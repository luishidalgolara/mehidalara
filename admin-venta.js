// ===================================
// ADMIN VENTA — Gestión de propiedades en venta
// ===================================

const Venta = (() => {

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
        const stored = localStorage.getItem('larem_venta');
        items = stored ? JSON.parse(stored) : [];
        render();
        updateStats();
    }

    function save() {
        localStorage.setItem('larem_venta', JSON.stringify(items));
        localStorage.setItem('larem_venta_updated', new Date().toISOString());
        render();
        updateStats();
    }

    // ── Estadísticas ──────────────────────────────────────
    function updateStats() {
        const el = document.getElementById('venta-count');
        if (el) el.textContent = items.length;
    }

    // ── Render tarjetas ───────────────────────────────────
    function render() {
        const container = document.getElementById('venta-list');
        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
                    <h3>Sin propiedades en venta</h3>
                    <p>Agrega tu primera propiedad en venta</p>
                </div>`;
            return;
        }

        container.innerHTML = items.map((item, i) => `
            <div class="apartment-item">
                <img src="${item.images[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}" alt="${item.name}" class="apartment-image">
                <div class="apartment-info">
                    <div class="item-badge badge-venta">Venta</div>
                    <h3 class="apartment-name">${item.name}</h3>
                    <p class="apartment-location">📍 ${item.location}</p>
                    <div class="apartment-price">${item.priceUF.toLocaleString('es-CL')} UF<span> · $${item.priceCLP.toLocaleString('es-CL')}</span></div>
                    <p class="item-specs">📐 ${item.sqm} m² · 🛏️ ${item.bedrooms} hab · 🚿 ${item.bathrooms} baños · ${item.mortgage ? '✅ Hipoteca' : '❌ Sin hipoteca'}</p>
                    <div class="apartment-actions">
                        <button class="btn-edit" onclick="Venta.edit(${i})">✏️ Editar</button>
                        <button class="btn-delete" onclick="Venta.remove(${i})">🗑️ Eliminar</button>
                    </div>
                </div>
            </div>`).join('');
    }

    // ── Modal ─────────────────────────────────────────────
    function showForm() {
        editingId = null;
        document.getElementById('venta-form').reset();
        uploadedImages = [];
        renderImagePreview();
        currentStep = 1;
        updateProgress();
        showStep(1);
        document.getElementById('venta-modal').classList.add('active');
    }

    function edit(index) {
        editingId = index;
        const item = items[index];
        document.getElementById('vt-name').value = item.name;
        document.getElementById('vt-location').value = item.location;
        document.getElementById('vt-price-uf').value = item.priceUF;
        document.getElementById('vt-price-clp').value = item.priceCLP;
        document.getElementById('vt-sqm').value = item.sqm;
        document.getElementById('vt-bedrooms').value = item.bedrooms;
        document.getElementById('vt-bathrooms').value = item.bathrooms;
        document.getElementById('vt-year').value = item.year || '';
        document.getElementById('vt-mortgage').value = item.mortgage ? 'si' : 'no';
        document.getElementById('vt-features').value = (item.features || []).join(', ');
        document.getElementById('vt-description').value = item.description;
        uploadedImages = item.images || [];
        renderImagePreview();
        currentStep = 1;
        updateProgress();
        showStep(1);
        document.getElementById('venta-modal').classList.add('active');
    }

    function remove(index) {
        if (confirm('¿Eliminar esta propiedad en venta?')) {
            items.splice(index, 1);
            save();
            showNotification('Propiedad eliminada', 'success');
        }
    }

    function closeModal() {
        document.getElementById('venta-modal').classList.remove('active');
        uploadedImages = [];
        editingId = null;
    }

    // ── Wizard ────────────────────────────────────────────
    function showStep(step) {
        document.querySelectorAll('#venta-modal .form-step').forEach(s => s.classList.remove('active'));
        document.querySelector(`#venta-modal [data-step="${step}"]`).classList.add('active');
        document.querySelector('#venta-modal .btn-prev').style.display = step === 1 ? 'none' : 'flex';
        document.querySelector('#venta-modal .btn-next').style.display = step === totalSteps ? 'none' : 'flex';
        document.querySelector('#venta-modal .btn-submit').style.display = step === totalSteps ? 'flex' : 'none';
        document.querySelector('#venta-modal .modal-content').scrollTop = 0;
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
        document.querySelector('#venta-modal .progress-fill').style.width = pct + '%';
        document.querySelector('#venta-modal .step-current').textContent = currentStep;
        document.querySelector('#venta-modal .step-total').textContent = totalSteps;
    }

    function validate(step) {
        const rules = {
            1: () => document.getElementById('vt-name').value.trim() ? true : '¿Cómo se llama la propiedad?',
            2: () => document.getElementById('vt-location').value.trim() ? true : '¿Dónde está ubicada?',
            3: () => document.getElementById('vt-price-uf').value > 0 ? true : 'Ingresa el precio en UF',
            4: () => document.getElementById('vt-sqm').value > 0 ? true : 'Ingresa los m² de la propiedad',
            5: () => document.getElementById('vt-bathrooms').value > 0 ? true : 'Ingresa el número de baños',
            6: () => document.getElementById('vt-mortgage').value ? true : 'Indica si acepta hipoteca',
            7: () => document.getElementById('vt-description').value.trim().length >= 20 ? true : 'Descripción mínimo 20 caracteres',
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

        const featuresRaw = document.getElementById('vt-features').value;
        const features = featuresRaw ? featuresRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

        const data = {
            id: editingId !== null ? items[editingId].id : Date.now(),
            name: document.getElementById('vt-name').value.trim(),
            location: document.getElementById('vt-location').value.trim(),
            priceUF: parseFloat(document.getElementById('vt-price-uf').value),
            priceCLP: parseInt(document.getElementById('vt-price-clp').value) || 0,
            sqm: parseInt(document.getElementById('vt-sqm').value),
            bedrooms: parseInt(document.getElementById('vt-bedrooms').value) || 0,
            bathrooms: parseInt(document.getElementById('vt-bathrooms').value),
            year: document.getElementById('vt-year').value || null,
            mortgage: document.getElementById('vt-mortgage').value === 'si',
            features,
            description: document.getElementById('vt-description').value.trim(),
            images: uploadedImages
        };

        if (editingId !== null) {
            items[editingId] = data;
            showNotification('Propiedad en venta actualizada', 'success');
        } else {
            items.push(data);
            showNotification('Propiedad en venta guardada', 'success');
        }

        save();
        closeModal();
    }

    // ── Imágenes ──────────────────────────────────────────
    function setupImageUpload() {
        const area = document.getElementById('vt-upload-area');
        const input = document.getElementById('vt-image-input');
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
        const container = document.getElementById('vt-image-preview');
        if (!container) return;
        container.innerHTML = uploadedImages.map((img, i) => `
            <div class="preview-item">
                <img src="${img}" alt="Preview">
                <button type="button" class="preview-remove" onclick="Venta.removeImage(${i})">×</button>
            </div>`).join('');
    }

    function removeImage(index) {
        uploadedImages.splice(index, 1);
        renderImagePreview();
    }

    // ── API pública ───────────────────────────────────────
    return { init, showForm, edit, remove, closeModal, nextStep, prevStep, submit, removeImage };

})();

document.addEventListener('DOMContentLoaded', Venta.init);
