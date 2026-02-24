// DOM Elements
const navbar = document.getElementById('navbar');
const revealElements = document.querySelectorAll('.reveal');
const cards = document.querySelectorAll('.project-card');

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('is-active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinksAnchors = document.querySelectorAll('.nav-links a');
    navLinksAnchors.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('is-active');
            navLinks.classList.remove('active');
        });
    });
}

// Scroll Event Listener for Navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Advanced Scroll Reveal Animation
const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 120;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

// Listen to scroll events
window.addEventListener('scroll', revealOnScroll);

// Initial check when page loads
revealOnScroll();

// 3D Tilt Effect for Project Cards using Vanilla JS
// This creates a premium, dynamic feel as user hovers
cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();

        // Calculate mouse position relative to the center of the card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Multiplier controls the strength of the effect
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        // Apply transform
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;

        // Subtle glare effect can be calculated here if added into CSS
    });

    // Reset transform on mouse leave
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
});

// Form Submission Handler using Formsubmit.co
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', () => {
        // DO NOT use e.preventDefault() here. FormSubmit requires a standard 
        // HTML submission for the first invocation to send you an Activation Email!
        const btn = document.getElementById('submit-btn');
        btn.innerText = "Sending...";
        btn.style.opacity = '0.8';
        btn.style.pointerEvents = 'none';

        // Simply re-enable the button after a delay so they can submit again if they close the tab
        setTimeout(() => {
            btn.innerText = "Send Message";
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        }, 3000);
    });
}

// 3D Floating Avatar Effect for Hero Section
const profileCard = document.getElementById('profile-card');
if (profileCard) {
    profileCard.addEventListener('mousemove', e => {
        const rect = profileCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation based on cursor position
        const rotateX = ((y - centerY) / centerY) * -15; // Increased depth
        const rotateY = ((x - centerX) / centerX) * 15;

        // Apply dynamic 3D transform tracking the mouse
        profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    profileCard.addEventListener('mouseleave', () => {
        // Return to natural 3D state
        profileCard.style.transform = 'perspective(1000px) rotateY(-15deg) rotateX(5deg)';
        profileCard.style.transition = 'transform 0.5s ease-out';
    });

    profileCard.addEventListener('mouseenter', () => {
        profileCard.style.transition = 'none'; // removing transition provides immediate tracking
    });
}

// ==========================================
// 3D Interactive Particle Background System
// ==========================================
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    // Resize canvas
    function setCanvasDimensions() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', setCanvasDimensions);
    setCanvasDimensions();

    // Mouse Interaction for Particles
    const mouseParams = { x: null, y: null, radius: 150 };
    window.addEventListener('mousemove', (event) => {
        mouseParams.x = event.x;
        mouseParams.y = event.y;
    });
    window.addEventListener('mouseout', () => {
        mouseParams.x = undefined;
        mouseParams.y = undefined;
    });

    // Particle Object
    class Particle {
        constructor(x, y, dx, dy, size) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            this.originX = x;
            this.originY = y;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.5)'; // Accent color
            ctx.fill();
        }

        update() {
            // Repel from mouse
            if (mouseParams.x != null && mouseParams.y != null) {
                let dx = mouseParams.x - this.x;
                let dy = mouseParams.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouseParams.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseParams.radius - distance) / mouseParams.radius;
                    // Multiply repel force for cool scatter
                    this.x -= forceDirectionX * force * 5;
                    this.y -= forceDirectionY * force * 5;
                }
            }

            // Return to path
            this.x += this.dx;
            this.y += this.dy;

            // Screen wrap
            if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
            if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

            this.draw();
        }
    }

    // Initialize particle network
    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;

            particlesArray.push(new Particle(x, y, directionX, directionY, size));
        }
    }

    // Connect particles via 3D feeling lines
    function connect() {
        let maxLinesDistance = 120;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (maxLinesDistance * maxLinesDistance)) {
                    let opacityValue = 1 - (distance / (maxLinesDistance * maxLinesDistance));
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacityValue * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    initParticles();
    animate();
}
