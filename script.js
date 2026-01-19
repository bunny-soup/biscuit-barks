/* ==========================================
   BUNNY SOUP - Interactive JavaScript
   Y2K / 2000s Aesthetic Effects
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoadingScreen();
    initNavigation();
    initGalleryFilters();
    initLightbox();
    initCursorTrail();
    initVisitorCounter();
    initFormHandling();
    initFloatingElements();
    initSoundEffects();
    initHeaderGlitter();
    initMSPaintUI();
    initTerminalModal();
});

/* ==========================================
   LOADING SCREEN
   ========================================== */

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    const percentText = document.querySelector('.loading-percent');

    let progress = 0;
    const loadingMessages = [
        'LOADING BUNNY SOUP...',
        'INITIALIZING Y2K VIBES...',
        'APPLYING PINK FILTER...',
        'CHARGING NEON LIGHTS...',
        'ALMOST THERE...',
        'WELCOME!'
    ];

    const loadingTextEl = document.querySelector('.loading-text');
    let messageIndex = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        progressBar.style.width = progress + '%';
        percentText.textContent = Math.floor(progress) + '%';

        // Update loading message
        const newIndex = Math.floor((progress / 100) * (loadingMessages.length - 1));
        if (newIndex !== messageIndex) {
            messageIndex = newIndex;
            loadingTextEl.textContent = loadingMessages[messageIndex];
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Play entrance sound if available
                playSound('startup');
            }, 500);
        }
    }, 100);
}

/* ==========================================
   NAVIGATION
   ========================================== */

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const featuredBoxes = document.querySelectorAll('.featured-box');

    // Nav link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });

            // Play click sound
            playSound('click');

            // Scroll to top of content
            document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Featured boxes on home page
    featuredBoxes.forEach((box, index) => {
        box.addEventListener('click', function() {
            const targets = ['portfolio', 'events', 'shop'];
            const targetSection = targets[index];

            // Trigger nav link click
            const targetLink = document.querySelector(`[data-section="${targetSection}"]`);
            if (targetLink) targetLink.click();
        });
    });

    // Always start on home page
    navLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    const homeLink = document.querySelector('[data-section="home"]');
    const homeSection = document.getElementById('home');
    if (homeLink) homeLink.classList.add('active');
    if (homeSection) homeSection.classList.add('active');

    // Clear any hash in URL
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
}

/* ==========================================
   GALLERY FILTERS
   ========================================== */

function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });

            playSound('click');
        });
    });
}

/* ==========================================
   LIGHTBOX
   ========================================== */

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || 'Artwork';
            }

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* ==========================================
   CURSOR TRAIL EFFECT
   ========================================== */

function initCursorTrail() {
    const trail = document.getElementById('cursor-trail');
    const trailElements = [];
    const numTrails = 10;
    const colors = ['#ff00ff', '#00ffff', '#ff69b4', '#00ff00', '#ffff00', '#9900ff'];

    // Create trail elements
    for (let i = 0; i < numTrails; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
            position: fixed;
            width: ${20 - i}px;
            height: ${20 - i}px;
            background: ${colors[i % colors.length]};
            border-radius: 50%;
            pointer-events: none;
            opacity: ${1 - (i * 0.1)};
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease;
            z-index: 9998;
            box-shadow: 0 0 ${10 - i}px ${colors[i % colors.length]};
        `;
        trail.appendChild(el);
        trailElements.push({
            el: el,
            x: 0,
            y: 0
        });
    }

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate trail
    function animateTrail() {
        let x = mouseX;
        let y = mouseY;

        trailElements.forEach((trail, index) => {
            const nextX = x;
            const nextY = y;

            trail.el.style.left = trail.x + 'px';
            trail.el.style.top = trail.y + 'px';

            // Ease towards target
            trail.x += (nextX - trail.x) * (0.3 - index * 0.02);
            trail.y += (nextY - trail.y) * (0.3 - index * 0.02);

            x = trail.x;
            y = trail.y;
        });

        requestAnimationFrame(animateTrail);
    }

    animateTrail();

    // Click burst effect
    document.addEventListener('click', function(e) {
        createBurst(e.clientX, e.clientY);
    });
}

function createBurst(x, y) {
    const numParticles = 12;
    const colors = ['#ff00ff', '#00ffff', '#ff69b4', '#00ff00', '#ffff00'];
    const symbols = ['★', '♥', '✦', '✧', '☆', '♡', '✩', '❤'];

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        const angle = (i / numParticles) * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];

        particle.textContent = symbol;
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: ${color};
            font-size: 20px;
            pointer-events: none;
            z-index: 10001;
            text-shadow: 0 0 10px ${color};
        `;

        document.body.appendChild(particle);

        // Animate
        const startTime = Date.now();
        const duration = 1000;

        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                const distance = velocity * progress;
                const px = x + Math.cos(angle) * distance;
                const py = y + Math.sin(angle) * distance + (progress * progress * 100); // gravity

                particle.style.left = px + 'px';
                particle.style.top = py + 'px';
                particle.style.opacity = 1 - progress;
                particle.style.transform = `scale(${1 - progress * 0.5}) rotate(${progress * 360}deg)`;

                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }

        animate();
    }
}

