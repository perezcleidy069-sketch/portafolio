/**
 * UNIVERSO CP — Cinematic Boot Loader
 * Muestra una pantalla de carga tipo sistema galáctico antes de revelar el portfolio.
 */
(function () {
    'use strict';

    const overlay = document.getElementById('loader-overlay');
    if (!overlay) return;

    const bar      = document.getElementById('loader-bar');
    const percent  = document.getElementById('loader-percent');
    const lines    = document.getElementById('loader-lines');

    const bootMessages = [
        '> Iniciando Universo CP...',
        '> Cargando partículas galácticas...',
        '> Compilando habilidades...',
        '> Sincronizando proyectos...',
        '> Estableciendo conexión...',
        '> Sistema listo. Bienvenido/a.',
    ];

    let progress = 0;
    let msgIndex = 0;

    // Typewrite a single boot message
    function typeMessage(text, cb) {
        const p = document.createElement('p');
        p.className = 'loader-line';
        lines.appendChild(p);
        lines.scrollTop = lines.scrollHeight;
        let i = 0;
        const interval = setInterval(() => {
            p.textContent += text[i++];
            if (i >= text.length) {
                clearInterval(interval);
                if (cb) cb();
            }
        }, 22);
    }

    function nextMessage() {
        if (msgIndex >= bootMessages.length) return;
        typeMessage(bootMessages[msgIndex++], () => {
            if (msgIndex < bootMessages.length) {
                setTimeout(nextMessage, 120);
            }
        });
    }

    // Animate progress bar
    const targetProgress = [15, 30, 50, 68, 85, 100];
    let targetIdx = 0;

    function animateProgress() {
        if (progress >= 100) {
            finish();
            return;
        }
        const target = targetProgress[targetIdx] || 100;
        progress = Math.min(progress + 1, target);
        bar.style.width = progress + '%';
        percent.textContent = progress + '%';

        if (progress >= target && targetIdx < targetProgress.length - 1) {
            targetIdx++;
            setTimeout(animateProgress, 180);
        } else {
            requestAnimationFrame(animateProgress);
        }
    }

    function finish() {
        setTimeout(() => {
            overlay.classList.add('loader--done');
            setTimeout(() => overlay.remove(), 900);
        }, 400);
    }

    // Start
    document.body.classList.add('loading');
    nextMessage();
    setTimeout(animateProgress, 300);

    // Safety fallback: remove after 5s regardless
    setTimeout(() => {
        if (overlay && overlay.parentNode) {
            overlay.classList.add('loader--done');
            setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 900);
        }
    }, 5000);
})();
