/////////////////////////// MODAL FUNCIONAL (VERSIÓN ESTABLE) ///////////////////////////

// Abrir modal
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    // Cargar la imagen primero para conocer sus dimensiones
    const tempImg = new Image();
    tempImg.src = this.src;
    tempImg.onload = function() {
      modalImg.src = this.src;
      modal.classList.add('active');
      
      // Ajustar tamaño basado en la relación de aspecto
      const windowRatio = window.innerWidth / window.innerHeight;
      const imgRatio = tempImg.width / tempImg.height;
      
      if (imgRatio > windowRatio) {
        modalImg.style.maxWidth = '85vw';
        modalImg.style.maxHeight = 'none';
      } else {
        modalImg.style.maxHeight = '85vh';
        modalImg.style.maxWidth = 'none';
      }
    };
  });
});

document.querySelector('.close-modal').addEventListener('click', closeModal);

document.querySelector('.modal-background').addEventListener('click', closeModal);

// Cerrar con tecla ESC
document.addEventListener('keydown', function(e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

function closeModal() {
  const modal = document.getElementById('imageModal');
  
  // Aplicar clase de cierre
  modal.classList.add('closing');

  // Esperar animación antes de ocultar
  setTimeout(() => {
    modal.classList.remove('active', 'closing');
  }, 400); // mismo tiempo que la animación CSS
}

/////////////////////////// Modal Mejorado v2 FIN ///////////////////////////

/////////////////////////// Filtros de Galería START ///////////////////////////

// Función para filtrar las imágenes
function filterGallery(category) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block'; // Mostrar
        } else {
            item.style.display = 'none'; // Ocultar
        }
    });
}

// Event listeners para los botones de filtro
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Quitar clase 'active' de todos los botones
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        
        // Añadir clase 'active' al botón clickeado
        this.classList.add('active');
        
        // Filtrar galería
        filterGallery(this.dataset.filter);
    });
});

/////////////////////////// Filtros de Galería FIN ///////////////////////////

/////////////////////////// Sistema de Pestañas Corregido START ///////////////////////////

const tabBtns = document.querySelectorAll('.tab-btn');

// Función para cargar imágenes si es necesario
function checkAndLoadPortfolio() {
    if (document.getElementById('portfolio-content').classList.contains('active') && 
        document.getElementById('gallery-container').children.length === 0) {
        loadAllImages();
    }
}

// Cargar imágenes al inicio si Portfolio está activo
document.addEventListener('DOMContentLoaded', checkAndLoadPortfolio);

tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Actualizar botones activos
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Ocultar todos los contenidos
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Mostrar el contenido correspondiente
        const tabId = this.dataset.tab;
        document.getElementById(tabId === 'portfolio' ? 'portfolio-content' : tabId).classList.add('active');
        
        // Cargar imágenes solo si es la pestaña Portfolio
        if (tabId === 'portfolio') {
            checkAndLoadPortfolio();
        }
    });
});

/////////////////////////// Sistema de Pestañas Corregido FIN ///////////////////////////

/////////////////////////// Dark Mode START ///////////////////////////

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const themeText = themeToggle.querySelector('.theme-text');
const bannerImg = document.querySelector('.banner');

// Función para actualizar el tema visual
function updateTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Actualizar icono y texto
    if (isDarkMode) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        themeText.textContent = translations[currentLanguage].themeLight;
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        themeText.textContent = translations[currentLanguage].themeDark;
    }
    
    // Actualizar banner
    bannerImg.src = isDarkMode 
        ? bannerImg.dataset.darkSrc 
        : bannerImg.dataset.lightSrc;
    
    // Actualizar partículas del banner
    initParticles();
}

// Event listener para el botón de tema
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    updateTheme();
    
    // Opcional: Guardar preferencia en localStorage
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Inicializar tema al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar preferencia guardada (opcional)
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
    }
    
    updateTheme();
});

/////////////////////////// Dark Mode FIN  ///////////////////////////

/////////////////////////// Traductor START ///////////////////////////

function setupLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    const languageText = languageToggle.querySelector('.language-text');
    
    // Detectar idioma actual
    const currentPath = window.location.pathname;
    let currentLanguage, oppositeLanguage;
    
    if (currentPath.includes('/es/')) {
        currentLanguage = 'es';
        oppositeLanguage = 'en';
        languageText.textContent = 'Idioma: ES';
    } else if (currentPath.includes('/en/')) {
        currentLanguage = 'en';
        oppositeLanguage = 'es';
        languageText.textContent = 'Language: EN';
    } else {
        // Por defecto (página madre u otro caso)
        currentLanguage = 'es';
        oppositeLanguage = 'en';
        languageText.textContent = 'Idioma: ES';
    }
    
    // Configurar evento de clic
    languageToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Construir nueva ruta
        const newPath = currentPath.includes('/es/') || currentPath.includes('/en/')
            ? currentPath.replace(`/${currentLanguage}/`, `/${oppositeLanguage}/`)
            : `/${oppositeLanguage}/index.html`;
        
        window.location.href = window.location.origin + newPath;
    });
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', setupLanguageToggle);

/////////////////////////// Traductor FIN  ///////////////////////////

// Función loadAllImages debe ser global para que pueda ser llamada desde el sistema de pestañas
window.loadAllImages = async function() {
    const galleryContainer = document.getElementById('gallery-container');
    const categories = ['halfbody', 'fullbody', 'chibi', 'oc'];
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    let allImages = [];

    async function imageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    async function loadCategoryImages(category) {
        const images = [];
        for (let number = 1; number <= 20; number++) {
            const paddedNumber = number.toString().padStart(2, '0');
            for (const ext of extensions) {
                const imgPath = `../images/${category}${paddedNumber}${ext}`;
                if (await imageExists(imgPath)) {
                    images.push({
                        path: imgPath,
                        category: category,
                        alt: `${category} imagen ${paddedNumber}`
                    });
                    break;
                }
            }
        }
        return images;
    }

    function displayImages(images) {
        galleryContainer.innerHTML = '';
        images.forEach(imgData => {
            const item = document.createElement('div');
            item.className = `gallery-item ${imgData.category}`;
            const imgElement = document.createElement('img');
            imgElement.src = imgData.path;
            imgElement.alt = imgData.alt;
            imgElement.loading = 'lazy';
            imgElement.addEventListener('click', function() {
                document.getElementById('modalImage').src = this.src;
                document.getElementById('imageModal').classList.add('active');
            });
            item.appendChild(imgElement);
            galleryContainer.appendChild(item);
        });
    }

    allImages = [];
    for (const category of categories) {
        const categoryImages = await loadCategoryImages(category);
        allImages = [...allImages, ...categoryImages];
    }
    displayImages(allImages);
};

/////////////////////////// PARTICULAS PARA EL BANNER START  ///////////////////////////

// Generador de partículas mejorado
function initParticles() {
  const banner = document.querySelector('.banner-container');
  
  // Limpia partículas existentes
  document.querySelectorAll('.banner-container .particle').forEach(p => p.remove());
  
  // Esperamos a que el layout se estabilice
  requestAnimationFrame(() => {
    createParticles();
  });
}

function createParticles() {
  const banner = document.querySelector('.banner-container');
  const bannerRect = banner.getBoundingClientRect();
  const bannerWidth = bannerRect.width;
  const bannerHeight = bannerRect.height;
  
  // Colores pastel
  const colors = [
    'var(--pastel-pink)',
    'var(--pastel-purple)',
    'var(--pastel-blue)',
    'var(--pastel-green)',
    'var(--pastel-yellow)',
    'var(--dark-pink)'
  ];
  
  // Creamos 120 partículas para mejor distribución
  for (let i = 0; i < 120; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Tamaño aleatorio entre 1px y 5px
    const size = Math.random() * 6 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Color aleatorio
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Posición aleatoria en todo el banner (usando porcentajes para mejor adaptación)
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Animación única para cada partícula
    const duration = 6 + Math.random() * 6;
    const delay = Math.random() * 5;
    particle.style.animation = `float ${duration}s ${delay}s infinite ease-in-out`;
    
    banner.appendChild(particle);
  }
}

// Iniciamos cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
  // Usamos un observer para detectar cambios en el banner
  const bannerObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      if (entry.contentRect) {
        initParticles();
      }
    }
  });
  
  const banner = document.querySelector('.banner-container');
  if (banner) {
    bannerObserver.observe(banner);
    initParticles();
  }
});

/////////////////////////// PARTICULAS PARA EL BANNER FIN  ///////////////////////////

///////////////////// SCRIPT PARA FAQs START ///////////////////// 

document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    faqItem.classList.toggle('active');
    
    // Cierra los demás items si se abre uno nuevo
    if (faqItem.classList.contains('active')) {
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
        }
      });
    }
  });
});

///////////////////// SCRIPT PARA FAQs FIN ///////////////////// 
