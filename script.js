// ===================================
// DATOS DE DEPARTAMENTOS
// ===================================

// Datos por defecto (si no hay datos del admin)
let apartmentsData = [
    {
        id: 0,
        name: 'Penthouse Panorámico',
        location: 'Centro Histórico',
        price: 180,
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Espectacular penthouse con vistas de 360° a la ciudad. Terraza privada, 3 habitaciones suite y acabados de primera clase.',
        amenities: [
            'WiFi de alta velocidad',
            'Aire acondicionado',
            'Terraza privada con jacuzzi',
            'Cocina completamente equipada',
            'Smart TV en todas las habitaciones',
            'Sistema de sonido premium',
            'Estacionamiento privado',
            'Servicio de limpieza',
            'Vistas panorámicas 360°',
            'Gimnasio privado'
        ],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80']
    },
    {
        id: 1,
        name: 'Suite Costera',
        location: 'Frente al Mar',
        price: 150,
        guests: 4,
        bedrooms: 2,
        bathrooms: 2,
        description: 'Despierta con el sonido de las olas. Amplio balcón con vista directa al océano, decoración contemporánea y cocina gourmet.',
        amenities: [
            'Vista directa al mar',
            'Balcón amplio',
            'WiFi fibra óptica',
            'Cocina gourmet',
            'Aire acondicionado',
            'Ropa de cama premium',
            'Acceso directo a la playa',
            'Estacionamiento incluido',
            'Smart TV 4K',
            'Cafetera espresso'
        ],
        images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80']
    },
    {
        id: 2,
        name: 'Loft Moderno',
        location: 'Distrito Artístico',
        price: 95,
        guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        description: 'Concepto abierto con techos altos, iluminación diseñada y arte contemporáneo. Perfecto para estancias creativas y profesionales.',
        amenities: [
            'Espacio de trabajo dedicado',
            'WiFi ultra rápido',
            'Techos de 4 metros',
            'Iluminación inteligente',
            'Arte contemporáneo',
            'Cocina moderna',
            'Aire acondicionado',
            'Smart TV',
            'Equipo de sonido',
            'Zona de lectura'
        ],
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80']
    },
    {
        id: 3,
        name: 'Jardín Urbano',
        location: 'Zona Residencial',
        price: 220,
        guests: 8,
        bedrooms: 4,
        bathrooms: 3,
        description: 'Oasis de tranquilidad con jardín privado. Ideal para familias que buscan espacio, naturaleza y privacidad en plena ciudad.',
        amenities: [
            'Jardín privado 150m²',
            'BBQ y área de terraza',
            'Cocina completamente equipada',
            'WiFi de alta velocidad',
            'Aire acondicionado central',
            'Lavadora y secadora',
            'Zona de juegos para niños',
            '2 estacionamientos',
            'Sistema de seguridad',
            'Chimenea'
        ],
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80']
    },
    {
        id: 4,
        name: 'Estudio Boutique',
        location: 'Plaza Principal',
        price: 85,
        guests: 2,
        bedrooms: 0,
        bathrooms: 1,
        description: 'Compacto pero sofisticado. Diseño inteligente que maximiza cada metro cuadrado con estilo y funcionalidad excepcional.',
        amenities: [
            'Diseño inteligente',
            'Cocina equipada',
            'WiFi rápido',
            'Aire acondicionado',
            'Smart TV',
            'Cama queen size',
            'Baño moderno',
            'Zona de trabajo',
            'Cafetera Nespresso',
            'Ubicación céntrica'
        ],
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80']
    },
    {
        id: 5,
        name: 'Classic Elegance',
        location: 'Barrio Histórico',
        price: 165,
        guests: 5,
        bedrooms: 3,
        bathrooms: 2,
        description: 'Elegancia atemporal en edificio patrimonial restaurado. Molduras originales, pisos de madera noble y confort moderno.',
        amenities: [
            'Edificio patrimonial',
            'Pisos de madera noble',
            'Molduras originales',
            'Biblioteca privada',
            'Cocina vintage-moderna',
            'WiFi de alta velocidad',
            'Aire acondicionado',
            'Chimenea decorativa',
            'Balcón francés',
            'Estacionamiento'
        ],
        images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80']
    }
];

// ===================================
// CARGAR DATOS DEL ADMIN
// ===================================

function loadApartmentsFromAdmin() {
    try {
        const adminData = localStorage.getItem('mehida_apartments');
        if (adminData) {
            const parsedData = JSON.parse(adminData);
            if (parsedData && parsedData.length > 0) {
                apartmentsData = parsedData;
                console.log('✅ Cargados', apartmentsData.length, 'departamentos desde el admin');
                renderDynamicApartments();
            }
        }
    } catch (error) {
        console.log('ℹ️ Usando departamentos por defecto');
    }
}

