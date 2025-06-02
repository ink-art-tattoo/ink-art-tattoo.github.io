document.addEventListener('DOMContentLoaded', function() {
  // 1. Verificar si ya existe un footer
  const existingFooter = document.querySelector('#footer-container footer');
  if (existingFooter) return; // Si ya existe, no hacer nada
  
  // 2. Crear contenedor si no existe
  let container = document.getElementById('footer-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'footer-container';
    document.body.appendChild(container);
  }
  
  // 3. Cargar el footer
  fetch('footer.html')
    .then(response => {
      if (!response.ok) throw new Error('No se encontró el footer');
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;
    })
    .catch(error => {
      console.error('Error cargando el footer:', error);
      container.innerHTML = '<p>Footer no disponible</p>';
    });
});