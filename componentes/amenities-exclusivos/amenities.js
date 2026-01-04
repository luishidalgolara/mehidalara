// Estado global de la aplicación
let productos = [];
let carrito = [];
let categoriaActual = 'todos';

// Iconos para las categorías (emojis)
const iconosCategoria = {
    'tragos': '🍾',
    'comidas': '🍽️',
    'dulces': '🍰',
    'frutas': '🍓'
};

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarCarritoDesdeStorage();
});

// Cargar productos desde el JSON
async function cargarProductos() {
    try {
        const response = await fetch('productos.json');
        const data = await response.json();
        
        // Aplanar el array de productos de todas las categorías
        productos = [];
        data.categorias.forEach(categoria => {
            categoria.productos.forEach(producto => {
                productos.push({
                    ...producto,
                    categoria: categoria.id,
                    icono: iconosCategoria[categoria.id]
                });
            });
        });
        
        mostrarProductos();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarError();
    }
}

// Mostrar productos en el grid
function mostrarProductos() {
    const grid = document.getElementById('products-grid');
    
    // Filtrar productos por categoría
    const productosFiltrados = categoriaActual === 'todos' 
        ? productos 
        : productos.filter(p => p.categoria === categoriaActual);
    
    if (productosFiltrados.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 60px 20px;">No hay productos en esta categoría</p>';
        return;
    }
    
    grid.innerHTML = productosFiltrados.map(producto => `
        <div class="product-card" data-categoria="${producto.categoria}">
            <div class="product-image">
                <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${producto.nombre}</h3>
                <p class="product-description">${producto.descripcion}</p>
                <div class="product-footer">
                    <span class="product-price">$${producto.precio.toFixed(2)}</span>
                    <button class="btn-add" onclick="agregarAlCarrito('${producto.id}')">
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filtrar por categoría
function filtrarCategoria(categoria) {
    categoriaActual = categoria;
    
    // Actualizar botones activos
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${categoria}"]`).classList.add('active');
    
    mostrarProductos();
}

// Agregar producto al carrito
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    actualizarCarrito();
    guardarCarritoEnStorage();
    
    // Feedback visual
    mostrarNotificacion('Producto agregado al carrito');
}

// Actualizar visualización del carrito
function actualizarCarrito() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    
    // Actualizar contador
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    cartCount.textContent = totalItems;
    
    // Si el carrito está vacío
    if (carrito.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
        totalAmount.textContent = '$0.00';
        return;
    }
    
    // Renderizar items del carrito
    cartItems.innerHTML = carrito.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.imagen}" alt="${item.nombre}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-price">$${item.precio.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="cambiarCantidad('${item.id}', -1)">-</button>
                    <span class="quantity-display">${item.cantidad}</span>
                    <button class="quantity-btn" onclick="cambiarCantidad('${item.id}', 1)">+</button>
                    <button class="btn-remove" onclick="eliminarDelCarrito('${item.id}')">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Calcular y mostrar total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Cambiar cantidad de un producto
function cambiarCantidad(productoId, cambio) {
    const item = carrito.find(i => i.id === productoId);
    if (!item) return;
    
    item.cantidad += cambio;
    
    if (item.cantidad <= 0) {
        eliminarDelCarrito(productoId);
    } else {
        actualizarCarrito();
        guardarCarritoEnStorage();
    }
}

// Eliminar producto del carrito
function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    actualizarCarrito();
    guardarCarritoEnStorage();
}

// Toggle panel del carrito
function toggleCart() {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    
    panel.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Procesar pedido
function procesarPedido() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Preparar datos del pedido
    const pedido = {
        items: carrito,
        total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0),
        fecha: new Date().toISOString()
    };
    
    console.log('Pedido procesado:', pedido);
    
    // Aquí puedes agregar la lógica para enviar el pedido al backend
    // Por ahora, solo mostramos confirmación
    
    // Limpiar carrito
    carrito = [];
    actualizarCarrito();
    guardarCarritoEnStorage();
    
    // Cerrar panel del carrito
    toggleCart();
    
    // Mostrar modal de confirmación
    mostrarModalConfirmacion();
}

// Mostrar modal de confirmación
function mostrarModalConfirmacion() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.add('active');
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('active');
}

// Volver a la página principal
function volverInicio() {
    window.location.href = '../../index.html';
}

// Guardar carrito en localStorage
function guardarCarritoEnStorage() {
    localStorage.setItem('amenities-carrito', JSON.stringify(carrito));
}

// Cargar carrito desde localStorage
function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('amenities-carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = mensaje;
    notif.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    // Remover después de 2 segundos
    setTimeout(() => {
        notif.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// Mostrar error al cargar productos
function mostrarError() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <p style="color: #e74c3c; font-size: 1.2rem; margin-bottom: 15px;">
                ⚠️ Error al cargar los productos
            </p>
            <p style="color: #666;">
                Por favor, intenta recargar la página
            </p>
            <button onclick="location.reload()" style="
                margin-top: 20px;
                background: linear-gradient(135deg, #c9a961 0%, #d4b676 100%);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 50px;
                font-size: 1rem;
                cursor: pointer;
            ">
                Recargar
            </button>
        </div>
    `;
}

// Agregar estilos de animación para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);