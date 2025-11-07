<?php
// procesar_pedido.php
// UBICACIÓN: carro/procesar_pedido.php

// Habilitar todos los errores
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// Iniciar sesión
session_start();

// Configurar respuesta JSON
header('Content-Type: application/json');

// Log de inicio
error_log("=== INICIO procesar_pedido.php ===");

// Verificar sesión
if (!isset($_SESSION['user_id'])) {
    error_log("ERROR: Usuario no logueado");
    echo json_encode([
        'success' => false, 
        'message' => 'Debes iniciar sesión para realizar un pedido'
    ]);
    exit();
}

error_log("Usuario ID: " . $_SESSION['user_id']);

// Verificar que exista config.php
if (!file_exists('../login/config.php')) {
    error_log("ERROR: No se encuentra config.php");
    echo json_encode([
        'success' => false,
        'message' => 'Error de configuración del servidor'
    ]);
    exit();
}

// Incluir configuración
require_once __DIR__ . '/../login/config.php';

// Verificar conexión
if (!isset($conn) || $conn->connect_error) {
    error_log("ERROR: Conexión a BD fallida");
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos'
    ]);
    exit();
}

error_log("Conexión a BD exitosa");

try {
    // Obtener datos del POST
    $input = file_get_contents('php://input');
    error_log("Datos recibidos: " . $input);
    
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('No se recibieron datos válidos');
    }
    
    $usuario_id = $_SESSION['user_id'];
    $productos = $data['productos'];
    $metodo_pago = $data['metodo_pago'];
    $total = floatval($data['total']);
    
    error_log("Total: $total, Método pago: $metodo_pago, Productos: " . count($productos));
    
    // Validaciones
    if (empty($productos)) {
        throw new Exception('El carrito está vacío');
    }
    
    if (empty($metodo_pago) || $metodo_pago === 'selecciona metodo de pago') {
        throw new Exception('Debes seleccionar un método de pago');
    }
    
    // Iniciar transacción
    $conn->begin_transaction();
    error_log("Transacción iniciada");
    
    // PASO 1: Verificar/crear cliente
    $stmt = $conn->prepare("SELECT id FROM Clientes WHERE email = (SELECT email FROM Usuarios WHERE id = ?)");
    if (!$stmt) {
        throw new Exception('Error al preparar consulta de cliente: ' . $conn->error);
    }
    
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $cliente = $result->fetch_assoc();
        $cliente_id = $cliente['id'];
        error_log("Cliente existente ID: $cliente_id");
    } else {
        // Crear nuevo cliente
        $stmt2 = $conn->prepare("INSERT INTO clientes (nombre, email) 
                                 SELECT nombre, email FROM usuarios WHERE id = ?");
        if (!$stmt2) {
            throw new Exception('Error al preparar inserción de cliente: ' . $conn->error);
        }
        
        $stmt2->bind_param("i", $usuario_id);
        
        if (!$stmt2->execute()) {
            throw new Exception('Error al crear cliente: ' . $stmt2->error);
        }
        
        $cliente_id = $conn->insert_id;
        error_log("Nuevo cliente creado ID: $cliente_id");
    }
    
    // PASO 2: Crear pedido
    $fecha = date('Y-m-d');
    $estado = 'pendiente';
    
    $stmt3 = $conn->prepare("INSERT INTO pedidos (usuario_id, cliente_id, fecha, total, estado, metodo_pago) 
                             VALUES (?, ?, ?, ?, ?, ?)");
    
    if (!$stmt3) {
        throw new Exception('Error al preparar inserción de pedido: ' . $conn->error);
    }
    
    $stmt3->bind_param("iisdss", $usuario_id, $cliente_id, $fecha, $total, $estado, $metodo_pago);
    
    if (!$stmt3->execute()) {
        throw new Exception('Error al crear pedido: ' . $stmt3->error);
    }
    
    $pedido_id = $conn->insert_id;
    error_log("Pedido creado ID: $pedido_id");
    
    // PASO 3: VERIFICAR Y USAR PRODUCTO POR DEFECTO
    // Primero, verificar si existe al menos un producto en la BD
    $check_product = $conn->query("SELECT id, nombre, precio FROM productos LIMIT 1");
    $producto_default_id = 1; // ID por defecto
    
    if ($check_product && $check_product->num_rows > 0) {
        $producto_data = $check_product->fetch_assoc();
        $producto_default_id = $producto_data['id'];
        error_log("Usando producto existente ID: $producto_default_id");
    } else {
        // Si no hay productos, crear uno por defecto
        $insert_default = $conn->prepare("INSERT INTO productos (nombre, precio, categoria) 
                                         VALUES ('Pastel Personalizado Base', 50.00, 'personalizado')");
        if ($insert_default && $insert_default->execute()) {
            $producto_default_id = $conn->insert_id;
            error_log("Producto por defecto creado ID: $producto_default_id");
        }
    }
    
    // PASO 4: Insertar detalles usando producto por defecto si es necesario
    $stmt4 = $conn->prepare("INSERT INTO detalle_pedido 
                             (pedido_id, producto_id, cantidad, tamano, sabor, decoracion, mensaje_personalizado, precio_unitario) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    if (!$stmt4) {
        throw new Exception('Error al preparar inserción de detalles: ' . $conn->error);
    }
    
    $contador = 0;
    foreach ($productos as $prod) {
        // Usar el ID del producto si existe y es válido, sino usar el por defecto
        $prod_id = isset($prod['id']) && !empty($prod['id']) ? intval($prod['id']) : $producto_default_id;
        $cantidad = isset($prod['cantidad']) ? intval($prod['cantidad']) : 1;
        $precio = isset($prod['precio']) ? floatval($prod['precio']) : 0;
        
        // Los valores NULL se manejan correctamente
        $tamano = isset($prod['tamano']) && $prod['tamano'] !== '' ? $prod['tamano'] : null;
        $sabor = isset($prod['sabor']) && $prod['sabor'] !== '' ? $prod['sabor'] : null;
        $decoracion = isset($prod['decoracion']) && $prod['decoracion'] !== '' ? $prod['decoracion'] : null;
        $mensaje = isset($prod['mensaje']) && $prod['mensaje'] !== '' ? $prod['mensaje'] : null;
        
        // Verificar que el producto_id existe en la tabla productos
        $check_prod = $conn->prepare("SELECT id FROM productos WHERE id = ?");
        $check_prod->bind_param("i", $prod_id);
        $check_prod->execute();
        $prod_exists = $check_prod->get_result();
        
        if ($prod_exists->num_rows === 0) {
            // Si el producto no existe, usar el por defecto
            error_log("Producto ID $prod_id no existe, usando por defecto: $producto_default_id");
            $prod_id = $producto_default_id;
        }
        
        $stmt4->bind_param("iiissssd", 
            $pedido_id, 
            $prod_id, 
            $cantidad, 
            $tamano, 
            $sabor, 
            $decoracion, 
            $mensaje, 
            $precio
        );
        
        if (!$stmt4->execute()) {
            throw new Exception('Error al guardar producto ' . ($contador + 1) . ': ' . $stmt4->error);
        }
        
        $contador++;
        error_log("Producto guardado: ID $prod_id, Cantidad $cantidad, Precio $$precio");
    }
    
    error_log("Se guardaron $contador productos en el pedido $pedido_id");
    
    // Todo bien - confirmar transacción
    $conn->commit();
    error_log("Transacción confirmada");
    
    echo json_encode([
        'success' => true,
        'message' => 'Pedido creado exitosamente',
        'pedido_id' => $pedido_id
    ]);
    
} catch (Exception $e) {
    // Error - revertir cambios
    if (isset($conn)) {
        $conn->rollback();
        error_log("Transacción revertida");
    }
    
    error_log("ERROR: " . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Cerrar conexión
if (isset($conn)) {
    $conn->close();
}

error_log("=== FIN procesar_pedido.php ===");
?>