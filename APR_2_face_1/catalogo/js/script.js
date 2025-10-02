// Variables globales
let productoActual = null;
let cantidadActual = 1;

document.addEventListener('DOMContentLoaded', function() {
    actualizarContadorCarrito();
    
    // Control de cantidades
    const cantidadControls = document.querySelectorAll('.btn-cantidad');
    cantidadControls.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const cantidadElement = this.parentElement.querySelector('.cantidad');
            let cantidad = parseInt(cantidadElement.textContent);
            
            if (action === 'increment') {
                cantidad++;
            } else if (action === 'decrement' && cantidad > 1) {
                cantidad--;
            }
            
            cantidadElement.textContent = cantidad;
            cantidadActual = cantidad;
        });
    });
    
    // Agregar productos al carrito
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function() {
            const productoData = JSON.parse(this.dataset.producto);
            const cantidadElement = this.parentElement.querySelector('.cantidad');
            cantidadActual = parseInt(cantidadElement.textContent);
            
            productoActual = {
                ...productoData,
                cantidad: cantidadActual
            };
            
            // Mostrar modal de personalización
            mostrarModalPersonalizacion(productoActual);
        });
    });
    
    // Modal functionality
    const modal = document.getElementById('modal-personalizar');
    const closeBtn = document.querySelector('.close');
    const btnPersonalizarSi = document.getElementById('btn-personalizar-si');
    const btnPersonalizarNo = document.getElementById('btn-personalizar-no');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    btnPersonalizarSi.onclick = function() {
        modal.style.display = 'none';
        redirigirAPersonalizar();
    }
    
    btnPersonalizarNo.onclick = function() {
        modal.style.display = 'none';
        agregarProductoAlCarrito(productoActual, false);
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});

function mostrarModalPersonalizacion(producto) {
    const modal = document.getElementById('modal-personalizar');
    const productoInfo = document.getElementById('modal-producto-info');
    
    productoInfo.textContent = `${producto.cantidad} x ${producto.nombre} - $${producto.precio * producto.cantidad}`;
    modal.style.display = 'block';
}

function redirigirAPersonalizar() {
    // Guardar producto actual en sessionStorage para la página de personalización
    sessionStorage.setItem('productoParaPersonalizar', JSON.stringify(productoActual));
    window.location.href = '../Perzonalizar_pedido/personalizar.html';
}

function agregarProductoAlCarrito(productoData, personalizado = false) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const producto = {
        id: 'CAT_' + Date.now(),
        nombre: productoData.nombre,
        precio: productoData.precio,
        categoria: productoData.categoria,
        tipo: productoData.tipo,
        cantidad: productoData.cantidad,
        personalizado: personalizado,
        fecha_agregado: new Date().toISOString()
    };
    
    if (personalizado) {
        producto.tipo_producto = 'personalizado';
    } else {
        producto.tipo_producto = 'catalogo';
    }
    
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    actualizarContadorCarrito();
    
    // Resetear cantidad
    const cantidadElements = document.querySelectorAll('.cantidad');
    cantidadElements.forEach(element => {
        element.textContent = '1';
    });
    cantidadActual = 1;
    
    alert(`¡${productoData.cantidad} ${productoData.nombre} agregado(s) al carrito!`);
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    const contadorElement = document.getElementById('carrito-count');
    if (contadorElement) {
        contadorElement.textContent = totalItems;
    }
}