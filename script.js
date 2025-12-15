// Animated Background Canvas
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsl(${Math.random() * 60 + 160}, 100%, 50%)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
            this.speedX *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY *= -1;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.strokeStyle = `rgba(0, 255, 136, ${1 - distance / 120})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// Colorful Mouse Trail Effect (guarded) - don't break if `trailCanvas` is missing
const trailCanvas = document.getElementById('trailCanvas');
let trailCtx = null;
let trails = [];
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;

if (trailCanvas) {
    trailCtx = trailCanvas.getContext('2d');

    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    });

    class Trail {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.targetX = x;
            this.targetY = y;
            this.hue = Math.random() * 360;
            this.life = 1;
            this.decay = 0.015;
        }

        update(mouseX, mouseY) {
            this.targetX = mouseX;
            this.targetY = mouseY;
            this.x += (this.targetX - this.x) * 0.15;
            this.y += (this.targetY - this.y) * 0.15;
            this.life -= this.decay;
            this.hue += 2;
        }

        draw() {
            if (this.life <= 0) return;
            trailCtx.save();
            trailCtx.globalAlpha = this.life;
            trailCtx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
            trailCtx.lineWidth = 3;
            trailCtx.lineCap = 'round';
            trailCtx.beginPath();
            trailCtx.moveTo(this.x, this.y);
            trailCtx.lineTo(this.targetX, this.targetY);
            trailCtx.stroke();
            trailCtx.restore();
        }
    }

    function animateTrails() {
        trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        for (let i = trails.length - 1; i >= 0; i--) {
            trails[i].update(mouseX, mouseY);
            trails[i].draw();
            if (trails[i].life <= 0) trails.splice(i, 1);
        }
        requestAnimationFrame(animateTrails);
    }

    animateTrails();
}

// Glowing Cursor Follower
const cursorGlow = document.querySelector('.cursor-glow');
let glowX = 0;
let glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (trailCanvas && typeof Trail !== 'undefined') {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                trails.push(new Trail(lastMouseX, lastMouseY));
            }, i * 30);
        }
    }

    lastMouseX = mouseX;
    lastMouseY = mouseY;
});

function animateGlow() {
    const dx = mouseX - glowX;
    const dy = mouseY - glowY;
    
    glowX += dx * 0.1;
    glowY += dy * 0.1;
    
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    
    requestAnimationFrame(animateGlow);
}

animateGlow();

// animateTrails is started conditionally where trailCanvas is initialized

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Fade-in Animation on Scroll
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
    fadeInObserver.observe(element);
});

// Social Cards Mouse Tracking
const cards = Array.from(document.querySelectorAll(".social-card"));
const cardsContainer = document.querySelector("#cards");

if (cardsContainer) {
    cardsContainer.addEventListener("mousemove", (e) => {
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        }
    });
}

// Scroll animations for tech items
const techObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const techObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 1s ease forwards';
        }
    });
}, techObserverOptions);

document.querySelectorAll('.tech-item, .social-card, .stat-card').forEach(el => {
    techObserver.observe(el);
});

// Parallax effect on scroll
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.landing-hero');
            
            parallaxElements.forEach(el => {
                el.style.transform = `translateY(${scrolled * 0.5}px)`;
            });
            
            ticking = false;
        });
        
        ticking = true;
    }
});

// Make whole social card open its inner link on click
document.querySelectorAll('.social-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // If user clicked an actual link, let default behavior happen
        if (e.target.closest('a')) return;
        const link = card.querySelector('.card_content a');
        if (link && link.href) {
            window.open(link.href, '_blank');
        }
    });
});

// Toggle overlay when About section is in view so background blurs/dims
(() => {
    const aboutSection = document.getElementById('about');
    const overlay = document.getElementById('section-overlay');
    if (!aboutSection || !overlay) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.body.classList.add('about-active');
            } else {
                document.body.classList.remove('about-active');
            }
        });
    }, { threshold: 0.35 });

    observer.observe(aboutSection);
})();