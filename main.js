document.addEventListener("DOMContentLoaded", () => {
  // Inicializar barra superior dinámica
  initTopInfoBar();
  
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
  });

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // Services horizontal scroll
  const section = document.querySelector("#services");
  if (!section) {
    console.log("⚠️ No se encontró la sección #services");
    return;
  }

  const track = section.querySelector(".services-track");
  const slides = section.querySelectorAll(".service-card");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentIndex = 0;
  let isScrolling = false;

  // Función para actualizar el estado de los botones
  function updateNavButtons() {
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex === slides.length - 1;
    }
  }

  // Función para navegar a un slide específico
  function goToSlide(index) {
    if (isScrolling || index < 0 || index >= slides.length) return;
    
    isScrolling = true;
    currentIndex = index;
    
    const offset = slides[currentIndex].offsetLeft;
    console.log("🎯 Navegando a slide:", currentIndex, "offset:", offset);
    
    track.scrollTo({ left: offset, behavior: "smooth" });
    updateNavButtons();
    
    setTimeout(() => {
      isScrolling = false;
      console.log("✅ Navegación completada");
    }, 600);
  }

  // Event listeners para los botones
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentIndex < slides.length - 1) {
        goToSlide(currentIndex + 1);
      }
    });
  }

  // Soporte táctil (swipe) para dispositivos móviles
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let isDragging = false;
  const minSwipeDistance = 50; // Distancia mínima para considerar un swipe
  const maxVerticalDistance = 100; // Máxima distancia vertical para considerar swipe horizontal

  // Event listeners para touch
  track.addEventListener('touchstart', (e) => {
    if (isScrolling) return;
    
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging || isScrolling) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = Math.abs(currentX - startX);
    const deltaY = Math.abs(currentY - startY);
    
    // Solo prevenir scroll si el movimiento horizontal es claramente mayor que el vertical
    if (deltaX > deltaY && deltaX > 20) {
      e.preventDefault();
    }
  }, { passive: false });

  track.addEventListener('touchend', (e) => {
    if (!isDragging || isScrolling) return;
    
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    
    const deltaX = endX - startX;
    const deltaY = Math.abs(endY - startY);
    
    // Procesar swipe horizontal si es significativo
    // Corregido: usar Math.abs(deltaX) > Math.abs(deltaY) para detectar movimiento horizontal
    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        // Swipe right - ir al slide anterior
        console.log('👆 Swipe derecha detectado, navegando al slide anterior');
        if (currentIndex > 0) {
          goToSlide(currentIndex - 1);
        }
      } else {
        // Swipe left - ir al slide siguiente
        console.log('👆 Swipe izquierda detectado, navegando al slide siguiente');
        if (currentIndex < slides.length - 1) {
          goToSlide(currentIndex + 1);
        }
      }
    }
    
    isDragging = false;
  });

  // Soporte para mouse drag solo en dispositivos móviles/tablets
  let mouseStartX = 0;
  let mouseStartY = 0;
  let isMouseDragging = false;
  
  // Detectar si es un dispositivo táctil
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Solo agregar soporte de mouse drag en dispositivos táctiles
  if (isTouchDevice) {
    track.addEventListener('mousedown', (e) => {
      if (isScrolling) return;
      
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
      isMouseDragging = true;
      
      e.preventDefault();
    });

    track.addEventListener('mousemove', (e) => {
      if (!isMouseDragging || isScrolling) return;
      
      e.preventDefault();
    });

    track.addEventListener('mouseup', (e) => {
      if (!isMouseDragging || isScrolling) return;
      
      const deltaX = e.clientX - mouseStartX;
      const deltaY = Math.abs(e.clientY - mouseStartY);
      
      // Corregido: verificar que el movimiento horizontal sea mayor que el vertical
      if (deltaY < maxVerticalDistance && Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > deltaY) {
        if (deltaX > 0) {
          // Drag right - ir al slide anterior
          console.log('🖱️ Drag derecha detectado, navegando al slide anterior');
          if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
          }
        } else {
          // Drag left - ir al slide siguiente
          console.log('🖱️ Drag izquierda detectado, navegando al slide siguiente');
          if (currentIndex < slides.length - 1) {
            goToSlide(currentIndex + 1);
          }
        }
      }
      
      isMouseDragging = false;
    });
  }

  // Prevenir selección de texto durante el drag (solo en dispositivos táctiles)
  if (isTouchDevice) {
    track.addEventListener('selectstart', (e) => {
      if (isDragging || isMouseDragging) {
        e.preventDefault();
      }
    });
  }

  // Inicializar estado de los botones
  updateNavButtons();

  window.addEventListener("wheel", (evt) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    const inView =
      scrollY + windowHeight > sectionTop && scrollY < sectionBottom;

    console.log("📌 Scroll detectado");
    console.log("   scrollY:", scrollY, "windowHeight:", windowHeight);
    console.log("   sectionTop:", sectionTop, "sectionBottom:", sectionBottom);
    console.log("   inView:", inView, "currentIndex:", currentIndex);

    if (inView && !isScrolling) {
      evt.preventDefault();
      isScrolling = true;

      if (evt.deltaY > 0 && currentIndex < slides.length - 1) {
        currentIndex++;
        console.log("➡️ Avanzando a slide:", currentIndex);
      } else if (evt.deltaY < 0 && currentIndex > 0) {
        currentIndex--;
        console.log("⬅️ Retrocediendo a slide:", currentIndex);
      } else {
        console.log("⏹ No hay más slides en esa dirección");
      }

      const offset = slides[currentIndex].offsetLeft;
      console.log("   Haciendo scrollLeft hasta:", offset);

      track.scrollTo({ left: offset, behavior: "smooth" });
      updateNavButtons();

      setTimeout(() => {
        isScrolling = false;
        console.log("✅ Scroll listo, se puede volver a mover");
      }, 600);
    }
  }, { passive: false });

  // Células orgánicas flotantes interactivas
  initFloatingBubbles();
  
  // Partículas flotantes para la sección About
  initAboutParticles();
  
  // Efecto parallax para la sección About
  initAboutParallax();
  
  // Interacciones con cards flotantes
  initFloatingCardsInteraction();
});

