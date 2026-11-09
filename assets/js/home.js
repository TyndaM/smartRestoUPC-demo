(function () {
    function initStickyHeader() {
        const header = document.querySelector('.site-header');

        if (!header) {
            return;
        }

        function syncHeaderState() {
            header.classList.toggle('is-scrolled', window.scrollY > 18);
        }

        syncHeaderState();
        window.addEventListener('scroll', syncHeaderState, { passive: true });
    }

    function initMobileNavigation() {
        const toggle = document.getElementById('siteNavToggle');
        const panel = document.getElementById('siteNavPanel');
        const overlay = document.getElementById('siteNavOverlay');

        if (!toggle || !panel || !overlay) {
            return;
        }

        const mobileBreakpoint = window.matchMedia('(max-width: 980px)');

        function openNav() {
            panel.classList.add('is-open');
            overlay.hidden = false;
            requestAnimationFrame(function () {
                overlay.classList.add('is-visible');
            });
            document.body.style.overflow = 'hidden';
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Fermer le menu');
            overlay.setAttribute('aria-hidden', 'false');
        }

        function closeNav() {
            panel.classList.remove('is-open');
            overlay.classList.remove('is-visible');
            document.body.style.overflow = '';
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Ouvrir le menu');
            overlay.setAttribute('aria-hidden', 'true');

            window.setTimeout(function () {
                if (!panel.classList.contains('is-open')) {
                    overlay.hidden = true;
                }
            }, 220);
        }

        toggle.addEventListener('click', function () {
            if (panel.classList.contains('is-open')) {
                closeNav();
            } else {
                openNav();
            }
        });

        overlay.addEventListener('click', closeNav);

        panel.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeNav();
            }
        });

        function syncDesktopState() {
            if (!mobileBreakpoint.matches) {
                closeNav();
                overlay.hidden = true;
            }
        }

        if (typeof mobileBreakpoint.addEventListener === 'function') {
            mobileBreakpoint.addEventListener('change', syncDesktopState);
        } else if (typeof mobileBreakpoint.addListener === 'function') {
            mobileBreakpoint.addListener(syncDesktopState);
        }
    }

    function initActiveSectionLinks() {
        const header = document.querySelector('.site-header');
        const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));

        if (!navLinks.length) {
            return;
        }

        const sections = navLinks
            .map(function (link) {
                const target = document.querySelector(link.getAttribute('href'));
                return target ? { link: link, section: target } : null;
            })
            .filter(Boolean);

        if (!sections.length) {
            return;
        }

        function syncActiveLink() {
            const offset = (header ? header.offsetHeight : 0) + 56;
            let activeId = '#top';

            sections.forEach(function (entry) {
                if (window.scrollY + offset >= entry.section.offsetTop) {
                    activeId = '#' + entry.section.id;
                }
            });

            navLinks.forEach(function (link) {
                const isActive = link.getAttribute('href') === activeId;
                link.classList.toggle('is-active', isActive);

                if (isActive) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }

        syncActiveLink();
        window.addEventListener('scroll', syncActiveLink, { passive: true });
        window.addEventListener('resize', syncActiveLink);
    }

    function initSectionReveal() {
        const sections = document.querySelectorAll('.section-reveal');

        if (!sections.length) {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
            sections.forEach(function (section) {
                section.classList.add('is-visible');
            });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.16,
            rootMargin: '0px 0px -40px 0px'
        });

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    function initCarouselControls() {
        const track = document.querySelector('[data-carousel]');
        const buttons = document.querySelectorAll('[data-carousel-action]');

        if (!track || !buttons.length) {
            return;
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                const direction = button.getAttribute('data-carousel-action') === 'next' ? 1 : -1;
                const amount = Math.max(track.clientWidth * 0.75, 280);

                track.scrollBy({
                    left: direction * amount,
                    behavior: 'smooth'
                });
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initStickyHeader();
        initMobileNavigation();
        initActiveSectionLinks();
        initSectionReveal();
        initCarouselControls();
    });
})();