/* ==========================================
   VISITOR COUNTER
   ========================================== */

function initVisitorCounter() {
    const counterDisplay = document.querySelector('.counter-display');

    // Get or initialize visitor count from localStorage
    let count = localStorage.getItem('bunny-soup-visitors') || 420;
    count = parseInt(count);

    // Increment count on new session
    if (!sessionStorage.getItem('bunny-soup-counted')) {
        count++;
        localStorage.setItem('bunny-soup-visitors', count);
        sessionStorage.setItem('bunny-soup-counted', 'true');
    }

    // Animate counter
    let displayCount = 0;
    const targetCount = count;
    const duration = 2000;
    const startTime = Date.now();

    function animateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        displayCount = Math.floor(easeProgress * targetCount);

        counterDisplay.textContent = String(displayCount).padStart(6, '0');

        if (progress < 1) {
            requestAnimationFrame(animateCounter);
        }
    }

    // Delay counter animation until page loads
    setTimeout(animateCounter, 1500);
}

/* ==========================================
   FORM HANDLING
   ========================================== */

function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Simple validation
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields!', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address!', 'error');
                return;
            }

            // Build mailto link and send email
            const recipient = 'bnnuysoup@gmail.com';
            const subject = encodeURIComponent(`[Bunny Soup] ${data.subject} - from ${data.name}`);
            const body = encodeURIComponent(
                `Name: ${data.name}\n` +
                `Email: ${data.email}\n` +
                `Subject: ${data.subject}\n\n` +
                `Message:\n${data.message}`
            );

            // Open email client
            window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

            showNotification('Opening your email client...', 'success');
            playSound('success');
            this.reset();
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#00ff00' : type === 'error' ? '#ff0066' : '#00ffff';

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 20px 30px;
        background: ${bgColor};
        color: ${type === 'success' ? '#000' : '#fff'};
        font-family: 'Press Start 2P', cursive;
        font-size: 12px;
        border: 3px outset ${bgColor};
        box-shadow: 0 0 20px ${bgColor};
        z-index: 10002;
        animation: slideIn 0.3s ease;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Remove after delay
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

/* ==========================================
   FLOATING ELEMENTS
   ========================================== */

