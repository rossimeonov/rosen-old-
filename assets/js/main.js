document.addEventListener('DOMContentLoaded', function () {
    if (typeof AOS !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        AOS.init({
            duration: 900,
            once: true
        });
    }

    const body = document.body;
    const navbar = document.getElementById('mainNavbar');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileQuickTop = document.getElementById('mobileQuickTop');
    const closeMenuLinks = document.querySelectorAll('.js-close-menu');
    const mobileContactLinks = document.querySelectorAll('.mobile-contact-link');
    const contactForm = document.getElementById('contactForm');
    const contactSubmitButton = document.getElementById('contactSubmitButton');
    const formStatus = document.getElementById('formStatus');

    let lastFocusedElement = null;

    function openMobileMenu() {
        if (!mobileMenu || !mobileMenuOverlay || !mobileMenuToggle) return;

        lastFocusedElement = document.activeElement;

        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuOverlay.hidden = false;
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        body.classList.add('menu-open');
        mobileMenu.focus();
    }

    function closeMobileMenu() {
        if (!mobileMenu || !mobileMenuOverlay || !mobileMenuToggle) return;

        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        body.classList.remove('menu-open');

        window.setTimeout(function () {
            mobileMenuOverlay.hidden = true;
        }, 300);

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    function smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 12;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({
            top: offsetTop,
            behavior: reducedMotion ? 'auto' : 'smooth'
        });
    }

    function handleScrollState() {
        if (!navbar) return;

        if (window.scrollY > 16) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }

    function handleQuickTopVisibility() {
        if (!mobileQuickTop) return;

        if (window.innerWidth < 992 && window.scrollY > 320 && !body.classList.contains('menu-open')) {
            mobileQuickTop.classList.add('show');
        } else {
            mobileQuickTop.classList.remove('show');
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function (e) {
            e.preventDefault();

            if (mobileMenu && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }

            handleQuickTopVisibility();
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function () {
            closeMobileMenu();
            handleQuickTopVisibility();
        });
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function () {
            closeMobileMenu();
            handleQuickTopVisibility();
        });
    }

    closeMenuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMobileMenu();
            handleQuickTopVisibility();
        });
    });

    mobileContactLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#contact') {
                e.preventDefault();
                closeMobileMenu();
                smoothScrollTo('contact');
                window.setTimeout(handleQuickTopVisibility, 400);
            }
        });
    });

    if (mobileQuickTop) {
        mobileQuickTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
            handleQuickTopVisibility();
        }
    });

    window.addEventListener('scroll', function () {
        handleScrollState();
        handleQuickTopVisibility();
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 992) {
            closeMobileMenu();
        }

        handleQuickTopVisibility();
    });

    if (contactForm && contactSubmitButton && formStatus) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!contactForm.checkValidity()) {
                formStatus.className = 'form-status is-visible is-error';
                formStatus.textContent = 'Моля, попълнете коректно всички задължителни полета.';
                return;
            }

            const formData = new FormData(contactForm);

            contactSubmitButton.classList.add('is-loading');
            contactSubmitButton.disabled = true;
            contactSubmitButton.textContent = 'Изпращане...';

            formStatus.className = 'form-status';
            formStatus.textContent = '';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactForm.reset();
                    formStatus.className = 'form-status is-visible is-success';
                    formStatus.textContent = 'Съобщението беше изпратено успешно. Благодарим Ви.';
                } else {
                    formStatus.className = 'form-status is-visible is-error';
                    formStatus.textContent = 'Възникна проблем при изпращането. Моля, опитайте отново.';
                }
            } catch (error) {
                formStatus.className = 'form-status is-visible is-error';
                formStatus.textContent = 'Неуспешна връзка. Моля, опитайте отново след малко.';
            } finally {
                contactSubmitButton.classList.remove('is-loading');
                contactSubmitButton.disabled = false;
                contactSubmitButton.textContent = 'Изпрати';
            }
        });
    }

    handleScrollState();
    handleQuickTopVisibility();
});
