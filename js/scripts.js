document.addEventListener('DOMContentLoaded', function () {
    // 1. Анимации и Lightbox
    if (typeof AOS !== 'undefined') AOS.init({ duration: 900, once: true });
    if (typeof Luminous !== 'undefined') {
        document.querySelectorAll('.lightbox').forEach(el => new Luminous(el));
    }

    const body = document.body;
    const navbar = document.getElementById('mainNavbar');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    // 2. Мобилно меню логика
    function openMenu() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
        body.classList.add('menu-open');
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        body.classList.remove('menu-open');
    }

    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMenu);

    // 3. Плавно скролване
    document.querySelectorAll('.nav-scroll-link, .mobile-scroll-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.dataset.target || this.getAttribute('href').replace('#', '');
            const target = document.getElementById(targetId);
            if (target) {
                e.preventDefault();
                closeMenu();
                const offset = navbar.offsetHeight + 20;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

    // 4. Ефект на навигацията при скрол
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) navbar.classList.add('navbar-scrolled');
        else navbar.classList.remove('navbar-scrolled');
    });

    // 5. Таймер (само ако елементите съществуват)
    function updateCountdown() {
        const targetDate = new Date(2026, 3, 19).getTime(); // 19 Април 2026
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff > 0 && document.getElementById('days')) {
            document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
            document.getElementById('hours').innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            document.getElementById('minutes').innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        }
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
});
