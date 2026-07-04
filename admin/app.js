/**
 * SPS TUNAS MELATI - Engine Konten Dinamis & Firebase Auth
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// KONFIGURASI PROYEK FIREBASE RESMI (tnsmelatidkl)
const firebaseConfig = {
  apiKey: "AIzaSyA1zxBRXwKGwj7Tz3Rcy3vWTtu9aQNKY84",
  authDomain: "tnsmelatidkl.firebaseapp.com",
  projectId: "tnsmelatidkl",
  storageBucket: "tnsmelatidkl.firebasestorage.app",
  messagingSenderId: "915178991722",
  appId: "1:915178991722:web:b465200ab481a5939e9a13"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DATABASE KONTEN DEFAULT LENGKAP UTK SELURUH ELEMEN WEB
const defaultWebData = {
    schoolName: "SPS TUNAS MELATI",
    heroSubTitle: "SISTEM PENERIMAAN MURID BARU",
    schoolAddress: "Dongkelan - Panggungharjo",
    donationTitle: "🏫 Donasi Pembangunan Gedung Baru SPS Tunas Melati",
    donationSub: '"Bersama kita wujudkan tempat belajar yang nyaman untuk anak-anak."',
    navTitle1: "Profil Sekolah", navSub1: "Kenali kami lebih dekat",
    navTitle2: "Program Belajar", navSub2: "Kegiatan seru anak",
    navTitle3: "Galeri", navSub3: "Dokumentasi ceria",
    navTitle4: "Guru", navSub4: "Pendidik tersayang",
    navTitle5: "PPDB", navSub5: "Pendaftaran baru",
    navTitle6: "Fasilitas", navSub6: "Sarana pendukung",
    navTitle7: "Kontak", navSub7: "Hubungi admin",
    navTitle8: "Lokasi", navSub8: "Peta petunjuk",
    titleSecProfil: "Profil Sekolah",
    titleWelcomeSpeech: "💬 Sambutan Kepala Sekolah",
    welcomeSpeech: '"Selamat datang di SPS Tunas Melati Dongkelan. Kami berkomitmen untuk menghadirkan lingkungan belajar yang aman, ceria, dan merangsang perkembangan motorik serta karakter budi pekerti luhur sejak dini."',
    titleVision: "🎯 Visi",
    visionText: "Terwujudnya anak usia dini yang cerdas, ceria, mandiri, dan berkarakter islami/budi pekerti luhur sejak usia emas.",
    titleMission: "🚀 Misi",
    misi1: "Menyelenggarakan pembelajaran aktif berbasis bermain.",
    misi2: "Mengembangkan kreativitas dan rasa percaya diri anak.",
    misi3: "Menjalin kemitraan yang harmonis dengan orang tua murid.",
    titleSecProgram: "Program Belajar",
    progTitle1: "Membaca", progDesc1: "Pengenalan huruf dan angka lewat cerita bergambar interaktif.",
    progTitle2: "Menggambar", progDesc2: "Mengeksplorasi warna untuk mengasah motorik halus anak.",
    progTitle3: "Musik", progDesc3: "Bernyanyi bersama melatih kecerdasan auditori dan ritme.",
    textCtaTitle: "Ayo Bergabung Bersama SPS Tunas Melati",
    textCtaSub: "Pendaftaran Murid Baru Tahun Ajaran Baru Telah Dibuka. Kuota Terbatas!",
    footerTextName: "SPS TUNAS MELATI",
    footerTextAddress: "Dongkelan, RT 04, Panggungharjo, Sewon, Bantul, D.I. Yogyakarta.",
    footerTextPhone: "📞 WhatsApp: +62 812-3456-789",
    footerTextEmail: "✉️ Email: spstunasmelati@gmail.com"
};

// Lifecycle Inisialisasi Berdasarkan Halaman Yang Sedang Aktif
document.addEventListener('DOMContentLoaded', () => {
    const isEditingPage = document.getElementById('adminPanelForm') !== null;
    
    if (isEditingPage) {
        // Mode Halaman Admin
        setupAdminEventListeners();
        monitorAdminAuthState();
    } else {
        // Mode Halaman User Utama
        renderClientWebsiteData();
        setupClientEventListeners();
    }
});

/* ==========================================================================
   ENGINE HALAMAN UTAMA (CLIENT SITE)
   ========================================================================== */
