/**
 * CURSOR.JS — Custom cursor with trail effect
 * Universo CP Portfolio
 */
(function () {
    'use strict';

    if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch devices

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (!dot || !ring) return;

    document.body.classList.add('cursor-active');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isHovering = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows immediately
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateRing() {
        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover states on interactive elements
    const hoverTargets = 'a, button, .card, .skill, .project-card__tag, .contact-card, [role="button"]';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
            ring.classList.add('hovering');
            dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
            dot.style.background = 'var(--neon-gold)';
            dot.style.boxShadow = 'var(--glow-gold)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
            ring.classList.remove('hovering');
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
            dot.style.background = 'var(--neon-pink)';
            dot.style.boxShadow = 'var(--glow-pink)';
        }
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(0.6)';
        ring.style.transform = 'translate(-50%, -50%) scale(0.85)';
    });

    document.addEventListener('mouseup', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        ring.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });

})();
