// ===================================
// AIRBNB - DATOS
// ===================================

const apartmentsData = [
    {
        id: 0,
        name: 'Penthouse Panorámico',
        location: 'Centro Histórico',
        price: 180,
        period: '/noche',
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Espectacular penthouse con vistas de 360° a la ciudad. Terraza privada, 3 habitaciones suite y acabados de primera clase.',
        amenities: ['WiFi de alta velocidad','Aire acondicionado','Terraza privada con jacuzzi','Cocina completamente equipada','Smart TV en todas las habitaciones','Sistema de sonido premium','Estacionamiento privado','Servicio de limpieza','Vistas panorámicas 360°','Gimnasio privado'],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
    },
    {
        id: 1,
        name: 'Suite Costera',
        location: 'Frente al Mar',
        price: 150,
        period: '/noche',
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        description: 'Despierta con el sonido de las olas. Amplio balcón con vista directa al océano, decoración contemporánea y cocina gourmet.',
        amenities: ['Vista directa al mar','Balcón amplio','WiFi fibra óptica','Cocina gourmet','Aire acondicionado','Ropa de cama premium','Acceso directo a la playa','Estacionamiento incluido','Smart TV 4K','Cafetera espresso'],
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'
    },
    {
        id: 2,
        name: 'Loft Moderno',
        location: 'Distrito Artístico',
        price: 95,
        period: '/noche',
        guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Concepto abierto con techos altos, iluminación diseñada y arte contemporáneo. Perfecto para estancias creativas y profesionales.',
        amenities: ['Espacio de trabajo dedicado','WiFi ultra rápido','Techos de 4 metros','Iluminación inteligente','Arte contemporáneo','Cocina moderna','Aire acondicionado','Smart TV','Equipo de sonido','Zona de lectura'],
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
    },
    {
        id: 3,
        name: 'Jardín Urbano',
        location: 'Zona Residencial',
        price: 220,
        period: '/noche',
        guests: 8,
        bedrooms: 4,
        bathrooms: 3,
        description: 'Oasis de tranquilidad con jardín privado. Ideal para familias que buscan espacio, naturaleza y privacidad en plena ciudad.',
        amenities: ['Jardín privado 150m²','BBQ y área de terraza','Cocina completamente equipada','WiFi de alta velocidad','Aire acondicionado central','Lavadora y secadora','Zona de juegos para niños','2 estacionamientos','Sistema de seguridad','Chimenea'],
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
    },
    {
        id: 4,
        name: 'Estudio Boutique',
        location: 'Plaza Principal',
        price: 85,
        period: '/noche',
        guests: 2,
        bedrooms: 0,
        bathrooms: 1,
        description: 'Compacto pero sofisticado. Diseño inteligente que maximiza cada metro cuadrado con estilo y funcionalidad excepcional.',
        amenities: ['Diseño inteligente','Cocina equipada','WiFi rápido','Aire acondicionado','Smart TV','Cama queen size','Baño moderno','Zona de trabajo','Cafetera Nespresso','Ubicación céntrica'],
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
    },
    {
        id: 5,
        name: 'Classic Elegance',
        location: 'Barrio Histórico',
        price: 165,
        period: '/noche',
        guests: 5,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Elegancia atemporal en edificio patrimonial restaurado. Molduras originales, pisos de madera noble y confort moderno.',
        amenities: ['Edificio patrimonial','Pisos de madera noble','Molduras originales','Biblioteca privada','Cocina vintage-moderna','WiFi de alta velocidad','Aire acondicionado','Chimenea decorativa','Balcón francés','Estacionamiento'],
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
    }
];

const galleryData = [
    { name: 'Sala de Estar', icon: '🛋️', image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80' },
    { name: 'Cocina Gourmet', icon: '🍳', image: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=1200&q=80' },
    { name: 'Habitación Principal', icon: '🛏️', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80' },
    { name: 'Baño de Lujo', icon: '🛁', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80' },
    { name: 'Vistas Panorámicas', icon: '🌆', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80' },
    { name: 'Terraza Privada', icon: '🪴', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80' }
];

let currentLightboxIndex = 0;

// ===================================
// INIT
// ===================================

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
        if (current > lastScroll && current > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = current;
    });
}

// ===================================
// MODAL
// ===================================

function openDetails(index) {
    const apt = apartmentsData[index];
    const modal = document.getElementById('detailsModal');
    document.getElementById('modalBody').innerHTML = `
        <div style="padding: 2rem;">
            <img src="${apt.image}" alt="${apt.name}" style="width:100%;height:300px;object-fit:cover;margin-bottom:1.5rem;">
            <h2 style="font-family:var(--font-elegant);font-size:2rem;font-weight:400;color:var(--color-primary);margin-bottom:0.5rem;">${apt.name}</h2>
            <p style="font-size:0.9rem;color:var(--color-text-light);margin-bottom:1.5rem;">📍 ${apt.location}</p>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem;">
                ${[['👥','Huéspedes',apt.guests],['🛏️','Habitaciones',apt.bedrooms],['🛁','Baños',apt.bathrooms],['💰','Por noche','$'+apt.price]].map(([icon,label,val])=>`
                <div style="text-align:center;padding:1rem;background:var(--color-background);">
                    <div style="font-size:1.8rem;margin-bottom:0.3rem;">${icon}</div>
                    <div style="font-size:0.8rem;color:var(--color-text-light);">${label}</div>
                    <div style="font-size:1.1rem;font-weight:500;">${val}</div>
                </div>`).join('')}
            </div>
            <p style="font-size:0.95rem;line-height:1.8;color:var(--color-text-light);margin-bottom:1.5rem;">${apt.description}</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0.5rem;margin-bottom:1.5rem;">
                ${apt.amenities.map(a=>`<div style="padding:0.6rem;background:var(--color-background);font-size:0.85rem;"><span style="color:var(--color-secondary);margin-right:0.5rem;">✓</span>${a}</div>`).join('')}
            </div>
            <button onclick="handleReservation()" style="width:100%;padding:1rem;background:var(--color-primary);color:white;border:none;font-family:var(--font-primary);font-size:0.85rem;letter-spacing:2px;text-transform:uppercase;cursor:pointer;">Reservar Ahora</button>
        </div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDetails() {
    document.getElementById('detailsModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.addEventListener('click', e => {
    if (e.target === document.getElementById('detailsModal')) closeDetails();
});

// ===================================
// LIGHTBOX
// ===================================

function openLightbox(index) {
    currentLightboxIndex = index;
    document.getElementById('lightboxImage').src = galleryData[index].image;
    document.getElementById('lightboxImage').alt = galleryData[index].name;
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

document.addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeLightbox(); closeDetails(); }
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
});

function handleReservation() {
    alert('Para reservar contáctanos:\n📧 Reserva@larem.cl\n📱 +56 9 930 955 22');
    closeDetails();
}
