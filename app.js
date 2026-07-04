/**
 * SPS Tunas Melati - Official Website Script
 * Vanilla JS (No Frameworks) - Modern Architectural Design Patterns 2026
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 2. MOBILE MENU NAVIGATION (TOGGLE)
    // ==========================================
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Tutup menu saat link diklik
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Set active class link
                navLinks.forEach(item => item.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    // ==========================================
    // 3. RIPPLE BUTTON EFFECT
    // ==========================================
    const rippleButtons = document.querySelectorAll('.btn-ripple');

    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;
            
            let ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // ==========================================
    // 4. SCROLL REVEAL (FADE IN ON SCROLL)
    // ==========================================
    const revealItems = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        for (let i = 0; i < revealItems.length; i++) {
            let windowHeight = window.innerHeight;
            let elementTop = revealItems[i].getBoundingClientRect().top;
            let elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                revealItems[i].classList.add('reveal-active');
            }
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Jalankan sekali saat load pertama

    // ==========================================
    // 5. STATS ANIMATED COUNTER
    // ==========================================
    const statsSection = document.querySelector('.section-stats');
    const counters = document.querySelectorAll('.stat-number');
    let counterActivated = false;

    const startCounters = () => {
        counters.forEach(counter => {
            counter.innerText = '0';
            const target = +counter.getAttribute('data-target');
            const speed = target / 50; // Atur durasi penambahan

            const updateCounter = () => {
                const count = +counter.innerText;
                if (count < target) {
                    counter.innerText = Math.ceil(count + speed);
                    setTimeout(updateCounter, 30);
                } else {
                    counter.innerText = target + (target === 100 ? '%' : '+');
                }
            };
            updateCounter();
        });
    };

    // Trigger counter saat masuk ke viewport viewport
    if (statsSection) {
        window.addEventListener('scroll', () => {
            const sectionPos = statsSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight;

            if (sectionPos < screenPos && !counterActivated) {
                startCounters();
                counterActivated = true;
            }
        });
    }

    // ==========================================
    // 6. TESTIMONIAL AUTOMATIC SLIDER
    // ==========================================
    const slider = document.querySelector('.testimonial-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 Detik ganti otomatis

    const goToSlide = (n) => {
        if (!slider) return;
        slider.style.transform = `translateX(-${n * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[n].classList.add('active');
        currentSlide = n;
    };

    const nextSlide = () => {
        let next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    };

    if (slider && slides.length > 0) {
        let timer = setInterval(nextSlide, slideInterval);

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                clearInterval(timer); // Reset timer jika di klik manual
                const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                goToSlide(slideIndex);
                timer = setInterval(nextSlide, slideInterval);
            });
        });
    }

    // ==========================================
    // 7. GALERI LIGHTBOX MODAL PREVIEW
    // ==========================================
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImg');
    const captionText = document.getElementById('modalCaption');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const closeBtn = document.querySelector('.modal-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const overlayText = this.querySelector('.gallery-overlay span').innerText;
            
            if(modal) {
                modal.style.display = 'block';
                modalImg.src = img.src;
                captionText.innerHTML = overlayText;
            }
        });
    });

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Tutup saat area luar gambar diklik
        modal.addEventListener('click', (e) => {
            if(e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});
