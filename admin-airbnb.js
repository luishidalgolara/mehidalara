// ===================================
// ADMIN AIRBNB — Gestión de estadías
// ===================================

const Airbnb = (() => {

    let currentStep = 1;
    const totalSteps = 8;
    let uploadedImages = [];
    let editingId = null;
    let items = [];

    // ── Init ──────────────────────────────────────────────
    function init() {
        load();
        setupImageUpload();
    }

    // ── Datos ─────────────────────────────────────────────
    function load() {
        const stored = localStorage.getItem('larem_airbnb');
        items = stored ? JSON.parse(stored) : [];
        render();
        updateStats();
    }

    function save() {
        localStorage.setItem('larem_airbnb', JSON.stringify(items));
        localStorage.setItem('larem_airbnb_updated', new Date().toISOString());
        render();
        updateStats();
    }

    // ── Estadísticas ──────────────────────────────────────
    function updateStats() {
        const el = document.getElementById('airbnb-count');
        if (el) el.textContent = items.length;
    }

    // ── Render tarjetas ───────────────────────────────────
    function render() {
        const container = document.getElementById('airbnb-list');
        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
                    <h3>Sin estadías Airbnb</h3>
                    <p>Agrega tu primera propiedad Airbnb</p>
                </div>`;
            return;
        }

        container.innerHTML = items.map((item, i) => `
            <div class="apartment-item">
                <img src="${item.images[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}" alt="${item.name}" class="apartment-image">
                <div class="apartment-info">
                    <div class="item-badge badge-airbnb">Airbnb</div>
                    <h3 class="apartment-name">${item.name}</h3>
                    <p class="apartment-location">📍 ${item.location}</p>
                    <div class="apartment-price">$${item.price.toLocaleString('es-CL')}<span>/noche</span></div>
                    <p class="item-specs">👥 ${item.guests} huéspedes · 🛏️ ${item.bedrooms} hab · 🚿 ${item.bathrooms} baños</p>
                    <div class="apartment-actions">
                        <button class="btn-edit" onclick="Airbnb.edit(${i})">✏️ Editar</button>
                        <button class="btn-delete" onclick="Airbnb.remove(${i})">🗑️ Eliminar</button>
                    </div>
                </div>
            </div>`).join('');
    }

    // ── Modal ─────────────────────────────────────────────
    function showForm() {
        editingId = null;
        document.getElementById('airbnb-form').reset();
        uploadedImages = [];
        renderImagePreview();
        currentStep = 1;
        updateProgress();
        showStep(1);
        document.getElementById('airbnb-modal').classList.add('active');
    }

    function edit(index) {
        editingId = index;
        const item = items[index];
        document.getElementById('ab-name').value = item.name;
        document.getElementById('ab-location').value = item.location;
        document.getElementById('ab-price').value = item.price;
        document.getElementById('ab-guests').value = item.guests;
        document.getElementById('ab-bedrooms').value = item.bedrooms;
        document.getElementById('ab-bathrooms').value = item.bathrooms;
        document.getElementById('ab-description').value = item.description;
        document.querySelectorAll('#airbnb-modal .amenity-checkbox input').forEach(cb => {
            cb.checked = item.amenities.includes(cb.value);
        });
        uploadedImages = item.images || [];
        renderImagePreview();
        currentStep = 1;
        updateProgress();
        showStep(1);
        document.getElementById('airbnb-modal').classList.add('active');
    }

    function remove(index) {
        if (confirm('¿Eliminar esta propiedad Airbnb?')) {
            items.splice(index, 1);
            save();
            showNotification('Propiedad eliminada', 'success');
        }
    }

    function closeModal() {
        document.getElementById('airbnb-modal').classList.remove('active');
        uploadedImages = [];
        editingId = null;
    }

    // ── Wizard ────────────────────────────────────────────
    function showStep(step) {
        document.querySelectorAll('#airbnb-modal .form-step').forEach(s => s.classList.remove('active'));
        document.querySelector(`#airbnb-modal [data-step="${step}"]`).classList.add('active');
        document.querySelector('#airbnb-modal .btn-prev').style.display = step === 1 ? 'none' : 'flex';
        document.querySelector('#airbnb-modal .btn-next').style.display = step === totalSteps ? 'none' : 'flex';
        document.querySelector('#airbnb-modal .btn-submit').style.display = step === totalSteps ? 'flex' : 'none';
        document.querySelector('#airbnb-modal .modal-content').scrollTop = 0;
    }

    function nextStep() {
        if (validate(currentStep)) {
            currentStep++;
            updateProgress();
            showStep(currentStep);
        }
    }

    function prevStep() {
        currentStep--;
        updateProgress();
        showStep(currentStep);
    }

    function updateProgress() {
        const pct = (currentStep / totalSteps) * 100;
        document.querySelector('#airbnb-modal .progress-fill').style.width = pct + '%';
        document.querySelector('#airbnb-modal .step-current').textContent = currentStep;
        document.querySelector('#airbnb-modal .step-total').textContent = totalSteps;
    }

    function validate(step) {
        const rules = {
            1: () => document.getElementById('ab-name').value.trim() ? true : '¿Cómo se llama la propiedad?',
            2: () => document.getElementById('ab-location').value.trim() ? true : '¿Dónde está ubicada?',
            3: () => document.getElementById('ab-price').value > 0 ? true : 'Ingresa el precio por noche',
            4: () => document.getElementById('ab-guests').value > 0 ? true : 'Ingresa el número de huéspedes',
            5: () => document.getElementById('ab-bathrooms').value > 0 ? true : 'Ingresa el número de baños',
            6: () => document.getElementById('ab-description').value.trim().length >= 20 ? true : 'Descripción mínimo 20 caracteres',
            7: () => true,
            8: () => uploadedImages.length > 0 ? true : 'Sube al menos una imagen'
        };
        const result = rules[step]();
        if (result !== true) { showNotification(result, 'error'); return false; }
        return true;
    }

    // ── Submit ────────────────────────────────────────────
    function submit(e) {
        e.preventDefault();
        if (!validate(8)) return;

        const amenities = Array.from(document.querySelectorAll('#airbnb-modal .amenity-checkbox input:checked'))
            .map(cb => cb.value);

        const data = {
            id: editingId !== null ? items[editingId].id : Date.now(),
            name: document.getElementById('ab-name').value.trim(),
            location: document.getElementById('ab-location').value.trim(),
            price: parseInt(document.getElementById('ab-price').value),
            guests: parseInt(document.getElementById('ab-guests').value),
            bedrooms: parseInt(document.getElementById('ab-bedrooms').value) || 0,
            bathrooms: parseInt(document.getElementById('ab-bathrooms').value),
            description: document.getElementById('ab-description').value.trim(),
            amenities,
            images: uploadedImages
        };

        if (editingId !== null) {
            items[editingId] = data;
            showNotification('Propiedad Airbnb actualizada', 'success');
        } else {
            items.push(data);
            showNotification('Propiedad Airbnb guardada', 'success');
        }

        save();
        closeModal();
    }

    // ── Imágenes ──────────────────────────────────────────
    function setupImageUpload() {
        const area = document.getElementById('ab-upload-area');
        const input = document.getElementById('ab-image-input');
        if (!area || !input) return;

        area.addEventListener('click', () => input.click());
        area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('drag-over'); });
        area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
        area.addEventListener('drop', e => { e.preventDefault(); area.classList.remove('drag-over'); handleFiles(Array.from(e.dataTransfer.files)); });
        input.addEventListener('change', e => handleFiles(Array.from(e.target.files)));
    }

    function handleFiles(files) {
        const valid = files.filter(f => ['image/jpeg','image/jpg','image/png'].includes(f.type));
        const slots = 10 - uploadedImages.length;
        valid.slice(0, slots).forEach(file => {
            const reader = new FileReader();
            reader.onload = e => { uploadedImages.push(e.target.result); renderImagePreview(); };
            reader.readAsDataURL(file);
        });
    }

    function renderImagePreview() {
        const container = document.getElementById('ab-image-preview');
        if (!container) return;
        container.innerHTML = uploadedImages.map((img, i) => `
            <div class="preview-item">
                <img src="${img}" alt="Preview">
                <button type="button" class="preview-remove" onclick="Airbnb.removeImage(${i})">×</button>
            </div>`).join('');
    }

    function removeImage(index) {
        uploadedImages.splice(index, 1);
        renderImagePreview();
    }

    function addCustomAmenity() {
        const input = document.getElementById('ab-custom-amenity');
        const val = input.value.trim();
        if (!val) return;
        const grid = document.querySelector('#airbnb-modal .amenities-grid');
        const label = document.createElement('label');
        label.className = 'amenity-checkbox';
        label.innerHTML = `<input type="checkbox" value="${val}" checked><span>✨ ${val}</span>`;
        grid.appendChild(label);
        input.value = '';
    }

    // ── API pública ───────────────────────────────────────
    return { init, showForm, edit, remove, closeModal, nextStep, prevStep, submit, removeImage, addCustomAmenity };

})();

document.addEventListener('DOMContentLoaded', Airbnb.init);
