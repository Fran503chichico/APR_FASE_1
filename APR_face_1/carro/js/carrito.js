document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    
    const confirmBtn = document.getElementById('confirm-btn');
    confirmBtn.addEventListener('click', confirmarPedido);
});

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito.length === 0) {
        mostrarCarritoVacio();
        return;
    }
    
    mostrarProductos(carrito);
    actualizarResumen(carrito);
    actualizarContadorCarrito();
}

function mostrarProductos(carrito) {
    const productsSection = document.getElementById('products-section');
    productsSection.innerHTML = '';
    
    carrito.forEach((producto, index) => {
        const productElement = crearElementoProducto(producto, index);
        productsSection.appendChild(productElement);
    });
}

function crearElementoProducto(producto, index) {
    const div = document.createElement('div');
    div.className = 'producto-item';
    div.dataset.index = index;
    
    let productoHTML = '';
    
    if (producto.tipo_producto === 'personalizado') {
        productoHTML = `
            <div class="producto-header">
                <h2>🎂 ${producto.nombre} <span class="price">$${producto.precio_total}</span></h2>
                <div class="producto-actions">
                    <button class="btn-editar" data-index="${index}" title="Editar personalización">✏️</button>
                    <button class="btn-eliminar" data-index="${index}" title="Eliminar">🗑️</button>
                </div>
            </div>
            <div class="product-details">
                <p><strong>Producto base:</strong> ${producto.producto_base.nombre}</p>
                <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
                <p><strong>Personalización:</strong></p>
                <ul class="personalizacion-list">
                    <li><strong>Tamaño:</strong> ${capitalize(producto.personalizacion.tamano)}</li>
                    <li><strong>Sabor:</strong> ${capitalize(producto.personalizacion.sabor)}</li>
                    <li><strong>Decoración:</strong> ${capitalize(producto.personalizacion.decoracion)}</li>
                    ${producto.personalizacion.mensaje ? `<li><strong>Mensaje:</strong> "${producto.personalizacion.mensaje}"</li>` : ''}
                </ul>
                <div class="precio-desglose">
                    <p><strong>Precio base:</strong> $${producto.precio_base}</p>
                    <p><strong>Personalización:</strong> $${producto.precio_personalizacion}</p>
                    <p><strong>Total:</strong> $${producto.precio_total}</p>
                </div>
            </div>
            <div class="cantidad-controls-carrito">
                <button class="btn-cantidad-carrito" data-index="${index}" data-action="decrement">-</button>
                <span class="cantidad-carrito">${producto.cantidad}</span>
                <button class="btn-cantidad-carrito" data-index="${index}" data-action="increment">+</button>
            </div>
        `;
    } else {
        productoHTML = `
            <div class="producto-header">
                <h2>${producto.nombre} <span class="price">$${producto.precio * producto.cantidad}</span></h2>
                <div class="producto-actions">
                    <button class="btn-personalizar" data-index="${index}" title="Personalizar">🎨</button>
                    <button class="btn-eliminar" data-index="${index}" title="Eliminar">🗑️</button>
                </div>
            </div>
            <div class="product-details">
                <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
                <p><strong>Precio unitario:</strong> $${producto.precio}</p>
                <p><strong>Total:</strong> $${producto.precio * producto.cantidad}</p>
            </div>
            <div class="cantidad-controls-carrito">
                <button class="btn-cantidad-carrito" data-index="${index}" data-action="decrement">-</button>
                <span class="cantidad-carrito">${producto.cantidad}</span>
                <button class="btn-cantidad-carrito" data-index="${index}" data-action="increment">+</button>
            </div>
        `;
    }
    
    div.innerHTML = productoHTML;
    
    // Agregar eventos
    const btnEliminar = div.querySelector('.btn-eliminar');
    btnEliminar.addEventListener('click', eliminarProducto);
    
    // Eventos para controles de cantidad
    const btnsCantidad = div.querySelectorAll('.btn-cantidad-carrito');
    btnsCantidad.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const index = parseInt(this.dataset.index);
            actualizarCantidadProducto(index, action);
        });
    });
    
    // Evento para editar producto personalizado
    if (producto.tipo_producto === 'personalizado') {
        const btnEditar = div.querySelector('.btn-editar');
        btnEditar.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            editarProductoPersonalizado(index);
        });
    } else {
        // Evento para personalizar producto del catálogo
        const btnPersonalizar = div.querySelector('.btn-personalizar');
        btnPersonalizar.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            personalizarProductoExistente(index);
        });
    }
    
    return div;
}

