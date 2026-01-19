document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        lang: localStorage.getItem('lang') || 'en',
        theme: localStorage.getItem('theme') || 'dark'
    };

    // --- Init ---
    applyTheme(state.theme);
    applyLanguage(state.lang);
    loadStaticClinicInfo();
    setupEventListeners();

    // --- Functions ---
    function setupEventListeners() {
        // Theme Toggle (if buttons existed, but we are using dark mode by default/class)
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                state.theme = state.theme === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', state.theme);
                applyTheme(state.theme);
            });
        }

        // Language Toggle
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.addEventListener('click', () => {
                state.lang = state.lang === 'so' ? 'en' : 'so';
                localStorage.setItem('lang', state.lang);
                applyLanguage(state.lang);
            });
        }

        // Contact Form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactSubmit);
        }

        // Mobile Menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileMenu.classList.toggle('hidden');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                }
            });

            // Close mobile menu when clicking links
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });
        }

        // --- Interactive Hero Background ---
        const hero = document.getElementById('home');
        if (hero) {
            hero.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = hero.getBoundingClientRect();

                const xPos = (clientX - left) / width - 0.5;
                const yPos = (clientY - top) / height - 0.5;

                hero.style.setProperty('--mouse-x', xPos);
                hero.style.setProperty('--mouse-y', yPos);
            });
        }

        // --- Smart Header Visibility ---
        let lastScrollY = window.scrollY;
        const header = document.querySelector('header');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Hide header on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            // Glass effect intensity on scroll
            if (currentScrollY > 50) {
                header.classList.add('shadow-md');
            } else {
                header.classList.remove('shadow-md');
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    function applyTheme(theme) {
        const doc = document.documentElement;
        if (theme === 'dark') {
            doc.classList.add('dark');
        } else {
            doc.classList.remove('dark');
        }
    }

    function applyLanguage(lang) {
        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                // If it contains HTML (like <strong>), use innerHTML, else textContent
                if (text.includes('<')) {
                    el.innerHTML = text;
                } else {
                    el.textContent = text;
                }
            }
        });

        // Toggle button text
        const langBtnText = document.getElementById('lang-toggle-text');
        if (langBtnText) {
            langBtnText.textContent = lang === 'so' ? 'English' : 'Somali';
        }

        // Update document lang attribute
        document.documentElement.lang = lang;
    }

    function loadStaticClinicInfo() {
        const data = {
            location: "Arabsiyo, Somaliland",
            email: "Baxnaanovet@gmail.com",
            call: "+252 63 8877111",
            whatsapp: "+252 63 4631496"
        };

        // Populate contact details
        document.querySelectorAll('.clinic-location').forEach(el => el.textContent = data.location);
        document.querySelectorAll('.clinic-email').forEach(el => el.textContent = data.email);
        document.querySelectorAll('.clinic-phone').forEach(el => el.textContent = data.call);
        document.querySelectorAll('.clinic-whatsapp').forEach(el => {
            const cleanWhatsapp = data.whatsapp.replace(/\D/g, '');
            el.href = `https://wa.me/${cleanWhatsapp}`;
        });
    }

    async function handleContactSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = state.lang === 'en' ? 'Sending...' : 'Diraya...';

        // Simulate network delay
        setTimeout(() => {
            alert(state.lang === 'en'
                ? 'Thank you! Your message has been received (Static Demo).'
                : 'Waad ku mahadsantahay! Farriintaada waa la helay (Static Demo).');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1500);
    }
});