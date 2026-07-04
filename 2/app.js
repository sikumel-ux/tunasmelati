/**
 * SPS TUNAS MELATI - Core Engine Application
 * Terintegrasi Resmi dengan Google Firebase Auth & Real-time Client Engine
 */

// 1. IMPORT FIREBASE SDK RESMI (Versi CDN Ringan Moduler)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 2. KONFIGURASI PROYEK FIREBASE (tnsmelatidkl)
const firebaseConfig = {
  apiKey: "AIzaSyA1zxBRXwKGwj7Tz3Rcy3vWTtu9aQNKY84",
  authDomain: "tnsmelatidkl.firebaseapp.com",
  projectId: "tnsmelatidkl",
  storageBucket: "tnsmelatidkl.firebasestorage.app",
  messagingSenderId: "915178991722",
  appId: "1:915178991722:web:b465200ab481a5939e9a13"
};

// Inisialisasi Firebase Core & Layanan Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// State Manajemen Lokal Konten
let isAdminLoggedIn = false;
const defaultWebData = {
    schoolName: "SPS TUNAS MELATI",
    schoolAddress: "Dongkelan - Panggungharjo",
    donationTitle: "🏫 Donasi Pembangunan Gedung Baru SPS Tunas Melati",
    donationSub: '"Bersama kita wujudkan tempat belajar yang nyaman untuk anak-anak."',
    welcomeSpeech: '"Selamat datang di SPS Tunas Melati Dongkelan. Kami berkomitmen untuk menghadirkan lingkungan belajar yang aman, ceria, dan merangsang perkembangan motorik serta karakter budi pekerti luhur sejak dini."',
    visionText: "Terwujudnya anak usia dini yang cerdas, ceria, mandiri, dan berkarakter islami/budi pekerti luhur sejak usia emas."
};

// Lifecycle Mulai Aplikasi saat DOM Siap
document.addEventListener('DOMContentLoaded', () => {
    initContentData();
    initScrollReveal();
    initRippleEffect();
    setupEventListeners();
    monitorAuthState();
});

/* ==========================================================================
   FIREBASE AUTH CONTROLLER & MONITORING
   ========================================================================== */

function monitorAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            isAdminLoggedIn = true;
            document.getElementById('adminTriggerBtn').innerText = "🛠️ Dashboard";
        } else {
            isAdminLoggedIn = false;
            document.getElementById('adminTriggerBtn').innerText = "🔒 Admin";
        }
    });
}

async function handleAdminLogin() {
    const email = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    const loginBtn = document.getElementById('btnAdminLogin');

    if (!email || !pass) {
        alert("Bro, email dan password admin wajib diisi!");
        return;
    }

    try {
        loginBtn.innerText = "Memverifikasi... OTW";
        loginBtn.disabled = true;

        await signInWithEmailAndPassword(auth, email, pass);
        
        showAdminDashboard();
        alert("🔑 Login Sukses via Firebase! Hak akses dikonfirmasi.");
    } catch (error) {
        console.error("Firebase Auth Error:", error.code);
        let errorMsg = "Gagal login. Periksa kembali email & password akun Firebase Anda.";
        if (error.code === "auth/invalid-credential") errorMsg = "Email atau Password salah, Bro!";
        if (error.code === "auth/invalid-email") errorMsg = "Format penulisan email salah.";
        
        alert(errorMsg);
    } finally {
        loginBtn.innerText = "Masuk Sistem";
        loginBtn.disabled = false;
    }
}

async function handleAdminLogout() {
    try {
        await signOut(auth);
        
        document.getElementById('adminUser').value = "";
        document.getElementById('adminPass').value = "";
        
        document.getElementById('adminPanelForm').classList.add('hidden');
        document.getElementById('adminLoginForm').classList.remove('hidden');
        
        toggleAdminModal();
        alert("🔒 Sesi Firebase berakhir. Anda berhasil keluar.");
    } catch (error) {
        alert("Gagal keluar dari sesi: " + error.message);
    }
}

function showAdminDashboard() {
    document.getElementById('adminLoginForm').classList.add('hidden');
    document.getElementById('adminPanelForm').classList.remove('hidden');
    
    const currentData = JSON.parse(localStorage.getItem('sps_tunas_melati_data')) || defaultWebData;
    document.getElementById('input-school-name').value = currentData.schoolName || '';
    document.getElementById('input-school-address').value = currentData.schoolAddress || '';
    document.getElementById('input-donation-title').value = currentData.donationTitle || '';
    document.getElementById('input-donation-sub').value = currentData.donationSub || '';
    document.getElementById('input-welcome').value = currentData.welcomeSpeech || '';
    document.getElementById('input-vision').value = currentData.visionText || '';
}

