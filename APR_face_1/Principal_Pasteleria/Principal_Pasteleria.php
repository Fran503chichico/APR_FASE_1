<?php
// Iniciar sesión para poder mostrar info del usuario
session_start();

// Verificar si hay usuario logueado
$isLoggedIn = isset($_SESSION['user_id']);
$userName = $isLoggedIn ? $_SESSION['user_name'] : 'Invitado';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pastelería Artesanal</title>
  <link rel="stylesheet" href="css/styles.css">
  <script src="js/script.js"></script>
</head>
<body>
  <!-- Navbar -->
  <nav class="navbar">
    <div class="logo">
      <img src="img/Imagen de WhatsApp 2025-10-01 a las 20.44.59_65d43f6a.jpg" alt="30px" width="50px">
    </div>
    <ul>
      <li><a href="../Principal_Pasteleria/Principal_Pasteleria.php">Inicio</a></li>
      <li><a href="../conctatos_pasteleria/Conctato_Pasteleria.html">Contacto</a></li>
      <li><a href="../carro/carro.html">🧺</a></li>
      <li>
        <?php if ($isLoggedIn): ?>
          <!-- Usuario logueado - Mostrar nombre y opciones -->
          <a href="../mi cuenta/mi-cuenta.php" style="display: inline-flex; align-items: center; gap: 5px;">
            👤 <span><?php echo htmlspecialchars($userName); ?></span>
          </a>
        <?php else: ?>
          <!-- Usuario no logueado - Mostrar link al login -->
          <a href="../login/login.php">👤</a>
        <?php endif; ?>
      </li>
    </ul>
  </nav>

  <!-- Hero Section -->
  <header class="hero">
    <div class="hero-content">
      <h1>Pastelería Artesanal</h1>
      <p>Los pasteles más deliciosos, hechos con amor para tus momentos especiales</p>
      <a href="../catalogo/catalogo.html"><button class="btn-pedido">Ir a Catalogo</button></a>
    </div>
  </header>

   <!-- Footer -->
  <footer>
    <div class="footer-container">
      <div class="footer-box">
        <h4>Pastelería</h4>
        <p>Los pasteles más deliciosos para tus momentos especiales.</p>
      </div>
      <div class="footer-box">
        <h4>Enlaces Rápidos</h4>
        <ul>
          <li><a href="catalogo.html">Catálogo</a></li>
          <li><a href="">Personalizar Pedido</a></li>
          <li><a href="#">Eventos Empresariales</a></li>
        </ul>
      </div>
      <div class="footer-box">
        <h4>Horarios</h4>
        <p>Lun - Vie: 8:00 AM - 8:00 PM</p>
        <p>Sábados: 9:00 AM - 9:00 PM</p>
        <p>Domingos: 10:00 AM - 6:00 PM</p>
      </div>
    </div>
    <p class="copy">© 2025 Pastelería. Todos los derechos reservados.</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>