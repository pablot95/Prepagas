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
    var accordionPanel = document.getElementById('accordionPanel');
    var currentAccordionItem = null;

    function closeAccordion() {
        if (currentAccordionItem) {
            currentAccordionItem.classList.remove('active');
            currentAccordionItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        }
        accordionPanel.style.maxHeight = null;
        accordionPanel.classList.remove('active');
        currentAccordionItem = null;
    }

    function getRowEndItem(item) {
        var items = Array.from(document.querySelectorAll('.accordion-item'));
        var idx = items.indexOf(item);
        var cols = window.innerWidth >= 768 ? 2 : 1;
        var rowStart = Math.floor(idx / cols) * cols;
        var rowEnd = Math.min(rowStart + cols - 1, items.length - 1);
        return items[rowEnd];
    }

    accordionHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            var item = this.closest('.accordion-item');
            var body = item.querySelector('.accordion-body');
            var wasActive = item === currentAccordionItem;

            closeAccordion();

            if (!wasActive) {
                item.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                currentAccordionItem = item;

                var rowEndItem = getRowEndItem(item);
                rowEndItem.after(accordionPanel);

                accordionPanel.innerHTML = body.innerHTML;
                accordionPanel.classList.add('active');

                requestAnimationFrame(function () {
                    accordionPanel.style.maxHeight = accordionPanel.scrollHeight + 'px';
                });

                setTimeout(function () {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 450);
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
        'Swiss Medical': ['S1', 'S2', 'SMG02', 'SMG20', 'SMG30', 'SMG50', 'SMG60'],
        'Galeno': ['Plan 200', 'Plan 220', 'Plan 300', 'Plan 330', 'Plan 400', 'Plan 440', 'Plan 550'],
        'Avalian': ['Plan Cerca', 'Plan Hoy', 'Plan Integral', 'Plan Superior', 'Plan Selecta'],
        'SanCor Salud': ['Plan F700', 'Plan 800', 'Plan 1000', 'Plan 1500', 'Plan 3000', 'Plan 4000', 'Plan 4500', 'Plan 5000 Exclusive', 'Plan 6000 Exclusive'],
        'Premedic': ['Plan Por Aportes', 'Plan C100', 'Plan 200', 'Plan 300', 'Plan 400', 'Plan 500'],
        'Medifé': ['Bronce Classic', 'Bronce', 'Plata', 'Oro', 'Platinum'],
        'Doctored': ['Plan 500', 'Plan 1000', 'Plan 2000', 'Plan 3000']
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

        // Ensure individual tab is active when clicking "Cotizar este plan"
        var tabs = document.querySelectorAll('.form-tab');
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tabs[0].classList.add('active');
        document.getElementById('contactFormIndividuo').style.display = '';
        document.getElementById('contactFormEmpresa').style.display = 'none';

        var contactSection = document.getElementById('contacto');
        contactSection.scrollIntoView({ behavior: 'smooth' });

        var formWrapper = document.getElementById('contactFormIndividuo');
        formWrapper.style.boxShadow = '0 0 0 3px rgba(108, 60, 240, 0.3), 0 25px 50px rgba(0,0,0,0.15)';
        setTimeout(function () {
            formWrapper.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
        }, 1500);
    };

    // Form tabs
    var formTabs = document.querySelectorAll('.form-tab');
    var formIndividuo = document.getElementById('contactFormIndividuo');
    var formEmpresa = document.getElementById('contactFormEmpresa');

    formTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            formTabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            if (tab.dataset.tab === 'individuo') {
                formIndividuo.style.display = '';
                formEmpresa.style.display = 'none';
            } else {
                formIndividuo.style.display = 'none';
                formEmpresa.style.display = '';
            }
        });
    });

    var formSuccess = document.getElementById('formSuccess');

    formIndividuo.addEventListener('submit', function (e) {
        e.preventDefault();
        formIndividuo.style.display = 'none';
        document.querySelector('.form-tabs').style.display = 'none';
        formSuccess.classList.add('show');
    });

    formEmpresa.addEventListener('submit', function (e) {
        e.preventDefault();
        formEmpresa.style.display = 'none';
        document.querySelector('.form-tabs').style.display = 'none';
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

    var btnVerMas = document.getElementById('btnVerMas');
    var clinicasExpanded = document.getElementById('clinicasExpanded');
    if (btnVerMas && clinicasExpanded) {
        btnVerMas.addEventListener('click', function () {
            btnVerMas.classList.toggle('active');
            clinicasExpanded.classList.toggle('show');
            var span = btnVerMas.querySelector('span');
            if (clinicasExpanded.classList.contains('show')) {
                span.textContent = 'Ver menos';
            } else {
                span.textContent = 'Ver más clínicas';
            }
        });
    }

});
