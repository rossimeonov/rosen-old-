document.addEventListener('DOMContentLoaded', function () {
    // 1. Инициализация на AOS (Анимации при скрол)
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 900, once: true });
    }

    // 2. Инициализация на Luminous (Увеличаване на снимки)
    if (typeof Luminous !== 'undefined') {
        document.querySelectorAll('.lightbox').forEach(function (elem) {
            new Luminous(elem);
        });
    }

    // Дефиниране на променливи
    const body = document.body;
    const navbar = document.getElementById('mainNavbar');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileScrollLinks = document.querySelectorAll('.mobile-scroll-link');
    const desktopScrollLinks = document.querySelectorAll('.nav-scroll-link');
    const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link[data-target]');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link[data-target]');
    const sections = document.querySelectorAll('section[id]');

    // Функции за мобилното меню
    function openMobileMenu() {
        if (!mobileMenu || !mobileMenuOverlay || !mobileMenuToggle) return;
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        body.classList.add('menu-open');
    }

    function closeMobileMenu() {
        if (!mobileMenu || !mobileMenuOverlay || !mobileMenuToggle) return;
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        body.classList.remove('menu-open');
    }

    // Плавно скролване до секция
    function smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 12;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }

    // Промяна на навигацията при скрол
    function handleScrollState() {
        if (!navbar) return;
        if (window.scrollY > 16) { 
            navbar.classList.add('navbar-scrolled'); 
        } else { 
            navbar.classList.remove('navbar-scrolled'); 
        }
    }

    // Активен линк в менюто спрямо това къде се намира потребителят
    function setActiveNav() {
        if (!sections.length || !navbar) return;
        let currentId = '';
        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - (navbar.offsetHeight + 120);
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentId = section.getAttribute('id');
            }
        });
        desktopNavLinks.forEach(function (link) { link.classList.toggle('active', link.dataset.target === currentId); });
        mobileNavLinks.forEach(function (link) { link.classList.toggle('active', link.dataset.target === currentId); });
    }

    // Логика за таймера до изборите (19 април 2026)
    function updateCountdown() {
        const electionDate = new Date(2026, 3, 19, 0, 0, 0).getTime();
        const now = new Date().getTime();
        const distance = electionDate - now;

        const countdownEl = document.getElementById("election-countdown");
        if (distance < 0) {
            if(countdownEl) countdownEl.style.display = "none";
            return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        const dEl = document.getElementById("days");
        const hEl = document.getElementById("hours");
        const mEl = document.getElementById("minutes");

        if(dEl) dEl.innerText = d.toString().padStart(2, '0');
        if(hEl) hEl.innerText = h.toString().padStart(2, '0');
        if(mEl) mEl.innerText = m.toString().padStart(2, '0');
    }

    // Event Listeners (Слушатели за събития)
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            if (mobileMenu && mobileMenu.classList.contains('active')) { 
                closeMobileMenu(); 
            } else { 
                openMobileMenu(); 
            }
        });
    }

    if (mobileMenuClose) { mobileMenuClose.addEventListener('click', closeMobileMenu); }
    if (mobileMenuOverlay) { mobileMenuOverlay.addEventListener('click', closeMobileMenu); }

    [...desktopScrollLinks, ...mobileScrollLinks].forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const targetId = this.dataset.target || (href && href.startsWith('#') ? href.substring(1) : '');
            if (targetId && document.getElementById(targetId)) {
                e.preventDefault();
                closeMobileMenu();
                smoothScrollTo(targetId);
            }
        });
    });

    window.addEventListener('scroll', function () {
        handleScrollState();
        setActiveNav();
    });

    // Извикване на функциите при зареждане
    handleScrollState();
    setActiveNav();
    setInterval(updateCountdown, 60000);
    updateCountdown();
});
