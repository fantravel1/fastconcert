/* ============================================
   FastConcert — Main JavaScript
   ============================================ */

(function () {
    'use strict';

    // ===== DOM Ready =====
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavScroll();
        initMobileMenu();
        initTickerDuplicate();
        initRevealAnimations();
        initFastScoreAnimation();
        initEventFilters();
        initCityRotator();
        initSmoothScrollLinks();
    }


    // ===== Sticky Nav on Scroll =====
    function initNavScroll() {
        var nav = document.getElementById('nav');
        if (!nav) return;

        var scrollThreshold = 50;

        function onScroll() {
            if (window.scrollY > scrollThreshold) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }


    // ===== Mobile Menu =====
    function initMobileMenu() {
        var toggle = document.getElementById('navToggle');
        var menu = document.getElementById('mobileMenu');
        var overlay = document.getElementById('mobileOverlay');
        if (!toggle || !menu) return;

        function openMenu() {
            toggle.classList.add('nav__toggle--active');
            menu.classList.add('mobile-menu--open');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            toggle.classList.remove('nav__toggle--active');
            menu.classList.remove('mobile-menu--open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', function () {
            if (menu.classList.contains('mobile-menu--open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        // Close on link click
        var menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('mobile-menu--open')) {
                closeMenu();
            }
        });
    }


    // ===== Duplicate Ticker for Infinite Scroll =====
    function initTickerDuplicate() {
        var content = document.getElementById('tickerContent');
        if (!content) return;

        // Clone the content for seamless looping
        var clone = content.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        content.parentElement.appendChild(clone);
    }


    // ===== Scroll Reveal Animations =====
    function initRevealAnimations() {
        // Add .reveal class to sections
        var sections = document.querySelectorAll(
            '.how-it-works, .tonight, .fastscore, .vibes, .views, .free-concerts, .bring-someone, .weather, .cities, .faq, .final-cta'
        );

        sections.forEach(function (section) {
            var elements = section.querySelectorAll(
                '.section__header, .step, .event-card, .fastscore__layout, .vibes__card, .views__card, .free-concerts__layout, .bring-someone__layout, .weather__card, .cities__card, .faq__item, .final-cta__content, .tonight__filter-bar, .tonight__cta-wrap'
            );
            elements.forEach(function (el) {
                el.classList.add('reveal');
            });
        });

        // Intersection Observer
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal--visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            });

            document.querySelectorAll('.reveal').forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: just show everything
            document.querySelectorAll('.reveal').forEach(function (el) {
                el.classList.add('reveal--visible');
            });
        }
    }


    // ===== FastScore Ring Animation =====
    function initFastScoreAnimation() {
        var ring = document.getElementById('fastscoreRing');
        var valueEl = document.getElementById('fastscoreValue');
        if (!ring || !valueEl) return;

        var targetScore = 94;
        var circumference = 534; // 2 * PI * 85
        var animated = false;

        function animateScore() {
            if (animated) return;
            animated = true;

            // Animate ring
            var progress = ring.querySelector('.fastscore__demo-progress');
            if (progress) {
                var offset = circumference - (targetScore / 100) * circumference;
                progress.style.strokeDashoffset = offset;
            }

            // Animate number
            var current = 0;
            var duration = 2000;
            var start = performance.now();

            function tick(now) {
                var elapsed = now - start;
                var t = Math.min(elapsed / duration, 1);
                // Ease out cubic
                t = 1 - Math.pow(1 - t, 3);
                current = Math.round(t * targetScore);
                valueEl.textContent = current;
                if (elapsed < duration) {
                    requestAnimationFrame(tick);
                }
            }

            requestAnimationFrame(tick);

            // Animate bar fills
            var bars = document.querySelectorAll('.fastscore__demo-bar-fill');
            bars.forEach(function (bar, i) {
                setTimeout(function () {
                    bar.classList.add('animated');
                }, 300 + i * 150);
            });
        }

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateScore();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(ring);
        } else {
            animateScore();
        }
    }


    // ===== Event Card Filters =====
    function initEventFilters() {
        var filterBtns = document.querySelectorAll('.tonight__filter');
        var cards = document.querySelectorAll('.event-card');
        if (!filterBtns.length || !cards.length) return;

        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filter = btn.getAttribute('data-filter');

                // Update active button
                filterBtns.forEach(function (b) { b.classList.remove('tonight__filter--active'); });
                btn.classList.add('tonight__filter--active');

                // Filter cards
                cards.forEach(function (card) {
                    var type = card.getAttribute('data-type') || '';
                    if (filter === 'all' || type.indexOf(filter) !== -1) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }


    // ===== City Name Rotator =====
    function initCityRotator() {
        var el = document.getElementById('cityRotator');
        if (!el) return;

        var cities = [
            'New York', 'Los Angeles', 'London', 'Paris',
            'Tokyo', 'Berlin', 'Sydney', 'Austin',
            'Nashville', 'Chicago', 'Barcelona', 'Amsterdam',
            'Toronto', 'Seoul', 'Melbourne', 'Portland'
        ];

        var index = 0;

        setInterval(function () {
            index = (index + 1) % cities.length;
            el.style.opacity = '0';
            el.style.transform = 'translateY(8px)';

            setTimeout(function () {
                el.textContent = cities[index];
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 300);
        }, 2500);

        el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        el.style.display = 'inline-block';
    }


    // ===== Smooth Scroll for Anchor Links =====
    function initSmoothScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = link.getAttribute('href');
                if (href === '#') return;

                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

})();
