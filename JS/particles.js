/**
 * PARTICLES.JS — Canvas Particle System
 * Universo CP Portfolio
 */
(function () {
    'use strict';

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, animId;
    let mouse = { x: -1000, y: -1000 };

    // Config
    const CONFIG = {
        count: 110,
        maxDist: 130,
        mouseRadius: 160,
        mouseForce: 0.025,
        speed: 0.45,
        particleRadius: 1.6,
        colorPink: 'rgba(229, 9, 127,',
        colorGold: 'rgba(240, 180, 41,',
        colorPurple: 'rgba(157, 78, 221,',
    };

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(randomPos = false) {
            this.x = randomPos ? Math.random() * width : Math.random() * width;
            this.y = randomPos ? Math.random() * height : Math.random() * height;
            this.vx = (Math.random() - 0.5) * CONFIG.speed;
            this.vy = (Math.random() - 0.5) * CONFIG.speed;
            this.r = Math.random() * CONFIG.particleRadius + 0.6;
            const roll = Math.random();
            if (roll < 0.6) this.color = CONFIG.colorPink;
            else if (roll < 0.85) this.color = CONFIG.colorGold;
            else this.color = CONFIG.colorPurple;
            this.alpha = Math.random() * 0.6 + 0.3;
        }

        update() {
            // Mouse repulsion
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.mouseRadius && dist > 0) {
                const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
                this.vx += (dx / dist) * force * 8;
                this.vy += (dy / dist) * force * 8;
            }

            // Damping
            this.vx *= 0.994;
            this.vy *= 0.994;

            // Speed cap
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > CONFIG.speed * 2.5) {
                this.vx = (this.vx / speed) * CONFIG.speed * 2.5;
                this.vy = (this.vy / speed) * CONFIG.speed * 2.5;
            }

            this.x += this.vx;
            this.y += this.vy;

            // Wrap edges
            if (this.x < -10) this.x = width + 10;
            if (this.x > width + 10) this.x = -10;
            if (this.y < -10) this.y = height + 10;
            if (this.y > height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color} ${this.alpha})`;
            ctx.fill();
        }
    }

    let particles = [];

    function init() {
        resize();
        particles = Array.from({ length: CONFIG.count }, () => new Particle());
    }

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.maxDist) {
                    const alpha = (1 - dist / CONFIG.maxDist) * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(229, 9, 127, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);
        drawConnections();
        particles.forEach(p => { p.update(); p.draw(); });
        animId = requestAnimationFrame(loop);
    }

    function handleMouse(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }

    function handleMouseLeave() {
        mouse.x = -1000;
        mouse.y = -1000;
    }

    // Events
    window.addEventListener('resize', () => {
        resize();
        particles.forEach(p => {
            if (p.x > width) p.x = Math.random() * width;
            if (p.y > height) p.y = Math.random() * height;
        });
    });

    document.addEventListener('mousemove', handleMouse);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Touch support
    document.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouse.x = t.clientX - rect.left;
        mouse.y = t.clientY - rect.top;
    }, { passive: true });

    // Respect reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        init();
        loop();
    } else {
        // Still show particles but no animation
        init();
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => p.draw());
    }

})();
