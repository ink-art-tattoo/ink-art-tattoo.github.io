// Inicializar EmailJS con tu User ID
        (function() {
            emailjs.init("he4Q00rUNtLv_aUuL");
        })();

        // Configuración de Supabase
        const supabaseUrl = 'https://umnfyoyamhsebhtystvr.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbmZ5b3lhbWhzZWJodHlzdHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDYyNzksImV4cCI6MjA2NTUyMjI3OX0.wgau4ceKnTkv3K5YzUsTvNWBEZ4-glmo-3kqIsKmx9U';
        const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

        // Correo del administrador
        const ADMIN_EMAIL = 'inkartjosielsalabarria@gmail.com';
        // Número de WhatsApp del estudio
        const WHATSAPP_NUMBER = '55480242';

        document.addEventListener('DOMContentLoaded', function () {
            const today = new Date();
            let currentMonth = today.getMonth();
            let currentYear = today.getFullYear();
            const calendarEl = document.querySelector('.calendar');
            const currentMonthEl = document.getElementById('current-month');
            const selectedDateDisplay = document.getElementById('selected-date-display');
            const summaryDate = document.getElementById('summary-date');
            const summaryTime = document.getElementById('summary-time');
            const summarySize = document.getElementById('summary-size');
            const summaryDuration = document.getElementById('summary-duration');
            const timeSlotsEl = document.querySelector('.time-slots');
            const prevMonthBtn = document.getElementById('prev-month');
            const nextMonthBtn = document.getElementById('next-month');
            const notification = document.getElementById('notification');
            const loader = document.getElementById('loader');
            const confirmBtn = document.getElementById('confirm-btn');
            const confirmationModal = document.getElementById('confirmationModal');
            const closeModal = document.getElementById('closeModal');
            const cancelReservation = document.getElementById('cancelReservation');
            const confirmReservation = document.getElementById('confirmReservation');
            const modalSummaryDate = document.getElementById('modal-summary-date');
            const modalSummaryTime = document.getElementById('modal-summary-time');
            const modalSummarySize = document.getElementById('modal-summary-size');
            const modalSummaryDuration = document.getElementById('modal-summary-duration');
            
            // Nuevos elementos para autenticación
            const authModal = document.getElementById('authModal');
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            const loginTab = document.querySelector('[data-tab="login"]');
            const registerTab = document.querySelector('[data-tab="register"]');
            const loginBtn = document.getElementById('login-btn');
            const registerBtn = document.getElementById('register-btn');
            const loginError = document.getElementById('login-error');
            const registerError = document.getElementById('register-error');
            const loginBtnHeader = document.getElementById('login-btn-header');
            const logoutBtn = document.getElementById('logout-btn');
            const userInfo = document.getElementById('user-info');
            const viewReservationsBtn = document.getElementById('view-reservations');
            const userInfoForm = document.getElementById('user-info-form');
            const userInfoName = document.getElementById('user-info-name');
            const userInfoEmail = document.getElementById('user-info-email');
            const userInfoPhone = document.getElementById('user-info-phone');
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            const closeReservationsModal = document.getElementById('closeReservationsModal');
            const reservationsList = document.getElementById('reservations-list');
            const reservationsModal = document.getElementById('reservationsModal');
            const closeAuthModalBtn = document.getElementById('closeAuthModal');
            
            // Elementos del panel de administrador
            const adminPanel = document.getElementById('admin-panel');
            const adminName = document.getElementById('admin-name');
            const adminAvatar = document.getElementById('admin-avatar');
            const adminLogoutBtn = document.getElementById('admin-logout-btn');
            const adminRefreshBtn = document.getElementById('admin-refresh');
            const adminReservations = document.getElementById('admin-reservations');
            const adminFilter = document.getElementById('admin-filter');
            const adminTodayBtn = document.getElementById('admin-today');
            const adminWeekBtn = document.getElementById('admin-week');
            const adminPendingBtn = document.getElementById('admin-pending');
            
            // Elementos de gestión de usuarios
            const userFilter = document.getElementById('user-filter');
            const usersList = document.getElementById('users-list');
            
            // Nuevos elementos para calendario del administrador
            const adminCalendarEl = document.querySelector('.admin-calendar');
            const adminCurrentMonthEl = document.getElementById('admin-current-month');
            const adminPrevMonthBtn = document.getElementById('admin-prev-month');
            const adminNextMonthBtn = document.getElementById('admin-next-month');
            let adminCurrentMonth = today.getMonth();
            let adminCurrentYear = today.getFullYear();
            
            // Nuevos elementos para modal de reservas de usuario
            const userReservationsModal = document.getElementById('userReservationsModal');
            const closeUserReservationsModal = document.getElementById('closeUserReservationsModal');
            const userModalAvatar = document.getElementById('user-modal-avatar');
            const userModalName = document.getElementById('user-modal-name');
            const userModalEmail = document.getElementById('user-modal-email');
            const userReservationsList = document.getElementById('user-reservations-list');
            
            // Nuevos elementos para modal de pago
            const paymentModal = document.getElementById('paymentModal');
            const closePaymentModal = document.getElementById('closePaymentModal');
            const paymentDoneBtn = document.getElementById('paymentDoneBtn');
            
            // Variables para la sesión
            let currentUser = null;
            let isAdmin = false;
            let userRole = 'user';
            
            // Establecer fecha por defecto al día siguiente
            let selectedDate = new Date();
            selectedDate.setDate(selectedDate.getDate() + 1);
            selectedDate.setHours(0, 0, 0, 0); // Asegurar que sea inicio del día
            
            let selectedTime = null;
            let selectedSize = null;
            let horariosBloqueados = new Set();
            
            // Mapa de tamaños a duración (en horas)
            const sizeDurationMap = {
                "0-10": 2,
                "10-20": 4,
                "20-30": 6,
                "30+": 8
            };

            // Función para formatear fecha en formato YYYY-MM-DD (local)
            function formatLocalDate(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            // Función para mostrar notificaciones
            function showNotification(message, isError = false, isWarning = false, isAdmin = false) {
                notification.innerHTML = `
                    <i class="fas ${isError ? 'fa-exclamation-circle' : isWarning ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
                    <span>${message}</span>
                `;
                
                notification.classList.toggle('error', isError);
                notification.classList.toggle('warning', isWarning);
                notification.classList.toggle('admin', isAdmin);
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }

            // Función para mostrar/ocultar loader
            function showLoader(show = true) {
                loader.classList.toggle('active', show);
            }

            // Función para mostrar/ocultar modal de confirmación
            function showConfirmationModal(show = true) {
                confirmationModal.classList.toggle('active', show);
            }

            // Función para mostrar/ocultar modal de pago
            function showPaymentModal(show = true) {
                paymentModal.classList.toggle('active', show);
            }

            // Función para mostrar/ocultar modal de reservas
            function showReservationsModal(show = true) {
                reservationsModal.classList.toggle('active', show);
            }

            // Función para mostrar/ocultar modal de autenticación
            function showAuthModal(show = true, tab = 'login') {
                authModal.classList.toggle('active', show);
                
                if (show) {
                    if (tab === 'login') {
                        loginForm.classList.add('active');
                        registerForm.classList.remove('active');
                        loginTab.classList.add('active');
                        registerTab.classList.remove('active');
                    } else {
                        registerForm.classList.add('active');
                        loginForm.classList.remove('active');
                        registerTab.classList.add('active');
                        loginTab.classList.remove('active');
                    }
                }
            }

            // Actualizar UI según estado de autenticación
            function updateAuthUI(user) {
                if (user) {
                    // Obtener el rol del usuario
                    getUserRole(user.id).then(role => {
                        userRole = role;
                        isAdmin = role === 'admin';
                        
                        if (isAdmin) {
                            // Mostrar panel de administrador y ocultar contenido normal
                            document.getElementById('normal-content').style.display = 'none';
                            adminPanel.style.display = 'block';
                            
                            // Actualizar información del administrador
                            adminName.textContent = 'Administrador';
                            if (user.user_metadata && user.user_metadata.full_name) {
                                adminName.textContent = user.user_metadata.full_name;
                                const initials = user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
                                adminAvatar.textContent = initials.substring(0, 2);
                            }
                            
                            // Cargar reservas para el administrador
                            cargarReservasAdmin();
                            
                            // Cargar usuarios
                            cargarUsuariosAdmin();
                            
                            // Generar calendario administrativo
                            generateAdminCalendar(adminCurrentMonth, adminCurrentYear);
                        } else {
                            // Mostrar contenido normal y ocultar panel de administrador
                            document.getElementById('normal-content').style.display = 'block';
                            adminPanel.style.display = 'none';
                            
                            userInfo.style.display = 'flex';
                            loginBtnHeader.style.display = 'none';
                            userInfoForm.style.display = 'block';
                            
                            // Actualizar información del usuario
                            userInfoName.value = user.user_metadata.full_name || '';
                            userInfoEmail.value = user.email || '';
                            userInfoPhone.value = user.user_metadata.phone || '';
                            
                            // Actualizar barra de usuario
                            userName.textContent = user.user_metadata.full_name || user.email;
                            if (user.user_metadata.full_name) {
                                const initials = user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
                                userAvatar.textContent = initials.substring(0, 2);
                            }
                        }
                    });
                } else {
                    // No hay usuario: mostrar contenido normal (sin sesión) y ocultar panel de admin
                    document.getElementById('normal-content').style.display = 'block';
                    adminPanel.style.display = 'none';
                    
                    userInfo.style.display = 'none';
                    loginBtnHeader.style.display = 'block';
                    userInfoForm.style.display = 'none';
                }
            }

            // Obtener rol de usuario
            async function getUserRole(userId) {
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', userId)
                        .single();
                    
                    if (error) throw error;
                    
                    return data ? data.role : 'user';
                } catch (error) {
                    console.error('Error obteniendo rol:', error);
                    return 'user';
                }
            }

            // Función para agregar minutos a un horario
            function addMinutes(time, minutes) {
                const [hours, mins] = time.split(':').map(Number);
                const date = new Date();
                date.setHours(hours);
                date.setMinutes(mins + minutes);
                return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            }

            // Función para calcular el tiempo final
            function getEndTime(startTime, durationHours) {
                const [hours, minutes] = startTime.split(':').map(Number);
                const startDate = new Date();
                startDate.setHours(hours, minutes, 0, 0);
                
                const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
                return `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
            }

            function updateMonthHeader() {
                const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
            }

            function updateSelectedDateDisplay() {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                selectedDateDisplay.textContent = selectedDate.toLocaleDateString('es-ES', options);
                
                // Actualizar resumen con formato DD/MM/YYYY
                const formattedDate = selectedDate.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).replace(/\//g, '/');
                summaryDate.textContent = formattedDate;
            }

            // Cargar horarios reservados desde Supabase
            async function cargarHorariosReservados(fechaISO) {
                try {
                    showLoader(true);
                    const { data, error } = await supabase
                        .from('reservas')
                        .select('hora, duracion')
                        .eq('fecha', fechaISO);

                    if (error) {
                        console.error('Error cargando reservas:', error);
                        return [];
                    }

                    // Extraemos los horarios de los datos
                    return data;
                } catch (error) {
                    console.error('Error al cargar horarios:', error);
                    return [];
                } finally {
                    showLoader(false);
                }
            }

            // Generar slots de tiempo
            async function generateTimeSlots() {
                timeSlotsEl.innerHTML = '';
                const fechaISO = formatLocalDate(selectedDate); // Usar formato local
                const reservas = await cargarHorariosReservados(fechaISO);
                
                // Reiniciar horarios bloqueados
                horariosBloqueados = new Set();
                
                // Agregar horarios reservados y bloquear según duración
                reservas.forEach(reserva => {
                    const horaInicio = reserva.hora;
                    const duracion = reserva.duracion || 2; // Por defecto 2 horas si no hay duración
                    
                    // Bloquear el horario de inicio y los siguientes bloques según duración
                    for (let i = 0; i < duracion * 2; i++) { // Cada 30 minutos (2 bloques por hora)
                        const blockedTime = addMinutes(horaInicio, 30 * i);
                        horariosBloqueados.add(blockedTime);
                    }
                });

                const startHour = 9;
                const endHour = 19;
                const now = new Date();
                const isToday = selectedDate.toDateString() === now.toDateString();

                // Solo generar slots si hay un tamaño seleccionado
                if (!selectedSize) {
                    timeSlotsEl.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:15px;">Por favor, selecciona un tamaño de tatuaje</p>';
                    return;
                }
                
                const requiredDuration = sizeDurationMap[selectedSize];
                const requiredBlocks = requiredDuration * 2; // Cada 30 minutos

                for (let hour = startHour; hour < endHour; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const formattedHour = hour.toString().padStart(2, '0');
                        const formattedMinute = minute.toString().padStart(2, '0');
                        const timeString = `${formattedHour}:${formattedMinute}`;
                        const slot = document.createElement('div');
                        slot.classList.add('time-slot');
                        slot.textContent = timeString;
                        
                        // Crear objeto Date para esta ranura horaria
                        const slotTime = new Date(selectedDate);
                        slotTime.setHours(hour, minute, 0, 0);
                        
                        // Comprobar si es un horario pasado para hoy
                        const isPastSlot = isToday && slotTime < now;

                        // Comprobar si hay suficiente tiempo disponible para la duración requerida
                        let hasEnoughTime = true;
                        for (let i = 0; i < requiredBlocks; i++) {
                            const checkTime = addMinutes(timeString, 30 * i);
                            const [checkHour] = checkTime.split(':').map(Number);
                            
                            // Comprobar si el horario está fuera del horario laboral
                            if (checkHour >= endHour) {
                                hasEnoughTime = false;
                                break;
                            }
                            
                            // Comprobar si el horario está reservado
                            if (horariosBloqueados.has(checkTime)) {
                                hasEnoughTime = false;
                                break;
                            }
                        }

                        if (horariosBloqueados.has(timeString) || isPastSlot) {
                            slot.classList.add('booked');
                            slot.title = isPastSlot ? 'Horario pasado' : 'Reservado';
                        } else if (!hasEnoughTime) {
                            slot.classList.add('not-enough-time');
                            slot.title = 'No hay suficiente tiempo disponible';
                        } else {
                            slot.addEventListener('click', () => {
                                document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
                                slot.classList.add('selected');
                                selectedTime = timeString;
                                summaryTime.textContent = timeString;
                                
                                // Actualizar el resumen con la hora final
                                const endTime = getEndTime(timeString, requiredDuration);
                                summaryDuration.textContent = `${requiredDuration} horas (${timeString} - ${endTime})`;
                            });
                        }

                        timeSlotsEl.appendChild(slot);
                    }
                }
            }

            // Generar calendario
            function generateCalendar(month, year) {
                // Limpiar calendario (dejando solo los encabezados)
                const dayElements = Array.from(calendarEl.querySelectorAll('.calendar-day'));
                dayElements.forEach(day => day.remove());
                
                updateMonthHeader();

                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const firstDayOfWeek = firstDay.getDay();
                const startingDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

                // Crear fecha de hoy sin horas
                const todayDate = new Date();
                todayDate.setHours(0, 0, 0, 0);
                
                // Fecha mínima (mañana)
                const minDate = new Date();
                minDate.setDate(todayDate.getDate() + 1);
                minDate.setHours(0, 0, 0, 0);

                // Días vacíos al inicio del mes
                for (let i = 0; i < startingDay; i++) {
                    const emptyDay = document.createElement('div');
                    emptyDay.classList.add('calendar-day', 'disabled');
                    emptyDay.innerHTML = '<div class="calendar-day-number"></div>';
                    calendarEl.appendChild(emptyDay);
                }

                // Generar días del mes
                for (let day = 1; day <= lastDay.getDate(); day++) {
                    const date = new Date(year, month, day);
                    date.setHours(0, 0, 0, 0); // Resetear horas para comparación
                    const dayEl = document.createElement('div');
                    
                    // Comprobar si es un día pasado o menor que la fecha mínima
                    if (date < minDate) {
                        dayEl.classList.add('calendar-day', 'disabled');
                    } else {
                        dayEl.classList.add('calendar-day');
                    }
                    
                    // Comprobar si es el día seleccionado
                    if (date.getTime() === selectedDate.getTime()) {
                        dayEl.classList.add('active');
                    }

                    dayEl.innerHTML = `<div class="calendar-day-number">${day}</div>`;
                    
                    // Solo agregar evento click si no está deshabilitado
                    if (!dayEl.classList.contains('disabled')) {
                        dayEl.addEventListener('click', async () => {
                            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
                            dayEl.classList.add('active');
                            selectedDate = new Date(year, month, day);
                            updateSelectedDateDisplay();
                            selectedTime = null;
                            summaryTime.textContent = '-';
                            summaryDuration.textContent = '-';
                            await generateTimeSlots();
                        });
                    }

                    calendarEl.appendChild(dayEl);
                }
            }

            // Función para cancelar una reserva
            async function cancelarReserva(reservaId) {
                try {
                    showLoader(true);
                    
                    // Primero obtenemos los datos de la reserva para el correo
                    const { data: reserva, error: getError } = await supabase
                        .from('reservas')
                        .select('*')
                        .eq('id', reservaId)
                        .single();
                    
                    if (getError) throw getError;
                    
                    // Ahora eliminamos la reserva
                    const { error: deleteError } = await supabase
                        .from('reservas')
                        .delete()
                        .eq('id', reservaId);
                    
                    if (deleteError) throw deleteError;
                    
                    // Enviar correo de cancelación
                    const templateParams = {
                        to_name: reserva.nombre,
                        to_email: reserva.email,
                        fecha: new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-ES'),
                        hora: reserva.hora,
                        artista: reserva.artista,
                        tamanio: reserva.tamanio,
                        duracion: `${reserva.duracion} horas`
                    };
                    
                    await emailjs.send(
                        'service_yw8xcrm', 
                        'template_cancelacion', 
                        templateParams
                    );
                    
                    showNotification('Reserva cancelada correctamente. Se ha enviado un correo de confirmación.');
                    
                    // Volver a cargar las reservas
                    if (isAdmin) {
                        cargarReservasAdmin();
                    } else {
                        cargarReservasUsuario();
                    }
                } catch (error) {
                    console.error('Error cancelando reserva:', error);
                    showNotification(`Error al cancelar reserva: ${error.message}`, true);
                } finally {
                    showLoader(false);
                }
            }

            // Función para cargar las reservas del usuario actual
            async function cargarReservasUsuario() {
                try {
                    showLoader(true);
                    
                    if (!currentUser) {
                        showNotification('Por favor inicia sesión para ver tus reservas', true);
                        return;
                    }
                    
                    const { data: reservas, error } = await supabase
                        .from('reservas')
                        .select('*')
                        .eq('user_id', currentUser.id)
                        .order('fecha', { ascending: true })
                        .order('hora', { ascending: true });
                    
                    if (error) throw error;
                    
                    reservationsList.innerHTML = '';
                    
                    if (!reservas || reservas.length === 0) {
                        reservationsList.innerHTML = `
                            <div class="no-reservations">
                                <i class="fas fa-calendar-times fa-3x" style="margin-bottom: 15px; opacity: 0.5;"></i>
                                <p>No se encontraron reservas para este usuario</p>
                            </div>
                        `;
                        return;
                    }
                    
                    reservas.forEach(reserva => {
                        const reservaEl = document.createElement('div');
                        reservaEl.classList.add('reservation-item');
                        
                        // Crear la fecha como local, agregando 'T00:00:00' para evitar desplazamiento
                        const fecha = new Date(reserva.fecha + 'T00:00:00');
                        const fechaFormateada = fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                        
                        // Determinar el estado para mostrar
                        let estadoTexto = '';
                        let estadoClase = '';
                        if (reserva.estado === 'pending') {
                            estadoTexto = 'Pendiente de aprobación';
                            estadoClase = 'status-pending';
                        } else if (reserva.estado === 'confirmed') {
                            estadoTexto = 'Confirmada';
                            estadoClase = 'status-confirmed';
                        } else {
                            estadoTexto = 'Cancelada';
                            estadoClase = 'status-canceled';
                        }
                        
                        // Determinar estado de pago
                        let pagoTexto = 'Pendiente';
                        let pagoClase = 'status-pending';
                        if (reserva.pago_verificado) {
                            pagoTexto = 'Verificado';
                            pagoClase = 'status-confirmed';
                        }
                        
                        reservaEl.innerHTML = `
                            <div class="reservation-header">
                                <h4>Reserva #${reserva.id}</h4>
                                <span>${fechaFormateada}</span>
                            </div>
                            <div class="reservation-details">
                                <div class="reservation-detail">
                                    <div class="reservation-label">Hora</div>
                                    <div>${reserva.hora}</div>
                                </div>
                                <div class="reservation-detail">
                                    <div class="reservation-label">Tamaño</div>
                                    <div>${reserva.tamanio}</div>
                                </div>
                                <div class="reservation-detail">
                                    <div class="reservation-label">Duración</div>
                                    <div>${reserva.duracion} horas</div>
                                </div>
                                <div class="reservation-detail">
                                    <div class="reservation-label">Artista</div>
                                    <div>${reserva.artista}</div>
                                </div>
                                <div class="reservation-detail">
                                    <div class="reservation-label">Estado</div>
                                    <div><span class="reservation-status-small ${estadoClase}">${estadoTexto}</span></div>
                                </div>
                                <div class="reservation-detail">
                                    <div class="reservation-label">Pago</div>
                                    <div><span class="reservation-status-small ${pagoClase}">${pagoTexto}</span></div>
                                </div>
                            </div>
                            <div class="reservation-actions">
                                <button class="btn btn-danger cancel-reservation-btn" data-id="${reserva.id}" ${reserva.estado === 'canceled' ? 'disabled' : ''}>
                                    <i class="fas fa-trash-alt"></i> Cancelar Reserva
                                </button>
                            </div>
                        `;
                        
                        reservationsList.appendChild(reservaEl);
                    });
                    
                    // Agregar eventos a los botones de cancelar
                    document.querySelectorAll('.cancel-reservation-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const reservaId = btn.dataset.id;
                            if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
                                cancelarReserva(reservaId);
                            }
                        });
                    });
                } catch (error) {
                    console.error('Error cargando reservas:', error);
                    showNotification(`Error al cargar reservas: ${error.message}`, true);
                } finally {
                    showLoader(false);
                }
            }

            // Función para cargar reservas para el panel de administrador
            async function cargarReservasAdmin(filter = 'all', customDate = null) {
                try {
                    showLoader(true);
                    
                    let query = supabase
                        .from('reservas')
                        .select('*')
                        .order('fecha', { ascending: true })
                        .order('hora', { ascending: true });
                    
                    // Aplicar filtros
                    if (filter === 'today') {
                        const today = new Date();
                        const todayISO = formatLocalDate(today);
                        query = query.eq('fecha', todayISO);
                    } else if (filter === 'pending') {
                        query = query.eq('estado', 'pending');
                    } else if (filter === 'confirmed') {
                        query = query.eq('estado', 'confirmed');
                    } else if (filter === 'canceled') {
                        query = query.eq('estado', 'canceled');
                    } else if (filter === 'custom' && customDate) {
                        const customISO = formatLocalDate(customDate);
                        query = query.eq('fecha', customISO);
                    }
                    
                    const { data: reservas, error } = await query;
                    
                    if (error) throw error;
                    
                    adminReservations.innerHTML = '';
                    
                    if (!reservas || reservas.length === 0) {
                        adminReservations.innerHTML = `
                            <div class="no-reservations" style="grid-column:1/-1;text-align:center;padding:30px;">
                                <i class="fas fa-calendar-times fa-3x" style="margin-bottom: 15px; opacity: 0.5;"></i>
                                <p>No se encontraron reservas</p>
                            </div>
                        `;
                        return;
                    }
                    
                    reservas.forEach(reserva => {
                        const fecha = new Date(reserva.fecha + 'T00:00:00');
                        const fechaFormateada = fecha.toLocaleDateString('es-ES', { 
                            weekday: 'short', 
                            day: '2-digit', 
                            month: 'short' 
                        });
                        
                        const horaFormateada = reserva.hora.substring(0, 5);
                        
                        const card = document.createElement('div');
                        card.classList.add('reservation-card');
                        
                        card.innerHTML = `
                            <div class="reservation-card-header">
                                <h3>${fechaFormateada} ${horaFormateada}</h3>
                                <span class="reservation-status status-${reserva.estado}">
                                    ${reserva.estado === 'pending' ? 'Pendiente' : 
                                      reserva.estado === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                                </span>
                            </div>
                            <div class="reservation-card-body">
                                <div><strong>${reserva.nombre}</strong></div>
                                <div>${reserva.email}</div>
                                <div>${reserva.telefono}</div>
                                <div>Tamaño: ${reserva.tamanio}</div>
                                <div>Duración: ${reserva.duracion} horas</div>
                                <div>Artista: ${reserva.artista}</div>
                                <div>Pago: <span class="${reserva.pago_verificado ? 'reservation-status-small status-confirmed' : 'reservation-status-small status-pending'}">${reserva.pago_verificado ? 'Verificado' : 'Pendiente'}</span></div>
                            </div>
                            <div class="reservation-card-footer">
                                ${reserva.estado === 'pending' ? `
                                <button class="admin-card-btn btn-confirm" data-id="${reserva.id}">
                                    <i class="fas fa-check"></i> Aprobar
                                </button>
                                ` : ''}
                                ${reserva.estado !== 'canceled' ? `
                                <button class="admin-card-btn btn-cancel" data-id="${reserva.id}">
                                    <i class="fas fa-times"></i> Cancelar
                                </button>
                                ` : ''}
                                <!-- Nuevo botón para confirmar pago -->
                                ${!reserva.pago_verificado && reserva.estado !== 'canceled' ? `
                                <button class="admin-card-btn btn-payment-confirm" data-id="${reserva.id}">
                                    <i class="fas fa-money-check-alt"></i> Confirmar Pago
                                </button>
                                ` : ''}
                                <button class="admin-card-btn btn-delete" data-id="${reserva.id}">
                                    <i class="fas fa-trash-alt"></i> Eliminar
                                </button>
                                <button class="admin-card-btn btn-whatsapp" data-phone="${reserva.telefono}">
                                    <i class="fab fa-whatsapp"></i> WhatsApp
                                </button>
                                <button class="admin-card-btn btn-details" data-id="${reserva.id}">
                                    <i class="fas fa-info-circle"></i> Detalles
                                </button>
                            </div>
                        `;
                        
                        adminReservations.appendChild(card);
                    });
                    
                    // Agregar eventos a los botones de administrador
                    document.querySelectorAll('.btn-confirm').forEach(btn => {
                        btn.addEventListener('click', async () => {
                            const reservaId = btn.dataset.id;
                            await actualizarEstadoReserva(reservaId, 'confirmed');
                        });
                    });
                    
                    document.querySelectorAll('.btn-cancel').forEach(btn => {
                        btn.addEventListener('click', async () => {
                            const reservaId = btn.dataset.id;
                            await actualizarEstadoReserva(reservaId, 'canceled');
                        });
                    });
                    
                    document.querySelectorAll('.btn-delete').forEach(btn => {
                        btn.addEventListener('click', async () => {
                            const reservaId = btn.dataset.id;
                            if (confirm('¿Estás seguro de que deseas eliminar permanentemente esta reserva?')) {
                                await eliminarReserva(reservaId);
                            }
                        });
                    });
                    
                    document.querySelectorAll('.btn-whatsapp').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const phone = btn.dataset.phone;
                            // Eliminar cualquier carácter que no sea dígito
                            const cleanedPhone = phone.replace(/\D/g, '');
                            // Formatear el enlace de WhatsApp
                            const whatsappUrl = `https://wa.me/53${cleanedPhone}`;
                            window.open(whatsappUrl, '_blank');
                        });
                    });
                    
                    document.querySelectorAll('.btn-details').forEach(btn => {
                        btn.addEventListener('click', async () => {
                            const reservaId = btn.dataset.id;
                            mostrarDetallesReserva(reservaId);
                        });
                    });

                    // Agregar eventos a los botones de confirmar pago
                    document.querySelectorAll('.btn-payment-confirm').forEach(btn => {
                        btn.addEventListener('click', async () => {
                            const reservaId = btn.dataset.id;
                            await confirmarPago(reservaId);
                        });
                    });
                    
                } catch (error) {
                    console.error('Error cargando reservas (admin):', error);
                    showNotification(`Error al cargar reservas: ${error.message}`, true);
                } finally {
                    showLoader(false);
                }
            }

            // Función para eliminar permanentemente una reserva (admin)
            async function eliminarReserva(reservaId) {
                try {
                    showLoader(true);
                    
                    // Eliminar la reserva de Supabase
                    const { error } = await supabase
                        .from('reservas')
                        .delete()
                        .eq('id', reservaId);
                    
                    if (error) throw error;
                    
                    showNotification('Reserva eliminada permanentemente', false, false, true);
                    
                    // Recargar las reservas
                    cargarReservasAdmin(adminFilter.value);
                } catch (error) {
                    console.error('Error eliminando reserva:', error);
                    showNotification(`Error al eliminar reserva: ${error.message}`, true);
                } finally {
                    showLoader(false);
                }
            }

            // Función para actualizar el estado de una reserva (admin)
            async function actualizarEstadoReserva(reservaId, estado) {
                try {
                    showLoader(true);
                    
                    
                    // Obtener la reserva para enviar el correo si es necesario
                    const { data: reserva, error: getError } = await supabase
                        .from('reservas')
                        .select('*')
                        .eq('id', reservaId)
                        .single();
                    
                    if (getError) throw getError;
                    
                    // Actualizar el estado
                    const { error } = await supabase
                        .from('reservas')
                        .update({ estado: estado })
                        .eq('id', reservaId);
                    
                    if (error) throw error;
                    
                    showNotification(`Reserva ${estado === 'confirmed' ? 'confirmada' : 'cancelada'} correctamente`, false, false, true);
                    
                    if (estado === 'confirmed') {
                      // Generar y descargar archivo ICS
    const icsContent = generateICS(reserva);
    downloadICS(icsContent, `reserva-${reserva.id}.ics`);
    
    // Agregar al calendario de Google (opcional)
    await agregarAlCalendarioGoogle(reserva);
}
                    // Enviar correo de confirmación solo si se aprueba
                    if (estado === 'confirmed') {
                        const templateParams = {
                            to_name: reserva.nombre,
                            to_email: reserva.email,
                            fecha: new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-ES'),
                            hora: reserva.hora,
                            artista: reserva.artista,
                            tamanio: reserva.tamanio,
                            duracion: `${reserva.duracion} horas`,
                            telefono: reserva.telefono
                        };
                        
                        await emailjs.send(
                            'service_yw8xcrm', 
                            'template_y09drjc',
                            templateParams
                        );
                        
                        // Agregar al calendario de Google solo si es una confirmación
                        await agregarAlCalendarioGoogle(reserva);
                    }
                    
                    // Recargar las reservas
                    cargarReservasAdmin(adminFilter.value);
                } catch (error) {
                    console.error('Error actualizando reserva:', error);
                    showNotification(`Error al actualizar reserva: ${error.message}`, true);
                } finally {
                    showLoader(false);
                }
              
            }

            // Función para agregar reserva al calendario de Google
            async function agregarAlCalendarioGoogle(reserva) {
                try {
                    // Simulación de integración con Google Calendar
                    // En un entorno real, esto sería una llamada a una API segura
                    
                    console.log('Agregando al calendario de Google:', reserva);
                    
                    // Construir los datos del evento
                    const evento = {
                        summary: `Tatuaje - ${reserva.nombre}`,
                        location: 'Inkart Studio',
                        description: `Tatuaje de ${reserva.tamanio} - ${reserva.duracion} horas\nCliente: ${reserva.nombre}\nTeléfono: ${reserva.telefono}`,
                        start: {
                            dateTime: `${reserva.fecha}T${reserva.hora}:00`,
                            timeZone: 'Europe/Madrid'
                        },
                        end: {
                            dateTime: `${reserva.fecha}T${getEndTime(reserva.hora, reserva.duracion)}:00`,
                            timeZone: 'Europe/Madrid'
                        },
                        reminders: {
                            useDefault: true
                        }
                    };
                    
                    // Aquí iría la llamada real a la API de Google Calendar
                    // Esta es una simulación para mostrar cómo funcionaría
                    
                    showNotification('Reserva agregada al calendario de Google', false, false, true);
                    
                    return true;
                } catch (error) {
                    console.error('Error al agregar al calendario:', error);
                    showNotification('Error al sincronizar con Google Calendar', true, false, true);
                    return false;
                }
            }

            // Función para mostrar detalles de una reserva (admin)
            async function mostrarDetallesReserva(reservaId) {
                try {
                    showLoader(true);
                    
                    const { data: reserva, error } = await supabase
                        .from('reservas')
                        .select('*')
                        .eq('id', reservaId)
                        .single();
                    
                    if (error) throw error;
                    
                    const fecha = new Date(reserva.fecha + 'T00:00:00');
                    const fechaFormateada = fecha.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                    });
                    
                    alert(`
                        Detalles de la Reserva #${reserva.id}
                        
                        Fecha: ${fechaFormateada}
                        Hora: ${reserva.hora}
                        Cliente: ${reserva.nombre}
                        Email: ${reserva.email}
                        Teléfono: ${reserva.telefono}
                        Tamaño: ${reserva.tamanio}
                        Duración: ${reserva.duracion} horas
                        Artista: ${reserva.artista}
                        Estado: ${reserva.estado === 'pending' ? 'Pendiente' : 
                                 reserva.estado === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                        Pago: ${reserva.pago_verificado ? 'Verificado' : 'Pendiente'}
                    `);
                    
                } catch (error) {
                    console.error('Error obteniendo detalles de reserva:', error);
                    showNotification(`Error al obtener detalles: ${error.message}`, true);
                } finally {
                    showLoader(false);
                }
            }

            // Función para confirmar el pago de una reserva (admin)
            async function confirmarPago(reservaId) {
                try {
                    showLoader(true);
                    
                    // Actualizar el estado del pago en Supabase
                    const { error } = await supabase
                        .from('reservas')
                        .update({ pago_verificado: true })
                        .eq('id', reservaId);
                    
                    if (error) throw error;
                    
                    // Obtener los datos de la reserva para enviar el correo
                    const { data: reserva, error: getError } = await supabase
                        .from('reservas')
                        .select('*')
                        .eq('id', reservaId)
                        .single();
                    
                    if (getError) throw getError;
                    
const mensaje = `Hola ${reserva.nombre}, tu pago ha sido confirmado correctamente. Nos vemos en tu cita de tatuaje en InkArt Studio. ¡Gracias!`;

const numeroWhatsApp = reserva.telefono?.replace(/\D/g, ''); // Limpia el número

if (numeroWhatsApp) {
    const url = `https://wa.me/53${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
} else {
    showNotification('Número de teléfono no válido para WhatsApp.', true);
}
                    
                    showNotification('Pago confirmado y notificación enviada al cliente', false, false, true);
                    
                    // Recargar las reservas
                    cargarReservasAdmin(adminFilter.value);
                } catch (error) {
                    console.error('Error confirmando pago:', error);
                    showNotification(`Error al confirmar pago: ${error.message}`, true);
                } finally {
                    showLoader(false);
                }
            }

            document.getElementById('direct-reservation-btn').addEventListener('click', () => {
                window.open('reserva-directa.html', '_blank');
            });

            // Función para cargar usuarios en el panel de administrador
            async function cargarUsuariosAdmin(filtro = 'all') {
                try {
                    showLoader(true);
                    
                    let query = supabase
                        .from('profiles')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (filtro === 'recent') {
                        const lastWeek = new Date();
                        lastWeek.setDate(lastWeek.getDate() - 7);
                        query = query.gte('created_at', lastWeek.toISOString());
                    } else if (filtro === 'active') {
                        const lastMonth = new Date();
                        lastMonth.setMonth(lastMonth.getMonth() - 1);
                        query = query.gte('last_login', lastMonth.toISOString());
                    }

                    const { data: usuarios, error } = await query;
                    
                    if (error) throw error;
                    
                    usersList.innerHTML = '';
                    
                    if (!usuarios || usuarios.length === 0) {
                        usersList.innerHTML = `
                            <div class="no-reservations" style="grid-column:1/-1;text-align:center;padding:30px;">
                                <i class="fas fa-user-slash fa-3x" style="margin-bottom: 15px; opacity: 0.5;"></i>
                                <p>No se encontraron usuarios</p>
                            </div>
                        `;
                        return;
                    }
                    
                    usuarios.forEach(usuario => {
                        const card = document.createElement('div');
                        card.classList.add('user-card');
                        
                        const createdDate = new Date(usuario.created_at);
                        const lastLogin = usuario.last_login ? new Date(usuario.last_login) : null;
                        
                        card.innerHTML = `
                            <div class="user-header">
                                <div class="user-avatar-admin">${usuario.full_name ? usuario.full_name.charAt(0).toUpperCase() : 'U'}</div>
                                <h3>${usuario.full_name || 'Usuario sin nombre'}</h3>
                                <span class="user-role ${usuario.role}">${usuario.role}</span>
                            </div>
                            <div class="user-details">
                                <p><i class="fas fa-envelope"></i> ${usuario.email}</p>
                                <p><i class="fas fa-phone"></i> ${usuario.phone || 'Sin teléfono'}</p>
                                <p><i class="fas fa-calendar-plus"></i> Registrado: ${createdDate.toLocaleDateString('es-ES')}</p>
                                <p><i class="fas fa-sign-in-alt"></i> Último acceso: ${lastLogin ? lastLogin.toLocaleString('es-ES') : 'Nunca'}</p>
                            </div>
                            <div class="user-actions">
                                <button class="admin-card-btn btn-details view-user-reservations" data-id="${usuario.id}" data-name="${usuario.full_name || 'Usuario'}" data-email="${usuario.email}" data-initial="${usuario.full_name ? usuario.full_name.charAt(0).toUpperCase() : 'U'}">
                                    <i class="fas fa-calendar"></i> Ver Reservas
                                </button>
                                ${usuario.role !== 'admin' ? `
                                <button class="admin-card-btn btn-admin make-admin-btn" data-id="${usuario.id}">
                                    <i class="fas fa-user-shield"></i> Hacer Admin
                                </button>
                                ` : ''}
                            </div>
                        `;
                        
                        usersList.appendChild(card);
                    });
                    
                    // Agregar eventos a los botones
                    document.querySelectorAll('.make-admin-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const userId = btn.dataset.id;
                            actualizarRolUsuario(userId, 'admin');
                        });
                    });
                    
                    // Agregar eventos para ver reservas de usuario
                    document.querySelectorAll('.view-user-reservations').forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            const userId = btn.dataset.id;
                            const userName = btn.dataset.name;
                            const userEmail = btn.dataset.email;
                            const userInitial = btn.dataset.initial;
                            
                            // Actualizar la información en el modal
                            userModalName.textContent = userName;
                            userModalEmail.textContent = userEmail;
                            userModalAvatar.textContent = userInitial;
                            
                            // Cargar las reservas del usuario
                            await mostrarReservasUsuario(userId);
                        });
                    });
                    
                } catch (error) {
                    console.error('Error cargando usuarios:', error);
                    showNotification(`Error al cargar usuarios: ${error.message}`, true);
                } finally {
                    showLoader(false);
                }
            }

            // Función para mostrar reservas de un usuario específico
            async function mostrarReservasUsuario(userId) {
                try {
                    showLoader(true);
                    
                    const { data: reservas, error } = await supabase
                        .from('reservas')
                        .select('*')
                        .eq('user_id', userId)
                        .order('fecha', { ascending: true })
                        .order('hora', { ascending: true });
                    
                    if (error) throw error;
                    
                    userReservationsList.innerHTML = '';
                    
                    if (!reservas || reservas.length === 0) {
                        userReservationsList.innerHTML = `
                            <div class="no-reservations">
                                <i class="fas fa-calendar-times fa-3x" style="margin-bottom: 15px; opacity: 0.5;"></i>
                                <p>No se encontraron reservas para este usuario</p>
                            </div>
                        `;
                        return;
                    }
                    
                    reservas.forEach(reserva => {
                        const reservaEl = document.createElement('div');
                        reservaEl.classList.add('reservation-item');
                        
                        // Crear la fecha como local, agregando 'T00:00:00' para evitar desplazamiento
                        const fecha = new Date(reserva.fecha + 'T00:00:00');
                        const fechaFormateada = fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                        
                        // Determinar el estado para mostrar
                        let estadoTexto = '';
                        let estadoClase = '';
                        if (reserva.estado === 'pending') {
                            estadoTexto = 'Pendiente de aprobación';
                            estadoClase = 'status-pending';
                        } else if (reserva.estado === 'confirmed') {
                            estadoTexto = 'Confirmada';
                            estadoClase = 'status-confirmed';
                        } else {
                            estadoTexto = 'Cancelada';
                            estadoClase = 'status-canceled';
                        }
                        
                        // Determinar estado de pago
                        let pagoTexto = 'Pendiente';
                        let pagoClase = 'status-pending';
                        if (reserva.pago_verificado) {
                            pagoTexto = 'Verificado';
                            pagoClase = 'status-confirmed';
                        }
                        
                        reservaEl.innerHTML = `
                            <div class="reservation-header">
                                <h4>Reserva #${reserva.id}</h4>
                                <span>${fechaFormateada}</span>
                            </div>
                            <div class="reservation-details">
                                <div class="reservation-detail">
                                    <div class="reservation-label">Hora</div>
                                    <div>${reserva.hora}</div>
                                </div>
                                <div class="reservation-detail">
                                    <div class="reservation-label">Tamaño</div>
                                    <div>${reserva.tamanio}</div>
                                </div>
                                <div class="reservation-detail">
                                    <div class="reservation-label">Duración</div>
                                    <div>${reserva.duracion} horas</div>
                                </div>
                                <div class="reservation-detail">
                                    <div class="reservation-label">Artista</div>
                                    <div>${reserva.artista}</div>
                                </div>
                                <div class="reservation-detail">
                                    <div class="reservation-label">Estado</div>
                                    <div><span class="reservation-status-small ${estadoClase}">${estadoTexto}</span></div>
                                </div>
                                <div class="reservation-detail">
                                    <div class="reservation-label">Pago</div>
                                    <div><span class="reservation-status-small ${pagoClase}">${pagoTexto}</span></div>
                                </div>
                            </div>
                            <div class="reservation-actions">
                                <button class="btn btn-danger cancel-reservation-btn" data-id="${reserva.id}" ${reserva.estado === 'canceled' ? 'disabled' : ''}>
                                    <i class="fas fa-trash-alt"></i> Cancelar Reserva
                                </button>
                            </div>
                        `;
                        
                        userReservationsList.appendChild(reservaEl);
                    });
                    
                    // Agregar eventos a los botones de cancelar
                    document.querySelectorAll('.cancel-reservation-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const reservaId = btn.dataset.id;
                            if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
                                cancelarReserva(reservaId);
                            }
                        });
                    });
                    
                    // Mostrar el modal
                    userReservationsModal.classList.add('active');
                    
                } catch (error) {
                    console.error('Error cargando reservas del usuario:', error);
                    showNotification(`Error al cargar reservas: ${error.message}`, true);
                } finally {
                    showLoader(false);
                }
            }

            // Función para actualizar el rol de un usuario
            async function actualizarRolUsuario(userId, nuevoRol) {
                try {
                    showLoader(true);
                    
                    const { error } = await supabase
                        .from('profiles')
                        .update({ role: nuevoRol })
                        .eq('id', userId);
                        
                    if (error) throw error;
                    
                    showNotification(`Rol de usuario actualizado a ${nuevoRol}`, false, false, true);
                    cargarUsuariosAdmin(userFilter.value);
                } catch (error) {
                    console.error('Error actualizando rol:', error);
                    showNotification(`Error al actualizar rol: ${error.message}`, true);
                } finally {
                    showLoader(false);
                }
            }

            // Función para generar el calendario del administrador
            async function generateAdminCalendar(month, year) {
                adminCalendarEl.innerHTML = '';
                updateAdminMonthHeader(month, year);
                
                // Agregar encabezados de días
                const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                days.forEach(day => {
                    const dayHeader = document.createElement('div');
                    dayHeader.classList.add('admin-calendar-day-header');
                    dayHeader.textContent = day;
                    adminCalendarEl.appendChild(dayHeader);
                });
                
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const firstDayOfWeek = firstDay.getDay();
                const startingDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
                
                // Días vacíos al inicio del mes
                for (let i = 0; i < startingDay; i++) {
                    const emptyDay = document.createElement('div');
                    emptyDay.classList.add('admin-calendar-day', 'disabled');
                    adminCalendarEl.appendChild(emptyDay);
                }
                
                // Obtener las reservas del mes para determinar los estados
                const reservasMes = await cargarReservasPorMes(month, year);
                
                // Generar días del mes
                for (let day = 1; day <= lastDay.getDate(); day++) {
                    const date = new Date(year, month, day);
                    date.setHours(0, 0, 0, 0);
                    const dayEl = document.createElement('div');
                    dayEl.classList.add('admin-calendar-day');
                    dayEl.innerHTML = `<div class="day-number">${day}</div>`;
                    dayEl.dataset.date = formatLocalDate(date);
                    
                    // Comprobar si hay reservas en este día
                    const fechaStr = formatLocalDate(date);
                    const reservasDia = reservasMes[fechaStr] || [];
                    
                    // Crear contenedor de indicadores
                    const indicatorsContainer = document.createElement('div');
                    indicatorsContainer.classList.add('event-indicators');
                    
                    // Agregar indicadores según los estados de reserva
                    if (reservasDia.includes('confirmed')) {
                        const indicator = document.createElement('div');
                        indicator.classList.add('event-indicator', 'event-confirmed');
                        indicatorsContainer.appendChild(indicator);
                    }
                    
                    if (reservasDia.includes('pending')) {
                        const indicator = document.createElement('div');
                        indicator.classList.add('event-indicator', 'event-pending');
                        indicatorsContainer.appendChild(indicator);
                    }
                    
                    if (reservasDia.includes('canceled')) {
                        const indicator = document.createElement('div');
                        indicator.classList.add('event-indicator', 'event-canceled');
                        indicatorsContainer.appendChild(indicator);
                    }
                    
                    // Agregar contenedor de indicadores si hay reservas
                    if (reservasDia.length > 0) {
                        dayEl.appendChild(indicatorsContainer);
                    }
                    
                    dayEl.addEventListener('click', async () => {
                        // Al hacer clic, cargar reservas de este día
                        document.querySelectorAll('.admin-calendar-day').forEach(d => d.classList.remove('active'));
                        dayEl.classList.add('active');
                        adminFilter.value = 'custom';
                        // Cargar reservas para este día
                        cargarReservasAdmin('custom', date);
                    });
                    
                    adminCalendarEl.appendChild(dayEl);
                }
            }
            
            // Función para actualizar el encabezado del mes del administrador
            function updateAdminMonthHeader(month, year) {
                const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                adminCurrentMonthEl.textContent = `${monthNames[month]} ${year}`;
            }
            
            // Función para cargar reservas por mes
            async function cargarReservasPorMes(month, year) {
                try {
                    const startDate = new Date(year, month, 1);
                    const endDate = new Date(year, month + 1, 0);
                    
                    const { data: reservas, error } = await supabase
                        .from('reservas')
                        .select('fecha, estado')
                        .gte('fecha', formatLocalDate(startDate))
                        .lte('fecha', formatLocalDate(endDate));
                    
                    if (error) throw error;
                    
                    // Agrupar por fecha y guardar los estados únicos
                    const reservasPorDia = {};
                    reservas.forEach(reserva => {
                        if (!reservasPorDia[reserva.fecha]) {
                            reservasPorDia[reserva.fecha] = [];
                        }
                        reservasPorDia[reserva.fecha].push(reserva.estado);
                    });
                    
                    return reservasPorDia;
                } catch (error) {
                    console.error('Error cargando reservas del mes:', error);
                    return {};
                }
            }

            // Función para eliminar reservas pasadas automáticamente
            async function eliminarReservasPasadas() {
                try {
                    const today = new Date();
                    const todayISO = formatLocalDate(today);
                    
                    const { data: reservasPasadas, error: fetchError } = await supabase
                        .from('reservas')
                        .select('id')
                        .lt('fecha', todayISO);
                    
                    if (fetchError) throw fetchError;
                    
                    if (reservasPasadas.length === 0) {
                        console.log('No hay reservas pasadas para eliminar');
                        return;
                    }
                    
                    const reservasIds = reservasPasadas.map(r => r.id);
                    
                    const { error: deleteError } = await supabase
                        .from('reservas')
                        .delete()
                        .in('id', reservasIds);
                    
                    if (deleteError) throw deleteError;
                    
                    console.log(`Se eliminaron ${reservasPasadas.length} reservas pasadas`);
                    
                    // Recargar las reservas si estamos en el panel de admin
                    if (isAdmin && adminPanel.style.display === 'block') {
                        cargarReservasAdmin(adminFilter.value);
                    }
                    
                } catch (error) {
                    console.error('Error eliminando reservas pasadas:', error);
                }
            }

            // Eventos para seleccionar tamaño
            document.querySelectorAll('.size-option').forEach(option => {
                option.addEventListener('click', function() {
                    // Quitar selección anterior
                    document.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));
                    
                    // Seleccionar nueva opción
                    this.classList.add('selected');
                    
                    // Guardar selección
                    selectedSize = this.dataset.size;
                    selectedDuration = parseInt(this.dataset.duration);
                    
                    // Actualizar resumen
                    summarySize.textContent = this.querySelector('div:first-child').textContent;
                    summaryDuration.textContent = `${selectedDuration} horas`;
                    
                    // Regenerar horarios con nueva duración
                    if (selectedDate) {
                        generateTimeSlots();
                    }
                });
            });

            // Navegación del calendario
            prevMonthBtn.addEventListener('click', () => {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                generateCalendar(currentMonth, currentYear);
            });

            nextMonthBtn.addEventListener('click', () => {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                generateCalendar(currentMonth, currentYear);
            });
            
            // Navegación del calendario administrativo
            adminPrevMonthBtn.addEventListener('click', () => {
                adminCurrentMonth--;
                if (adminCurrentMonth < 0) {
                    adminCurrentMonth = 11;
                    adminCurrentYear--;
                }
                generateAdminCalendar(adminCurrentMonth, adminCurrentYear);
            });

            adminNextMonthBtn.addEventListener('click', () => {
                adminCurrentMonth++;
                if (adminCurrentMonth > 11) {
                    adminCurrentMonth = 0;
                    adminCurrentYear++;
                }
                generateAdminCalendar(adminCurrentMonth, adminCurrentYear);
            });

            // Botón de confirmación abre el modal
            confirmBtn.addEventListener('click', () => {
                if (!currentUser) {
                    showNotification('Por favor inicia sesión para reservar', true);
                    return;
                }
                
                if (!selectedTime) {
                    showNotification('Por favor selecciona una hora', true);
                    return;
                }
                
                if (!selectedSize) {
                    showNotification('Por favor selecciona un tamaño de tatuaje', true);
                    return;
                }
                
                // Actualizar el modal con la información
                modalSummaryDate.textContent = summaryDate.textContent;
                modalSummaryTime.textContent = summaryTime.textContent;
                modalSummarySize.textContent = summarySize.textContent;
                modalSummaryDuration.textContent = summaryDuration.textContent;
                
                showConfirmationModal(true);
            });

            // Cerrar modal
            closeModal.addEventListener('click', () => {
                showConfirmationModal(false);
            });

            cancelReservation.addEventListener('click', () => {
                showConfirmationModal(false);
            });

            // Confirmar reserva desde el modal
            confirmReservation.addEventListener('click', async () => {
                showConfirmationModal(false);
                showPaymentModal(true);
            });

            // Botón "He realizado el pago" en modal de pago
            paymentDoneBtn.addEventListener('click', async () => {
                showPaymentModal(false);
                
                if (!currentUser) {
                    showNotification('Por favor inicia sesión para reservar', true);
                    return;
                }
                
                const duracion = sizeDurationMap[selectedSize];
                const fechaISO = formatLocalDate(selectedDate); // Usar formato local

                try {
                    showLoader(true);
                    
                    // Verificar si el horario sigue disponible
                    const { data: existingReservations, error: checkError } = await supabase
                        .from('reservas')
                        .select('id')
                        .eq('fecha', fechaISO)
                        .eq('hora', selectedTime);
                    
                    if (checkError) throw checkError;
                    
                    if (existingReservations.length > 0) {
                        showNotification('Lo sentimos, este horario ya ha sido reservado', true);
                        await generateTimeSlots();
                        return;
                    }
                    
                    // Guardar en Supabase con estado "pending" y pago pendiente
                    const { error } = await supabase
                        .from('reservas')
                        .insert({
                            user_id: currentUser.id,
                            nombre: currentUser.user_metadata.full_name,
                            email: currentUser.email,
                            telefono: currentUser.user_metadata.phone,
                            fecha: fechaISO,
                            hora: selectedTime,
                            artista: "Josiel Salabarría López",
                            tamanio: selectedSize,
                            duracion: duracion,
                            estado: "pending", // Estado pendiente por defecto
                            pago_verificado: false, // Pago pendiente de verificación
                            timestamp: new Date().toISOString()
                        });

                    if (error) throw error;
                    
                    showNotification(`¡Reserva enviada para aprobación! Por favor realiza el pago de 1000 CUP.`);
                    selectedTime = null;
                    selectedSize = null;
                    summaryTime.textContent = '-';
                    summarySize.textContent = '-';
                    summaryDuration.textContent = '-';
                    
                    // Limpiar selecciones
                    document.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));
                    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
                    
                    await generateTimeSlots();
                } catch (error) {
                    console.error('Error guardando reserva:', error);
                    showNotification(`Error al guardar reserva: ${error.message}`, true);
                } finally {
                    showLoader(false);
                }
            });

            // Botón para ver reservas
            viewReservationsBtn.addEventListener('click', () => {
                showReservationsModal(true);
                cargarReservasUsuario();
            });

            // Cerrar modal de reservas
            closeReservationsModal.addEventListener('click', () => {
                showReservationsModal(false);
            });
            
            // Cerrar modal de pago
            closePaymentModal.addEventListener('click', () => {
                showPaymentModal(false);
            });

            // Cambiar pestañas de autenticación
            loginTab.addEventListener('click', () => {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
                loginTab.classList.add('active');
                registerTab.classList.remove('active');
            });
            
            registerTab.addEventListener('click', () => {
                registerForm.classList.add('active');
                loginForm.classList.remove('active');
                registerTab.classList.add('active');
                loginTab.classList.remove('active');
            });
            
            // Botón para abrir modal de login
            loginBtnHeader.addEventListener('click', () => showAuthModal(true, 'login'));
            
            // Botón de login
            loginBtn.addEventListener('click', async () => {
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                if (!email || !password) {
                    loginError.textContent = 'Por favor completa todos los campos';
                    return;
                }
                
                try {
                    showLoader(true);
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });
                    
                    if (error) throw error;
                    
                    currentUser = data.user;
                    
                    // Verificar si el usuario ha confirmado su correo
                    if (!currentUser.confirmed_at) {
                        showNotification('Por favor confirma tu correo electrónico antes de iniciar sesión', true);
                        logoutBtn.click(); // Cerrar sesión automáticamente
                        return;
                    }
                    
                    // Actualizar último acceso
                    await supabase
                        .from('profiles')
                        .update({ last_login: new Date().toISOString() })
                        .eq('id', currentUser.id);
                    
                    updateAuthUI(currentUser);
                    showAuthModal(false);
                    showNotification('Sesión iniciada correctamente');
                } catch (error) {
                    loginError.textContent = error.message;
                } finally {
                    showLoader(false);
                }
            });
            
            // Botón de registro con confirmación de correo
            registerBtn.addEventListener('click', async () => {
                const name = document.getElementById('register-name').value;
                const email = document.getElementById('register-email').value;
                const phone = document.getElementById('register-phone').value;
                const password = document.getElementById('register-password').value;
                const passwordConfirm = document.getElementById('register-password-confirm').value;
                
                // Validaciones
                if (!name || !email || !phone || !password || !passwordConfirm) {
                    registerError.textContent = 'Por favor completa todos los campos';
                    return;
                }
                
                if (password !== passwordConfirm) {
                    registerError.textContent = 'Las contraseñas no coinciden';
                    return;
                }
                
                try {
                    showLoader(true);
                    const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                            data: {
                                full_name: name,
                                phone: phone
                            },
                            // Habilitar redirección después de confirmación
                            emailRedirectTo: window.location.href
                        }
                    });
                    
                    if (error) throw error;
                    
                    // Mostrar mensaje de confirmación
                    showNotification('¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta.');
                    
                    // Limpiar formulario
                    document.getElementById('register-name').value = '';
                    document.getElementById('register-email').value = '';
                    document.getElementById('register-phone').value = '';
                    document.getElementById('register-password').value = '';
                    document.getElementById('register-password-confirm').value = '';
                    
                    // Cambiar a pestaña de inicio de sesión
                    loginTab.click();
                    
                } catch (error) {
                    registerError.textContent = error.message;
                } finally {
                    showLoader(false);
                }
            });
            
            // Botón de logout
            logoutBtn.addEventListener('click', async () => {
                try {
                    await supabase.auth.signOut();
                    currentUser = null;
                    updateAuthUI(null);
                    showNotification('Sesión cerrada correctamente');
                } catch (error) {
                    console.error('Error cerrando sesión:', error);
                    showNotification('Error al cerrar sesión', true);
                }
            });
            
            // Botón de logout para administrador
            adminLogoutBtn.addEventListener('click', async () => {
                try {
                    await supabase.auth.signOut();
                    currentUser = null;
                    isAdmin = false;
                    updateAuthUI(null);
                    showNotification('Sesión cerrada correctamente');
                } catch (error) {
                    console.error('Error cerrando sesión:', error);
                    showNotification('Error al cerrar sesión', true);
                }
            });
            
            // Botón para cerrar modal de autenticación
            closeAuthModalBtn.addEventListener('click', () => {
                showAuthModal(false);
            });
            
            // Botón de actualizar para administrador
            adminRefreshBtn.addEventListener('click', () => {
                cargarReservasAdmin(adminFilter.value);
                cargarUsuariosAdmin(userFilter.value);
                generateAdminCalendar(adminCurrentMonth, adminCurrentYear);
                showNotification('Datos actualizados', false, false, true);
            });
            
            // Filtro para administrador (reservas)
            adminFilter.addEventListener('change', () => {
                cargarReservasAdmin(adminFilter.value);
            });
            
            // Filtro para administrador (usuarios)
            userFilter.addEventListener('change', () => {
                cargarUsuariosAdmin(userFilter.value);
            });
            
            // Botones de filtro rápido para administrador
            adminTodayBtn.addEventListener('click', () => {
                adminFilter.value = 'today';
                cargarReservasAdmin('today');
            });
            
            adminWeekBtn.addEventListener('click', () => {
                // Implementar lógica para esta semana
                showNotification('Filtro de esta semana seleccionado', false, false, true);
            });
            
            adminPendingBtn.addEventListener('click', () => {
                adminFilter.value = 'pending';
                cargarReservasAdmin('pending');
            });
            
            // Cerrar modal de reservas de usuario
            closeUserReservationsModal.addEventListener('click', () => {
                userReservationsModal.classList.remove('active');
            });
            
            // Verificar sesión al cargar la página
            async function checkSession() {
                const { data, error } = await supabase.auth.getUser();
                if (data && data.user) {
                    currentUser = data.user;
                    
                    // Verificar si el usuario ha confirmado su correo
                    if (!currentUser.confirmed_at) {
                        showNotification('Por favor confirma tu correo electrónico antes de iniciar sesión', true);
                        await supabase.auth.signOut();
                        currentUser = null;
                        return;
                    }
                    
                    // Actualizar último acceso
                    await supabase
                        .from('profiles')
                        .update({ last_login: new Date().toISOString() })
                        .eq('id', currentUser.id);
                    
                    updateAuthUI(currentUser);
                }
            }
            
            // Inicializar la aplicación
            generateCalendar(currentMonth, currentYear);
            updateSelectedDateDisplay();
            checkSession().then(() => {
                // Eliminar reservas pasadas después de verificar la sesión
                eliminarReservasPasadas();
            });
        
    
    // ===== NUEVO CÓDIGO AQUÍ =====
    // Verificar si debemos abrir el modal de login
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'openLogin') {
        // Esperar 500ms para que la página cargue completamente
        setTimeout(() => {
            showAuthModal(true, 'login');
        }, 500);
    }
    // ===== FIN NUEVO CÓDIGO =====
});

// Al final del script existente, antes del cierre de
document.getElementById('back-button').addEventListener('click', () => {
    if (history.length > 1) {
        history.back();
    } else {
        // Redirigir al inicio si no hay historial
        window.location.href = 'index.html';
    }
});


// ... código existente ...

// Función para generar contenido .ics
function generateICS(reserva) {
    const startDate = new Date(`${reserva.fecha}T${reserva.hora}:00`);
    const endDate = new Date(startDate.getTime() + reserva.duracion * 60 * 60 * 1000);
    
    // Formatear fechas para ICS (formato UTC)
    const formatDate = (date) => {
        return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Inkart Studio//Reservas//ES
BEGIN:VEVENT
UID:${reserva.id}@inkartstudio
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Tatuaje - ${reserva.nombre}
DESCRIPTION:Cliente: ${reserva.nombre}\\nTeléfono: ${reserva.telefono}\\nTamaño: ${reserva.tamanio}\\nDuración: ${reserva.duracion} horas
LOCATION:Inkart Studio
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

// Función para descargar el archivo .ics
function downloadICS(icsContent, fileName) {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'reserva.ics';
    document.body.appendChild(a);
    a.click();
    
    // Limpiar después de la descarga
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}
generateTimeSlots();