function renderClientWebsiteData() {
    const localData = localStorage.getItem('sps_tunas_melati_data');
    const data = localData ? JSON.parse(localData) : defaultWebData;

    // Mapping otomatis ke DOM ID di index.html
    Object.keys(defaultWebData).forEach(key => {
        // Konversi key camelCase jadi format ID kebab-case (contoh: schoolName -> text-school-name atau schoolName -> school-name)
        const elementId = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        
        // Coba cari elemen dengan prefix "text-" terlebih dahulu, jika gagal cari ID aslinya
        let element = document.getElementById(`text-${elementId}`) || document.getElementById(elementId);
        
        if (element) {
            element.innerText = data[key];
        }
    });
}

function setupClientEventListeners() {
    // Navigasi Smooth Launcher Grid
    document.querySelectorAll('.app-launcher-grid .launcher-card[data-target]').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Event Handler Eksternal
    document.getElementById('btnContactWA')?.addEventListener('click', () => { window.open('https://wa.me/628123456789', '_blank'); });
    document.getElementById('btnCtaDaftar')?.addEventListener('click', () => { window.open('https://wa.me/628123456789?text=Daftar', '_blank'); });

    // Viewer Modal Galeri Singkat
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            document.getElementById('galleryModalImg').src = item.querySelector('img').src;
            document.getElementById('galleryModal').classList.add('active');
        });
    });
    document.getElementById('galleryModal')?.addEventListener('click', () => {
        document.getElementById('galleryModal').classList.remove('active');
    });
}

/* ==========================================================================
   ENGINE DASHBOARD MANAJEMEN (ADMIN PAGE TERSENDIRI)
   ========================================================================== */
function monitorAdminAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Jika terautentikasi, buka panel editor dan isi data input form
            document.getElementById('adminLoginForm').classList.add('hidden');
            document.getElementById('adminPanelForm').classList.remove('hidden');
            loadCurrentDataToInputs();
        } else {
            // Jika belum login / logout, tampilkan form login utama
            document.getElementById('adminPanelForm').classList.add('hidden');
            document.getElementById('adminLoginForm').classList.remove('hidden');
        }
    });
}

async function handleAdminLogin() {
    const email = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;
    const btn = document.getElementById('btnAdminLogin');

    if (!email || !pass) { alert("Email dan password admin wajib diisi, Bro!"); return; }

    try {
        btn.innerText = "Memverifikasi..."; btn.disabled = true;
        await signInWithEmailAndPassword(auth, email, pass);
        alert("🔑 Login Sukses! Dashboard editor terbuka.");
    } catch (error) {
        alert("Gagal masuk: Akun salah atau tidak terdaftar di Firebase Auth.");
    } finally {
        btn.innerText = "Masuk Ke Dashboard"; btn.disabled = false;
    }
}

function loadCurrentDataToInputs() {
    const localData = localStorage.getItem('sps_tunas_melati_data');
    const data = localData ? JSON.parse(localData) : defaultWebData;

    // Masukkan data lama ke dalam masing-masing kolom input editor
    Object.keys(defaultWebData).forEach(key => {
        const elementId = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        const inputElement = document.getElementById(`input-${elementId}`);
        if (inputElement) {
            inputElement.value = data[key] || '';
        }
    });
}

function saveAllAdminChanges() {
    if (!auth.currentUser) { alert("Sesi kadaluarsa. Silakan login kembali."); return; }

    const updatedData = {};
    Object.keys(defaultWebData).forEach(key => {
        const elementId = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        const inputElement = document.getElementById(`input-${elementId}`);
        if (inputElement) {
            updatedData[key] = inputElement.value;
        } else {
            updatedData[key] = defaultWebData[key]; // Fallback ke default jika tidak ada inputan
        }
    });

    localStorage.setItem('sps_tunas_melati_data', JSON.stringify(updatedData));
    alert("🎉 Selesai! Semua konten website berhasil diperbarui secara massal.");
    window.location.href = "index.html"; // Redirect kembali ke beranda utama
}

function setupAdminEventListeners() {
    document.getElementById('btnAdminLogin').addEventListener('click', handleAdminLogin);
    document.getElementById('btnAdminLogout').addEventListener('click', () => signOut(auth));
    document.getElementById('btnSaveAdminChanges').addEventListener('click', saveAllAdminChanges);
}
