document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const header = document.getElementById('siteHeader');
    const hasIO = 'IntersectionObserver' in window;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Header: transparent at the very top, dark over dark sections, light elsewhere
    const darkSections = [...document.querySelectorAll('[data-theme="dark"]')];
    let ticking = false;

    const updateHeader = () => {
        const probe = header.offsetHeight / 2;
        const overDark = darkSections.some((s) => {
            const r = s.getBoundingClientRect();
            return r.top <= probe && r.bottom >= probe;
        });
        header.classList.toggle('is-dark', overDark);
        header.classList.toggle('at-top', window.scrollY < 24);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateHeader);
        }
    }, { passive: true });
    window.addEventListener('resize', updateHeader);
    updateHeader();

    // 2. Mobile menu
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');

    const setMenu = (open) => {
        root.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        menu.setAttribute('aria-hidden', String(!open));
    };

    toggle.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
        if (e.matches) setMenu(false);
    });

    // 3. Scroll reveal, with a light stagger for siblings revealed together
    const revealEls = document.querySelectorAll('.reveal');
    if (hasIO && !reduceMotion) {
        const revealIO = new IntersectionObserver((entries) => {
            entries
                .filter((entry) => entry.isIntersecting)
                .forEach((entry, i) => {
                    entry.target.style.setProperty('--reveal-delay', `${i * 0.08}s`);
                    entry.target.classList.add('is-visible');
                    revealIO.unobserve(entry.target);
                });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        revealEls.forEach((el) => revealIO.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    // 4. Key-figure counters
    const counters = document.querySelectorAll('[data-count]');
    const animateCount = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1600;
        const start = performance.now();
        const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    if (hasIO && !reduceMotion) {
        const countIO = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    countIO.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach((el) => {
            el.textContent = '0';
            countIO.observe(el);
        });
    }

    // 5. Videos play only while on screen (saves CPU and bandwidth)
    if (hasIO) {
        const videoIO = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                if (entry.isIntersecting) video.play().catch(() => {});
                else video.pause();
            });
        }, { threshold: 0.35 });
        document.querySelectorAll('video').forEach((v) => videoIO.observe(v));
    }

    // 6. Scrollspy for the primary navigation
    const navLinks = document.querySelectorAll('.nav a');
    const sectionToLink = new Map();
    navLinks.forEach((link) => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) sectionToLink.set(section, link);
    });

    if (hasIO && sectionToLink.size) {
        const spyIO = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const link = sectionToLink.get(entry.target);
                if (entry.isIntersecting) {
                    navLinks.forEach((l) => l.classList.remove('active'));
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sectionToLink.forEach((_, section) => spyIO.observe(section));
    }

    // 7. Footer year
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
});
