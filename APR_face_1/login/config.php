<?php
// config.php - Configuración de la base de datos

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'root');          // Cambia si usas otro usuario
define('DB_PASS', '');              // Cambia si tienes contraseña
define('DB_NAME', 'Tienda');        // Nombre de tu base de datos

// Crear conexión
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar conexión
if ($conn->connect_error) {
    // Log del error
    error_log("Error de conexión MySQL: " . $conn->connect_error);
    
    // En desarrollo, mostrar error
    if (headers_sent()) {
        echo "Error de conexión a la base de datos";
    } else {
        http_response_code(500);
        if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
            // Si es una petición AJAX, devolver JSON
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Error de conexión a la base de datos: ' . $conn->connect_error
            ]);
        } else {
            // Si es petición normal, mostrar error
            die("Error de conexión: " . $conn->connect_error);
        }
    }
    exit();
}

// Configurar charset para evitar problemas con acentos
$conn->set_charset("utf8mb4");

// Configurar zona horaria
date_default_timezone_set('America/El_Salvador');
?>