function saveAdminChanges() {
    if (!auth.currentUser || !isAdminLoggedIn) {
        alert("Akses ilegal terdeteksi! Anda tidak terautentikasi di Firebase.");
        return;
    }

    const updatedData = {
        schoolName: document.getElementById('input-school-name').value,
        schoolAddress: document.getElementById('input-school-address').value,
        donationTitle: document.getElementById('input-donation-title').value,
        donationSub: document.getElementById('input-donation-sub').value,
        welcomeSpeech: document.getElementById('input-welcome').value,
        visionText: document.getElementById('input-vision').value
    };
    
    localStorage.setItem('sps_tunas_melati_data', JSON.stringify(updatedData));
    initContentData();
    toggleAdminModal();
    alert("🎉 Mantap, perubahan data web berhasil diperbarui!");
}

/* ==========================================================================
   UI CORE UTILITY FUNCTIONS
   ========================================================================== */

function toggleAdminModal() {
    const modal = document.getElementById('adminModal');
    modal.classList.toggle('active');
    
    if(modal.classList.contains('active') && isAdminLoggedIn) {
        showAdminDashboard();
    }
}

function initContentData() {
    let currentData = localStorage.getItem('sps_tunas_melati_data');
    if (!currentData) {
        localStorage.setItem('sps_tunas_melati_data', JSON.stringify(defaultWebData));
        currentData = JSON.stringify(defaultWebData);
    }
    const data = JSON.parse(currentData);
    document.getElementById('text-school-name').innerText = data.schoolName;
    document.getElementById('text-school-address').innerText = data.schoolAddress;
    document.getElementById('text-donation-title').innerText = data.donationTitle;
    document.getElementById('text-donation-sub').innerText = data.donationSub;
    document.getElementById('text-welcome').innerText = data.welcomeSpeech;
    document.getElementById('text-vision').innerText = data.visionText;
}

// Sentralisasi Event Listener (Sangat krusial untuk JS bertipe Module)
function setupEventListeners() {
    // Trigger Sesi Modals Admin
    document.getElementById('adminTriggerBtn').addEventListener('click', toggleAdminModal);
    document.getElementById('btnCloseAdminModal').addEventListener('click', toggleAdminModal);
    document.getElementById('btnAdminLogin').addEventListener('click', handleAdminLogin);
    document.getElementById('btnAdminLogout').addEventListener('click', handleAdminLogout);
    document.getElementById('btnSaveAdminChanges').addEventListener('click', saveAdminChanges);

    // Navigasi Launcher Cards
    document.querySelectorAll('.app-launcher-grid .launcher-card[data-target]').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            scrollToSection(target);
        });
    });

    // Tombol Eksternal khusus WA & Donasi
    document.getElementById('donationBanner').addEventListener('click', () => { location.href = 'donasi.html'; });
    document.getElementById('btnContactWA').addEventListener('click', () => { window.open('https://wa.me/628123456789', '_blank'); });
    document.getElementById('btnCtaDaftar').addEventListener('click', () => { window.open('https://wa.me/628123456789?text=Halo%20SPS%20Tunas%20Melati,%20saya%20ingin%20mendaftar.', '_blank'); });

    // Viewer Modal Galeri Foto
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => openGalleryModal(item));
    });
    document.getElementById('galleryModal').addEventListener('click', closeGalleryModal);
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if(element) { element.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealOnScroll = () => {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            if (elementTop < windowHeight - 80) {
                revealElements[i].classList.add('reveal-active');
            }
        }
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
}

function initRippleEffect() {
    document.querySelectorAll('.ripple-effect').forEach(element => {
        element.addEventListener('click', function(e) {
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) { existingRipple.remove(); }
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            this.appendChild(ripple);
        });
    });
}

function openGalleryModal(element) {
    const clickedImg = element.querySelector('img');
    document.getElementById('galleryModalImg').src = clickedImg.src;
    document.getElementById('galleryModalCaption').innerText = clickedImg.alt;
    document.getElementById('galleryModal').classList.add('active');
}

function closeGalleryModal() {
    document.getElementById('galleryModal').classList.remove('active');
}