// Sistema de células orgánicas flotantes interactivas
function initFloatingBubbles() {
  console.log('🧬 Iniciando células orgánicas...');
  
  const canvas = document.getElementById('floating-bubbles');
  if (!canvas) {
    console.log('❌ Canvas no encontrado');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  let cells = [];
  let mouse = { x: 0, y: 0 };
  let smoothMouse = { x: 0, y: 0 }; // Mouse suavizado para interpolación
  let animationId;
  let skinBounds = { top: 0, left: 0, right: 0, bottom: 0 }; // Límites de la zona rosada

  // Configuración mejorada
  const config = {
    cellCount: getCellCount(),  // ← CANTIDAD: Dinámica según tamaño de pantalla
    colors: [
      'rgba(196, 48, 139, 0.6)',   // Rosa principal
      'rgba(255, 102, 196, 0.5)',  // Rosa claro
      'rgba(250, 210, 235, 0.4)',  // Rosa pastel
      'rgba(221, 160, 221, 0.5)',  // Lila suave
      'rgba(255, 255, 255, 0.3)',  // Blanco translúcido
      'rgba(245, 245, 220, 0.4)',  // Beige suave
      'rgba(255, 182, 193, 0.5)',  // Rosa bebé
      'rgba(255, 192, 203, 0.4)'   // Rosa claro
    ],
    mouseInfluence: 0.6,  // ← FUERZA DE HUIDA: reducida para suavidad
    fleeDistance: 200,    // ← DISTANCIA: 100=cerca, 200=lejos
    mouseSmoothness: 0.15 // ← SUAVIDAD DEL MOUSE: 0.1=muy suave, 0.3=más rápido
  };

  // Función para determinar el número de células según el tamaño de pantalla
  function getCellCount() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      return 20; // Versión móvil: 20 células
    } else {
      return 35; // Versión escritorio: 35 células (mantener actual)
    }
  }

  // Clase simple para células
  class Cell {
    constructor() {
      // Asegurar que las células empiecen dentro del área rosada
      this.radius = 20 + Math.random() * 25;
      
      // Posición inicial dentro del área segura (usando skinBounds)
      const safeTop = skinBounds.top + this.radius;
      const safeBottom = skinBounds.bottom - this.radius;
      const safeLeft = this.radius;
      const safeRight = canvas.width - this.radius;
      
      this.x = safeLeft + Math.random() * (safeRight - safeLeft);
      this.y = safeTop + Math.random() * (safeBottom - safeTop);
      
      this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.phase = Math.random() * Math.PI * 2;
    }
    
    // Método para forzar que la célula esté dentro de los límites
    enforceBounds() {
      if (this.x < skinBounds.left + this.radius) {
        this.x = skinBounds.left + this.radius;
      }
      if (this.x > skinBounds.right - this.radius) {
        this.x = skinBounds.right - this.radius;
      }
      if (this.y < skinBounds.top + this.radius) {
        this.y = skinBounds.top + this.radius;
      }
      if (this.y > skinBounds.bottom - this.radius) {
        this.y = skinBounds.bottom - this.radius;
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.phase += 0.02;

      // Reacción al mouse - HUIR del cursor (SUAVE Y NATURAL)
      const dx = smoothMouse.x - this.x;
      const dy = smoothMouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < config.fleeDistance && distance > 0) {
        // Calcular fuerza de huida (más cerca = más fuerte)
        const fleeForce = (config.fleeDistance - distance) / config.fleeDistance;
        
        // Vector de huida (dirección opuesta al mouse)
        const fleeX = -dx / distance;
        const fleeY = -dy / distance;
        
        // Aplicar fuerza de huida SUAVE
        const fleeSpeed = fleeForce * config.mouseInfluence * 3; // Reducido para suavidad
        this.x += fleeX * fleeSpeed;
        this.y += fleeY * fleeSpeed;
        
        // Aumentar velocidad de membrana cuando están asustadas (más sutil)
        this.phase += fleeForce * 0.1; // Reducido para suavidad
        
        // Debug: mostrar cuando una célula está huyendo (solo ocasionalmente)
        if (Math.random() < 0.005) {
          console.log('🏃‍♀️ Célula huyendo! Distancia:', Math.round(distance), 'Fuerza:', fleeForce.toFixed(2));
        }
      }

      // Movimiento natural suave cuando no hay mouse cerca
      if (distance > config.fleeDistance) {
        this.x += (Math.random() - 0.5) * 0.1;
        this.y += (Math.random() - 0.5) * 0.1;
      }

      // Rebote estricto en bordes - mantener dentro del área rosada
      // Límites horizontales (izquierda y derecha)
      if (this.x < skinBounds.left + this.radius) {
        this.x = skinBounds.left + this.radius;
        this.vx = Math.abs(this.vx) * 0.7; // Rebote más fuerte
      }
      if (this.x > skinBounds.right - this.radius) {
        this.x = skinBounds.right - this.radius;
        this.vx = -Math.abs(this.vx) * 0.7;
      }
      
      // Límites verticales usando skinBounds - NO salir del área rosada
      // Borde superior - evitar que suban al navbar
      if (this.y < skinBounds.top + this.radius) {
        this.y = skinBounds.top + this.radius;
        this.vy = Math.abs(this.vy) * 0.8; // Rebote suave hacia abajo
        // Solo mostrar mensaje ocasionalmente para evitar spam
        if (Math.random() < 0.005) console.log('🔄 Célula rebotando en borde superior');
      }
      
      // Borde inferior - mantener dentro del área rosada
      if (this.y > skinBounds.bottom - this.radius) {
        this.y = skinBounds.bottom - this.radius;
        this.vy = -Math.abs(this.vy) * 0.8; // Rebote suave hacia arriba
        // Solo mostrar mensaje ocasionalmente para evitar spam
        if (Math.random() < 0.005) console.log('🔄 Célula rebotando en borde inferior');
      }
      
      // Forzar límites como medida de seguridad adicional
      this.enforceBounds();
    }

    draw() {
      ctx.save();
      
      // Calcular distancia al mouse suavizado para efectos visuales
      const dx = smoothMouse.x - this.x;
      const dy = smoothMouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const isFleeing = distance < config.fleeDistance;
      
      // Membrana irregular (más agitada si está huyendo)
      ctx.beginPath();
      const points = 12;
      const wobbleIntensity = isFleeing ? 8 : 5; // Más agitada cuando huye
      
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const wobble = Math.sin(this.phase + angle * 2) * wobbleIntensity;
        const radius = this.radius + wobble;
        const x = this.x + Math.cos(angle) * radius;
        const y = this.y + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      // Gradiente (más intenso si está huyendo)
      const gradient = ctx.createRadialGradient(
        this.x - 10, this.y - 10, 0,
        this.x, this.y, this.radius
      );
      
      if (isFleeing) {
        // Efecto más brillante cuando está asustada
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(0.8, this.color);
        gradient.addColorStop(1, this.color.replace(/[\d.]+\)/, '0.3)'));
      } else {
        // Efecto normal
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(0.7, this.color);
        gradient.addColorStop(1, this.color.replace(/[\d.]+\)/, '0.2)'));
      }

      ctx.fillStyle = gradient;
      ctx.fill();

      // Borde (más brillante si está huyendo)
      ctx.strokeStyle = isFleeing ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = isFleeing ? 1.5 : 1;
      ctx.stroke();
      
      // Efecto de resplandor cuando está huyendo
      if (isFleeing) {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      
      ctx.restore();
    }
  }

  // Event listeners para interacción con el cursor
  function setupEventListeners() {
    console.log('🎯 Configurando eventos de mouse...');
    
    // Mouse move - actualizar posición del cursor
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    // Mouse leave - resetear posición
    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
      console.log('🚪 Mouse salió del canvas');
    });

    // Mouse enter - para debug
    canvas.addEventListener('mouseenter', () => {
      console.log('🚪 Mouse entró al canvas');
    });

    // También agregar eventos a la sección hero por si el canvas no captura bien
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
    }
    
    // Redimensionar canvas cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
      // Recalcular límites usando la función centralizada
      recalculateSkinBounds();
      
      // Recrear células si es necesario según el nuevo tamaño de pantalla
      recreateCells();
      
      // Ajustar células existentes si están fuera de los nuevos límites
      cells.forEach(cell => {
        // Límites horizontales
        if (cell.x < skinBounds.left + cell.radius) cell.x = skinBounds.left + cell.radius;
        if (cell.x > skinBounds.right - cell.radius) cell.x = skinBounds.right - cell.radius;
        
        // Límites verticales usando skinBounds
        if (cell.y < skinBounds.top + cell.radius) cell.y = skinBounds.top + cell.radius;
        if (cell.y > skinBounds.bottom - cell.radius) cell.y = skinBounds.bottom - cell.radius;
      });
      
      console.log('📏 Canvas redimensionado y células ajustadas');
    });
  }

  // Animación principal
  function animate() {
    // Suavizar el movimiento del mouse con interpolación
    smoothMouse.x += (mouse.x - smoothMouse.x) * config.mouseSmoothness;
    smoothMouse.y += (mouse.y - smoothMouse.y) * config.mouseSmoothness;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    cells.forEach(cell => {
      cell.update();
      cell.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Función para recalcular límites de la piel
  function recalculateSkinBounds() {
    const heroSection = document.querySelector('.hero');
    const heroRect = heroSection.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    
    // Redimensionar canvas
    canvas.width = canvasRect.width;
    canvas.height = canvasRect.height;
    
    // Calcular límites más precisos considerando el padding del hero
    // El canvas ahora empieza en top: 80px, así que ajustamos los márgenes
    const safeTopMargin = 20; // Margen superior reducido ya que el canvas empieza después del navbar
    const safeBottomMargin = 30; // Margen inferior para evitar el borde
    const safeSideMargin = 20; // Margen lateral aumentado
    
    skinBounds = {
      top: safeTopMargin, // Empezar un poco más abajo del borde superior del canvas
      left: safeSideMargin, // Margen lateral
      right: canvas.width - safeSideMargin, // Margen lateral
      bottom: canvas.height - safeBottomMargin // Margen inferior
    };
    
    console.log('📍 Límites recalculados:', skinBounds);
    console.log('📏 Canvas:', canvas.width, 'x', canvas.height);
    console.log('📏 Hero:', heroRect.width, 'x', heroRect.height);
    console.log('🛡️ Margen superior de seguridad:', safeTopMargin);
    
    return skinBounds;
  }

  // Función para recrear células cuando cambie el tamaño de pantalla
  function recreateCells() {
    const newCellCount = getCellCount();
    const currentCount = cells.length;
    
    console.log(`📱 Cambio de tamaño detectado. Células actuales: ${currentCount}, nuevas: ${newCellCount}`);
    
    if (newCellCount !== currentCount) {
      // Limpiar células existentes
      cells = [];
      
      // Crear nuevas células con la cantidad correcta
      for (let i = 0; i < newCellCount; i++) {
        cells.push(new Cell());
      }
      
      console.log(`✅ Células recreadas: ${cells.length} células`);
    }
  }

  // Inicializar
  function init() {
    console.log('🚀 Inicializando...');
    
    // Recalcular límites
    recalculateSkinBounds();
    
    // Inicializar mouse suavizado
    smoothMouse.x = canvas.width / 2;
    smoothMouse.y = canvas.height / 2;
    
    // Crear células
    cells = [];
    for (let i = 0; i < config.cellCount; i++) {
      cells.push(new Cell());
    }
    
    console.log('✅ Células creadas:', cells.length);
    
    // Configurar eventos
    setupEventListeners();
    
    // Iniciar animación
    animate();
    console.log('✅ Animación iniciada');
  }

  // Función para forzar recalibración (útil para debugging)
  window.recalibrateCells = function() {
    console.log('🔧 Recalibrando células manualmente...');
    recalculateSkinBounds();
    
    // Ajustar todas las células existentes
    cells.forEach(cell => {
      if (cell.x < skinBounds.left + cell.radius) cell.x = skinBounds.left + cell.radius;
      if (cell.x > skinBounds.right - cell.radius) cell.x = skinBounds.right - cell.radius;
      if (cell.y < skinBounds.top + cell.radius) cell.y = skinBounds.top + cell.radius;
      if (cell.y > skinBounds.bottom - cell.radius) cell.y = skinBounds.bottom - cell.radius;
    });
    
    console.log('✅ Recalibración completada');
  };

  // Iniciar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// Sistema de partículas flotantes para la sección About
function initAboutParticles() {
  console.log('✨ Iniciando partículas flotantes para About...');
  
  const canvas = document.getElementById('about-floating-particles');
  if (!canvas) {
    console.log('❌ Canvas de partículas About no encontrado');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: 0, y: 0 };
  let animationId;

  // Configuración de partículas suaves y elegantes para vitrina digital
  const config = {
    particleCount: 20,
    colors: [
      'rgba(255, 255, 255, 0.4)',   // Blanco translúcido
      'rgba(255, 102, 196, 0.2)',  // Rosa claro
      'rgba(196, 48, 139, 0.15)',  // Rosa principal
      'rgba(250, 210, 235, 0.25)',  // Rosa pastel
      'rgba(221, 160, 221, 0.2)',  // Lila suave
    ],
    mouseInfluence: 0.2,
    fleeDistance: 200,
  };

  // Clase para partículas suaves
  class Particle {
    constructor() {
      this.radius = 8 + Math.random() * 12;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.phase = Math.random() * Math.PI * 2;
      this.opacity = 0.2 + Math.random() * 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.phase += 0.01;

      // Reacción suave al mouse
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < config.fleeDistance && distance > 0) {
        const fleeForce = (config.fleeDistance - distance) / config.fleeDistance;
        const fleeX = -dx / distance;
        const fleeY = -dy / distance;
        
        this.x += fleeX * fleeForce * config.mouseInfluence;
        this.y += fleeY * fleeForce * config.mouseInfluence;
      }

      // Movimiento natural suave
      this.x += (Math.random() - 0.5) * 0.05;
      this.y += (Math.random() - 0.5) * 0.05;

      // Rebote suave en bordes
      if (this.x < this.radius) {
        this.x = this.radius;
        this.vx = Math.abs(this.vx) * 0.8;
      }
      if (this.x > canvas.width - this.radius) {
        this.x = canvas.width - this.radius;
        this.vx = -Math.abs(this.vx) * 0.8;
      }
      if (this.y < this.radius) {
        this.y = this.radius;
        this.vy = Math.abs(this.vy) * 0.8;
      }
      if (this.y > canvas.height - this.radius) {
        this.y = canvas.height - this.radius;
        this.vy = -Math.abs(this.vy) * 0.8;
      }
    }

    draw() {
      ctx.save();
      
      // Efecto de pulso suave
      const pulse = Math.sin(this.phase) * 0.1 + 1;
      const currentRadius = this.radius * pulse;
      
      // Gradiente suave
      const gradient = ctx.createRadialGradient(
        this.x - currentRadius * 0.3, this.y - currentRadius * 0.3, 0,
        this.x, this.y, currentRadius
      );
      
      gradient.addColorStop(0, this.color.replace(/[\d.]+\)/, '0.4)'));
      gradient.addColorStop(0.7, this.color);
      gradient.addColorStop(1, this.color.replace(/[\d.]+\)/, '0.1)'));

      ctx.fillStyle = gradient;
      ctx.globalAlpha = this.opacity;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Borde sutil
      ctx.strokeStyle = this.color.replace(/[\d.]+\)/, '0.3)');
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      ctx.restore();
    }
  }

  // Event listeners para interacción con el mouse
  function setupEventListeners() {
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    window.addEventListener('resize', () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
  }

  // Animación principal
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Inicializar
  function init() {
    console.log('🚀 Inicializando partículas About...');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle());
    }
    
    setupEventListeners();
    animate();
    console.log('✅ Partículas About iniciadas');
  }

  // Iniciar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// Efecto parallax sutil para la sección About