function actualizarCantidadProducto(index, action) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito[index];
    
    if (action === 'increment') {
        producto.cantidad++;
    } else if (action === 'decrement' && producto.cantidad > 1) {
        producto.cantidad--;
    }
    
    // Recalcular precios si es personalizado
    if (producto.tipo_producto === 'personalizado') {
        producto.precio_base = producto.producto_base.precio * producto.cantidad;
        producto.precio_total = producto.precio_base + producto.precio_personalizacion;
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito(); // Recargar todo el carrito
}

function editarProductoPersonalizado(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito[index];
    
    // Guardar el producto en sessionStorage para edición
    sessionStorage.setItem('productoParaEditar', JSON.stringify({
        ...producto,
        indiceCarrito: index
    }));
    
    // Redirigir a la página de personalización
    window.location.href = '../Perzonalizar_pedido/personalizar.html?edicion=true';
}

function personalizarProductoExistente(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const producto = carrito[index];
    
    // Crear objeto de producto base para personalización
    const productoBase = {
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
        tipo: producto.tipo,
        cantidad: producto.cantidad
    };
    
    // Guardar en sessionStorage
    sessionStorage.setItem('productoParaPersonalizar', JSON.stringify(productoBase));
    
    // Eliminar el producto actual del carrito
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Redirigir a personalización
    window.location.href = '../Perzonalizar_pedido/personalizar.html';
}

function eliminarProducto(event) {
    const index = parseInt(event.target.dataset.index);
    
    if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        cargarCarrito();
    }
}

function actualizarResumen(carrito) {
    let subtotal = 0;
    
    carrito.forEach(producto => {
        if (producto.tipo_producto === 'personalizado') {
            subtotal += producto.precio_total;
        } else {
            subtotal += producto.precio * producto.cantidad;
        }
    });
    
    const envio = 50;
    const total = subtotal + envio;
    
    document.getElementById('subtotal').textContent = `$${subtotal}`;
    document.getElementById('shipping').textContent = `$${envio}`;
    document.getElementById('total').textContent = `$${total}`;
}

function mostrarCarritoVacio() {
    const productsSection = document.getElementById('products-section');
    productsSection.innerHTML = `
        <div class="carrito-vacio">
            <p>Tu carrito está vacío</p>
            <div class="carrito-vacio-actions">
                <a href="../catalogo/catalogo.html" class="btn-volver">Ver Catálogo</a>
                <a href="../Perzonalizar_pedido/personalizar.html" class="btn-volver">Personalizar Pedido</a>
            </div>
        </div>
    `;
    
    document.getElementById('subtotal').textContent = '$0';
    document.getElementById('shipping').textContent = '$50';
    document.getElementById('total').textContent = '$50';
    actualizarContadorCarrito();
}

