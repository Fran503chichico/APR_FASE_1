let productoBase = null;
let precioBase = 0;
let editando = false;
let indiceEdicion = null;

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos editando
    const urlParams = new URLSearchParams(window.location.search);
    editando = urlParams.get('edicion') === 'true';
    
    if (editando) {
        // Cargar producto para edición
        const productoEditar = sessionStorage.getItem('productoParaEditar');
        if (productoEditar) {
            const producto = JSON.parse(productoEditar);
            productoBase = producto.producto_base;
            precioBase = producto.precio_base;
            indiceEdicion = producto.indiceCarrito;
            cargarDatosEdicion(producto);
        }
    } else {
        // Cargar producto nuevo desde sessionStorage
        const productoGuardado = sessionStorage.getItem('productoParaPersonalizar');
        if (productoGuardado) {
            productoBase = JSON.parse(productoGuardado);
            precioBase = productoBase.precio * productoBase.cantidad;
            actualizarInterfazProducto();
        } else {
            // Si no hay producto, redirigir al catálogo
            window.location.href = '../catalogo/catalogo.html';
            return;
        }
    }
    
    actualizarContadorCarrito();
    
    // Calcular precio cuando cambien las opciones
    const opciones = document.querySelectorAll('input[type="radio"], #mensaje');
    opciones.forEach(opcion => {
        if (opcion.type === 'radio') {
            opcion.addEventListener('change', calcularPrecio);
        } else {
            opcion.addEventListener('input', calcularPrecio);
        }
    });
    
    // Manejar envío del formulario
    const formulario = document.getElementById('formulario-personalizar');
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        if (editando) {
            actualizarProductoEnCarrito();
        } else {
            agregarAlCarrito();
        }
    });
    
    // Calcular precio inicial
    calcularPrecio();
});

function cargarDatosEdicion(producto) {
    const titulo = document.getElementById('titulo-producto');
    const subtitulo = document.getElementById('subtitulo-producto');
    const infoProducto = document.getElementById('info-producto-base');
    
    titulo.textContent = `Editando: ${producto.nombre}`;
    subtitulo.textContent = `Modifica la personalización de tu ${producto.producto_base.nombre.toLowerCase()}`;
    
    infoProducto.innerHTML = `
        <div class="producto-base-info">
            <h4>${producto.producto_base.nombre}</h4>
            <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
            <p><strong>Precio base:</strong> $${producto.precio_base}</p>
            <p><strong>Categoría:</strong> ${producto.producto_base.categoria}</p>
        </div>
    `;
    
    // Cargar valores actuales de personalización
    document.querySelector(`input[name="tamano"][value="${producto.personalizacion.tamano}"]`).checked = true;
    document.querySelector(`input[name="sabor"][value="${producto.personalizacion.sabor}"]`).checked = true;
    document.querySelector(`input[name="decoracion"][value="${producto.personalizacion.decoracion}"]`).checked = true;
    document.getElementById('mensaje').value = producto.personalizacion.mensaje || '';
}

function actualizarInterfazProducto() {
    const titulo = document.getElementById('titulo-producto');
    const subtitulo = document.getElementById('subtitulo-producto');
    const infoProducto = document.getElementById('info-producto-base');
    
    titulo.textContent = `Personalizar: ${productoBase.nombre}`;
    subtitulo.textContent = `Personaliza tu ${productoBase.nombre.toLowerCase()} según tus preferencias`;
    
    infoProducto.innerHTML = `
        <div class="producto-base-info">
            <h4>${productoBase.nombre}</h4>
            <p><strong>Cantidad:</strong> ${productoBase.cantidad}</p>
            <p><strong>Precio base:</strong> $${precioBase}</p>
            <p><strong>Categoría:</strong> ${productoBase.categoria}</p>
        </div>
    `;
}

