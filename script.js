document.addEventListener('DOMContentLoaded', function () {

    var navbar = document.getElementById('navbar');
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    document.querySelectorAll('.nav-menu a').forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    document.addEventListener('click', function (e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
        }
    });

    var accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            var item = this.closest('.accordion-item');
            var body = item.querySelector('.accordion-body');
            var isActive = item.classList.contains('active');

            document.querySelectorAll('.accordion-item.active').forEach(function (activeItem) {
                activeItem.classList.remove('active');
                activeItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                var activeBody = activeItem.querySelector('.accordion-body');
                activeBody.style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                body.style.maxHeight = body.scrollHeight + 'px';

                setTimeout(function () {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 400);
            }
        });
    });

    var faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function (question) {
        question.addEventListener('click', function () {
            var item = this.closest('.faq-item');
            var answer = item.querySelector('.faq-answer');
            var isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(function (activeItem) {
                activeItem.classList.remove('active');
                activeItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                activeItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    var plansByPrepaga = {
        'OSDE': ['Plan 210', 'Plan 310', 'Plan 410', 'Plan 510'],
        'Swiss Medical': ['SMG 20', 'SMG 30', 'SMG 40', 'SMG 50'],
        'Galeno': ['Plan 220', 'Plan 330', 'Plan 440', 'Plan 550'],
        'Medicus': ['Conecta', 'Integra', 'Family', 'Azul'],
        'OMINT': ['Plan Global', 'Plan Premium', 'Plan Excellence'],
        'Medifé': ['Bronce', 'Plata', 'Oro', 'Platinum']
    };

    var prepagaSelect = document.getElementById('prepaga');
    var planSelect = document.getElementById('plan');

    function updatePlanOptions(prepaga, selectedPlan) {
        planSelect.innerHTML = '<option value="">Seleccioná un plan</option>';
        if (plansByPrepaga[prepaga]) {
            plansByPrepaga[prepaga].forEach(function (plan) {
                var option = document.createElement('option');
                option.value = plan;
                option.textContent = plan;
                if (plan === selectedPlan) {
                    option.selected = true;
                }
                planSelect.appendChild(option);
            });
        }
    }

    prepagaSelect.addEventListener('change', function () {
        updatePlanOptions(this.value);
    });

    window.selectPlan = function (prepaga, plan) {
        prepagaSelect.value = prepaga;
        updatePlanOptions(prepaga, plan);

        var contactSection = document.getElementById('contacto');
        contactSection.scrollIntoView({ behavior: 'smooth' });

        var formWrapper = document.querySelector('.contact-form');
        formWrapper.style.boxShadow = '0 0 0 3px rgba(108, 60, 240, 0.3), 0 25px 50px rgba(0,0,0,0.15)';
        setTimeout(function () {
            formWrapper.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
        }, 1500);
    };

    var contactForm = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
    });

    var observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(function (el) {
        revealObserver.observe(el);
    });

    var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounters();
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    var statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        statObserver.observe(statsBar);
    }

    function animateCounters() {
        var counters = document.querySelectorAll('.stat-number');
        counters.forEach(function (counter) {
            var target = parseInt(counter.getAttribute('data-target'));
            var duration = 2000;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = Math.floor(eased * target);
                counter.textContent = current.toLocaleString('es-AR');

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = target.toLocaleString('es-AR');
                }
            }

            requestAnimationFrame(step);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                var offset = navbar.offsetHeight + 10;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

});
