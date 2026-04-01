// ===================================
// ARRIENDO - JS
// ===================================

const propiedades = [
    {
        name: 'Estudio Moderno',
        location: 'Centro, Concepción',
        price: '$380.000/mes',
        m2: 35,
        piso: 5,
        bedrooms: 'Estudio',
        bathrooms: 1,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        description: 'Estudio totalmente amoblado con cocina integrada, excelente iluminación natural y acceso a áreas comunes con gimnasio.',
        features: ['Amoblado completo','Cocina integrada equipada','Gimnasio en edificio','Conserjería 24/7','WiFi de alta velocidad','Calefacción central','Ascensor','Lavandería común']
    },
    {
        name: 'Departamento 2D2B',
        location: 'Barrio Universitario',
        price: '$550.000/mes',
        m2: 65,
        piso: 4,
        bedrooms: 2,
        bathrooms: 2,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        description: 'Amplio departamento en edificio moderno con seguridad 24/7. Ideal para parejas o profesionales. Balcón con vista a la ciudad.',
        features: ['Sin amoblar','Estacionamiento incluido','Bodega','Seguridad 24/7','Balcón','Cocina equipada','Calefacción central','Piscina edificio']
    },
    {
        name: 'Casa 3D Jardín',
        location: 'Sector Collao',
        price: '$850.000/mes',
        m2: 110,
        piso: null,
        bedrooms: 3,
        bathrooms: 2,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        description: 'Casa con jardín privado en sector tranquilo. Amplio living-comedor, cocina equipada y 2 estacionamientos techados.',
        features: ['Jardín privado','2 Estacionamientos techados','Mascotas permitidas','Cocina equipada','Calefacción a gas','Alarma incluida','BBQ','Antejardín']
    },
    {
        name: 'Depto Vista al Río',
        location: 'Ribera Norte',
        price: '$620.000/mes',
        m2: 70,
        piso: 8,
        bedrooms: 2,
        bathrooms: 1,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        description: 'Departamento con espectacular vista al río Biobío. Piso 8, amplia terraza, terminaciones de primera y edificio con piscina.',
        features: ['Vista al río','Semi amoblado','Terraza amplia','Piscina en edificio','Gimnasio','Sala de reuniones','Calefacción central','Estacionamiento visitantes']
    },
    {
        name: 'Loft 1 Dormitorio',
        location: 'Pedro de Valdivia',
        price: '$450.000/mes',
        m2: 48,
        piso: 3,
        bedrooms: 1,
        bathrooms: 1,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
        description: 'Loft de diseño con concepto abierto, techos altos y ventanales grandes. Perfecto para profesionales modernos.',
        features: ['Amoblado completo','WiFi incluido','Cocina equipada','Smart TV','Aire acondicionado','Calefacción','Acceso a terraza comunitaria','Bicicletero']
    },
    {
        name: 'Penthouse 3D Terraza',
        location: 'Punta de Parra',
        price: '$1.100.000/mes',
        m2: 150,
        piso: 15,
        bedrooms: 3,
        bathrooms: 3,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        description: 'Exclusivo penthouse con terraza de 40m². Vistas panorámicas, cocina gourmet, living doble y suite principal con vestidor.',
        features: ['Sin amoblar','Terraza privada 40m²','2 Estacionamientos','Bodega grande','Suite con vestidor','Cocina gourmet','Domótica','Sala de cine']
    }
];

const galleryData = [
    { name: 'Living Comedor', image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80' },
    { name: 'Cocina', image: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=1200&q=80' },
    { name: 'Dormitorio', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80' },
    { name: 'Vistas', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80' },
    { name: 'Baño', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80' },
    { name: 'Terraza', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80' }
];

let currentLightboxIndex = 0;

document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initScrollAnimations();
    initHeaderScroll();
    initFilters();
});

function initMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-on-scroll').forEach(el => observer.observe(el));
}

function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        header.style.transform = (current > lastScroll && current > 100) ? 'translateY(-100%)' : 'translateY(0)';
        lastScroll = current;
    });
}

function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.dataset.filter;
            document.querySelectorAll('.prop-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

function openDetails(index) {
    const p = propiedades[index];
    document.getElementById('modalBody').innerHTML = `
        <div style="padding: 2rem;">
            <img src="${p.image}" alt="${p.name}" style="width:100%;height:280px;object-fit:cover;margin-bottom:1.5rem;">
            <h2 style="font-family:var(--font-elegant);font-size:1.8rem;font-weight:400;color:var(--color-primary);margin-bottom:0.3rem;">${p.name}</h2>
            <p style="font-size:0.85rem;color:var(--color-text-light);margin-bottom:0.5rem;">📍 ${p.location}</p>
            <p style="font-family:var(--font-primary);font-size:1.3rem;font-weight:600;color:#6b8f71;margin-bottom:1.5rem;">${p.price}</p>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1.5rem;">
                ${[['🛏️', p.bedrooms + (typeof p.bedrooms === 'number' ? ' hab.' : '')], ['🛁', p.bathrooms + ' baños'], ['📐', p.m2 + ' m²'], p.piso ? ['🏢', 'Piso ' + p.piso] : null].filter(Boolean).map(([icon, val]) => `
                <div style="padding:0.6rem 1rem;background:#f2f7f3;font-size:0.85rem;">${icon} ${val}</div>`).join('')}
            </div>
            <p style="font-size:0.9rem;line-height:1.8;color:var(--color-text-light);margin-bottom:1.5rem;">${p.description}</p>
            <h4 style="font-family:var(--font-primary);font-size:0.75rem;letter-spacing:3px;text-transform:uppercase;color:#6b8f71;margin-bottom:1rem;">Características</h4>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.5rem;margin-bottom:1.5rem;">
                ${p.features.map(f => `<div style="padding:0.6rem;background:#f2f7f3;font-size:0.85rem;"><span style="color:#6b8f71;margin-right:0.5rem;">✓</span>${f}</div>`).join('')}
            </div>
            <button onclick="handleContact()" style="width:100%;padding:1rem;background:#6b8f71;color:white;border:none;font-family:var(--font-primary);font-size:0.85rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;">Consultar Disponibilidad</button>
        </div>
    `;
    document.getElementById('detailsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDetails() {
    document.getElementById('detailsModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.addEventListener('click', e => {
    if (e.target === document.getElementById('detailsModal')) closeDetails();
    if (e.target === document.getElementById('lightbox')) closeLightbox();
});

function openLightbox(index) {
    currentLightboxIndex = index;
    document.getElementById('lightboxImage').src = galleryData[index].image;
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryData.length;
    document.getElementById('lightboxImage').src = galleryData[currentLightboxIndex].image;
}

function prevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryData.length) % galleryData.length;
    document.getElementById('lightboxImage').src = galleryData[currentLightboxIndex].image;
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeLightbox(); closeDetails(); }
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});

function handleContact() {
    alert('Para consultar disponibilidad:\n📧 Reserva@larem.cl\n📱 +56 9 930 955 22');
    closeDetails();
}
