<?php
// mis-pedidos.php
session_start();

// Verificar que el usuario esté logueado
if (!isset($_SESSION['user_id'])) {
    header('Location: ../login/login.php');
    exit();
}

require_once '../login/config.php';

$usuario_id = $_SESSION['user_id'];

// Obtener pedidos del usuario
$query = "SELECT p.*, 
          (SELECT COUNT(*) FROM Detalle_Pedido WHERE pedido_id = p.id) as cantidad_productos
          FROM Pedidos p 
          WHERE p.usuario_id = ? 
          ORDER BY p.fecha DESC";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();
$pedidos = $result->fetch_all(MYSQLI_ASSOC);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Pedidos - Pastelería</title>
    <link rel="stylesheet" href="css/pedidos.css">
</head>
<body>
    <nav class="navbar">
        <ul>
            <li><a href="../Principal_Pasteleria/Principal_Pasteleria.php">🏠 Inicio</a></li>
            <li><a href="../catalogo/catalogo.html">📋 Catálogo</a></li>
            <li><a href="../carro/carro.html">🛒 Carrito</a></li>
            <li><a href="../mi cuenta/mi-cuenta.php">👤 Mi Cuenta</a></li>
            <li><a href="mis-pedidos.php">📦 Mis Pedidos</a></li>
        </ul>
    </nav>

    <div class="container">
        <h1>📦 Mis Pedidos</h1>

        <?php if (empty($pedidos)): ?>
            <div class="empty-state">
                <h2>Aún no tienes pedidos</h2>
                <p style="color: #999; margin-bottom: 20px;">Explora nuestro catálogo y realiza tu primer pedido</p>
                <a href="../catalogo/catalogo.html" class="btn-catalogo">Ir al Catálogo</a>
            </div>
        <?php else: ?>
            <div class="pedidos-grid">
                <?php foreach ($pedidos as $pedido): ?>
                    <div class="pedido-card">
                        <div class="pedido-header">
                            <span class="pedido-id">Pedido #<?php echo $pedido['id']; ?></span>
                            <span class="pedido-estado estado-<?php echo $pedido['estado']; ?>">
                                <?php echo ucfirst($pedido['estado']); ?>
                            </span>
                        </div>
                        
                        <div class="pedido-info">
                            <div class="info-item">
                                <strong>📅 Fecha</strong>
                                <?php echo date('d/m/Y', strtotime($pedido['fecha'])); ?>
                            </div>
                            <div class="info-item">
                                <strong>💰 Total</strong>
                                $<?php echo number_format($pedido['total'], 2); ?>
                            </div>
                            <div class="info-item">
                                <strong>📦 Productos</strong>
                                <?php echo $pedido['cantidad_productos']; ?> item(s)
                            </div>
                            <div class="info-item">
                                <strong>💳 Pago</strong>
                                <?php echo ucfirst($pedido['metodo_pago']); ?>
                            </div>
                        </div>
                        
                        <button class="btn-ver-detalles" onclick="verDetalles(<?php echo $pedido['id']; ?>)">
                            Ver Detalles
                        </button>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <script>
        function verDetalles(pedidoId) {
            window.location.href = 'detalle-pedido.php?id=' + pedidoId;
        }
    </script>
</body>
</html>