function initFloatingElements() {
    const container = document.querySelector('.floating-stars');
    const symbols = ['★', '✦', '♥', '✧', '☆', '♡', '✩', '❤', '🐰', '💕', '✨'];
    const colors = ['#ff00ff', '#00ffff', '#ff69b4', '#00ff00', '#ffff00', '#9900ff'];

    // Create floating elements
    for (let i = 0; i < 20; i++) {
        const el = document.createElement('span');
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 10 + Math.random() * 20;
        const x = Math.random() * 100;
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * -20;

        el.textContent = symbol;
        el.style.cssText = `
            position: absolute;
            left: ${x}%;
            font-size: ${size}px;
            color: ${color};
            text-shadow: 0 0 10px ${color};
            animation: floatUp ${duration}s linear ${delay}s infinite;
            opacity: 0.5;
        `;

        container.appendChild(el);
    }

    // Add float animation if not exists
    if (!document.querySelector('#float-animation')) {
        const style = document.createElement('style');
        style.id = 'float-animation';
        style.textContent = `
            @keyframes floatUp {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.5;
                }
                90% {
                    opacity: 0.5;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ==========================================
   SOUND EFFECTS (Optional - muted by default)
   ========================================== */

const sounds = {
    click: null,
    open: null,
    close: null,
    startup: null,
    success: null
};

let soundEnabled = false;

function initSoundEffects() {
    // Create mute/unmute button
    const soundToggle = document.createElement('button');
    soundToggle.innerHTML = '🔇';
    soundToggle.title = 'Toggle Sound Effects';
    soundToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--win98-gray, #c0c0c0);
        border: 3px outset white;
        font-size: 24px;
        cursor: pointer;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    soundToggle.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        this.innerHTML = soundEnabled ? '🔊' : '🔇';
        if (soundEnabled) {
            playSound('click');
        }
    });

    document.body.appendChild(soundToggle);

    // Note: Add actual sound files for full effect
    // sounds.click = new Audio('sounds/click.mp3');
    // etc.
}

function playSound(soundName) {
    if (!soundEnabled || !sounds[soundName]) return;

    try {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play();
    } catch (e) {
        // Sound failed to play, ignore
    }
}

/* ==========================================
   KONAMI CODE EASTER EGG
   ========================================== */

(function initKonamiCode() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', function(e) {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        // Rainbow mode!
        document.body.style.animation = 'rainbow-bg 2s linear infinite';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow-bg {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        showNotification('🐰 BUNNY MODE ACTIVATED! 🐰', 'success');

        // Create bunny rain
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const bunny = document.createElement('div');
                bunny.textContent = '🐰';
                bunny.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * 100}%;
                    top: -50px;
                    font-size: ${20 + Math.random() * 30}px;
                    z-index: 10003;
                    pointer-events: none;
                    animation: bunnyFall ${3 + Math.random() * 2}s linear forwards;
                `;
                document.body.appendChild(bunny);

                setTimeout(() => bunny.remove(), 5000);
            }, i * 100);
        }

        // Add bunny fall animation
        const bunnyStyle = document.createElement('style');
        bunnyStyle.textContent = `
            @keyframes bunnyFall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                }
            }
        `;
        document.head.appendChild(bunnyStyle);

        // Disable after 10 seconds
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 10000);
    }
})();

/* ==========================================
   SHOPIFY BUY BUTTON INTEGRATION
   ========================================== */

// Placeholder for Shopify Buy Button SDK
// Replace with your actual Shopify store details

function initShopify() {
    /*
    To integrate Shopify Buy Button:

    1. Go to your Shopify admin panel
    2. Navigate to Sales Channels > Buy Button
    3. Create a Buy Button for your products or collection
    4. Copy the generated script code
    5. Paste it here or in the HTML

    Example:

    <script type="text/javascript">
    (function () {
        var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
        if (window.ShopifyBuy) {
            if (window.ShopifyBuy.UI) {
                ShopifyBuyInit();
            } else {
                loadScript();
            }
        } else {
            loadScript();
        }
        function loadScript() {
            var script = document.createElement('script');
            script.async = true;
            script.src = scriptURL;
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
            script.onload = ShopifyBuyInit;
        }
        function ShopifyBuyInit() {
            var client = ShopifyBuy.buildClient({
                domain: 'your-store.myshopify.com',
                storefrontAccessToken: 'your-storefront-access-token',
            });
            ShopifyBuy.UI.onReady(client).then(function (ui) {
                ui.createComponent('collection', {
                    id: 'your-collection-id',
                    node: document.getElementById('shopify-embed'),
                    // ... styling options
                });
            });
        }
    })();
    </script>
    */
}

/* ==========================================
   UTILITY: Debounce function
   ========================================== */

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ==========================================
   INITIALIZE ON SCROLL ANIMATIONS
   ========================================== */

(function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.gallery-item, .event-card, .blog-post, .shop-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Add animate-in styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
})();

/* ==========================================
   HEADER GLITTER EFFECT
   ========================================== */

