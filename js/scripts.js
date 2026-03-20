document.addEventListener('DOMContentLoaded', function () {
    // 1. Инициализация на анимации (AOS)
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 900, once: true });
    }

    // 2. Инициализация на Lightbox (Luminous)
    if (typeof Luminous !== 'undefined') {
        document.querySelectorAll('.lightbox').forEach(function (elem) {
            new Luminous(elem);
        });
    }

    // 3. Селектори за Менюто
    const body = document.body;
    const navbar = document.getElementById('mainNavbar');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

    // Функции за отваряне/затваряне
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

    // 4. Плавно скролване (Smooth Scroll)
    const scrollLinks = document.querySelectorAll('.nav-scroll-link, .mobile-scroll-link');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.dataset.target || this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                closeMenu();
                const offset = navbar.offsetHeight + 10;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Ефект при скрол на Navbar
    window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // 6. Таймер за обратно броене
    function updateCountdown() {
        const electionDate = new Date(2026, 3, 19, 0, 0, 0).getTime(); // 19 Април 2026
        const now = new Date().getTime();
        const distance = electionDate - now;

        if (distance < 0) {
            const timerWrap = document.getElementById("election-countdown");
            if (timerWrap) timerWrap.style.display = "none";
            return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        if (document.getElementById("days")) document.getElementById("days").innerText = d.toString().padStart(2, '0');
        if (document.getElementById("hours")) document.getElementById("hours").innerText = h.toString().padStart(2, '0');
        if (document.getElementById("minutes")) document.getElementById("minutes").innerText = m.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 60000);
    updateCountdown();
});