function initAboutParallax() {
  console.log('🎭 Iniciando efecto parallax para About...');
  
  const aboutSection = document.querySelector('.about');
  const aboutText = document.querySelector('.about-text');
  const aboutImg = document.querySelector('.about-img');
  
  if (!aboutSection || !aboutText || !aboutImg) {
    console.log('❌ Elementos de parallax About no encontrados');
    return;
  }

  let ticking = false;

  function updateParallax() {
    const rect = aboutSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Solo aplicar parallax cuando la sección está visible
    if (rect.bottom >= 0 && rect.top <= windowHeight) {
      const scrolled = window.scrollY;
      const rate = scrolled * -0.1; // Velocidad sutil del parallax
      const rateImg = scrolled * 0.05; // Velocidad diferente para la imagen
      
      // Aplicar transformación sutil al texto
      aboutText.style.transform = `translateY(${rate}px)`;
      
      // Aplicar transformación sutil a la imagen (dirección opuesta)
      aboutImg.style.transform = `translateY(${rateImg}px)`;
    }
    
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Event listener para scroll
  window.addEventListener('scroll', requestTick, { passive: true });
  
  console.log('✅ Parallax About iniciado');
}

// Interacciones avanzadas con cards flotantes y efecto parallax 3D tipo Dropbox × McLaren
function initFloatingCardsInteraction() {
  console.log('🎯 Iniciando interacciones avanzadas con cards flotantes y parallax 3D...');
  
  const floatingCards = document.querySelectorAll('.floating-card');
  const centralDoctor = document.querySelector('.central-doctor');
  const aboutSection = document.querySelector('.about');
  
  if (!floatingCards.length || !centralDoctor || !aboutSection) {
    console.log('❌ Elementos no encontrados');
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let isMouseInside = false;
  let smoothMouseX = 0;
  let smoothMouseY = 0;

  // Tracking del mouse para efecto parallax suavizado
  aboutSection.addEventListener('mousemove', (e) => {
    const rect = aboutSection.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width;
    mouseY = (e.clientY - rect.top) / rect.height;
    isMouseInside = true;
    
    updateParallax3D();
  });

  aboutSection.addEventListener('mouseleave', () => {
    isMouseInside = false;
    resetParallax3D();
  });

  function updateParallax3D() {
    if (!isMouseInside) return;

    // Suavizar el movimiento del mouse
    smoothMouseX += (mouseX - smoothMouseX) * 0.1;
    smoothMouseY += (mouseY - smoothMouseY) * 0.1;

    // Calcular desplazamiento basado en la posición del mouse suavizada
    const moveX = (smoothMouseX - 0.5) * 30; // -15px a +15px
    const moveY = (smoothMouseY - 0.5) * 30; // -15px a +15px
    
    // Aplicar efecto parallax a cada card con intensidad y dirección diferentes
    floatingCards.forEach((card, index) => {
      const intensity = (index + 1) * 0.4; // Intensidad variable por card
      const cardMoveX = moveX * intensity;
      const cardMoveY = moveY * intensity;
      
      // Rotación sutil basada en la posición del mouse
      const rotateX = moveY * 0.3;
      const rotateY = moveX * 0.3;
      
      // Aplicar transformación 3D con perspectiva
      card.style.transform = `
        translateX(${cardMoveX}px) 
        translateY(${cardMoveY}px) 
        translateZ(${8 + index * 3}px)
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
        scale(${1 + (intensity * 0.02)})
      `;
    });

    // La doctora central permanece completamente estática - sin parallax
  }

  function resetParallax3D() {
    floatingCards.forEach((card) => {
      card.style.transform = '';
    });
    // La doctora central mantiene su posición estática
    smoothMouseX = 0.5;
    smoothMouseY = 0.5;
  }

  // Efecto de hover mejorado en cada card con animación suave
  floatingCards.forEach((card, index) => {
    let isHovered = false;
    
    card.addEventListener('mouseenter', () => {
      isHovered = true;
      card.style.animationPlayState = 'paused';
      card.style.transform += ' translateY(-12px) scale(1.05) translateZ(10px)';
      card.style.boxShadow = `
        0 25px 50px rgba(0, 0, 0, 0.15),
        0 10px 20px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.9),
        0 0 40px rgba(255, 102, 196, 0.2)
      `;
      card.style.background = 'rgba(255, 255, 255, 0.98)';
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      card.style.animationPlayState = 'running';
      card.style.boxShadow = '';
      card.style.background = '';
      // Mantener el efecto parallax si el mouse está dentro
      if (isMouseInside) {
        updateParallax3D();
      } else {
        card.style.transform = '';
      }
    });

    // Efecto de click con feedback visual y ripple
    card.addEventListener('click', (e) => {
      // Crear efecto ripple
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 102, 196, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin-left: -10px;
        margin-top: -10px;
      `;
      
      card.style.position = 'relative';
      card.appendChild(ripple);
      
      // Feedback visual temporal
      const originalTransform = card.style.transform;
      card.style.transform += ' translateY(-6px) scale(1.02)';
      
      setTimeout(() => {
        ripple.remove();
        // Restaurar transformación original o aplicar parallax
        if (isMouseInside && !isHovered) {
          updateParallax3D();
        } else if (!isHovered) {
          card.style.transform = originalTransform;
        }
      }, 300);
    });
  });

  // Sin efectos de hover en la doctora central - imagen completamente estática

  // Añadir estilos CSS para la animación ripple
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  console.log('✅ Interacciones avanzadas con cards y parallax 3D iniciadas');
}

// Sistema de barra superior dinámica con información contextual
function initTopInfoBar() {
  console.log('🌅 Iniciando barra superior dinámica...');
  
  const weatherElement = document.getElementById('weatherInfo');
  
  if (!weatherElement) {
    console.log('❌ Elemento del índice UV no encontrado');
    return;
  }

  // Función para actualizar la información
  function updateInfo() {
    // Actualizar índice UV desde la API
    updateUVIndex();
  }

  // Actualizar inmediatamente
  updateInfo();
  
  // Actualizar cada minuto
  const updateInterval = setInterval(updateInfo, 60000);
  
  // Limpiar intervalo cuando se cierre la página
  window.addEventListener('beforeunload', () => {
    clearInterval(updateInterval);
  });
  
  console.log('✅ Barra superior dinámica iniciada');
}

// Función para determinar categoría de riesgo (ámbito global)
function getRiskLevel(uvValue) {
  const uv = parseFloat(uvValue);
  
  // Redondear al entero más cercano antes de comparar
  const roundedUV = Math.round(uv);
  
  if (roundedUV >= 0 && roundedUV <= 2) return 'Bajo';
  else if (roundedUV >= 3 && roundedUV <= 5) return 'Moderado';
  else if (roundedUV >= 6 && roundedUV <= 7) return 'Alto';
  else if (roundedUV >= 8 && roundedUV <= 10) return 'Muy Alto';
  else if (roundedUV >= 11) return 'Extremo';
  else return 'Bajo'; // Default para valores inválidos
}

// Ejecutar al cargar la página
window.addEventListener('load', updateUVIndex);

// Función optimizada para obtener el índice UV con cache local
async function updateUVIndex() {
  const apiKey = '6667fcadcae70063da98e04f014392a6';
  const lat = 14.6349;
  const lon = -90.5069;
  const cacheKey = 'uvValue';
  const cacheTimeKey = 'uvTimestamp';
  const now = Date.now();
  const threeHours = 3 * 60 * 60 * 1000; // 3 horas en milisegundos

  // Función para obtener el color según el nivel de riesgo
  function getRiskColor(riskLevel) {
    switch (riskLevel) {
      case 'Bajo': return '#4CAF50';      // Verde
      case 'Moderado': return '#FF9800';  // Naranja
      case 'Alto': return '#FF5722';      // Rojo claro
      case 'Muy Alto': return '#E91E63';  // Rosa intenso
      case 'Extremo': return '#9C27B0';   // Morado
      default: return '#c4308b';          // Color por defecto (rosa original)
    }
  }

  // Revisar si hay cache válido
  const cachedValue = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(cacheTimeKey);

  if (cachedValue && cachedTime && now - parseInt(cachedTime) < threeHours) {
    const weatherElement = document.getElementById('weatherInfo');
    if (weatherElement) {
      const riskLevel = getRiskLevel(cachedValue);
      const riskColor = getRiskColor(riskLevel);
      // Detectar si es escritorio o móvil
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        weatherElement.innerHTML = `
          Índice UV: <span style="color: ${riskColor}">${cachedValue} ${riskLevel}</span>
        `;
      } else {
        weatherElement.innerHTML = `
          <span style="color: ${riskColor}">${cachedValue} ${riskLevel}</span>
        `;
      }
    }
    console.log(`🌞 Usando valor UV del cache: ${cachedValue} (${getRiskLevel(cachedValue)})`);
    return;
  }

  // Si no hay cache o ya expiró, hacer fetch a la API
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    
    // Verificar si la respuesta es exitosa (status 200)
    if (response.ok) {
      const data = await response.json();
      const uv = data.current?.uvi;

      const weatherElement = document.getElementById('weatherInfo');
      if (weatherElement) {
        // Mostrar el valor real del campo uvi, incluyendo 0.0 si es de noche
        const uvValue = uv !== undefined && uv !== null ? uv.toFixed(1) : '0';
        const riskLevel = getRiskLevel(uvValue);
        const riskColor = getRiskColor(riskLevel);
        // Detectar si es escritorio o móvil
        const isDesktop = window.innerWidth >= 1024;
        if (isDesktop) {
          weatherElement.innerHTML = `
            Índice UV: <span style="color: ${riskColor}">${uvValue} ${riskLevel}</span>
          `;
        } else {
          weatherElement.innerHTML = `
            <span style="color: ${riskColor}">${uvValue} ${riskLevel}</span>
          `;
        }
        
        // Guardar en cache el valor obtenido (incluyendo 0.0)
        localStorage.setItem(cacheKey, uvValue);
        localStorage.setItem(cacheTimeKey, now.toString());
        console.log(`🌞 Nuevo valor UV obtenido y guardado en cache: ${uvValue} (${riskLevel})`);
      }
    } else {
      // Si la respuesta no es exitosa, mostrar "NA"
      throw new Error(`Error de API: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error al obtener el índice UV:', error);
    const weatherElement = document.getElementById('weatherInfo');
    if (weatherElement) {
      // Detectar si es escritorio o móvil
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        weatherElement.innerHTML = `
          Índice UV: <span style="color: #c4308b">No disponible</span>
        `;
      } else {
        weatherElement.innerHTML = `
          <span style="color: #c4308b">No disponible</span>
        `;
      }
    }
  }
}

// Función de utilidad para limpiar el cache del índice UV (útil para debugging)
function clearUVCache() {
  localStorage.removeItem('uvValue');
  localStorage.removeItem('uvTimestamp');
  console.log('🗑️ Cache del índice UV limpiado');
}

// Función de utilidad para verificar el estado del cache
function checkUVCache() {
  const cachedValue = localStorage.getItem('uvValue');
  const cachedTime = localStorage.getItem('uvTimestamp');
  const now = Date.now();
  const threeHours = 3 * 60 * 60 * 1000;
  
  if (cachedValue && cachedTime) {
    const age = now - parseInt(cachedTime);
    const isValid = age < threeHours;
    const ageHours = (age / (60 * 60 * 1000)).toFixed(1);
    
    console.log(`📊 Estado del cache UV:`);
    console.log(`   Valor: ${cachedValue}`);
    console.log(`   Edad: ${ageHours} horas`);
    console.log(`   Válido: ${isValid ? 'Sí' : 'No'}`);
    
    return { value: cachedValue, age: age, isValid: isValid };
  } else {
    console.log('📊 No hay cache del índice UV');
    return null;
  }
}

// Función de utilidad para probar la lógica del índice UV
function testUVLogic() {
  console.log('🧪 Probando lógica del índice UV:');
  
  const testValues = [
    { value: 0, expected: 'Bajo' },
    { value: 1.5, expected: 'Bajo' }, // 1.5 → 2 → Bajo
    { value: 2.2, expected: 'Bajo' }, // 2.2 → 2 → Bajo
    { value: 2.9, expected: 'Moderado' }, // 2.9 → 3 → Moderado
    { value: 3, expected: 'Moderado' },
    { value: 4.2, expected: 'Moderado' }, // 4.2 → 4 → Moderado
    { value: 5.6, expected: 'Alto' }, // 5.6 → 6 → Alto
    { value: 6, expected: 'Alto' },
    { value: 7.5, expected: 'Muy Alto' }, // 7.5 → 8 → Muy Alto
    { value: 7.9, expected: 'Muy Alto' }, // 7.9 → 8 → Muy Alto
    { value: 8, expected: 'Muy Alto' },
    { value: 9.3, expected: 'Muy Alto' }, // 9.3 → 9 → Muy Alto
    { value: 10.4, expected: 'Muy Alto' }, // 10.4 → 10 → Muy Alto
    { value: 11, expected: 'Extremo' },
    { value: 15.7, expected: 'Extremo' } // 15.7 → 16 → Extremo
  ];
  
  testValues.forEach(test => {
    const result = getRiskLevel(test.value.toString());
    const color = getRiskColor(result);
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.value} → ${result} (esperado: ${test.expected}) [${color}]`);
  });
}

// Función específica para probar los casos decimales mencionados
function testDecimalCases() {
  console.log('🔍 Probando casos decimales específicos:');
  
  const decimalCases = [
    { value: 2.2, expected: 'Bajo' },    // 2.2 → 2 → Bajo
    { value: 5.6, expected: 'Alto' },    // 5.6 → 6 → Alto
    { value: 7.5, expected: 'Muy Alto' }, // 7.5 → 8 → Muy Alto
    { value: 10.4, expected: 'Muy Alto' } // 10.4 → 10 → Muy Alto
  ];
  
  decimalCases.forEach(test => {
    const result = getRiskLevel(test.value.toString());
    const status = result === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.value} → ${result} (esperado: ${test.expected})`);
  });
}

// Hacer las funciones de utilidad disponibles globalmente para debugging
window.clearUVCache = clearUVCache;
window.checkUVCache = checkUVCache;
window.testUVLogic = testUVLogic;
window.testDecimalCases = testDecimalCases;

// ===== DECORATIVE SCROLL GAUGE =====

// Función para inicializar el gauge decorativo basado en scroll
function initMiniUVGauge() {
  console.log('🌡️ Iniciando gauge decorativo basado en scroll...');
  
  const miniGauge = document.getElementById('miniUvGauge');
  const miniNeedle = document.getElementById('miniGaugeNeedle');
  
  if (!miniGauge || !miniNeedle) {
    console.log('❌ Elementos del gauge decorativo no encontrados');
    return;
  }

  // Mostrar el gauge con animación
  setTimeout(() => {
    miniGauge.classList.add('visible');
  }, 500);

  // Función para actualizar el gauge basado en scroll
  function updateGaugeByScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollTop / documentHeight, 1);
    
    // Calcular rotación de la aguja basada en scroll
    // Rango: -90° (izquierda) a +90° (derecha)
    // Scroll 0% = -90°, Scroll 100% = +90°
    const rotation = -90 + (scrollProgress * 180);
    
    // Aplicar rotación con animación suave
    miniNeedle.style.transform = `rotate(${rotation}deg)`;
    
    console.log(`🎯 Gauge decorativo rotado a ${rotation.toFixed(1)}° (scroll: ${(scrollProgress * 100).toFixed(1)}%)`);
  }

  // Función optimizada para scroll con throttling
  let scrollTimeout;
  function handleScroll() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(() => {
      updateGaugeByScroll();
    }, 16); // ~60fps
  }

  // Inicializar gauge en posición inicial (izquierda)
  updateGaugeByScroll();

  // Event listener para scroll
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Actualizar gauge cuando cambie el tamaño de ventana
  window.addEventListener('resize', () => {
    updateGaugeByScroll();
  });

  console.log('✅ Gauge decorativo inicializado');
}

