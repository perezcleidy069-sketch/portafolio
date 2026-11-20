/**
 * GAME-EFFECTS.JS — Easter eggs, header scroll, toast, count-up, skill bars
 * Universo CP Portfolio
 */
(function () {
    'use strict';

    /* ── Header scroll effect ──────────────────────────────────── */
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 30);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ── Toast notification ────────────────────────────────────── */
    const toast = document.getElementById('toast');
    function showToast(label, msg, duration = 3500) {
        if (!toast) return;
        toast.innerHTML = `<span class="toast-label">${label}</span>${msg}`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    }

    /* ── Konami Code Easter Egg ────────────────────────────────── */
    const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let konamiIdx = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === KONAMI[konamiIdx]) {
            konamiIdx++;
            if (konamiIdx === KONAMI.length) {
                konamiIdx = 0;
                activateKonami();
            }
        } else {
            konamiIdx = e.key === KONAMI[0] ? 1 : 0;
        }
    });

    function activateKonami() {
        const overlay = document.getElementById('konami-overlay');
        if (overlay) {
            overlay.classList.add('active');
            launchConfetti();
        }
    }

    const konamiClose = document.getElementById('konami-close');
    if (konamiClose) {
        konamiClose.addEventListener('click', () => {
            const overlay = document.getElementById('konami-overlay');
            if (overlay) overlay.classList.remove('active');
        });
    }

    /* ── Confetti ──────────────────────────────────────────────── */
    function launchConfetti() {
        const colors = ['#e5097f', '#f0b429', '#9d4edd', '#00d4ff', '#fff'];
        for (let i = 0; i < 80; i++) {
            setTimeout(() => createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]), i * 25);
        }
    }

    function createConfettiPiece(color) {
        const el = document.createElement('div');
        el.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: -10px;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${color};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events: none;
            z-index: 999999;
            animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
        `;
        document.body.appendChild(el);

        // Add keyframe style if not present
        if (!document.getElementById('confetti-style')) {
            const s = document.createElement('style');
            s.id = 'confetti-style';
            s.textContent = `
                @keyframes confetti-fall {
                    to { transform: translateY(110vh) rotate(${Math.random() * 720}deg); opacity: 0; }
                }
            `;
            document.head.appendChild(s);
        }

        setTimeout(() => el.remove(), 4000);
    }

    /* ── Typing animation (home page) ─────────────────────────── */
    const roleEl = document.getElementById('typing-role');
    if (roleEl) {
        const roles = [
            'Desarrolladora Web',
            'Creadora de Soluciones',
            'Estudiante de Software',
            'Apasionada del Código',
        ];
        let roleIdx = 0, charIdx = 0, deleting = false;

        function type() {
            const current = roles[roleIdx];
            if (!deleting) {
                charIdx++;
                roleEl.textContent = current.slice(0, charIdx);
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(type, 1800);
                    return;
                }
            } else {
                charIdx--;
                roleEl.textContent = current.slice(0, charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    roleIdx = (roleIdx + 1) % roles.length;
                }
            }
            setTimeout(type, deleting ? 45 : 75);
        }
        setTimeout(type, 800);
    }

    /* ── Count-up numbers on stats ─────────────────────────────── */
    function animateCountUp(el, end, duration = 1200) {
        const start = 0;
        const startTime = performance.now();
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(start + (end - start) * eased);
            el.textContent = prefix + value + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // Trigger count-up when stats are visible
    const statNumbers = document.querySelectorAll('.count-up');
    if (statNumbers.length && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10);
                    animateCountUp(el, target);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(el => obs.observe(el));
    }

    /* ── Skill bar fill on scroll ──────────────────────────────── */
    const skillBars = document.querySelectorAll('.skill-bar__fill');
    if (skillBars.length && 'IntersectionObserver' in window) {
        const barObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.dataset.pct + '%';
                    barObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        skillBars.forEach(bar => barObs.observe(bar));
    }

    /* ── 3D card tilt on mouse move ────────────────────────────── */
    document.querySelectorAll('.card, .contact-card, .stat-card').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            if (e.pointerType !== 'mouse') return;
            const r = card.getBoundingClientRect();
            if (!r.width || !r.height) return;
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            card.style.setProperty('--card-pointer-x', `${(x * 100).toFixed(1)}%`);
            card.style.setProperty('--card-pointer-y', `${(y * 100).toFixed(1)}%`);
            card.style.setProperty('--card-rotate-x', `${((0.5 - y) * 5).toFixed(2)}deg`);
            card.style.setProperty('--card-rotate-y', `${((x - 0.5) * 7).toFixed(2)}deg`);
        });
        card.addEventListener('pointerleave', () => {
            card.style.removeProperty('--card-pointer-x');
            card.style.removeProperty('--card-pointer-y');
            card.style.removeProperty('--card-rotate-x');
            card.style.removeProperty('--card-rotate-y');
        });
    });

    /* ── Show welcome toast on first visit ─────────────────────── */
    if (!sessionStorage.getItem('cp-visited')) {
        sessionStorage.setItem('cp-visited', '1');
        setTimeout(() => showToast('// SISTEMA', 'Bienvenido al Universo CP ✦'), 2000);
    }

})();