// FUNCIÓN CALCULAR PRECIO - CORREGIDA
function calcularPrecio() {
    let precioPersonalizacion = 0;
    
    // Calcular precio de tamaño
    const tamanoSeleccionado = document.querySelector('input[name="tamano"]:checked');
    if (tamanoSeleccionado) {
        precioPersonalizacion += parseInt(tamanoSeleccionado.dataset.precio) || 0;
    }
    
    // Calcular precio de sabor
    const saborSeleccionado = document.querySelector('input[name="sabor"]:checked');
    if (saborSeleccionado) {
        precioPersonalizacion += parseInt(saborSeleccionado.dataset.precio) || 0;
    }
    
    // Calcular precio de decoración
    const decoracionSeleccionada = document.querySelector('input[name="decoracion"]:checked');
    if (decoracionSeleccionada) {
        precioPersonalizacion += parseInt(decoracionSeleccionada.dataset.precio) || 0;
    }
    
    const precioTotal = precioBase + precioPersonalizacion;
    
    // Actualizar la interfaz
    document.getElementById('resumen-base').textContent = `$${precioBase}`;
    document.getElementById('resumen-personalizacion').textContent = `$${precioPersonalizacion}`;
    document.getElementById('resumen-total').textContent = `$${precioTotal}`;
    
    return precioTotal;
}

// FUNCIÓN AGREGAR AL CARRITO - NUEVA
function agregarAlCarrito() {
    // Obtener valores de personalización
    const tamano = document.querySelector('input[name="tamano"]:checked').value;
    const sabor = document.querySelector('input[name="sabor"]:checked').value;
    const decoracion = document.querySelector('input[name="decoracion"]:checked').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Calcular precios
    const precioPersonalizacion = calcularPrecio() - precioBase;
    const precioTotal = calcularPrecio();
    
    // Crear objeto del producto personalizado
    const productoPersonalizado = {
        id: 'PERS_' + Date.now(),
        nombre: productoBase.nombre,
        producto_base: productoBase,
        cantidad: productoBase.cantidad,
        precio_base: precioBase,
        personalizacion: {
            tamano: tamano,
            sabor: sabor,
            decoracion: decoracion,
            mensaje: mensaje
        },
        precio_personalizacion: precioPersonalizacion,
        precio_total: precioTotal,
        personalizado: true,
        tipo_producto: 'personalizado',
        fecha_agregado: new Date().toISOString()
    };
    
    // Obtener carrito actual
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Agregar producto al carrito
    carrito.push(productoPersonalizado);
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Limpiar sessionStorage
    sessionStorage.removeItem('productoParaPersonalizar');
    
    // Actualizar contador
    actualizarContadorCarrito();
    
    // Mostrar confirmación
    alert(`✅ ¡${productoBase.cantidad} ${productoBase.nombre} personalizado agregado al carrito!`);
    
    // Redirigir al carrito
    window.location.href = '../carro/carro.html';
}

// FUNCIÓN ACTUALIZAR PRODUCTO EN CARRITO - CORREGIDA
function actualizarProductoEnCarrito() {
    // Obtener valores de personalización
    const tamano = document.querySelector('input[name="tamano"]:checked').value;
    const sabor = document.querySelector('input[name="sabor"]:checked').value;
    const decoracion = document.querySelector('input[name="decoracion"]:checked').value;
    const mensaje = document.getElementById('mensaje').value;
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Calcular precios actualizados
    const precioPersonalizacion = calcularPrecio() - precioBase;
    const precioTotal = calcularPrecio();
    
    // Actualizar el producto en el carrito
    carrito[indiceEdicion] = {
        ...carrito[indiceEdicion],
        personalizacion: {
            tamano: tamano,
            sabor: sabor,
            decoracion: decoracion,
            mensaje: mensaje
        },
        precio_personalizacion: precioPersonalizacion,
        precio_total: precioTotal
    };
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Limpiar sessionStorage
    sessionStorage.removeItem('productoParaEditar');
    
    // Actualizar contador
    actualizarContadorCarrito();
    
    // Mostrar confirmación
    alert('✅ ¡Producto actualizado en el carrito!');
    
    // Redirigir al carrito
    window.location.href = '../carro/carro.html';
}

// FUNCIÓN ACTUALIZAR CONTADOR CARRITO - NUEVA
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    const contadorElement = document.getElementById('carrito-count');
    if (contadorElement) {
        contadorElement.textContent = totalItems;
    }
}