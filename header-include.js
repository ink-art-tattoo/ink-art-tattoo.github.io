// js/include-header.js
document.addEventListener('DOMContentLoaded', function() {
    // Crear contenedor para el header
    const headerContainer = document.createElement('div');
    headerContainer.id = 'header-container';
    document.body.insertBefore(headerContainer, document.body.firstChild);
    
    // Cargar el header
    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            headerContainer.innerHTML = html;
            initHeaderFunctions(); // Inicializar funciones del header
        })
        .catch(error => {
            console.error('Error cargando el header:', error);
            headerContainer.innerHTML = '<p>Error cargando el encabezado</p>';
        });
});

// Función para inicializar todas las funciones del header
function initHeaderFunctions() {
    // Menú Hamburguesa
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.getElementById('themeToggle');
    
    if (menuBtn && closeBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.add('active');
            menuBtn.style.display = 'none';
            document.body.style.overflow = 'hidden';
        });
        
        closeBtn.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.style.display = 'block';
            document.body.style.overflow = 'auto';
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.style.display = 'block';
                document.body.style.overflow = 'auto';
            });
        });
    }
    
    // Tema Oscuro
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        
        // Verificar preferencia guardada
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Efecto de desplazamiento del encabezado
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    
}