// ===================================
// RENDERIZAR DEPARTAMENTOS DINÁMICOS
// ===================================

function renderDynamicApartments() {
    const container = document.querySelector('.apartments-grid');
    if (!container) return;
    
    container.innerHTML = apartmentsData.map((apt, index) => `
        <article class="apartment-card fade-on-scroll">
            <div class="card-image">
                <img src="${apt.images && apt.images[0] ? apt.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'}" 
                     alt="${apt.name}" 
                     class="card-img">
                <div class="image-overlay"></div>
                ${index === 0 ? '<span class="card-badge">Destacado</span>' : ''}
                ${apt.isNew ? '<span class="card-badge">Nuevo</span>' : ''}
            </div>
            <div class="card-content">
                <h3 class="card-title">${apt.name}</h3>
                <p class="card-location">📍 ${apt.location}</p>
                <p class="card-description">${apt.description}</p>
                <ul class="card-features">
                    <li>👥 ${apt.guests} huéspedes</li>
                    <li>🛏️ ${apt.bedrooms} habitaciones</li>
                    <li>🛁 ${apt.bathrooms} baños</li>
                    <li>📶 WiFi Premium</li>
                </ul>
                <div class="card-footer">
                    <div class="card-price">
                        <span class="price-amount">$${apt.price}</span>
                        <span class="price-period">/noche</span>
                    </div>
                    <button class="btn-secondary" onclick="openDetails(${index})">Ver Detalles</button>
                </div>
            </div>
        </article>
    `).join('');
    
    // Re-inicializar animaciones
    initScrollAnimations();
}

// Datos de galería
const galleryData = [
    { 
        name: 'Sala de Estar', 
        icon: '🛋️', 
        image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80'
    },
    { 
        name: 'Cocina Gourmet', 
        icon: '🍳', 
        image: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=1200&q=80'
    },
    { 
        name: 'Habitación Principal', 
        icon: '🛏️', 
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80'
    },
    { 
        name: 'Baño de Lujo', 
        icon: '🛁', 
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80'
    },
    { 
        name: 'Vistas Panorámicas', 
        icon: '🌆', 
        image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80'
    },
    { 
        name: 'Terraza Privada', 
        icon: '🪴', 
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80'
    }
];

// ===================================
// VARIABLES GLOBALES
// ===================================

let currentLightboxIndex = 0;

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Cargar departamentos del admin (si existen)
    loadApartmentsFromAdmin();
    
    initMenu();
    initScrollAnimations();
    initSmoothScroll();
    initHeaderScroll();
});

// ===================================
// MENÚ DE NAVEGACIÓN MÓVIL
// ===================================

function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

// ===================================
// ANIMACIONES AL HACER SCROLL
// ===================================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const elements = document.querySelectorAll('.fade-on-scroll');
    elements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// SCROLL SUAVE
// ===================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// HEADER CON EFECTO AL HACER SCROLL
// ===================================

function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scroll hacia abajo
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scroll hacia arriba
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
        }

        lastScroll = currentScroll;
    });
}

// ===================================
// MODAL DE DETALLES DE DEPARTAMENTO
// ===================================

