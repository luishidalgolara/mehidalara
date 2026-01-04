// Estado global
let servicios = [];
let serviciosSeleccionados = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarServicios();
});

// Cargar servicios desde JSON
async function cargarServicios() {
    try {
        const response = await fetch('servicios.json');
        const data = await response.json();
        servicios = data.servicios;
        
        mostrarServicios();
    } catch (error) {
        console.error('Error al cargar servicios:', error);
        mostrarError();
    }
}

// Mostrar servicios en la lista
function mostrarServicios() {
    const lista = document.getElementById('services-list');
    
    if (servicios.length === 0) {
        lista.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No hay servicios disponibles</p>';
        return;
    }
    
    lista.innerHTML = servicios.map(servicio => `
        <div class="service-item ${servicio.destacado ? 'destacado' : ''}" 
             id="servicio-${servicio.id}" 
             onclick="toggleServicio('${servicio.id}')">
            <div class="service-checkbox"></div>
            <div class="service-icon">${servicio.icono}</div>
            <div class="service-info">
                <div class="service-header">
                    <h3 class="service-name">${servicio.nombre}</h3>
                    <span class="service-price">$${servicio.precio.toLocaleString('es-CL')}</span>
                </div>
                <p class="service-description">${servicio.descripcion}</p>
                <div class="service-duration">${servicio.duracion}</div>
            </div>
        </div>
    `).join('');
}

// Toggle selección de servicio
function toggleServicio(servicioId) {
    const servicio = servicios.find(s => s.id === servicioId);
    if (!servicio) return;
    
    const elemento = document.getElementById(`servicio-${servicioId}`);
    const index = serviciosSeleccionados.findIndex(s => s.id === servicioId);
    
    if (index > -1) {
        // Deseleccionar
        serviciosSeleccionados.splice(index, 1);
        elemento.classList.remove('selected');
        elemento.querySelector('.service-checkbox').textContent = '';
    } else {
        // Seleccionar
        serviciosSeleccionados.push(servicio);
        elemento.classList.add('selected');
        elemento.querySelector('.service-checkbox').textContent = '✓';
    }
    
    actualizarResumen();
}

// Actualizar panel de resumen
function actualizarResumen() {
    const summaryBody = document.getElementById('summary-body');
    const totalAmount = document.getElementById('total-amount');
    const btnRequest = document.getElementById('btn-request');
    
    // Si no hay servicios seleccionados
    if (serviciosSeleccionados.length === 0) {
        summaryBody.innerHTML = '<p class="summary-empty">No has seleccionado ningún servicio</p>';
        totalAmount.textContent = '$0';
        btnRequest.disabled = true;
        return;
    }
    
    // Mostrar servicios seleccionados
    summaryBody.innerHTML = serviciosSeleccionados.map(servicio => `
        <div class="summary-item">
            <div class="summary-item-name">
                ${servicio.icono} ${servicio.nombre}
            </div>
            <div class="summary-item-price">$${servicio.precio.toLocaleString('es-CL')}</div>
        </div>
    `).join('');
    
    // Calcular y mostrar total
    const total = serviciosSeleccionados.reduce((sum, servicio) => sum + servicio.precio, 0);
    totalAmount.textContent = `$${total.toLocaleString('es-CL')}`;
    
    // Habilitar botón
    btnRequest.disabled = false;
}

// Solicitar servicios
function solicitarServicios() {
    if (serviciosSeleccionados.length === 0) {
        alert('Por favor selecciona al menos un servicio');
        return;
    }
    
    // Preparar datos de la solicitud
    const solicitud = {
        servicios: serviciosSeleccionados,
        total: serviciosSeleccionados.reduce((sum, s) => sum + s.precio, 0),
        fecha: new Date().toISOString()
    };
    
    console.log('Solicitud de servicios:', solicitud);
    
    // Aquí puedes agregar la lógica para enviar al backend
    
    // Limpiar selección
    serviciosSeleccionados = [];
    document.querySelectorAll('.service-item').forEach(item => {
        item.classList.remove('selected');
        item.querySelector('.service-checkbox').textContent = '';
    });
    
    actualizarResumen();
    
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

// Volver a inicio
function volverInicio() {
    window.location.href = '../../index.html';
}

// Mostrar error
function mostrarError() {
    const lista = document.getElementById('services-list');
    lista.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <p style="color: #e74c3c; font-size: 1.2rem; margin-bottom: 15px;">
                ⚠️ Error al cargar los servicios
            </p>
            <p style="color: #666; margin-bottom: 20px;">
                Por favor, intenta recargar la página
            </p>
            <button onclick="location.reload()" style="
                background: linear-gradient(135deg, #4a9d8e 0%, #6fb3a7 100%);
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

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('confirmation-modal');
    if (event.target === modal) {
        cerrarModal();
    }
}