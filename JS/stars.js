/**
 * UNIVERSO CP — Star Field & Shooting Stars
 * Crea un campo de estrellas animado con estrellas fugaces y nebulosas.
 */
(function () {
    'use strict';

    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, stars = [], shootingStars = [], nebulae = [];

    /* ── Resize ─────────────────────────────── */
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    /* ── Create stars ───────────────────────── */
    function createStars(n) {
        stars = [];
        for (let i = 0; i < n; i++) {
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.4 + 0.2,
                alpha: Math.random() * 0.7 + 0.1,
                speed: Math.random() * 0.4 + 0.05,
                twinkleDir: Math.random() > 0.5 ? 1 : -1,
                twinkleSpeed: Math.random() * 0.008 + 0.002,
                color: pickStarColor(),
            });
        }
    }

    function pickStarColor() {
        const palette = ['255,255,255', '229,9,127', '240,180,41', '157,78,221', '180,220,255'];
        const c = palette[Math.floor(Math.random() * palette.length)];
        // 85% white, 5% each neon
        return Math.random() > 0.15 ? '255,255,255' : c;
    }

    /* ── Nebula blobs ───────────────────────── */
    function createNebulae() {
        nebulae = [
            { x: W * 0.15, y: H * 0.2,  r: W * 0.28, color: 'rgba(229,9,127,0.028)' },
            { x: W * 0.85, y: H * 0.75, r: W * 0.22, color: 'rgba(157,78,221,0.032)' },
            { x: W * 0.5,  y: H * 0.5,  r: W * 0.18, color: 'rgba(240,180,41,0.018)' },
        ];
    }

    /* ── Shooting star factory ──────────────── */
    function spawnShootingStar() {
        const angle = Math.PI / 6 + Math.random() * Math.PI / 8;
        shootingStars.push({
            x: Math.random() * W * 0.6,
            y: Math.random() * H * 0.4,
            len: Math.random() * 160 + 80,
            speed: Math.random() * 8 + 6,
            angle: angle,
            alpha: 1,
            vx: Math.cos(angle),
            vy: Math.sin(angle),
            life: 0,
            maxLife: Math.random() * 40 + 30,
        });
    }

    /* ── Draw helpers ───────────────────────── */
    function drawNebulae() {
        nebulae.forEach(n => {
            const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
            g.addColorStop(0, n.color);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawStars() {
        stars.forEach(s => {
            // Twinkle
            s.alpha += s.twinkleSpeed * s.twinkleDir;
            if (s.alpha > 0.85 || s.alpha < 0.05) s.twinkleDir *= -1;

            ctx.save();
            ctx.globalAlpha = s.alpha;
            ctx.fillStyle = `rgb(${s.color})`;
            ctx.shadowBlur = s.r > 1 ? 4 : 0;
            ctx.shadowColor = `rgba(${s.color}, 0.8)`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    function drawShootingStars() {
        shootingStars.forEach((ss, i) => {
            ss.life++;
            ss.x += ss.vx * ss.speed;
            ss.y += ss.vy * ss.speed;

            const fade = 1 - ss.life / ss.maxLife;
            ctx.save();
            ctx.globalAlpha = fade * 0.9;

            const grad = ctx.createLinearGradient(
                ss.x, ss.y,
                ss.x - ss.vx * ss.len, ss.y - ss.vy * ss.len
            );
            grad.addColorStop(0, 'rgba(255,255,255,1)');
            grad.addColorStop(0.3, 'rgba(229,9,127,0.6)');
            grad.addColorStop(1, 'transparent');

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(ss.x - ss.vx * ss.len, ss.y - ss.vy * ss.len);
            ctx.stroke();
            ctx.restore();

            if (ss.life >= ss.maxLife) shootingStars.splice(i, 1);
        });
    }

    /* ── Animation loop ─────────────────────── */
    function loop() {
        ctx.clearRect(0, 0, W, H);
        drawNebulae();
        drawStars();
        drawShootingStars();
        requestAnimationFrame(loop);
    }

    /* ── Shooting star scheduler ────────────── */
    function scheduleShootingStar() {
        spawnShootingStar();
        setTimeout(scheduleShootingStar, Math.random() * 3500 + 1500);
    }

    /* ── Init ───────────────────────────────── */
    function init() {
        resize();
        createStars(200);
        createNebulae();
        loop();
        setTimeout(scheduleShootingStar, 1200);
    }

    window.addEventListener('resize', () => {
        resize();
        createStars(200);
        createNebulae();
    });

    init();
})();