// Inicializar el mini gauge cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  // Pequeño delay para asegurar que todos los elementos estén cargados
  setTimeout(initMiniUVGauge, 1000);
  
  // Inicializar la animación interactiva de las tarjetas
  initAboutCardsAnimation();
  
  // Inicializar el visor de tarjetas para móvil
  initMobileCardViewer();
});

// ===== ANIMACIÓN INTERACTIVA DE TARJETAS =====
function initAboutCardsAnimation() {
  const aboutCards = document.querySelector('.about-cards');
  
  if (!aboutCards) {
    return;
  }

  let isExploded = false;
  let isMobileExpanded = false;
  let activeCard = null;

  // Función para alternar el estado de explosión (escritorio)
  function toggleExplosion() {
    isExploded = !isExploded;
    
    if (isExploded) {
      aboutCards.classList.add('exploded');
    } else {
      aboutCards.classList.remove('exploded');
    }
  }

  // Función para alternar el estado de expansión móvil
  function toggleMobileExpansion(clickedCard) {
    isMobileExpanded = !isMobileExpanded;
    
    if (isMobileExpanded) {
      aboutCards.classList.add('mobile-expanded');
      // Marcar la tarjeta clickeada como activa
      if (clickedCard) {
        activeCard = clickedCard;
        clickedCard.classList.add('active');
      }
    } else {
      aboutCards.classList.remove('mobile-expanded');
      // Remover la clase active de todas las tarjetas
      const allCards = aboutCards.querySelectorAll('.about-card--stack');
      allCards.forEach(card => card.classList.remove('active'));
      activeCard = null;
    }
  }

  // Event listener para clic en las tarjetas (solo escritorio)
  aboutCards.addEventListener('click', (e) => {
    // Solo procesar en escritorio para evitar conflictos con el visor móvil
    if (window.innerWidth < 1024) {
      return; // Dejar que el visor móvil maneje los eventos
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const clickedCard = e.target.closest('.about-card--stack');
    
    // Solo comportamiento de escritorio
    if (window.innerWidth >= 1024) {
      toggleExplosion();
    }
  });

  // Event listener para clic en área vacía (para volver al estado original)
  document.addEventListener('click', (e) => {
    // Solo si las tarjetas están en estado expandido y se hace clic fuera de ellas
    if ((isExploded || isMobileExpanded) && !aboutCards.contains(e.target)) {
      if (window.innerWidth >= 1024 && isExploded) {
        aboutCards.classList.remove('exploded');
        isExploded = false;
      } else if (window.innerWidth <= 767 && isMobileExpanded) {
        aboutCards.classList.remove('mobile-expanded');
        const allCards = aboutCards.querySelectorAll('.about-card--stack');
        allCards.forEach(card => card.classList.remove('active'));
        isMobileExpanded = false;
        activeCard = null;
      }
    }
  });

  // Event listener para redimensionamiento de ventana
  window.addEventListener('resize', () => {
    // Si se cambia de escritorio a móvil/tablet
    if (window.innerWidth < 1024 && isExploded) {
      aboutCards.classList.remove('exploded');
      isExploded = false;
    }
    
    // Si se cambia de móvil a escritorio/tablet
    if (window.innerWidth >= 768 && isMobileExpanded) {
      aboutCards.classList.remove('mobile-expanded');
      const allCards = aboutCards.querySelectorAll('.about-card--stack');
      allCards.forEach(card => card.classList.remove('active'));
      isMobileExpanded = false;
      activeCard = null;
    }
  });
}

// ===== VISOR DE TARJETAS PARA MÓVIL =====
function initMobileCardViewer() {
  console.log('📱 Iniciando visor de tarjetas para móvil...');
  
  // Verificar si estamos en móvil
  const isMobile = window.innerWidth <= 768;
  console.log(`📱 Ancho de ventana: ${window.innerWidth}px, es móvil: ${isMobile}`);
  
  // Solo funcionar en móviles (max-width: 768px)
  if (!isMobile) {
    console.log('💻 Dispositivo no móvil detectado, visor deshabilitado');
    return;
  }

  const aboutCards = document.querySelector('.about-cards');
  const cardViewer = document.getElementById('cardViewer');
  const closeViewer = document.getElementById('closeViewer');
  const viewerTrack = document.getElementById('viewerTrack');
  const viewerIndicators = document.getElementById('viewerIndicators');

  if (!aboutCards || !cardViewer || !closeViewer || !viewerTrack || !viewerIndicators) {
    console.log('❌ Elementos del visor no encontrados');
    return;
  }

  let currentCardIndex = 0;
  let isViewerOpen = false;
  let isTransitioning = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let isDragging = false;
  let dragThreshold = 50; // Distancia mínima para considerar swipe

  // Obtener todas las tarjetas originales
  const originalCards = aboutCards.querySelectorAll('.about-card--stack');
  const totalCards = originalCards.length;

  // Crear clones de las tarjetas para el visor
  function createViewerCards() {
    viewerTrack.innerHTML = '';
    viewerIndicators.innerHTML = '';

    originalCards.forEach((card, index) => {
      // Clonar la tarjeta
      const clonedCard = card.cloneNode(true);
      clonedCard.classList.remove('about-card--1', 'about-card--2', 'about-card--3', 'about-card--4');
      clonedCard.classList.add('viewer-card');
      
      if (index === 0) {
        clonedCard.classList.add('active');
      }
      
      viewerTrack.appendChild(clonedCard);

      // Crear indicador
      const indicator = document.createElement('div');
      indicator.classList.add('viewer-indicator');
      if (index === 0) {
        indicator.classList.add('active');
      }
      indicator.addEventListener('click', () => goToCard(index));
      viewerIndicators.appendChild(indicator);
    });
  }

  // Navegar a una tarjeta específica
  function goToCard(index) {
    if (isTransitioning || index < 0 || index >= totalCards) return;

    isTransitioning = true;
    currentCardIndex = index;

    // Actualizar posición del track
    const translateX = -index * 100;
    viewerTrack.style.transform = `translateX(${translateX}%)`;

    // Actualizar clases activas
    const cards = viewerTrack.querySelectorAll('.viewer-card');
    const indicators = viewerIndicators.querySelectorAll('.viewer-indicator');

    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });

    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });

    // Resetear transición
    setTimeout(() => {
      isTransitioning = false;
    }, 600);
  }

  // Navegar a la siguiente tarjeta
  function nextCard() {
    if (currentCardIndex < totalCards - 1) {
      goToCard(currentCardIndex + 1);
    }
  }

  // Navegar a la tarjeta anterior
  function prevCard() {
    if (currentCardIndex > 0) {
      goToCard(currentCardIndex - 1);
    }
  }

  // Abrir el visor
  function openViewer(clickedCardIndex = 0) {
    if (isViewerOpen) return;

    console.log('🔍 Abriendo visor de tarjetas...');
    
    isViewerOpen = true;
    currentCardIndex = clickedCardIndex;
    
    // Crear las tarjetas del visor
    createViewerCards();
    
    // Ir a la tarjeta clickeada
    goToCard(clickedCardIndex);
    
    // Mostrar el visor
    cardViewer.classList.add('active');
    document.body.classList.add('viewer-open');
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }

  // Cerrar el visor
  function closeViewerFunc() {
    if (!isViewerOpen) return;

    console.log('❌ Cerrando visor de tarjetas...');
    
    isViewerOpen = false;
    cardViewer.classList.remove('active');
    document.body.classList.remove('viewer-open');
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }

  // Función para manejar la interacción con las tarjetas
  function handleCardInteraction(e, index) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    
    // Solo abrir el visor en móviles
    if (window.innerWidth <= 768) {
      console.log(`🎯 Tarjeta ${index} tocada en móvil`);
      openViewer(index);
    }
  }

  // Event listeners para las tarjetas originales
  originalCards.forEach((card, index) => {
    // Agregar múltiples tipos de eventos para mejor compatibilidad
    card.addEventListener('click', (e) => handleCardInteraction(e, index), { passive: false });
    card.addEventListener('touchend', (e) => handleCardInteraction(e, index), { passive: false });
    
    // Prevenir el comportamiento por defecto en touchstart
    card.addEventListener('touchstart', (e) => {
      e.preventDefault();
    }, { passive: false });
  });

  // Event listener para el botón de cierre
  closeViewer.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeViewerFunc();
  });

  // Event listener para cerrar con clic en el fondo
  cardViewer.addEventListener('click', (e) => {
    if (e.target === cardViewer) {
      closeViewerFunc();
    }
  });

  // Soporte táctil (swipe) para navegación
  function setupTouchEvents() {
    viewerTrack.addEventListener('touchstart', (e) => {
      if (isTransitioning) return;
      
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      
      // Remover transición suave durante el drag
      viewerTrack.classList.remove('smooth-transition');
    }, { passive: true });

    viewerTrack.addEventListener('touchmove', (e) => {
      if (!isDragging || isTransitioning) return;
      
      currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      const deltaY = Math.abs(e.touches[0].clientY - startY);
      
      // Solo procesar si el movimiento es más horizontal que vertical
      if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
        e.preventDefault();
        
        // Aplicar transformación en tiempo real
        const baseTranslate = -currentCardIndex * 100;
        const dragTranslate = (deltaX / window.innerWidth) * 100;
        viewerTrack.style.transform = `translateX(${baseTranslate + dragTranslate}%)`;
      }
    }, { passive: false });

    viewerTrack.addEventListener('touchend', (e) => {
      if (!isDragging || isTransitioning) return;
      
      const deltaX = currentX - startX;
      const deltaY = Math.abs(e.changedTouches[0].clientY - startY);
      
      // Restaurar transición suave
      viewerTrack.classList.add('smooth-transition');
      
      // Procesar swipe si es significativo
      if (Math.abs(deltaX) > dragThreshold && Math.abs(deltaX) > deltaY) {
        if (deltaX > 0) {
          // Swipe derecha - ir a tarjeta anterior
          prevCard();
        } else {
          // Swipe izquierda - ir a tarjeta siguiente
          nextCard();
        }
      } else {
        // Volver a la posición original
        goToCard(currentCardIndex);
      }
      
      isDragging = false;
    }, { passive: true });
  }

  // Soporte de teclado para accesibilidad
  function setupKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      if (!isViewerOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeViewerFunc();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevCard();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextCard();
          break;
      }
    });
  }

  // Event listener para redimensionamiento de ventana
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth <= 768;
    
    // Cerrar el visor si se cambia a escritorio
    if (!newIsMobile && isViewerOpen) {
      closeViewerFunc();
    }
    
    // Reinicializar si se cambia de escritorio a móvil
    if (newIsMobile && !isMobile) {
      console.log('📱 Cambio a móvil detectado, reinicializando visor...');
      // Reinicializar
      setTimeout(() => {
        initMobileCardViewer();
      }, 100);
    }
  });

  // Inicializar eventos
  setupTouchEvents();
  setupKeyboardEvents();

  console.log('✅ Visor de tarjetas móvil inicializado');
}

