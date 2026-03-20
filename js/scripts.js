/**
 * РОСЕН СИМЕОНОВ - Официален уебсайт
 * Обединен JavaScript файл (Меню, Скрол, Таймер)
 */

document.addEventListener('DOMContentLoaded', function () {
    
    // 1. ИНИЦИАЛИЗАЦИЯ НА ВЪНШНИ БИБЛИОТЕКИ (AOS & Luminous)
    // Проверка дали AOS (Animations On Scroll) съществува
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            duration: 900, 
            once: true,
            offset: 100
        });
    }

    // Проверка дали Luminous (Lightbox за галерията) съществува
    if (typeof Luminous !== 'undefined') {
        const lightboxOptions = {
            caption: function(trigger) {
                return trigger.querySelector('img').getAttribute('alt');
            }
        };
        document.querySelectorAll('.lightbox').forEach(function (elem) {
            new Luminous(elem, lightboxOptions);
        });
    }

    // 2. ЕЛЕМЕНТИ ЗА НАВИГАЦИЯ И МЕНЮ
    const body = document.body;
    const navbar = document.getElementById('mainNavbar');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    const allScrollLinks = document.querySelectorAll('.nav-scroll-link, .mobile-scroll-link');
    const sections = document.querySelectorAll('section[id]');
    const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link[data-target]');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link[data-target]');

    // 3. ФУНКЦИИ ЗА МОБИЛНО МЕНЮ
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

    // 4. ПЛАВНО СКРОЛВАНЕ (SMOOTH SCROLL)
    function smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;
        
        // Изчисляваме височината на навигацията, за да не застъпи заглавието
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 10;

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    // 5. УПРАВЛЕНИЕ НА NAVBAR ПРИ СКРОЛ (Navbar Scrolled State)
    function handleScrollState() {
        if (!navbar) return;
        if (window.scrollY > 20) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }

    // 6. АКТИВИРАНЕ НА ЛИНКОВЕТЕ ПРИ СКРОЛ (Scroll Spy)
    function setActiveNav() {
        if (!sections.length || !navbar) return;
        
        let currentId = '';
        const scrollPosition = window.scrollY + navbar.offsetHeight + 150;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentId = section.getAttribute('id');
            }
        });

        // Десктоп линкове
        desktopNavLinks.forEach(function (link) {
            link.classList.toggle('active', link.dataset.target === currentId);
        });
        
        // Мобилни линкове
        mobileNavLinks.forEach(function (link) {
            link.classList.toggle('active', link.dataset.target === currentId);
        });
    }

    // 7. ТАЙМЕР ЗА ОБРАТНО БРОЕНЕ (Countdown Timer)
    function updateCountdown() {
        // Зададена дата: 19 април 2026 (Примерна дата за избори)
        const electionDate = new Date(2026, 3, 19, 0, 0, 0).getTime(); 
        const now = new Date().getTime();
        const distance = electionDate - now;

        const daysElement = document.getElementById("days");
        const hoursElement = document.getElementById("hours");
        const minutesElement = document.getElementById("minutes");
        const countdownWrapper = document.getElementById("election-countdown");

        // Ако датата е минала, скриваме таймера
        if (distance < 0) {
            if (countdownWrapper) countdownWrapper.style.display = "none";
            return;
        }

        // Изчисления за дни, часове и минути
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        // Визуализация с водеща нула (01, 02...)
        if (daysElement) daysElement.innerText = d.toString().padStart(2, '0');
        if (hoursElement) hoursElement.innerText = h.toString().padStart(2, '0');
        if (minutesElement) minutesElement.innerText = m.toString().padStart(2, '0');
    }

    // 8. СЪБИТИЯ (EVENT LISTENERS)

    // Кликване на бутона за мобилно меню
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

    // Затваряне при клик върху хикс или фонов слой
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Обработка на всички скрол линкове
    allScrollLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Вземаме ID-то или от data-target, или от самия href
            const targetId = this.dataset.target || (href && href.startsWith('#') ? href.substring(1) : '');
            
            if (targetId) {
                e.preventDefault();
                closeMobileMenu(); // Затваряме мобилното меню, ако е отворено
                smoothScrollTo(targetId);
            }
        });
    });

    // Слушател за скролване на прозореца
    window.addEventListener('scroll', function () {
        handleScrollState();
        setActiveNav();
    });

    // Изпълнение при първоначално зареждане
    handleScrollState();
    setActiveNav();
    
    // Обновяваме таймера всяка минута
    setInterval(updateCountdown, 60000);
    updateCountdown(); // Стартираме веднага веднъж
});
