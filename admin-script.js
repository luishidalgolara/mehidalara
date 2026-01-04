// ===================================
// VARIABLES GLOBALES
// ===================================

let currentStep = 1;
const totalSteps = 8;
let uploadedImages = [];
let editingApartmentId = null;
let apartments = [];

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión
    checkSession();
    
    // Cargar departamentos
    loadApartments();
    
    // Actualizar estadísticas
    updateStats();
    
    // Setup upload area
    setupImageUpload();
    
    // Cargar username
    const session = getSession();
    if (session) {
        document.getElementById('adminUsername').textContent = session.username;
    }
});

// ===================================
// GESTIÓN DE SESIÓN
// ===================================

function checkSession() {
    const session = getSession();
    if (!session) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Verificar expiración
    const loginTime = new Date(session.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
        logout();
    }
}

function getSession() {
    const session = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');
    return session ? JSON.parse(session) : null;
}

function logout() {
    localStorage.removeItem('adminSession');
    sessionStorage.removeItem('adminSession');
    window.location.href = 'admin-login.html';
}

// ===================================
// GESTIÓN DE DEPARTAMENTOS
// ===================================

function loadApartments() {
    const stored = localStorage.getItem('apartments');
    apartments = stored ? JSON.parse(stored) : [];
    renderApartments();
}

function saveApartments() {
    localStorage.setItem('apartments', JSON.stringify(apartments));
    localStorage.setItem('lastUpdate', new Date().toISOString());
    updateStats();
    renderApartments();
}

