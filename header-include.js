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
    
    // Tema Oscuro - MODIFICADO PARA MODO OSCURO PREDETERMINADO
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        
        // Verificar preferencia guardada o establecer modo oscuro como predeterminado
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Determinar tema inicial (prioridad: localStorage > sistema > predeterminado oscuro)
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // Siempre oscuro si no hay preferencia
        
        // Aplicar tema inicial
        if (initialTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        // Guardar tema inicial si no existía
        if (!savedTheme) {
            localStorage.setItem('theme', 'dark');
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


    // Configuración de Supabase (usa las mismas credenciales)
    const supabaseUrl = 'https://umnfyoyamhsebhtystvr.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbmZ5b3lhbWhzZWJodHlzdHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDYyNzksImV4cCI6MjA2NTUyMjI3OX0.wgau4ceKnTkv3K5YzUsTvNWBEZ4-glmo-3kqIsKmx9U';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // Elementos del DOM
    const loginBtn = document.getElementById('loginBtn');
    const userAvatarBtn = document.getElementById('userAvatarBtn');
    const userAvatarImg = document.getElementById('userAvatarImg');
    const defaultAvatar = 'https://raw.githubusercontent.com/ink-art-tattoo/Imagenes/main/User.jpg';

    // Verificar estado de autenticación
    async function checkAuthStatus() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) throw error;
            
            if (user) {
                // Obtener perfil completo del usuario
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('avatar_url')
                    .eq('id', user.id)
                    .single();
                
                if (profileError) throw profileError;
                
                // Determinar URL del avatar (usar default si no existe)
                const newAvatarUrl = profile?.avatar_url || defaultAvatar;
                
                // Clave única para el almacenamiento local
                const storageKey = `avatarCache_${user.id}`;
                const now = Date.now();
                const cacheExpiry = 5 * 60 * 1000; // 5 minutos
                
                // Obtener caché existente
                const cachedAvatar = JSON.parse(localStorage.getItem(storageKey)) || {};
                
                // Verificar si necesitamos actualizar la imagen
                const shouldUpdate = 
                    !cachedAvatar.url ||                     // No hay caché previa
                    cachedAvatar.url !== newAvatarUrl ||     // URL cambiada
                    (now - cachedAvatar.timestamp) > cacheExpiry; // Caché expirada

                if (shouldUpdate) {
                    // Forzar recarga con nuevo timestamp
                    userAvatarImg.src = `${newAvatarUrl}?t=${now}`;
                    
                    // Actualizar caché local
                    localStorage.setItem(storageKey, JSON.stringify({
                        url: newAvatarUrl,
                        timestamp: now
                    }));
                } else {
                    // Usar versión en caché (sin recargar)
                    userAvatarImg.src = cachedAvatar.url;
                }

                loginBtn.style.display = 'none';
                userAvatarBtn.style.display = 'block';
            } else {
                loginBtn.style.display = 'block';
                userAvatarBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Error verificando sesión:', error);
            loginBtn.style.display = 'block';
            userAvatarBtn.style.display = 'none';
        }
    }

    // Evento para abrir login
    loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    // Evento para el avatar (abrir perfil)
    userAvatarBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    // Escuchar cambios de autenticación en tiempo real
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            checkAuthStatus();
        } else if (event === 'SIGNED_OUT') {
            loginBtn.style.display = 'block';
            userAvatarBtn.style.display = 'none';
        }
    });

    // Inicializar al cargar la página
    checkAuthStatus();
}