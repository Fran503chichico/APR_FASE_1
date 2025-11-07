<?php
// Iniciar sesión
session_start();

// Verificar si el usuario está logueado
if (!isset($_SESSION['user_id'])) {
    // Si no está logueado, redirigir al login
    header('Location: ../login/login.php');
    exit();
}

// Obtener datos del usuario
$user_name = $_SESSION['user_name'];
$user_email = $_SESSION['user_email'];
$user_id = $_SESSION['user_id'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Cuenta - Pastelería</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f5f5;
        }

        .navbar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 15px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .navbar ul {
            list-style: none;
            display: flex;
            justify-content: center;
            gap: 30px;
            padding: 0;
        }

        .navbar li a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.3s;
        }

        .navbar li a:hover {
            opacity: 0.8;
        }

        .user-profile {
            max-width: 800px;
            margin: 40px auto;
            padding: 30px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        h1 {
            color: #333;
            margin-bottom: 10px;
        }

        .welcome-text {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1rem;
        }

        .user-info {
            margin-bottom: 30px;
        }

        .user-info h2 {
            color: #667eea;
            margin-bottom: 20px;
            font-size: 1.3rem;
        }

        .info-item {
            margin-bottom: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #667eea;
        }

        .info-label {
            font-weight: bold;
            color: #333;
            display: inline-block;
            width: 120px;
        }

        .info-value {
            color: #666;
        }

        .actions {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }

        .btn {
            padding: 12px 25px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }

        .btn-logout {
            background: #e74c3c;
            color: white;
        }

        .btn-logout:hover {
            background: #c0392b;
            transform: translateY(-2px);
        }

        .btn-edit {
            background: #667eea;
            color: white;
        }

        .btn-edit:hover {
            background: #5568d3;
            transform: translateY(-2px);
        }

        footer {
            background: #2c3e50;
            color: white;
            padding: 40px 20px 20px;
            margin-top: 60px;
        }

        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-bottom: 20px;
        }

        .footer-box h4 {
            margin-bottom: 15px;
            color: #ecf0f1;
        }

        .footer-box ul {
            list-style: none;
        }

        .footer-box ul li {
            margin-bottom: 8px;
        }

        .footer-box a {
            color: #bdc3c7;
            text-decoration: none;
            transition: color 0.3s;
        }

        .footer-box a:hover {
            color: #ecf0f1;
        }

        .copy {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #34495e;
            color: #95a5a6;
        }

        @media (max-width: 768px) {
            .navbar ul {
                flex-direction: column;
                gap: 10px;
            }

            .user-profile {
                margin: 20px;
                padding: 20px;
            }

            .actions {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <ul>
            <li><a href="../Principal_Pasteleria/Principal_Pasteleria.php">🏠 Inicio</a></li>
            <li><a href="../catalogo/catalogo.html">📋 Catálogo</a></li>
            <li><a href="../carro/carro.html">🛒 Carrito</a></li>
            <li><a href="../conctatos_pasteleria/Conctato_Pasteleria.html">📞 Contacto</a></li>
            <li><a href="mi-cuenta.php">👤 Mi Cuenta</a></li>
        </ul>
    </nav>

    <div class="user-profile">
        <h1>🎂 Mi Cuenta</h1>
        <p class="welcome-text">Bienvenido, <strong><?php echo htmlspecialchars($user_name); ?></strong></p>
        
        <div class="user-info">
            <h2>Información Personal</h2>
            <div class="info-item">
                <span class="info-label">👤 Nombre:</span>
                <span class="info-value"><?php echo htmlspecialchars($user_name); ?></span>
            </div>
            <div class="info-item">
                <span class="info-label">📧 Email:</span>
                <span class="info-value"><?php echo htmlspecialchars($user_email); ?></span>
            </div>
            <div class="info-item">
                <span class="info-label">🆔 ID Usuario:</span>
                <span class="info-value">#<?php echo htmlspecialchars($user_id); ?></span>
            </div>
        </div>

        <div class="actions">
            <a href="../Principal_Pasteleria/Principal_Pasteleria.php" class="btn btn-edit">
                ← Volver al Inicio
            </a>
            <button class="btn btn-logout" onclick="if(confirm('¿Estás seguro de que quieres cerrar sesión?')) location.href='../login/logout.php'">
                🚪 Cerrar Sesión
            </button>
        </div>
    </div>

    <footer>
        <div class="footer-container">
            <div class="footer-box">
                <h4>Pastelería</h4>
                <p>Los pasteles más deliciosos para tus momentos especiales.</p>
            </div>
            <div class="footer-box">
                <h4>Enlaces Rápidos</h4>
                <ul>
                    <li><a href="../Principal_Pasteleria/Principal_Pasteleria.php">Inicio</a></li>
                    <li><a href="../catalogo/catalogo.html">Catálogo</a></li>
                    <li><a href="../conctatos_pasteleria/Conctato_Pasteleria.html">Contacto</a></li>
                </ul>
            </div>
            <div class="footer-box">
                <h4>Horarios</h4>
                <p>Lun - Vie: 8:00 AM - 8:00 PM</p>
                <p>Sábados: 9:00 AM - 9:00 PM</p>
                <p>Domingos: 10:00 AM - 6:00 PM</p>
            </div>
        </div>
        <div class="copy">
            <p>&copy; 2025 Pastelería. Todos los derechos reservados.</p>
        </div>
    </footer>
</body>
</html>