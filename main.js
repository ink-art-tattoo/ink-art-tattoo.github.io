// Efecto de máquina de escribir
const typewriterElement = document.getElementById('typewriter');
const cursorElement = document.querySelector('.cursor');
const text = "creemos arte";
let i = 0;
let isDeleting = false;
let typingSpeed = 150;

function typeEffect() {
    const currentText = text.substring(0, i);
    typewriterElement.textContent = currentText;
    
    if (!isDeleting && i === text.length) {
        // Pausa al final del texto
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
    }
    
    if (isDeleting && i === 0) {
        // Volver a escribir después de borrar
        isDeleting = false;
    }
    
    if (isDeleting) {
        i--;
        typingSpeed = 100;
    } else {
        i++;
        typingSpeed = 150;
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// Iniciar el efecto después de cargar la página
window.addEventListener('load', () => {
    setTimeout(typeEffect, 1000);
});

// Animación al desplazar
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.hygiene-card, .contact-card').forEach(card => {
    observer.observe(card);
});

        
    // Variables para la paginación
const itemsPerPage = 6;
let currentPage = {};
let currentFilter = 'all';
const galleryItems = document.querySelectorAll('.gallery-item');
const loadMoreGalleryBtn = document.getElementById('loadMore');

// Inicializar paginación
galleryItems.forEach(item => {
    const categories = item.getAttribute('data-category').split(' ');
    categories.forEach(cat => {
        if (!currentPage[cat]) currentPage[cat] = 1;
    });
});
currentPage['all'] = 1;

// Función para mostrar elementos con paginación
function showItems(filter) {
    let itemsToShow = [];
    
    galleryItems.forEach(item => {
        item.style.display = 'none';
        const categories = item.getAttribute('data-category').split(' ');
        
        if (filter === 'all' || categories.includes(filter)) {
            itemsToShow.push(item);
        }
    });
    
    const startIndex = 0;
    const endIndex = currentPage[filter] * itemsPerPage;
    const visibleItems = itemsToShow.slice(startIndex, endIndex);
    
    visibleItems.forEach(item => {
        item.style.display = 'block';
    });
    
    // Mostrar u ocultar botón
    if (endIndex >= itemsToShow.length) {
        loadMoreGalleryBtn.style.display = 'none';
    } else {
        loadMoreGalleryBtn.style.display = 'block';
        loadMoreGalleryBtn.onclick = () => {
            currentPage[filter]++;
            showItems(filter);
        };
    }
}

// Filtro de galería con paginación
const galleryCategories = document.querySelectorAll('.gallery-category');

galleryCategories.forEach(category => {
    category.addEventListener('click', function() {
        galleryCategories.forEach(cat => cat.classList.remove('active'));
        this.classList.add('active');
        
        currentFilter = this.getAttribute('data-filter');
        currentPage[currentFilter] = 1; // Resetear a primera página
        showItems(currentFilter);
    });
});
        // Inicializar galería
