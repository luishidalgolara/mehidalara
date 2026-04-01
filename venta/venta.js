// ===================================
// VENTA - JS
// ===================================

const propiedades = [
    {
        name: 'Penthouse Exclusivo',
        location: 'Barrio Universitario, Concepción',
        uf: '5.800 UF',
        clp: '~ $222.000.000',
        m2: 180,
        bedrooms: 3,
        bathrooms: 3,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        description: 'Espectacular penthouse en edificio premium. Terminaciones de lujo, terraza privada con jacuzzi y vistas panorámicas a 360°. Oportunidad única de inversión en el corazón de la ciudad.',
        features: ['Terraza privada 50m² con jacuzzi','Vistas 360° a la ciudad','Cocina gourmet equipada','Suite principal con vestidor','Sistema domótico','2 estacionamientos + bodega','Gimnasio privado en edificio','Sala de eventos','Conserje 24/7','Generador eléctrico']
    },
    {
        name: 'Depto Vista al Mar',
        location: 'Tomé, Región del Biobío',
        uf: '3.200 UF',
        clp: '~ $122.000.000',
        m2: 85,
        bedrooms: 2,
        bathrooms: 2,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
        description: 'Departamento con vista directa al mar en edificio boutique de 12 pisos. Terminaciones europeas, cocina integrada con isla y balcón privado con orientación poniente.',
        features: ['Vista directa al mar','Balcón privado 8m²','Terminaciones europeas','Cocina con isla integrada','Estacionamiento incluido','Bodega','Piscina en el edificio','Seguridad 24/7','Ascensor panorámico','Sala de reuniones']
    },
    {
        name: 'Casa Barrio Residencial',
        location: 'Camino a Dichato, Concepción',
        uf: '4.500 UF',
        clp: '~ $172.000.000',
        m2: 200,
        bedrooms: 4,
        bathrooms: 3,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        description: 'Amplia casa en sector tranquilo con jardín y zona de BBQ. Construcción sólida con materiales de primera. Ampliaciones aprobadas y excelente conectividad.',
        features: ['Terreno 700m²','Jardín con riego automático','Zona BBQ cubierta','4 dormitorios (1 en suite)','Estudio independiente','2 estacionamientos techados','Alarma y cámaras','Calefacción central gas','Ampliaciones aprobadas','Bodegas exteriores']
    },
    {
        name: 'Loft para Inversión',
        location: 'Centro Histórico, Concepción',
        uf: '1.800 UF',
        clp: '~ $68.000.000',
        m2: 42,
        bedrooms: 0,
        bathrooms: 1,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        description: 'Ideal para inversión con arriendo garantizado. Ubicación premium en el centro histórico, alta demanda de arrendatarios y rentabilidad estimada del 7% anual.',
        features: ['Rentabilidad 7% anual estimada','Arriendo garantizado 12 meses','Amoblado y equipado','Administración incluida 1er año','Ubicación premium','Alta demanda de arriendo','Edificio con recepción','Gimnasio','Cafetería en el edificio','Gestión de renta disponible']
    },
    {
        name: 'Departamento Familiar',
        location: 'San Pedro de la Paz',
        uf: '2.600 UF',
        clp: '~ $99.000.000',
        m2: 95,
        bedrooms: 3,
        bathrooms: 2,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        description: 'Perfecta opción para familia. Ubicado cerca de los mejores colegios y supermercados de San Pedro. Edificio con piscina, sala de juegos y seguridad privada.',
        features: ['Cercano a colegios principales','Piscina en el edificio','Sala de juegos infantiles','Seguridad privada 24/7','Estacionamiento incluido','Bodega','Balcón','Calefacción central','Áreas verdes','Juegos infantiles exteriores']
    },
    {
        name: 'Estudio Céntrico',
        location: 'Centro, Concepción',
        uf: '1.200 UF',
        clp: '~ $46.000.000',
        m2: 32,
        bedrooms: 0,
        bathrooms: 1,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
        description: 'Excelente opción para primera vivienda o inversión. Subsidio habitacional disponible. Edificio moderno con todas las comodidades en pleno centro de Concepción.',
        features: ['Subsidio habitacional disponible','Crédito hipotecario factible','Edificio moderno 2022','Gimnasio','Lavandería','Sala de reuniones','Bicicletero','Recepción','Ubicación céntrica','Llave de cocina americana']
    }
];

const galleryData = [
    { name: 'Living', image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80' },
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

function openDetails(index) {
    const p = propiedades[index];
    document.getElementById('modalBody').innerHTML = `
        <div style="padding: 2rem;">
            <img src="${p.image}" alt="${p.name}" style="width:100%;height:280px;object-fit:cover;margin-bottom:1.5rem;">
            <h2 style="font-family:var(--font-elegant);font-size:1.8rem;font-weight:400;color:var(--color-primary);margin-bottom:0.3rem;">${p.name}</h2>
            <p style="font-size:0.85rem;color:var(--color-text-light);margin-bottom:0.75rem;">📍 ${p.location}</p>
            <div style="display:flex;gap:1rem;align-items:baseline;margin-bottom:1.5rem;">
                <span style="font-family:var(--font-primary);font-size:1.6rem;font-weight:700;color:#2c3e6b;">${p.uf}</span>
                <span style="font-family:var(--font-primary);font-size:0.9rem;color:var(--color-text-light);">${p.clp}</span>
            </div>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1.5rem;">
                ${[['🛏️', p.bedrooms > 0 ? p.bedrooms + ' hab.' : 'Estudio'], ['🛁', p.bathrooms + ' baños'], ['📐', p.m2 + ' m²']].map(([icon, val]) => `
                <div style="padding:0.6rem 1rem;background:#f0f2f8;font-size:0.85rem;">${icon} ${val}</div>`).join('')}
            </div>
            <p style="font-size:0.9rem;line-height:1.8;color:var(--color-text-light);margin-bottom:1.5rem;">${p.description}</p>
            <h4 style="font-family:var(--font-primary);font-size:0.75rem;letter-spacing:3px;text-transform:uppercase;color:#2c3e6b;margin-bottom:1rem;">Características</h4>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0.5rem;margin-bottom:1.5rem;">
                ${p.features.map(f => `<div style="padding:0.6rem;background:#f0f2f8;font-size:0.85rem;"><span style="color:#2c3e6b;margin-right:0.5rem;">✓</span>${f}</div>`).join('')}
            </div>
            <button onclick="handleContact()" style="width:100%;padding:1rem;background:#2c3e6b;color:white;border:none;font-family:var(--font-primary);font-size:0.85rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;">Agendar Visita</button>
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
    alert('Para agendar una visita:\n📧 Reserva@larem.cl\n📱 +56 9 930 955 22');
    closeDetails();
}
