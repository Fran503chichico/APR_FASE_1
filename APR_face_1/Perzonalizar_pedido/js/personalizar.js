// personalizar.js - Manejo de personalización de productos

// Obtener producto base desde sessionStorage
function obtenerProductoBase() {
    const productoJSON = sessionStorage.getItem('productoParaPersonalizar');
    
    if (productoJSON) {
        const producto = JSON.parse(productoJSON);
        // Asegurarse de que los campos numéricos sean números
        producto.id = parseInt(producto.id);
        producto.precio = parseFloat(producto.precio);
        producto.cantidad = parseInt(producto.cantidad);
        return producto;
    }

    // Fallback si no se encuentra nada (ej. acceso directo a la URL)
    alert("No se ha seleccionado un producto para personalizar. Redirigiendo al catálogo.");
    window.location.href = '../catalogo/catalogo.html';
    return null; // Devuelve null para detener la ejecución
}

// Cargar información del producto base
function cargarProductoBase() {
    const producto = obtenerProductoBase();
    
    // Actualizar título
    document.getElementById('titulo-producto').textContent = `Personaliza: ${producto.nombre}`;
    
    // Mostrar info del producto base
    const infoDiv = document.getElementById('info-producto-base');
    infoDiv.innerHTML = `
        <div style="display: flex; gap: 20px; align-items: center;">
            <!-- La imagen no se pasa actualmente, se puede agregar si es necesario -->
            <div>
                <h3>${producto.nombre}</h3>
                <p class="precio-base">Precio base: $${producto.precio.toFixed(2)}</p>
                <p>Cantidad seleccionada: ${producto.cantidad}</p>
            </div>
        </div>
    `;
    
    return producto;
}

// Calcular precio total con personalizaciones
function calcularPrecio() {
    const producto = obtenerProductoBase();
    let precioBase = producto.precio;
    let precioPersonalizacion = 0;
    
    // Obtener todas las opciones seleccionadas
    const inputs = document.querySelectorAll('input[type="radio"]:checked');
    
    inputs.forEach(input => {
        const precio = parseFloat(input.dataset.precio) || 0;
        precioPersonalizacion += precio;
    });
    
    const total = (precioBase * producto.cantidad) + precioPersonalizacion;
    
    // Actualizar resumen
    document.getElementById('resumen-base').textContent = `$${precioBase.toFixed(2)}`;
    document.getElementById('resumen-personalizacion').textContent = `$${precioPersonalizacion.toFixed(2)}`;
    document.getElementById('resumen-total').textContent = `$${total.toFixed(2)}`;
    
    return total;
}

// Agregar al carrito
function agregarAlCarrito(e) {
    e.preventDefault();
    
    const producto = obtenerProductoBase();
    if (!producto) return; // Detener si no hay producto

    const precioPersonalizacion = parseFloat(document.getElementById('resumen-personalizacion').textContent.replace('$', ''));
    const precioTotal = parseFloat(document.getElementById('resumen-total').textContent.replace('$', ''));
    
    // Obtener todas las personalizaciones
    const tamano = document.querySelector('input[name="tamano"]:checked').value;
    const sabor = document.querySelector('input[name="sabor"]:checked').value;
    const decoracion = document.querySelector('input[name="decoracion"]:checked').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Crear objeto del producto personalizado
    const productoPersonalizado = {
        tipo_producto: 'personalizado',
        nombre: `Personalización de ${producto.nombre}`,
        cantidad: producto.cantidad,
        producto_base: { // Guardamos el producto original dentro
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio
        },
        personalizacion: {
            tamano: tamano,
            sabor: sabor,
            decoracion: decoracion,
            mensaje: mensaje
        },
        precio_personalizacion: precioPersonalizacion,
        precio_total: precioTotal
    };
    
    // Obtener carrito actual
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Agregar producto al carrito
    carrito.push(productoPersonalizado);
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar contador
    actualizarContador();
    
    // Mostrar confirmación
    alert('¡Producto agregado al carrito!');
    
    // Opcional: redirigir al carrito
    if (confirm('¿Quieres ir al carrito ahora?')) {
        window.location.href = '../carro/carro.html';
    }
}

// Actualizar contador del carrito
function actualizarContador() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contador = document.getElementById('carrito-count');
    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems;
    }
}

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar producto base
    if (!sessionStorage.getItem('productoParaPersonalizar')) return; // No hacer nada si no hay producto
    cargarProductoBase();
    
    // Calcular precio inicial
    calcularPrecio();
    
    // Actualizar contador
    actualizarContador();
    
    // Event listeners para cambios en opciones
    const inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.addEventListener('change', calcularPrecio);
    });
    
    // Event listener para el formulario
    const form = document.getElementById('formulario-personalizar');
    if (form) {
        form.addEventListener('submit', agregarAlCarrito);
    }
});