function initHeaderGlitter() {
    const header = document.querySelector('.header');
    if (!header) return;

    // 8-bit pixel style symbols
    const glitterSymbols = ['★', '+', '·', '×', '▪', '◆', '♦', '■', '●', '♥'];
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff69b4', '#00ff00', '#ff6600', '#9900ff', '#ffffff'];

    function createGlitter() {
        const glitter = document.createElement('span');
        const symbol = glitterSymbols[Math.floor(Math.random() * glitterSymbols.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const x = Math.random() * 100;
        const size = 8 + Math.floor(Math.random() * 4) * 4; // Pixel-perfect sizes: 8, 12, 16, 20
        const duration = 2 + Math.random() * 3;

        glitter.textContent = symbol;
        glitter.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: -30px;
            font-family: 'Press Start 2P', monospace;
            font-size: ${size}px;
            color: ${color};
            text-shadow: 2px 2px 0 #000;
            pointer-events: none;
            z-index: 10;
            animation: glitterFall ${duration}s steps(20) forwards;
            image-rendering: pixelated;
        `;

        header.appendChild(glitter);

        setTimeout(() => glitter.remove(), duration * 1000);
    }

    // Add 8-bit style glitter fall animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitterFall {
            0% {
                transform: translateY(0) scale(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
                transform: scale(1);
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(250px) scale(0.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Create glitter particles continuously
    setInterval(createGlitter, 300);

    // Create initial burst
    for (let i = 0; i < 10; i++) {
        setTimeout(createGlitter, i * 150);
    }
}

/* ==========================================
   MS PAINT UI INTERACTIVITY
   ========================================== */

// Global paint state
const paintState = {
    currentTool: 'pencil',
    currentColor: '#ff00ff',
    brushSize: 3,
    isDrawing: false,
    lastX: 0,
    lastY: 0
};

function initMSPaintUI() {
    // Track mouse coordinates for status bar
    const coordsDisplay = document.querySelector('.status-coords');
    const mainContainer = document.querySelector('.main-container');

    if (coordsDisplay && mainContainer) {
        mainContainer.addEventListener('mousemove', function(e) {
            const rect = mainContainer.getBoundingClientRect();
            const x = Math.floor(e.clientX - rect.left);
            const y = Math.floor(e.clientY - rect.top);
            coordsDisplay.textContent = `Pos: ${x}, ${y}`;
        });
    }

    // Tool selection with tool type mapping
    const toolMap = {
        0: 'select',
        1: 'select',
        2: 'eraser',
        3: 'fill',
        4: 'picker',
        5: 'magnifier',
        6: 'pencil',
        7: 'brush',
        8: 'spray',
        9: 'text',
        10: 'line',
        11: 'curve',
        12: 'rectangle',
        13: 'ellipse'
    };

    const tools = document.querySelectorAll('.mspaint-tool');
    tools.forEach((tool, index) => {
        tool.addEventListener('click', function() {
            tools.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            paintState.currentTool = toolMap[index] || 'pencil';

            // Update cursor based on tool
            const canvas = document.getElementById('paint-canvas');
            if (canvas) {
                if (paintState.currentTool === 'eraser') {
                    canvas.style.cursor = 'cell';
                } else if (paintState.currentTool === 'fill') {
                    canvas.style.cursor = 'crosshair';
                } else if (paintState.currentTool === 'picker') {
                    canvas.style.cursor = 'crosshair';
                } else if (paintState.currentTool === 'text') {
                    canvas.style.cursor = 'text';
                } else {
                    canvas.style.cursor = 'crosshair';
                }
            }
        });
    });

    // Color palette selection
    const colors = document.querySelectorAll('.mspaint-color');

    colors.forEach(color => {
        color.addEventListener('click', function() {
            const selectedColor = this.style.background || this.style.backgroundColor;
            paintState.currentColor = selectedColor;

            // Update color indicator
            const indicator = document.querySelector('.mspaint-toolbar-container');
            if (indicator) {
                indicator.style.setProperty('--selected-color', selectedColor);
            }

            // Visual feedback
            colors.forEach(c => c.style.outline = 'none');
            this.style.outline = '2px solid white';
        });
    });

    // Menu item hover effects
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const menuName = this.textContent;
            if (menuName === 'Help') {
                alert('🐰 BUNNY SOUP HELP 🐰\n\nDraw on the banner!\n\nTools:\n• Pencil - Freehand drawing\n• Brush - Thick strokes\n• Spray - Airbrush effect\n• Eraser - Remove drawings\n• Shapes - Click & drag\n\nClick colors to change!\n\nPLUR! ★');
            } else if (menuName === 'Edit') {
                if (confirm('Clear the canvas?')) {
                    const canvas = document.getElementById('paint-canvas');
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        });
    });

    // Initialize the paint canvas
    initPaintCanvas();
}

/* ==========================================
   PAINT CANVAS FUNCTIONALITY
   ========================================== */

function initPaintCanvas() {
    const canvas = document.getElementById('paint-canvas');
    const canvasWrapper = document.querySelector('.canvas-wrapper');

    if (!canvas || !canvasWrapper) {
        console.log('Canvas or wrapper not found');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Set canvas size based on wrapper
    function resizeCanvas() {
        const rect = canvasWrapper.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Fill with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        console.log('Canvas initialized:', canvas.width, 'x', canvas.height);
    }

    // Initial setup and resize handler
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 250));

    // Drawing functions
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (canvas.width / rect.width),
            y: (e.clientY - rect.top) * (canvas.height / rect.height)
        };
    }

    function startDrawing(e) {
        e.preventDefault();
        if (paintState.currentTool === 'select' || paintState.currentTool === 'magnifier') return;

        paintState.isDrawing = true;
        const pos = getMousePos(e);
        paintState.lastX = pos.x;
        paintState.lastY = pos.y;

        // For shapes, store start position
        if (['rectangle', 'ellipse', 'line'].includes(paintState.currentTool)) {
            paintState.startX = paintState.lastX;
            paintState.startY = paintState.lastY;
        }

        // For fill tool
        if (paintState.currentTool === 'fill') {
            floodFill(Math.floor(paintState.lastX), Math.floor(paintState.lastY), paintState.currentColor);
            paintState.isDrawing = false;
        }

        // For text tool
        if (paintState.currentTool === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                ctx.font = '20px "Comic Sans MS", cursive';
                ctx.fillStyle = paintState.currentColor;
                ctx.fillText(text, paintState.lastX, paintState.lastY);
            }
            paintState.isDrawing = false;
        }
    }

    function draw(e) {
        if (!paintState.isDrawing) return;
        e.preventDefault();

        const pos = getMousePos(e);
        const x = pos.x;
        const y = pos.y;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        switch (paintState.currentTool) {
            case 'pencil':
                ctx.strokeStyle = paintState.currentColor;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(paintState.lastX, paintState.lastY);
                ctx.lineTo(x, y);
                ctx.stroke();
                break;

            case 'brush':
                ctx.strokeStyle = paintState.currentColor;
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(paintState.lastX, paintState.lastY);
                ctx.lineTo(x, y);
                ctx.stroke();
                break;

            case 'eraser':
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 20;
                ctx.beginPath();
                ctx.moveTo(paintState.lastX, paintState.lastY);
                ctx.lineTo(x, y);
                ctx.stroke();
                break;

            case 'spray':
                sprayPaint(x, y, 20, 50);
                break;
        }

        paintState.lastX = x;
        paintState.lastY = y;
    }

    function stopDrawing(e) {
        if (!paintState.isDrawing) return;

        let x = paintState.lastX;
        let y = paintState.lastY;

        if (e && e.clientX !== undefined) {
            const pos = getMousePos(e);
            x = pos.x;
            y = pos.y;
        }

        // Draw shapes on mouse up
        if (paintState.currentTool === 'rectangle') {
            ctx.strokeStyle = paintState.currentColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(
                paintState.startX,
                paintState.startY,
                x - paintState.startX,
                y - paintState.startY
            );
        } else if (paintState.currentTool === 'ellipse') {
            ctx.strokeStyle = paintState.currentColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            const radiusX = Math.abs(x - paintState.startX) / 2;
            const radiusY = Math.abs(y - paintState.startY) / 2;
            const centerX = paintState.startX + (x - paintState.startX) / 2;
            const centerY = paintState.startY + (y - paintState.startY) / 2;
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            ctx.stroke();
        } else if (paintState.currentTool === 'line') {
            ctx.strokeStyle = paintState.currentColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(paintState.startX, paintState.startY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        paintState.isDrawing = false;
    }

    function sprayPaint(x, y, radius, density) {
        ctx.fillStyle = paintState.currentColor;
        for (let i = 0; i < density; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * radius;
            const sprayX = x + r * Math.cos(angle);
            const sprayY = y + r * Math.sin(angle);
            ctx.fillRect(sprayX, sprayY, 1, 1);
        }
    }

    function floodFill(startX, startY, fillColor) {
        // Simple flood fill - fills connected area
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const startPos = (startY * canvas.width + startX) * 4;
        const startR = data[startPos];
        const startG = data[startPos + 1];
        const startB = data[startPos + 2];
        const startA = data[startPos + 3];

        // Parse fill color
        const tempDiv = document.createElement('div');
        tempDiv.style.color = fillColor;
        document.body.appendChild(tempDiv);
        const computedColor = getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);

        const rgb = computedColor.match(/\d+/g);
        const fillR = parseInt(rgb[0]);
        const fillG = parseInt(rgb[1]);
        const fillB = parseInt(rgb[2]);

        // Don't fill if same color
        if (startR === fillR && startG === fillG && startB === fillB) return;

        const stack = [[startX, startY]];
        const visited = new Set();

        while (stack.length > 0 && stack.length < 50000) {
            const [x, y] = stack.pop();
            const key = `${x},${y}`;

            if (visited.has(key)) continue;
            if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

            const pos = (y * canvas.width + x) * 4;

            if (data[pos] !== startR || data[pos + 1] !== startG ||
                data[pos + 2] !== startB || data[pos + 3] !== startA) continue;

            visited.add(key);

            data[pos] = fillR;
            data[pos + 1] = fillG;
            data[pos + 2] = fillB;
            data[pos + 3] = 255;

            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }

        ctx.putImageData(imageData, 0, 0);
    }

    // Simple stop for mouseout
    function stopDrawingSimple() {
        paintState.isDrawing = false;
    }

    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawingSimple);

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startDrawing({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => {} });
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        draw({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => {} });
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
            const touch = e.changedTouches[0];
            stopDrawing({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => {} });
        } else {
            stopDrawingSimple();
        }
    });

    console.log('Paint canvas initialized!');

    // Clear button - reset to white
    const clearBtn = document.getElementById('clear-canvas');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    }

    // Save button
    const saveBtn = document.getElementById('save-canvas');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'bunny-soup-art.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
}

/* ==========================================
   TERMINAL MODAL
   ========================================== */

function initTerminalModal() {
    const terminalModal = document.getElementById('terminal-modal');
    const tutorialLink = document.getElementById('kandi-tutorial-link');
    const terminalClose = document.querySelector('.terminal-close');

    console.log('Terminal modal init:', terminalModal, tutorialLink);

    if (tutorialLink) {
        tutorialLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Tutorial link clicked');
            if (terminalModal) {
                terminalModal.classList.add('active');
                console.log('Modal activated');
            }
        });
    }

    if (terminalClose) {
        terminalClose.addEventListener('click', function(e) {
            e.stopPropagation();
            if (terminalModal) {
                terminalModal.classList.remove('active');
            }
        });
    }

    // Close on clicking outside the window
    if (terminalModal) {
        terminalModal.addEventListener('click', function(e) {
            if (e.target === terminalModal) {
                terminalModal.classList.remove('active');
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && terminalModal && terminalModal.classList.contains('active')) {
            terminalModal.classList.remove('active');
        }
    });
}

console.log('%c🐰 BUNNY SOUP 🐰', 'color: #ff69b4; font-size: 30px; font-weight: bold; text-shadow: 2px 2px 0 #000;');
console.log('%cWelcome to the bunny hole! 💕', 'color: #ff00ff; font-size: 16px;');
console.log('%c~ Made in MS Paint 98 ~', 'color: #c0c0c0; font-size: 12px;');