showItems('all');

        
        // Funcionalidad para los carruseles - CORREGIDA
        document.querySelectorAll('[data-carousel="true"] .gallery-carousel').forEach(carousel => {
            const inner = carousel.querySelector('.carousel-inner');
            const items = carousel.querySelectorAll('.carousel-item');
            const prevBtn = carousel.querySelector('.prev');
            const nextBtn = carousel.querySelector('.next');
            const indicatorsContainer = carousel.querySelector('.carousel-indicators');
            
            let currentIndex = 0;
            const totalItems = items.length;
            
            // Variables para detección de swipe
            let touchStartX = 0;
            let touchEndX = 0;
            const swipeThreshold = 50; // Mínimo desplazamiento para considerar un swipe
            
            // Crear indicadores
            items.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.classList.add('carousel-indicator');
                if (index === 0) indicator.classList.add('active');
                indicator.addEventListener('click', (e) => {
                    e.stopPropagation(); // Evitar que el clic se propague al contenedor
                    goToSlide(index);
                });
                indicatorsContainer.appendChild(indicator);
            });
            
            // Función para actualizar el carrusel
            function updateCarousel() {
                inner.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Actualizar indicadores
                carousel.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentIndex);
                });
            }
            
            // Función para ir a un slide específico
            function goToSlide(index) {
                currentIndex = index;
                updateCarousel();
            }
            
            // Función para ir al siguiente slide
            function nextSlide() {
                currentIndex = (currentIndex + 1) % totalItems;
                updateCarousel();
            }
            
            // Función para ir al slide anterior
            function prevSlide() {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                updateCarousel();
            }
            
            // Event listeners para botones - con stopPropagation
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Evitar que el clic se propague al contenedor
                    nextSlide();
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Evitar que el clic se propague al contenedor
                    prevSlide();
                });
            }
            
            // Autoavance cada 5 segundos
            let autoSlide = setInterval(nextSlide, 5000);
            
            // Pausar autoavance al pasar el mouse
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoSlide);
            });
            
            // Reanudar autoavance al quitar el mouse
            carousel.addEventListener('mouseleave', () => {
                autoSlide = setInterval(nextSlide, 5000);
            });
            
            // Eventos táctiles para swipe
            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const diff = touchStartX - touchEndX;
                
                if (diff > swipeThreshold) {
                    // Swipe izquierda: siguiente
                    nextSlide();
                } else if (diff < -swipeThreshold) {
                    // Swipe derecha: anterior
                    prevSlide();
                }
            }
        });
        
        // Lightbox para ver detalles de los tatuajes - MODIFICADO
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.querySelector('.lightbox-img');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxDescription = document.getElementById('lightboxDescription');
        const lightboxSize = document.getElementById('lightboxSize').querySelector('span');
        const lightboxHours = document.getElementById('lightboxHours').querySelector('span');
        const lightboxTags = document.getElementById('lightboxTags');
        const lightboxClose = document.getElementById('lightboxClose');
        
        // Información detallada de los tatuajes
        const tattooDetails = {
            'Tatuaje Black Work': {
                title: 'Black Work',
                description: 'Diseño tribal en blanco y negro con patrones geométricos complejos',
                size: '25x15 cm',
                hours: '8 horas',
                tags: ['Black Work', 'Geométrico', 'Tribal']
            },
            'Ambition': {
                title: 'Ambition',
                description: 'Tatuaje de texto con tipografía elegante y moderna',
                size: '12x5 cm',
                hours: '2 horas',
                tags: ['Lettering', 'Texto', 'Minimalista']
            },
            'Diseño de letras': {
                title: 'Diseño de Letras',
                description: 'Composición tipográfica con elementos geométricos integrados',
                size: '20x10 cm',
                hours: '5 horas',
                tags: ['Lettering', 'Geométrico', 'Moderno']
            },
            'Frutos': {
                title: 'Frutos',
                description: 'Diseño colorido de frutas tropicales con estilo realista',
                size: '18x12 cm',
                hours: '6 horas',
                tags: ['Color', 'Realismo', 'Naturaleza']
            },
            'Persona Realista': {
                title: 'Retrato Realista',
                description: 'Retrato hiperrealista de una figura histórica',
                size: '30x20 cm',
                hours: '15 horas',
                tags: ['Realismo', 'Retrato', 'Blanco y negro']
            },
            'Corazón': {
                title: 'Corazón Anatómico',
                description: 'Representación anatómica estilizada del corazón humano',
                size: '15x10 cm',
                hours: '4 horas',
                tags: ['Lineal', 'Anatomía', 'Minimalista']
            },
            'Tradicional': {
                title: 'Tradicional Japonés',
                description: 'Diseño de estilo tradicional japonés con koi y olas',
                size: '25x15 cm',
                hours: '10 horas',
                tags: ['Tradicional', 'Japonés', 'Color']
            },
            'Fuego': {
                title: 'Fuego y Letras',
                description: 'Composición de texto con elementos de fuego integrados',
                size: '22x12 cm',
                hours: '7 horas',
                tags: ['Lettering', 'Color', 'Abstracto']
            },
            'Rostro Mujer': {
                title: 'Retrato Femenino',
                description: 'Retrato realista de una mujer con elementos florales',
                size: '20x15 cm',
                hours: '12 horas',
                tags: ['Realismo', 'Retrato', 'Color']
            },
            'Barco': {
                title: 'Barco en la Tormenta',
                description: 'Escena dramática de un barco navegando en alta mar',
                size: '35x20 cm',
                hours: '18 horas',
                tags: ['Realismo', 'Black Work', 'Escena']
            }
        };
        
        // Abrir lightbox solo al hacer clic en la imagen
        document.querySelectorAll('.gallery-item').forEach(item => {
            // Evento solo para la imagen
            item.querySelectorAll('img').forEach(img => {
                img.addEventListener('click', function() {
                    const imgSrc = this.src;
                    const imgAlt = this.alt;
                    const title = item.querySelector('.gallery-overlay h3').textContent;
                    
                    lightboxImg.src = imgSrc;
                    lightboxImg.alt = imgAlt;
                    lightboxTitle.textContent = title;
                    
                    // Obtener detalles del tatuaje o usar valores predeterminados
                    const details = tattooDetails[title] || {
                        description: 'Tatuaje personalizado creado por Josiel Salabarria',
                        size: 'Tamaño variable',
                        hours: 'Tiempo variable',
                        tags: ['Arte', 'Personalizado']
                    };
                    
                    lightboxDescription.textContent = details.description;
                    lightboxSize.textContent = details.size;
                    lightboxHours.textContent = details.hours;
                    
                    // Actualizar etiquetas
                    lightboxTags.innerHTML = '';
                    details.tags.forEach(tag => {
                        const tagElement = document.createElement('span');
                        tagElement.classList.add('lightbox-tag');
                        tagElement.textContent = tag;
                        lightboxTags.appendChild(tagElement);
                    });
                    
                    lightbox.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                });
            });
        });
        
        // Cerrar lightbox
        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Cerrar lightbox al hacer clic fuera del contenido
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
       