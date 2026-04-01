// ===================================
// ADMIN ARRIENDO — Gestión de arriendos
// ===================================

const Arriendo = (() => {

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
        const stored = localStorage.getItem('larem_arriendo');
        items = stored ? JSON.parse(stored) : [];
        render();
        updateStats();
    }

    function save() {
        localStorage.setItem('larem_arriendo', JSON.stringify(items));
        localStorage.setItem('larem_arriendo_updated', new Date().toISOString());
        render();
        updateStats();
    }

    // ── Estadísticas ──────────────────────────────────────
    function updateStats() {
        const el = document.getElementById('arriendo-count');
        if (el) el.textContent = items.length;
    }

    // ── Render tarjetas ───────────────────────────────────
    function render() {
        const container = document.getElementById('arriendo-list');
        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
                    <h3>Sin propiedades en arriendo</h3>
                    <p>Agrega tu primera propiedad en arriendo</p>
                </div>`;
            return;
        }

        container.innerHTML = items.map((item, i) => `
            <div class="apartment-item">
                <img src="${item.images[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}" alt="${item.name}" class="apartment-image">
                <div class="apartment-info">
                    <div class="item-badge badge-arriendo">Arriendo</div>
                    <h3 class="apartment-name">${item.name}</h3>
                    <p class="apartment-location">📍 ${item.location}</p>
                    <div class="apartment-price">$${item.price.toLocaleString('es-CL')}<span>/mes</span></div>
                    <p class="item-specs">📐 ${item.sqm} m² · Piso ${item.floor} · ${item.furnished}</p>
                    <div class="apartment-actions">
                        <button class="btn-edit" onclick="Arriendo.edit(${i})">✏️ Editar</button>
                        <button class="btn-delete" onclick="Arriendo.remove(${i})">🗑️ Eliminar</button>
                    </div>
                </div>
            </div>`).join('');
    }

    // ── Modal ─────────────────────────────────────────────
    function showForm() {
        editingId = null;
        document.getElementById('arriendo-form').reset();
        uploadedImages = [];
        renderImagePreview();
        currentStep = 1;
        updateProgress();
        showStep(1);
        document.getElementById('arriendo-modal').classList.add('active');
    }

    function edit(index) {
        editingId = index;
        const item = items[index];
        document.getElementById('ar-name').value = item.name;
        document.getElementById('ar-location').value = item.location;
        document.getElementById('ar-price').value = item.price;
        document.getElementById('ar-sqm').value = item.sqm;
        document.getElementById('ar-floor').value = item.floor;
        document.getElementById('ar-bedrooms').value = item.bedrooms;
        document.getElementById('ar-bathrooms').value = item.bathrooms;
        document.getElementById('ar-furnished').value = item.furnished;
        document.getElementById('ar-description').value = item.description;
        document.getElementById('ar-extras').value = (item.extras || []).join(', ');
        uploadedImages = item.images || [];
        renderImagePreview();
        currentStep = 1;
        updateProgress();
        showStep(1);
        document.getElementById('arriendo-modal').classList.add('active');
    }

    function remove(index) {
        if (confirm('¿Eliminar esta propiedad en arriendo?')) {
            items.splice(index, 1);
            save();
            showNotification('Propiedad eliminada', 'success');
        }
    }

    function closeModal() {
        document.getElementById('arriendo-modal').classList.remove('active');
        uploadedImages = [];
        editingId = null;
    }

    // ── Wizard ────────────────────────────────────────────
    function showStep(step) {
        document.querySelectorAll('#arriendo-modal .form-step').forEach(s => s.classList.remove('active'));
        document.querySelector(`#arriendo-modal [data-step="${step}"]`).classList.add('active');
        document.querySelector('#arriendo-modal .btn-prev').style.display = step === 1 ? 'none' : 'flex';
        document.querySelector('#arriendo-modal .btn-next').style.display = step === totalSteps ? 'none' : 'flex';
        document.querySelector('#arriendo-modal .btn-submit').style.display = step === totalSteps ? 'flex' : 'none';
        document.querySelector('#arriendo-modal .modal-content').scrollTop = 0;
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
        document.querySelector('#arriendo-modal .progress-fill').style.width = pct + '%';
        document.querySelector('#arriendo-modal .step-current').textContent = currentStep;
        document.querySelector('#arriendo-modal .step-total').textContent = totalSteps;
    }

    function validate(step) {
        const rules = {
            1: () => document.getElementById('ar-name').value.trim() ? true : '¿Cómo se llama la propiedad?',
            2: () => document.getElementById('ar-location').value.trim() ? true : '¿Dónde está ubicada?',
            3: () => document.getElementById('ar-price').value > 0 ? true : 'Ingresa el precio mensual',
            4: () => document.getElementById('ar-sqm').value > 0 ? true : 'Ingresa los m² de la propiedad',
            5: () => document.getElementById('ar-bathrooms').value > 0 ? true : 'Ingresa el número de baños',
            6: () => document.getElementById('ar-furnished').value ? true : 'Selecciona el estado del amoblado',
            7: () => document.getElementById('ar-description').value.trim().length >= 20 ? true : 'Descripción mínimo 20 caracteres',
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

        const extrasRaw = document.getElementById('ar-extras').value;
        const extras = extrasRaw ? extrasRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

        const data = {
            id: editingId !== null ? items[editingId].id : Date.now(),
            name: document.getElementById('ar-name').value.trim(),
            location: document.getElementById('ar-location').value.trim(),
            price: parseInt(document.getElementById('ar-price').value),
            sqm: parseInt(document.getElementById('ar-sqm').value),
            floor: document.getElementById('ar-floor').value.trim() || 'N/A',
            bedrooms: parseInt(document.getElementById('ar-bedrooms').value) || 0,
            bathrooms: parseInt(document.getElementById('ar-bathrooms').value),
            furnished: document.getElementById('ar-furnished').value,
            extras,
            description: document.getElementById('ar-description').value.trim(),
            images: uploadedImages
        };

        if (editingId !== null) {
            items[editingId] = data;
            showNotification('Propiedad en arriendo actualizada', 'success');
        } else {
            items.push(data);
            showNotification('Propiedad en arriendo guardada', 'success');
        }

        save();
        closeModal();
    }

    // ── Imágenes ──────────────────────────────────────────
    function setupImageUpload() {
        const area = document.getElementById('ar-upload-area');
        const input = document.getElementById('ar-image-input');
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
        const container = document.getElementById('ar-image-preview');
        if (!container) return;
        container.innerHTML = uploadedImages.map((img, i) => `
            <div class="preview-item">
                <img src="${img}" alt="Preview">
                <button type="button" class="preview-remove" onclick="Arriendo.removeImage(${i})">×</button>
            </div>`).join('');
    }

    function removeImage(index) {
        uploadedImages.splice(index, 1);
        renderImagePreview();
    }

    // ── API pública ───────────────────────────────────────
    return { init, showForm, edit, remove, closeModal, nextStep, prevStep, submit, removeImage };

})();

document.addEventListener('DOMContentLoaded', Arriendo.init);