function openDetails(index) {
    const apartment = apartmentsData[index];
    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modalBody');

    // Usar la primera imagen del departamento (puede ser de Unsplash o del admin)
    const mainImage = apartment.images && apartment.images[0] 
        ? apartment.images[0] 
        : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80';

    // Crear contenido del modal
    const modalContent = `
        <div style="padding: 2rem;">
            <img src="${mainImage}" alt="${apartment.name}" style="width: 100%; height: 350px; object-fit: cover; border-radius: 8px; margin-bottom: 2rem;">
            
            <h2 style="font-size: 2.5rem; font-weight: 300; color: var(--color-primary); margin-bottom: 1rem; font-family: var(--font-elegant);">${apartment.name}</h2>
            
            <p style="font-size: 1rem; color: var(--color-text-light); margin-bottom: 2rem;">
                📍 ${apartment.location}
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div style="text-align: center; padding: 1rem; background: var(--color-background); border-radius: 8px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">👥</div>
                    <div style="font-size: 0.9rem; color: var(--color-text-light);">Huéspedes</div>
                    <div style="font-size: 1.25rem; font-weight: 500; color: var(--color-primary);">${apartment.guests}</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--color-background); border-radius: 8px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🛏️</div>
                    <div style="font-size: 0.9rem; color: var(--color-text-light);">Habitaciones</div>
                    <div style="font-size: 1.25rem; font-weight: 500; color: var(--color-primary);">${apartment.bedrooms}</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--color-background); border-radius: 8px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🛁</div>
                    <div style="font-size: 0.9rem; color: var(--color-text-light);">Baños</div>
                    <div style="font-size: 1.25rem; font-weight: 500; color: var(--color-primary);">${apartment.bathrooms}</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: var(--color-background); border-radius: 8px;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">💰</div>
                    <div style="font-size: 0.9rem; color: var(--color-text-light);">Por noche</div>
                    <div style="font-size: 1.25rem; font-weight: 500; color: var(--color-primary);">$${apartment.price}</div>
                </div>
            </div>
            
            <h3 style="font-size: 1.5rem; font-weight: 400; color: var(--color-primary); margin-bottom: 1rem;">Descripción</h3>
            <p style="font-size: 1rem; line-height: 1.8; color: var(--color-text-light); margin-bottom: 2rem;">
                ${apartment.description}
            </p>
            
            <h3 style="font-size: 1.5rem; font-weight: 400; color: var(--color-primary); margin-bottom: 1rem;">Comodidades</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 0.75rem; margin-bottom: 2rem;">
                ${apartment.amenities.map(amenity => `
                    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--color-background); border-radius: 8px;">
                        <span style="color: var(--color-secondary);">✓</span>
                        <span style="font-size: 0.95rem;">${amenity}</span>
                    </div>
                `).join('')}
            </div>
            
            ${apartment.images && apartment.images.length > 1 ? `
                <h3 style="font-size: 1.5rem; font-weight: 400; color: var(--color-primary); margin-bottom: 1rem;">Galería de Imágenes</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; margin-bottom: 2rem;">
                    ${apartment.images.map((img, i) => `
                        <img src="${img}" alt="Imagen ${i + 1}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; cursor: pointer;">
                    `).join('')}
                </div>
            ` : ''}
            
            <button onclick="handleReservation()" style="width: 100%; padding: 1.2rem; background: linear-gradient(135deg, var(--color-primary) 0%, #3d3d3d 100%); color: white; font-size: 1rem; letter-spacing: 2px; text-transform: uppercase; border-radius: 50px; cursor: pointer; transition: all 0.3s ease; border: none; font-weight: 500;">
                Reservar Ahora
            </button>
        </div>
    `;

    modalBody.innerHTML = modalContent;
    modal.classList.add('active');

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

function closeDetails() {
    const modal = document.getElementById('detailsModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Cerrar modal al hacer click fuera del contenido
document.addEventListener('click', function(e) {
    const modal = document.getElementById('detailsModal');
    if (e.target === modal) {
        closeDetails();
    }
});

// ===================================
// LIGHTBOX PARA GALERÍA
// ===================================

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryData.length;
    updateLightboxContent();
}

function prevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
}

function updateLightboxContent() {
    const lightboxContent = document.getElementById('lightboxContent');
    const item = galleryData[currentLightboxIndex];

    lightboxContent.innerHTML = `
        <div style="text-align: center; max-width: 1200px;">
            <img src="${item.image}" alt="${item.name}" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); margin-bottom: 1rem;">
            <h3 style="color: white; font-size: 1.5rem; letter-spacing: 2px; text-transform: uppercase; margin-top: 1rem;">${item.name}</h3>
        </div>
    `;
}

// Cerrar lightbox con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
        closeDetails();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    } else if (e.key === 'ArrowLeft') {
        prevImage();
    }
});

// Cerrar lightbox al hacer click fuera del contenido
document.addEventListener('click', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// ===================================
// FUNCIONES DE RESERVA
// ===================================

function handleReservation() {
    // Simular proceso de reserva
    alert('¡Gracias por tu interés! En una aplicación real, esto te llevaría al proceso de reserva.\n\nPara continuar, por favor contáctanos:\n📧 reservas@mehidalara.com\n📱 +56 9 1234 5678');
    
    // Cerrar modal si está abierto
    closeDetails();
}

// ===================================
// LAZY LOADING PARA IMÁGENES
// ===================================

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.card-img, .gallery-img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ===================================
// PRELOADER
// ===================================

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    initLazyLoading();
    
    setTimeout(() => {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.opacity = '1';
        }
    }, 100);
});

// ===================================
// CONSOLE LOG PERSONALIZADO
// ===================================

console.log('%c Mehida Lara Airbnb ', 'background: #b8956a; color: white; font-size: 20px; padding: 10px;');
console.log('%c Sitio web con panel de administración integrado ', 'background: #1a1a1a; color: white; font-size: 12px; padding: 5px;');