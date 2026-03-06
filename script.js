/* ==========================================
   KeyCharm – Stylish Keychains | JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initGallery();
    initContactForm();
    initStatCounters();
    initClickEffect();
    initNavHighlight();
});

/* ======================================
   1. ANIMATED BACKGROUND CANVAS
   – Floating key shapes + particles
   ====================================== */
function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, mouse = { x: 0, y: 0 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Track mouse for parallax
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Particles
    const particles = [];
    const PARTICLE_COUNT = 50;

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() > 0.5 ? 43 : 270; // gold or purple
        }
        update() {
            // Mouse influence
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                this.x -= dx * 0.003;
                this.y -= dy * 0.003;
            }
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < -10 || this.x > width + 10 || this.y < -10 || this.y > height + 10) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 60%, 65%, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    // Floating key shapes
    const keys = [];
    const KEY_COUNT = 8;
    const keyEmojis = ['🔑', '🗝️', '✨', '💎', '⭐'];

    class FloatingKey {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 18 + 12;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.15 + 0.05;
            this.emoji = keyEmojis[Math.floor(Math.random() * keyEmojis.length)];
            this.parallaxFactor = Math.random() * 0.02 + 0.005;
        }
        update() {
            // Mouse parallax
            const px = (mouse.x - width / 2) * this.parallaxFactor;
            const py = (mouse.y - height / 2) * this.parallaxFactor;

            this.x += this.speedX + px * 0.05;
            this.y += this.speedY + py * 0.05;
            this.rotation += this.rotSpeed;

            if (this.x < -50) this.x = width + 50;
            if (this.x > width + 50) this.x = -50;
            if (this.y < -50) this.y = height + 50;
            if (this.y > height + 50) this.y = -50;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.emoji, 0, 0);
            ctx.restore();
        }
    }

    for (let i = 0; i < KEY_COUNT; i++) keys.push(new FloatingKey());

    // Connection lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(43, 50%, 60%, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        keys.forEach(k => { k.update(); k.draw(); });
        drawConnections();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ======================================
   2. NAVBAR SCROLL EFFECT
   ====================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 60);
        lastScroll = scrollY;
    });
}

/* ======================================
   3. MOBILE MENU
   ====================================== */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const links = document.getElementById('nav-links');

    btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        links.classList.toggle('open');
    });

    // Close when link is clicked
    links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('open');
            links.classList.remove('open');
        });
    });
}

/* ======================================
   4. SCROLL REVEAL (Intersection Observer)
   ====================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.product-card, .custom-card, .section-header, .about-content, .about-image, .contact-info, .contact-form, .gallery-item'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
}

/* ======================================
   5. HORIZONTAL SCROLL GALLERY
   ====================================== */
function initGallery() {
    const track = document.querySelector('.gallery-track');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    let scrollPos = 0;
    const scrollStep = 320;

    nextBtn.addEventListener('click', () => {
        const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
        scrollPos = Math.min(scrollPos + scrollStep, maxScroll);
        track.style.transform = `translateX(-${scrollPos}px)`;
    });

    prevBtn.addEventListener('click', () => {
        scrollPos = Math.max(scrollPos - scrollStep, 0);
        track.style.transform = `translateX(-${scrollPos}px)`;
    });

    // Drag to scroll
    let isDragging = false, startX, startScroll;

    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        startScroll = scrollPos;
        track.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = startX - e.pageX;
        const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
        scrollPos = Math.max(0, Math.min(startScroll + diff, maxScroll));
        track.style.transform = `translateX(-${scrollPos}px)`;
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            track.style.transition = '';
        }
    });

    // Touch support
    track.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX;
        startScroll = scrollPos;
        track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const diff = startX - e.touches[0].pageX;
        const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
        scrollPos = Math.max(0, Math.min(startScroll + diff, maxScroll));
        track.style.transform = `translateX(-${scrollPos}px)`;
    }, { passive: true });

    track.addEventListener('touchend', () => {
        isDragging = false;
        track.style.transition = '';
    });
}

/* ======================================
   6. CONTACT FORM
   ====================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('submit-btn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        btn.classList.add('loading');

        // Simulate send
        setTimeout(() => {
            btn.classList.remove('loading');
            btn.classList.add('success');
            form.reset();

            setTimeout(() => {
                btn.classList.remove('success');
            }, 2500);
        }, 1500);
    });
}

/* ======================================
   7. STAT COUNTER ANIMATION
   ====================================== */
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCount(stat, target);
                });
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateCount(el, target) {
    const duration = 2000;
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        el.textContent = current.toLocaleString() + (target >= 1000 ? '+' : '+');

        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

/* ======================================
   8. CLICK EFFECT – Floating Keys
   ====================================== */
function initClickEffect() {
    const container = document.getElementById('click-effects');
    const emojis = ['🔑', '🗝️', '✨', '💫', '⭐'];

    document.addEventListener('click', (e) => {
        for (let i = 0; i < 4; i++) {
            const key = document.createElement('span');
            key.className = 'click-key';
            key.textContent = emojis[Math.floor(Math.random() * emojis.length)];

            const angle = Math.random() * Math.PI * 2;
            const dist = 40 + Math.random() * 60;
            key.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
            key.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
            key.style.left = `${e.clientX}px`;
            key.style.top = `${e.clientY}px`;

            container.appendChild(key);
            key.addEventListener('animationend', () => key.remove());
        }
    });
}

/* ======================================
   9. ACTIVE NAV LINK HIGHLIGHT
   ====================================== */
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));
}
