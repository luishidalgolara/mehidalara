// Estado global
let categorias = [];
let categoriaActual = 'todos';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarLugares();
});

// Cargar lugares desde JSON
async function cargarLugares() {
    try {
        const response = await fetch('lugares.json');
        const data = await response.json();
        categorias = data.categorias;
        
        mostrarLugares();
    } catch (error) {
        console.error('Error al cargar lugares:', error);
        mostrarError();
    }
}

// Mostrar lugares según categoría seleccionada
function mostrarLugares() {
    const container = document.getElementById('places-container');
    
    if (categorias.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; padding: 60px;">No hay lugares disponibles</p>';
        return;
    }
    
    // Filtrar categorías
    const categoriasAMostrar = categoriaActual === 'todos' 
        ? categorias 
        : categorias.filter(c => c.id === categoriaActual);
    
    // Generar HTML
    let html = '';
    
    categoriasAMostrar.forEach(categoria => {
        // Header de categoría
        html += `
            <div class="category-header">
                <h2 class="category-title">
                    <span class="category-title-icon">${categoria.icono}</span>
                    ${categoria.nombre}
                </h2>
                <p class="category-description">${categoria.descripcion}</p>
            </div>
        `;
        
        // Lugares de la categoría
        categoria.lugares.forEach(lugar => {
            html += `
                <div class="place-card ${lugar.destacado ? 'destacado' : ''}" 
                     data-categoria="${categoria.id}">
                    <div class="place-image">
                        <img src="${lugar.imagen}" alt="${lugar.nombre}" loading="lazy">
                        <span class="place-type">${lugar.tipo}</span>
                    </div>
                    <div class="place-info">
                        <h3 class="place-name">${lugar.nombre}</h3>
                        <p class="place-description">${lugar.descripcion}</p>
                        <div class="place-location">${lugar.ubicacion}</div>
                        <div class="place-footer">
                            <button class="btn-details" onclick="mostrarDetalles('${categoria.id}', '${lugar.id}')">
                                Ver Más
                            </button>
                            <button class="btn-link" onclick="abrirEnlace('${lugar.link}')">
                                Ir al Lugar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    });
    
    container.innerHTML = html;
}

// Filtrar por categoría
function filtrarCategoria(categoria) {
    categoriaActual = categoria;
    
    // Actualizar tabs activos
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-category="${categoria}"]`).classList.add('active');
    
    mostrarLugares();
    
    // Scroll suave al inicio de los lugares
    document.querySelector('.places-section').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Mostrar detalles en modal
function mostrarDetalles(categoriaId, lugarId) {
    const categoria = categorias.find(c => c.id === categoriaId);
    if (!categoria) return;
    
    const lugar = categoria.lugares.find(l => l.id === lugarId);
    if (!lugar) return;
    
    const modal = document.getElementById('details-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <img src="${lugar.imagen}" alt="${lugar.nombre}" class="modal-image">
        <div class="modal-info">
            <span class="modal-type">${lugar.tipo}</span>
            <h2 class="modal-title">${lugar.nombre}</h2>
            <div class="modal-location">${lugar.ubicacion}</div>
            <p class="modal-description">${lugar.descripcion}</p>
            <a href="${lugar.link}" target="_blank" class="modal-link">
                📍 Ver en Google Maps / Más Info
            </a>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('details-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Abrir enlace externo
function abrirEnlace(url) {
    window.open(url, '_blank');
}

// Volver a inicio
function volverInicio() {
    window.location.href = '../../index.html';
}

// Mostrar error
function mostrarError() {
    const container = document.getElementById('places-container');
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <p style="color: #e74c3c; font-size: 1.2rem; margin-bottom: 15px;">
                ⚠️ Error al cargar los lugares
            </p>
            <p style="color: #666; margin-bottom: 20px;">
                Por favor, intenta recargar la página
            </p>
            <button onclick="location.reload()" style="
                background: linear-gradient(135deg, #FF385C 0%, #E31C5F 100%);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 50px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
            ">
                Recargar
            </button>
        </div>
    `;
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cerrarModal();
    }
});
