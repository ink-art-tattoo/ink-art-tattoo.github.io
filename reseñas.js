// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Configuración de Supabase
    const SUPABASE_URL = 'https://umnfyoyamhsebhtystvr.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbmZ5b3lhbWhzZWJodHlzdHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDYyNzksImV4cCI6MjA2NTUyMjI3OX0.wgau4ceKnTkv3K5YzUsTvNWBEZ4-glmo-3kqIsKmx9U';
    
    // Crear cliente Supabase
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Variables para almacenar las imágenes seleccionadas
    let tattooImageFile = null;
    let avatarImageFile = null;
    
    // Referencia al modal de carga
    const loadingModal = document.getElementById('loading-modal');
    const loadingMessage = document.getElementById('loading-message');
    
    // Variables para paginación
    let currentPage = 1;
    let reviewsPerPage = 5;
    let totalReviews = 0;
    let totalPages = 1;
    let currentFilter = 'all';
    let allReviews = [];
    
    // Referencias a elementos de paginación
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const paginationInfo = document.getElementById('pagination-info');
    
    // Referencias a elementos de autenticación
    const reviewFormContainer = document.getElementById('review-form-container');
    
    // Función para mostrar/ocultar el modal de carga
    function showLoading(show, message = 'Por favor espera...') {
        loadingMessage.textContent = message;
        if (show) {
            loadingModal.classList.add('active');
        } else {
            loadingModal.classList.remove('active');
        }
    }
    
    // Función para actualizar los botones de paginación
    function updatePaginationButtons() {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }

    // Función para cargar reseñas desde Supabase
    async function loadReviews() {
        try {
            showLoading(true, 'Por favor espera...');
            
            // Obtener solo reseñas aprobadas
            const { data, error } = await supabaseClient
                .from('reviews')
                .select('*')
                .eq('approved', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Guardar todas las reseñas
            allReviews = data || [];
            totalReviews = allReviews.length;
            totalPages = Math.ceil(totalReviews / reviewsPerPage);
            
            // Renderizar las reseñas de la página actual
            renderReviewsForCurrentPage();
            
            // Actualizar botones de paginación
            updatePaginationButtons();
            
        } catch (error) {
            console.error('Error cargando reseñas:', error);
            showMessage('Error al cargar las reseñas. Intente recargar la página.', 'error');
            // Renderizar con un array vacío para no mostrar reseñas
            renderReviews([]);
        } finally {
            showLoading(false);
        }
    }
    
    // Función para obtener las reseñas de la página actual
    function getCurrentPageReviews() {
        const startIndex = (currentPage - 1) * reviewsPerPage;
        const endIndex = Math.min(startIndex + reviewsPerPage, totalReviews);
        return allReviews.slice(startIndex, endIndex);
    }
    
    // Función para renderizar las reseñas de la página actual
    function renderReviewsForCurrentPage() {
        const pageReviews = getCurrentPageReviews();
        renderReviews(pageReviews);
    }
    
    // Función para cambiar de página
    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderReviewsForCurrentPage();
        updatePaginationButtons();
    }

    // Función para generar las estrellas de calificación
    function generateStars(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        return starsHTML;
    }

    // Función para formatear la fecha
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Hoy';
        if (diffInDays === 1) return 'Ayer';
        if (diffInDays < 7) return `Hace ${diffInDays} días`;
        if (diffInDays < 30) return `Hace ${Math.floor(diffInDays/7)} semanas`;
        return `Hace ${Math.floor(diffInDays/30)} meses`;
    }

    // Función para renderizar las reseñas
    function renderReviews(reviews) {
        const container = document.getElementById('reviews-container');
        container.innerHTML = '';
        
        if (!reviews || reviews.length === 0) {
            container.innerHTML = '<p class="no-reviews">No hay reseñas disponibles. ¡Sé el primero en dejar una!</p>';
            return;
        }
        
        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.innerHTML = `
                <div class="review-header">
                    <div class="client-info">
                        <img src="${review.avatar_url || 'https://via.placeholder.com/60?text=No+Image'}" alt="${review.client_name}" class="avatar">
                        <div class="client-details">
                            <h3>${review.client_name}</h3>
                            <p>${formatDate(review.created_at)}</p>
                        </div>
                    </div>
                    <div class="rating">
                        ${generateStars(review.rating)}
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.content}</p>
                </div>
                <div class="tattoo-info">
                    ${review.tattoo_image_url ? `<img src="${review.tattoo_image_url}" alt="${review.tattoo_name || 'Tatuaje'}">` : ''}
                    <div class="tattoo-details">
                        <h4>${review.tattoo_name || 'Diseño personalizado'}</h4>
                        <p>Artista: ${review.artist}</p>
                        ${review.time_spent ? `<p>Tiempo: ${review.time_spent}</p>` : ''}
                    </div>
                </div>
            `;
            container.appendChild(reviewCard);
        });
    }

    // Función para manejar los filtros
    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', async function() {
                // Remover la clase 'active' de todos los botones
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Agregar la clase 'active' al botón clickeado
                this.classList.add('active');
                
                // Obtener el tipo de filtro
                currentFilter = this.getAttribute('data-filter');
                
                // Volver a la primera página
                currentPage = 1;
                
                // Aplicar filtro
                applyFilter();
            });
        });
    }
    
    // Función para aplicar el filtro actual
    function applyFilter() {
        if (currentFilter === 'all') {
            // Mostrar todas las reseñas
            renderReviewsForCurrentPage();
            updatePaginationButtons();
            return;
        }
        
        let filteredReviews = [];
        
        if (currentFilter === '5') {
            filteredReviews = allReviews.filter(review => review.rating === 5);
        } else if (currentFilter === '4') {
            filteredReviews = allReviews.filter(review => review.rating === 4);
        } else if (currentFilter === 'with-photos') {
            filteredReviews = allReviews.filter(review => review.tattoo_image_url);
        }
        
        // Actualizar paginación con las reseñas filtradas
        totalReviews = filteredReviews.length;
        totalPages = Math.ceil(totalReviews / reviewsPerPage);
        
        // Obtener reseñas para la página actual
        const startIndex = (currentPage - 1) * reviewsPerPage;
        const endIndex = Math.min(startIndex + reviewsPerPage, totalReviews);
        const pageReviews = filteredReviews.slice(startIndex, endIndex);
        
        // Renderizar reseñas
        renderReviews(pageReviews);
        updatePaginationButtons();
    }

    // Función para inicializar el rating con estrellas
    function setupStarRating() {
        const stars = document.querySelectorAll('.star-rating i');
        const ratingInput = document.getElementById('rating');
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                ratingInput.value = rating;
                
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('active');
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('active');
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
            
            star.addEventListener('mouseover', function() {
                const hoverRating = parseInt(this.getAttribute('data-rating'));
                stars.forEach((s, index) => {
                    if (index < hoverRating) {
                        s.classList.add('hovered');
                    } else {
                        s.classList.remove('hovered');
                    }
                });
            });
            
            star.addEventListener('mouseout', function() {
                stars.forEach(s => {
                    s.classList.remove('hovered');
                });
            });
        });
    }

    // Función para mostrar mensajes
    function showMessage(text, type) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
    
    // Función para subir imágenes a Supabase Storage
    async function uploadImage(file, bucketName, folder) {
        try {
            // Generar un nombre de archivo único
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;
            
            // Subir el archivo
            const { error: uploadError } = await supabaseClient
                .storage
                .from(bucketName)
                .upload(filePath, file);
            
            if (uploadError) throw uploadError;
            
            // Obtener URL pública
            const { data: { publicUrl } } = await supabaseClient
                .storage
                .from(bucketName)
                .getPublicUrl(filePath);
            
            return publicUrl;
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            showMessage('Error al subir la imagen. Intente con otra imagen.', 'error');
            return null;
        }
    }
    
    // Función para manejar la previsualización de imágenes
    function setupImagePreview() {
        // Foto del tatuaje
        const tattooInput = document.getElementById('tattoo-image');
        const tattooPreview = document.getElementById('tattoo-preview-container');
        
        tattooInput.addEventListener('change', function(e) {
            tattooPreview.innerHTML = '';
            tattooImageFile = null;
            
            if (this.files && this.files[0]) {
                tattooImageFile = this.files[0];
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewDiv = document.createElement('div');
                    previewDiv.className = 'image-preview';
                    previewDiv.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <button class="remove-btn">&times;</button>
                    `;
                    
                    tattooPreview.appendChild(previewDiv);
                    
                    // Botón para eliminar la imagen
                    previewDiv.querySelector('.remove-btn').addEventListener('click', function() {
                        tattooPreview.innerHTML = '';
                        tattooInput.value = '';
                        tattooImageFile = null;
                    });
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        // Foto del cliente
        const avatarInput = document.getElementById('avatar');
        const avatarPreview = document.getElementById('avatar-preview-container');
        
        avatarInput.addEventListener('change', function(e) {
            avatarPreview.innerHTML = '';
            avatarImageFile = null;
            
            if (this.files && this.files[0]) {
                avatarImageFile = this.files[0];
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewDiv = document.createElement('div');
                    previewDiv.className = 'image-preview';
                    previewDiv.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <button class="remove-btn">&times;</button>
                    `;
                    
                    avatarPreview.appendChild(previewDiv);
                    
                    // Botón para eliminar la imagen
                    previewDiv.querySelector('.remove-btn').addEventListener('click', function() {
                        avatarPreview.innerHTML = '';
                        avatarInput.value = '';
                        avatarImageFile = null;
                    });
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    // Función para manejar el envío del formulario
    async function submitReview(event) {
        event.preventDefault();
        
        // Mostrar modal de carga
        showLoading(true, 'Enviando reseña...');
        
        const form = event.target;
        const formData = new FormData(form);
        const reviewData = Object.fromEntries(formData.entries());
        
        // Convertir el rating a número
        reviewData.rating = parseInt(reviewData.rating);
        
        // Eliminamos los campos de archivo del objeto
        delete reviewData.tattoo_image;
        delete reviewData.avatar;
        
        try {
            // Subir imágenes si se seleccionaron
            if (tattooImageFile) {
                reviewData.tattoo_image_url = await uploadImage(tattooImageFile, 'reviews', 'tattoos');
            }
            
            if (avatarImageFile) {
                reviewData.avatar_url = await uploadImage(avatarImageFile, 'reviews', 'avatars');
            }
            
            // Insertar la reseña en la base de datos
            const { error } = await supabaseClient
                .from('reviews')
                .insert([reviewData]);
            
            if (error) throw error;
            
            showMessage('¡Gracias por tu reseña! Será revisada antes de publicarse.', 'success');
            form.reset();
            
            // Resetear estrellas
            document.querySelectorAll('.star-rating i').forEach(star => {
                star.classList.remove('active', 'fas');
                star.classList.add('far');
            });
            
            // Limpiar previsualizaciones de imágenes
            document.getElementById('tattoo-preview-container').innerHTML = '';
            document.getElementById('avatar-preview-container').innerHTML = '';
            tattooImageFile = null;
            avatarImageFile = null;
            
            // Recargar las reseñas
            await loadReviews();
            
        } catch (error) {
            console.error('Error enviando reseña:', error);
            showMessage('Hubo un error al enviar tu reseña. Por favor, intenta de nuevo.', 'error');
        } finally {
            // Ocultar modal de carga
            showLoading(false);
        }
    }
    
    // Función para actualizar la UI según estado de autenticación
    async function updateAuthUI(user) {
        if (user) {
            // Obtener nombre del usuario desde la tabla 'profiles'
            let userName = 'Usuario';
            
            try {
                const { data: profile, error } = await supabaseClient
                    .from('profiles')
                    .select('full_name')
                    .eq('id', user.id)
                    .single();

                if (!error && profile && profile.full_name) {
                    userName = profile.full_name;
                } else {
                    userName = user.email || 'Usuario';
                }
            } catch (error) {
                console.error('Error obteniendo perfil:', error);
                userName = user.email || 'Usuario';
            }

            // Mostrar formulario de reseñas con nombre autocompletado
            reviewFormContainer.innerHTML = `
                <div class="add-review-form">
                    <h3>Deja tu reseña</h3>
                    
                    <div id="message" class="message"></div>
                    
                    <form id="review-form">
                        <!-- Nombre oculto que se enviará automáticamente -->
                        <input type="hidden" id="client-name" name="client_name" value="${userName}" required>
                        
                        <div class="form-group">
                            <label for="rating">Calificación</label>
                            <div class="star-rating">
                                <i class="far fa-star" data-rating="1"></i>
                                <i class="far fa-star" data-rating="2"></i>
                                <i class="far fa-star" data-rating="3"></i>
                                <i class="far fa-star" data-rating="4"></i>
                                <i class="far fa-star" data-rating="5"></i>
                            </div>
                            <input type="hidden" id="rating" name="rating" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Artista</label>
                            <div class="artist-display">Josiel Salabarría López</div>
                            <input type="hidden" id="artist" name="artist" value="Josiel Salabarría López" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="time-spent">Tiempo de la sesión</label>
                            <input type="text" id="time-spent" name="time_spent" placeholder="Ej: 3 horas">
                        </div>
                        
                        <div class="form-group">
                            <label for="tattoo-name">Nombre del diseño (opcional)</label>
                            <input type="text" id="tattoo-name" name="tattoo_name">
                        </div>
                        
                        <div class="form-group">
                            <label for="content">Tu reseña</label>
                            <textarea id="content" name="content" rows="4" required></textarea>
                        </div>
                        
                        <!-- Campo para subir foto del tatuaje -->
                        <div class="form-group">
                            <label>Foto del tatuaje (opcional)</label>
                            <div class="image-preview-container" id="tattoo-preview-container"></div>
                            <label class="upload-btn" for="tattoo-image">
                                <i class="fas fa-upload"></i> Seleccionar imagen
                            </label>
                            <input type="file" id="tattoo-image" name="tattoo_image" accept="image/*" class="file-input">
                        </div>
                        
                        <!-- Campo para subir foto del cliente -->
                        <div class="form-group">
                            <label>Tu foto (opcional)</label>
                            <div class="image-preview-container" id="avatar-preview-container"></div>
                            <label class="upload-btn" for="avatar">
                                <i class="fas fa-upload"></i> Seleccionar foto
                            </label>
                            <input type="file" id="avatar" name="avatar" accept="image/*" class="file-input">
                        </div>
                        
                        <button type="submit" class="submit-btn">Enviar reseña</button>
                    </form>
                </div>
            `;
            
            // Configurar el formulario
            document.getElementById('review-form')?.addEventListener('submit', submitReview);
            setupStarRating();
            setupImagePreview();
            
        } else {
            // Usuario no autenticado
            // Mostrar mensaje para iniciar sesión con botón que redirige a reservas.html
            reviewFormContainer.innerHTML = `
                <div class="login-required">
                    <h3>¡Inicia sesión para dejar tu reseña!</h3>
                    <p>Para compartir tu experiencia con Josiel, necesitas tener una cuenta.</p>
                    <button class="login-action-btn" id="go-to-reservations">
                        <i class="fas fa-sign-in-alt"></i> Ir a Reservas para Iniciar Sesión
                    </button>
                </div>
            `;
            
            // Configurar botón de redirección
            document.getElementById('go-to-reservations')?.addEventListener('click', () => {
                window.location.href = 'reservas.html?action=openLogin';
            });
        }
    }
    
    // Función para inicializar la autenticación
    async function initAuth() {
        // Verificar sesión activa
        const { data: { user } } = await supabaseClient.auth.getUser();
        updateAuthUI(user);
        
        // Escuchar cambios en la autenticación
        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                updateAuthUI(session.user);
            } else if (event === 'SIGNED_OUT') {
                updateAuthUI(null);
            }
        });
    }
    
    // Configurar eventos de paginación
    prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
    
    // Cargar reseñas iniciales
    loadReviews();
    
    // Configurar los filtros
    setupFilters();
    
    // Configurar autenticación
    initAuth();
});