// FUNCIÓN ACTUALIZADA - CONECTA CON BASE DE DATOS
async function confirmarPedido() {
    const metodoPago = document.getElementById('payment-method').value;
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    if (metodoPago === 'selecciona metodo de pago') {
        alert('Por favor selecciona un método de pago.');
        return;
    }
    
    // Calcular total final
    let subtotal = 0;
    carrito.forEach(producto => {
        if (producto.tipo_producto === 'personalizado') {
            subtotal += producto.precio_total;
        } else {
            subtotal += producto.precio * producto.cantidad;
        }
    });
    const total = subtotal + 50;
    
    // Crear resumen para mostrar al usuario
    const resumenPedido = carrito.map(producto => {
        if (producto.tipo_producto === 'personalizado') {
            return `${producto.cantidad}x ${producto.nombre} - $${producto.precio_total}`;
        } else {
            return `${producto.cantidad}x ${producto.nombre} - $${producto.precio * producto.cantidad}`;
        }
    }).join('\n');
    
    const confirmacion = `¿Confirmar pedido?\n\n${resumenPedido}\n\nSubtotal: $${subtotal}\nEnvío: $50\nTotal: $${total}\n\nMétodo de pago: ${metodoPago}`;
    
    if (!confirm(confirmacion)) {
        return; // Usuario canceló
    }
    
    // Deshabilitar botón mientras procesa
    const btnConfirmar = document.getElementById('confirm-btn');
    const textoOriginal = btnConfirmar.textContent;
    btnConfirmar.textContent = 'Procesando...';
    btnConfirmar.disabled = true;
    
    try {
        // Preparar y validar productos para enviar a la BD
        const productosParaBD = [];
        for (const producto of carrito) {
            let prodParaBD;
            if (producto.tipo_producto === 'personalizado') {
                if (!producto.producto_base?.id) {
                    throw new Error(`El producto personalizado "${producto.nombre}" no tiene un ID de producto base válido.`);
                }
                prodParaBD = {
                    id: producto.producto_base.id,
                    cantidad: producto.cantidad,
                    precio: producto.precio_total,
                    tamano: producto.personalizacion.tamano,
                    sabor: producto.personalizacion.sabor,
                    decoracion: producto.personalizacion.decoracion,
                    mensaje: producto.personalizacion.mensaje || ''
                };
            } else {
                if (!producto.id) {
                    throw new Error(`El producto "${producto.nombre}" no tiene un ID válido.`);
                }
                prodParaBD = {
                    id: producto.id,
                    cantidad: producto.cantidad,
                    precio: producto.precio
                };
            }
            productosParaBD.push(prodParaBD);
        }
        
        // Enviar al servidor
        const response = await fetch('procesar_pedido.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productos: productosParaBD,
                metodo_pago: metodoPago,
                total: total
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Guardar también en historial local
            guardarEnHistorial(carrito, total, metodoPago);
            
            // Limpiar carrito
            localStorage.removeItem('carrito');
            
            alert(`¡Pedido confirmado exitosamente!\n\nNúmero de pedido: #${result.pedido_id}\n\nTe contactaremos pronto para los detalles de entrega.`);
            
            // Redirigir a página principal
            window.location.href = '../Principal_Pasteleria/Principal_Pasteleria.php';
        } else {
            // Error del servidor
            alert('Error al procesar el pedido: ' + result.message);
            btnConfirmar.textContent = textoOriginal;
            btnConfirmar.disabled = false;
        }
        
    } catch (error) {
        console.error('Error al enviar pedido:', error);
        alert('Error de conexión. Por favor verifica que estés conectado e intenta de nuevo.');
        btnConfirmar.textContent = textoOriginal;
        btnConfirmar.disabled = false;
    }
}

function guardarEnHistorial(carrito, total, metodoPago) {
    const historial = JSON.parse(localStorage.getItem('historialPedidos')) || [];
    const pedido = {
        id: 'PED_' + Date.now(),
        fecha: new Date().toISOString(),
        productos: carrito,
        total: total,
        metodoPago: metodoPago,
        estado: 'confirmado'
    };
    
    historial.push(pedido);
    localStorage.setItem('historialPedidos', JSON.stringify(historial));
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    const contadorElement = document.getElementById('carrito-count');
    if (contadorElement) {
        contadorElement.textContent = totalItems;
    }
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}