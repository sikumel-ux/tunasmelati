/**
 * SPS TUNAS MELATI - Core Engine Application
 * Desain Interaksi Halus & Sistem Manajemen Konten Lokal (CMS Simulator)
 */

document.addEventListener('DOMContentLoaded', () => {
    initContentData();
    initScrollReveal();
    initRippleEffect();
});

/* ==========================================================================
   1. CORE CMS DATA MANAGEMENT (Simulasi Database LocalStorage)
   ========================================================================== */
// Data default awal sistem web resmi
const defaultWebData = {
    schoolName: "SPS TUNAS MELATI",
    schoolAddress: "Dongkelan - Panggungharjo",
    donationTitle: "🏫 Donasi Pembangunan Gedung Baru SPS Tunas Melati",
    donationSub: '"Bersama kita wujudkan tempat belajar yang nyaman untuk anak-anak."',
    welcomeSpeech: '"Selamat datang di SPS Tunas Melati Dongkelan. Kami berkomitmen untuk menghadirkan lingkungan belajar yang aman, ceria, dan merangsang perkembangan motorik serta karakter budi pekerti luhur sejak dini."',
    visionText: "Terwujudnya anak usia dini yang cerdas, ceria, mandiri, dan berkarakter islami/budi pekerti luhur sejak usia emas."
};

// Fungsi memuat data tekstual ter-update ke DOM halaman
function initContentData() {
    let currentData = localStorage.getItem('sps_tunas_melati_data');
    if (!currentData) {
        localStorage.setItem('sps_tunas_melati_data', JSON.stringify(defaultWebData));
        currentData = JSON.stringify(defaultWebData);
    }
    
    const data = JSON.parse(currentData);
    
    // Inject data ke elemen HTML target
    document.getElementById('text-school-name').innerText = data.schoolName;
    document.getElementById('text-school-address').innerText = data.schoolAddress;
    document.getElementById('text-donation-title').innerText = data.donationTitle;
    document.getElementById('text-donation-sub').innerText = data.donationSub;
    document.getElementById('text-welcome').innerText = data.welcomeSpeech;
    document.getElementById('text-vision').innerText = data.visionText;
}

/* ==========================================================================
   2. AUTHENTICATION & PANEL ADMIN INTERACTIVE CONTROLLER
   ========================================================================== */
let isAdminLoggedIn = false;

function toggleAdminModal() {
    const modal = document.getElementById('adminModal');
    modal.classList.toggle('active');
    
    // Jika user sudah masuk sebelumnya, langsung tampilkan dashboard editor
    if(modal.classList.contains('active') && isAdminLoggedIn) {
        showAdminDashboard();
    }
}

// Simulasi Keamanan Validasi Akun Pengelola
function handleAdminLogin() {
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    
    // Akun default (Aman untuk standarisasi pengelolaan website)
    if (user === "admin" && pass === "tunasmelati2026") {
        isAdminLoggedIn = true;
        showAdminDashboard();
    } else {
        alert("Kombinasi Username atau Password salah! Silahkan coba lagi.");
    }
}

function showAdminDashboard() {
    document.getElementById('adminLoginForm').classList.add('hidden');
    document.getElementById('adminPanelForm').classList.remove('hidden');
    
    // Mengisi kolom input editor berdasarkan data terkini di DOM
    const currentData = JSON.parse(localStorage.getItem('sps_tunas_melati_data'));
    document.getElementById('input-school-name').value = currentData.schoolName;
    document.getElementById('input-school-address').value = currentData.schoolAddress;
    document.getElementById('input-donation-title').value = currentData.donationTitle;
    document.getElementById('input-donation-sub').value = currentData.donationSub;
    document.getElementById('input-welcome').value = currentData.welcomeSpeech;
    document.getElementById('input-vision').value = currentData.visionText;
}

// Fungsi Menyimpan Data Hasil Perubahan Admin
function saveAdminChanges() {
    const updatedData = {
        schoolName: document.getElementById('input-school-name').value,
        schoolAddress: document.getElementById('input-school-address').value,
        donationTitle: document.getElementById('input-donation-title').value,
        donationSub: document.getElementById('input-donation-sub').value,
        welcomeSpeech: document.getElementById('input-welcome').value,
        visionText: document.getElementById('input-vision').value
    };
    
    localStorage.setItem('sps_tunas_melati_data', JSON.stringify(updatedData));
    initContentData(); // Refresh UI seketika tanpa reloading page
    toggleAdminModal(); // Close window modal
    alert("🎉 Selamat! Perubahan data website berhasil disimpan.");
}

function handleAdminLogout() {
    isAdminLoggedIn = false;
    document.getElementById('adminUser').value = "";
    document.getElementById('adminPass').value = "";
    document.getElementById('adminPanelForm').classList.add('hidden');
    document.getElementById('adminLoginForm').classList.remove('hidden');
    toggleAdminModal();
}

/* ==========================================================================
   3. ANIMASI INTERAKSI (Scroll Reveal & Efek Ripple Taktil Android)
   ========================================================================== */
// Smooth Scroll navigasi Launcher Card
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Scroll Reveal - Muncul berurutan halus saat user menggeser layar
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 80; // offset pixel memicu trigger
            
            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('reveal-active');
            }
        }
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Jalankan sekali saat load untuk mengecek area viewport atas
}

// Efek Gelombang Sentuh Ripple (Menciptakan kesan Aplikasi Native Android premium)
function initRippleEffect() {
    const rippleElements = document.querySelectorAll('.ripple-effect');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // Bersihkan jika ada ripple tersisa sebelumnya
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) { existingRipple.remove(); }

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // Kalkulasi posisi titik sentuh user
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
        });
    });
}

/* ==========================================================================
   4. MODAL DETIL GALERI FOTO
   ========================================================================== */
function openGalleryModal(element) {
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('galleryModalImg');
    const modalCaption = document.getElementById('galleryModalCaption');
    const clickedImg = element.querySelector('img');
    
    modalImg.src = clickedImg.src;
    modalCaption.innerText = clickedImg.alt;
    modal.classList.add('active');
}

function closeGalleryModal() {
    document.getElementById('galleryModal').classList.remove('active');
}