function renderApartments() {
    const container = document.getElementById('apartmentsList');
    
    if (apartments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                <h3>No hay departamentos aún</h3>
                <p>Comienza agregando tu primer departamento</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = apartments.map((apt, index) => `
        <div class="apartment-item">
            <img src="${apt.images[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}" alt="${apt.name}" class="apartment-image">
            <div class="apartment-info">
                <h3 class="apartment-name">${apt.name}</h3>
                <p class="apartment-location">📍 ${apt.location}</p>
                <div class="apartment-price">$${apt.price}<span style="font-size: 0.875rem; font-weight: 400; color: #64748b;">/noche</span></div>
                <div class="apartment-actions">
                    <button class="btn-edit" onclick="editApartment(${index})">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                        Editar
                    </button>
                    <button class="btn-delete" onclick="deleteApartment(${index})">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const totalImages = apartments.reduce((sum, apt) => sum + (apt.images?.length || 0), 0);
    const lastUpdate = localStorage.getItem('lastUpdate');
    
    document.getElementById('totalApartments').textContent = apartments.length;
    document.getElementById('totalImages').textContent = totalImages;
    
    if (lastUpdate) {
        const date = new Date(lastUpdate);
        const formatted = date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('lastUpdate').textContent = formatted;
    }
}

// ===================================
// MODAL Y FORMULARIO
// ===================================

function showAddForm() {
    editingApartmentId = null;
    document.getElementById('modalTitle').textContent = 'Agregar Nuevo Departamento';
    document.getElementById('apartmentForm').reset();
    uploadedImages = [];
    currentStep = 1;
    updateStepProgress();
    showStep(1);
    document.getElementById('apartmentModal').classList.add('active');
}

function editApartment(index) {
    editingApartmentId = index;
    const apt = apartments[index];
    
    document.getElementById('modalTitle').textContent = 'Editar Departamento';
    
    // Llenar formulario
    document.getElementById('apartmentName').value = apt.name;
    document.getElementById('apartmentLocation').value = apt.location;
    document.getElementById('apartmentPrice').value = apt.price;
    document.getElementById('apartmentGuests').value = apt.guests;
    document.getElementById('apartmentBedrooms').value = apt.bedrooms;
    document.getElementById('apartmentBathrooms').value = apt.bathrooms;
    document.getElementById('apartmentDescription').value = apt.description;
    
    // Marcar amenidades
    document.querySelectorAll('.amenity-checkbox input').forEach(checkbox => {
        checkbox.checked = apt.amenities.includes(checkbox.value);
    });
    
    // Cargar imágenes
    uploadedImages = apt.images || [];
    renderImagePreview();
    
    currentStep = 1;
    updateStepProgress();
    showStep(1);
    document.getElementById('apartmentModal').classList.add('active');
}

function deleteApartment(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
        apartments.splice(index, 1);
        saveApartments();
        
        // Mostrar notificación
        showNotification('Departamento eliminado correctamente', 'success');
    }
}

function closeModal() {
    document.getElementById('apartmentModal').classList.remove('active');
    document.getElementById('apartmentForm').reset();
    uploadedImages = [];
    editingApartmentId = null;
}

// ===================================
// WIZARD NAVIGATION
// ===================================

function showStep(step) {
    // Ocultar todos los pasos
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    
    // Mostrar paso actual
    document.querySelector(`[data-step="${step}"]`).classList.add('active');
    
    // Actualizar botones
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const submitBtn = document.querySelector('.btn-submit');
    
    prevBtn.style.display = step === 1 ? 'none' : 'flex';
    nextBtn.style.display = step === totalSteps ? 'none' : 'flex';
    submitBtn.style.display = step === totalSteps ? 'flex' : 'none';
    
    // Scroll to top
    document.querySelector('.modal-content').scrollTop = 0;
}

function nextStep() {
    if (validateStep(currentStep)) {
        currentStep++;
        updateStepProgress();
        showStep(currentStep);
    }
}

function previousStep() {
    currentStep--;
    updateStepProgress();
    showStep(currentStep);
}

function updateStepProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('currentStep').textContent = currentStep;
    document.getElementById('totalSteps').textContent = totalSteps;
}

function validateStep(step) {
    let isValid = true;
    let errorMessage = '';
    
    switch(step) {
        case 1:
            const name = document.getElementById('apartmentName').value.trim();
            if (!name) {
                errorMessage = 'Por favor ingresa el nombre del departamento';
                isValid = false;
            }
            break;
        case 2:
            const location = document.getElementById('apartmentLocation').value.trim();
            if (!location) {
                errorMessage = 'Por favor ingresa la ubicación';
                isValid = false;
            }
            break;
        case 3:
            const price = document.getElementById('apartmentPrice').value;
            if (!price || price <= 0) {
                errorMessage = 'Por favor ingresa un precio válido';
                isValid = false;
            }
            break;
        case 4:
            const guests = document.getElementById('apartmentGuests').value;
            if (!guests || guests <= 0) {
                errorMessage = 'Por favor ingresa la cantidad de huéspedes';
                isValid = false;
            }
            break;
        case 5:
            const bedrooms = document.getElementById('apartmentBedrooms').value;
            const bathrooms = document.getElementById('apartmentBathrooms').value;
            if (!bathrooms || bathrooms <= 0) {
                errorMessage = 'Por favor ingresa la cantidad de baños';
                isValid = false;
            }
            break;
        case 6:
            const description = document.getElementById('apartmentDescription').value.trim();
            if (!description || description.length < 20) {
                errorMessage = 'Por favor ingresa una descripción de al menos 20 caracteres';
                isValid = false;
            }
            break;
        case 7:
            // Las amenidades son opcionales
            break;
        case 8:
            if (uploadedImages.length === 0) {
                errorMessage = 'Por favor sube al menos una imagen';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showNotification(errorMessage, 'error');
    }
    
    return isValid;
}

// ===================================
// SUBIDA DE IMÁGENES
// ===================================

function setupImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    
    // Click para seleccionar archivos
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });
    
    // Cambio de input
    imageInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    });
}

function handleFiles(files) {
    // Filtrar solo imágenes JPG y PNG
    const validFiles = files.filter(file => {
        const type = file.type.toLowerCase();
        return type === 'image/jpeg' || type === 'image/jpg' || type === 'image/png';
    });
    
    if (validFiles.length !== files.length) {
        showNotification('Solo se permiten archivos JPG y PNG', 'warning');
    }
    
    // Limitar a 10 imágenes totales
    const remainingSlots = 10 - uploadedImages.length;
    const filesToProcess = validFiles.slice(0, remainingSlots);
    
    if (validFiles.length > remainingSlots) {
        showNotification(`Solo puedes subir ${remainingSlots} imágenes más (máximo 10 total)`, 'warning');
    }
    
    // Procesar archivos
    filesToProcess.forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            uploadedImages.push(e.target.result);
            renderImagePreview();
        };
        
        reader.readAsDataURL(file);
    });
}

function renderImagePreview() {
    const container = document.getElementById('imagePreview');
    
    container.innerHTML = uploadedImages.map((img, index) => `
        <div class="preview-item">
            <img src="${img}" alt="Preview ${index + 1}">
            <button type="button" class="preview-remove" onclick="removeImage(${index})">×</button>
        </div>
    `).join('');
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    renderImagePreview();
}

// ===================================
// AMENIDADES PERSONALIZADAS
// ===================================

function addCustomAmenity() {
    const input = document.getElementById('customAmenity');
    const value = input.value.trim();
    
    if (!value) return;
    
    // Crear checkbox para la nueva amenidad
    const amenitiesGrid = document.querySelector('.amenities-grid');
    const newCheckbox = document.createElement('label');
    newCheckbox.className = 'amenity-checkbox';
    newCheckbox.innerHTML = `
        <input type="checkbox" value="${value}" checked>
        <span>✨ ${value}</span>
    `;
    
    amenitiesGrid.appendChild(newCheckbox);
    input.value = '';
    
    showNotification('Amenidad agregada', 'success');
}

// ===================================
// GUARDAR DEPARTAMENTO
// ===================================

document.getElementById('apartmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateStep(8)) return;
    
    // Recopilar amenidades seleccionadas
    const selectedAmenities = Array.from(document.querySelectorAll('.amenity-checkbox input:checked'))
        .map(checkbox => checkbox.value);
    
    const apartmentData = {
        id: editingApartmentId !== null ? apartments[editingApartmentId].id : Date.now(),
        name: document.getElementById('apartmentName').value.trim(),
        location: document.getElementById('apartmentLocation').value.trim(),
        price: parseInt(document.getElementById('apartmentPrice').value),
        guests: parseInt(document.getElementById('apartmentGuests').value),
        bedrooms: parseInt(document.getElementById('apartmentBedrooms').value),
        bathrooms: parseInt(document.getElementById('apartmentBathrooms').value),
        description: document.getElementById('apartmentDescription').value.trim(),
        amenities: selectedAmenities,
        images: uploadedImages
    };
    
    if (editingApartmentId !== null) {
        // Editar existente
        apartments[editingApartmentId] = apartmentData;
        showNotification('Departamento actualizado correctamente', 'success');
    } else {
        // Agregar nuevo
        apartments.push(apartmentData);
        showNotification('Departamento agregado correctamente', 'success');
    }
    
    saveApartments();
    closeModal();
    
    // Exportar datos para la web principal
    exportToWebsite();
});

// ===================================
// EXPORTAR DATOS A LA WEB PRINCIPAL
// ===================================

function exportToWebsite() {
    // Preparar datos para la web principal en el MISMO formato que script.js
    const webData = apartments.map((apt, index) => ({
        id: index,
        name: apt.name,
        location: apt.location,
        price: apt.price,
        guests: apt.guests,
        bedrooms: apt.bedrooms,
        bathrooms: apt.bathrooms,
        description: apt.description,
        amenities: apt.amenities,
        images: apt.images // Array de imágenes en base64
    }));
    
    // Guardar en localStorage para que index.html lo lea
    localStorage.setItem('mehida_apartments', JSON.stringify(webData));
    
    console.log('✅ Datos exportados a la web principal:', webData.length, 'departamentos');
}

// ===================================
// UTILIDADES
// ===================================

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function viewWebsite() {
    window.open('index.html', '_blank');
}

// Agregar animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);