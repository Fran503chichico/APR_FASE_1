// Funcionalidad para todas las páginas
document.addEventListener('DOMContentLoaded', function() {
  // Funcionalidad para agregar productos al carrito (solo en catálogo)
  const botonesAgregar = document.querySelectorAll('.btn-agregar');
  
  if (botonesAgregar.length > 0) {
    botonesAgregar.forEach(boton => {
      boton.addEventListener('click', function() {
        const producto = this.closest('.producto-card');
        const nombre = producto.querySelector('h3').textContent;
        const precio = producto.querySelector('.producto-precio').textContent;
        const imagen = producto.querySelector('img').src;
        
        // Crear objeto del producto
        const productoCarrito = {
          nombre: nombre,
          precio: precio,
          imagen: imagen
        };
        
        // Obtener carrito actual del localStorage
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Agregar producto al carrito
        carrito.push(productoCarrito);
        
        // Guardar carrito actualizado en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Mostrar mensaje de confirmación
        alert(`¡${nombre} agregado al carrito! Precio: ${precio}`);
        
        // Actualizar contador del carrito si existe
        actualizarContadorCarrito();
      });
    });
  }
  
  // Funcionalidad para el botón de pedido (solo en página principal)
  const btnPedido = document.querySelector('.btn-pedido');
  if (btnPedido) {
    btnPedido.addEventListener('click', function() {
      window.location.href = 'catalogo.html';
    });
  }
  
  // Funcionalidad para Mi Cuenta
  const menuItems = document.querySelectorAll('.menu-cuenta a');
  const secciones = document.querySelectorAll('.seccion');
  
  if (menuItems.length > 0 && secciones.length > 0) {
    menuItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remover clase activa de todos los items del menú
        menuItems.forEach(i => i.parentElement.classList.remove('active'));
        
        // Agregar clase activa al item clickeado
        this.parentElement.classList.add('active');
        
        // Ocultar todas las secciones
        secciones.forEach(seccion => seccion.classList.remove('activa'));
        
        // Mostrar la sección correspondiente
        const targetId = this.getAttribute('href').substring(1);
        const targetSeccion = document.getElementById(targetId);
        if (targetSeccion) {
          targetSeccion.classList.add('activa');
        }
      });
    });
  }
  
  // Funcionalidad para guardar cambios del perfil
  const btnGuardar = document.querySelector('.btn-guardar');
  if (btnGuardar) {
    btnGuardar.addEventListener('click', function() {
      alert('Cambios guardados exitosamente');
      // Aquí iría la lógica para guardar los datos del perfil
    });
  }
  
  // Función para actualizar el contador del carrito
  function actualizarContadorCarrito() {
    const contadorCarrito = document.querySelector('.navbar a[href="#"]:nth-child(7)');
    if (contadorCarrito) {
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const cantidad = carrito.length;
      
      if (cantidad > 0) {
        contadorCarrito.innerHTML = `🛒 <span style="background: red; color: white; border-radius: 50%; padding: 2px 6px; font-size: 12px;">${cantidad}</span>`;
      } else {
        contadorCarrito.innerHTML = '🛒';
      }
    }
  }
   
  //Función para la direcciones 

   document.addEventListener('DOMContentLoaded', function() {
            const updateLocationBtn = document.getElementById('update-location');
            const currentAddress = document.getElementById('current-address');
            const currentCity = document.getElementById('current-city');
            const currentPostal = document.getElementById('current-postal');
            const currentCountry = document.getElementById('current-country');
            const loadingSpinner = document.querySelector('.loading');
            
            // Función para obtener la ubicación
            function getLocation() {
                if (navigator.geolocation) {
                    loadingSpinner.classList.remove('hidden');
                    updateLocationBtn.disabled = true;
                    
                    navigator.geolocation.getCurrentPosition(
                        // Éxito
                        function(position) {
                            const latitude = position.coords.latitude;
                            const longitude = position.coords.longitude;
                            
                            // Usar el servicio de geocodificación para obtener la dirección
                            getAddressFromCoordinates(latitude, longitude);
                        },
                        // Error
                        function(error) {
                            loadingSpinner.classList.add('hidden');
                            updateLocationBtn.disabled = false;
                            
                            switch(error.code) {
                                case error.PERMISSION_DENIED:
                                    currentAddress.textContent = "Permiso de ubicación denegado.";
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    currentAddress.textContent = "Información de ubicación no disponible.";
                                    break;
                                case error.TIMEOUT:
                                    currentAddress.textContent = "Tiempo de espera agotado para obtener la ubicación.";
                                    break;
                                case error.UNKNOWN_ERROR:
                                    currentAddress.textContent = "Error desconocido al obtener la ubicación.";
                                    break;
                            }
                        },
                        // Opciones
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 60000
                        }
                    );
                } else {
                    currentAddress.textContent = "La geolocalización no es compatible con este navegador.";
                }
            }
            
            // Función para obtener la dirección a partir de coordenadas
            function getAddressFromCoordinates(lat, lng) {
                // En un caso real, aquí harías una llamada a una API de geocodificación
                // Por ejemplo, la API de Google Maps Geocoding o OpenStreetMap Nominatim
                
                // Para esta demostración, simularemos una respuesta después de un breve retraso
                setTimeout(() => {
                    loadingSpinner.classList.add('hidden');
                    updateLocationBtn.disabled = false;
                    
                    // Datos de ejemplo (en una aplicación real, estos vendrían de la API)
                    currentAddress.textContent = "Calle de la Demostración 123";
                    currentCity.textContent = "Madrid";
                    currentPostal.textContent = "28013";
                    currentCountry.textContent = "España";
                    
                    // Mostrar mensaje de éxito
                    showNotification("Ubicación actualizada correctamente", "success");
                }, 2000);
            }
            
            // Función para mostrar notificaciones
            function showNotification(message, type) {
                // Crear elemento de notificación
                const notification = document.createElement('div');
                notification.textContent = message;
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 5px;
                    color: white;
                    font-weight: 500;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    transition: all 0.3s ease;
                `;
                
                if (type === 'success') {
                    notification.style.backgroundColor = '#4CAF50';
                } else {
                    notification.style.backgroundColor = '#f44336';
                }
                
                document.body.appendChild(notification);
                
                // Eliminar la notificación después de 3 segundos
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(100px)';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 3000);
            }
            
            // Event listener para el botón de actualizar ubicación
            updateLocationBtn.addEventListener('click', getLocation);
            
            // Obtener ubicación automáticamente al cargar la página
            getLocation();
        });

  
  // Actualizar contador al cargar la página
  actualizarContadorCarrito();
});