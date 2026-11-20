/**
 * ANIMATIONS.JS — Scroll reveal & nav active state
 * Universo CP Portfolio
 */
document.documentElement.classList.add('js');

/* ── Nav section tracking ─────────────────────────────────────── */
const sectionNavLinks = Array.from(document.querySelectorAll('.site-nav__link')).filter(l => l.hash);

function updateSectionNav() {
    const active = sectionNavLinks.find((link) => {
        const t = new URL(link.href);
        return t.pathname === window.location.pathname && t.hash === window.location.hash;
    });
    if (!active) return;
    sectionNavLinks.forEach(l => l.removeAttribute('aria-current'));
    active.setAttribute('aria-current', 'page');
}
updateSectionNav();
window.addEventListener('hashchange', updateSectionNav);

/* ── Scroll Reveal ───────────────────────────────────────────── */
const revealTargets = document.querySelectorAll(
    '.profile, .stat-card, .skill-group, .language-item, .project-card, ' +
    '.contact-card, .section-title, .resume-card, .info-card, .skill-detail-list li'
);

revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.delay = String((i % 4) + 1);
});

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduced || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
} else {
    const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px' });

    revealTargets.forEach(el => obs.observe(el));
}
