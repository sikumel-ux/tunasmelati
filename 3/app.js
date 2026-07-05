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

// Ambil data dari LocalStorage atau pakai default jika kosong
function getWebData() {
    const localData = localStorage.getItem('sps_tunas_melati_data');
    return localData ? JSON.parse(localData) : defaultWebData;
}

// Lifecycle Inisialisasi Berdasarkan Halaman Yang Sedang Aktif
document.addEventListener('DOMContentLoaded', () => {
    const isEditingPage = document.getElementById('adminPanelForm') !== null;
    
    if (isEditingPage) {
        setupAdminEventListeners();
        monitorAdminAuthState();
    } else {
        renderClientWebsiteData();
        setupClientEventListeners();
    }
});

/* ==========================================================================
   ENGINE HALAMAN UTAMA (CLIENT SITE - INDEX.HTML)
   ========================================================================== */
function renderClientWebsiteData() {
    const data = getWebData();

    // Pemetaan manual ID HTML di index.html ke key object data (Anti-Undefined)
    const elementMapping = {
        'text-school-name': data.schoolName,
        'text-hero-sub-title': data.heroSubTitle,
        'text-school-address': data.schoolAddress,
        'text-donation-title': data.donationTitle,
        'text-donation-sub': data.donationSub,
        'nav-title-1': data.navTitle1, 'nav-sub-1': data.navSub1,
        'nav-title-2': data.navTitle2, 'nav-sub-2': data.navSub2,
        'nav-title-3': data.navTitle3, 'nav-sub-3': data.navSub3,
        'nav-title-4': data.navTitle4, 'nav-sub-4': data.navSub4,
        'nav-title-5': data.navTitle5, 'nav-sub-5': data.navSub5,
        'nav-title-6': data.navTitle6, 'nav-sub-6': data.navSub6,
        'nav-title-7': data.navTitle7, 'nav-sub-7': data.navSub7,
        'nav-title-8': data.navTitle8, 'nav-sub-8': data.navSub8,
        'title-sec-profil': data.titleSecProfil,
        'title-welcome-speech': data.titleWelcomeSpeech,
        'text-welcome': data.welcomeSpeech,
        'title-vision': data.titleVision,
        'text-vision': data.visionText,
        'title-mission': data.titleMission,
        'misi-1': data.misi1,
        'misi-2': data.misi2,
        'misi-3': data.misi3,
        'title-sec-program': data.titleSecProgram,
        'prog-title-1': data.progTitle1, 'prog-desc-1': data.progDesc1,
        'prog-title-2': data.progTitle2, 'prog-desc-2': data.progDesc2,
        'prog-title-3': data.progTitle3, 'prog-desc-3': data.progDesc3,
        'text-cta-title': data.textCtaTitle,
        'text-cta-sub': data.textCtaSub,
        'footer-text-name': data.footerTextName,
        'footer-text-address': data.footerTextAddress,
        'footer-text-phone': data.footerTextPhone,
        'footer-text-email': data.footerTextEmail
    };

    // Terapkan data ke HTML jika elemennya ditemukan
    Object.keys(elementMapping).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerText = elementMapping[id] || "";
        }
    });
}

function setupClientEventListeners() {
    document.querySelectorAll('.app-launcher-grid .launcher-card[data-target]').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    document.getElementById('btnContactWA')?.addEventListener('click', () => { window.open('https://wa.me/628123456789', '_blank'); });
    document.getElementById('btnCtaDaftar')?.addEventListener('click', () => { window.open('https://wa.me/628123456789?text=Daftar', '_blank'); });

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
   ENGINE DASHBOARD MANAJEMEN (ADMIN.HTML)
   ========================================================================== */
function monitorAdminAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('adminLoginForm').classList.add('hidden');
            document.getElementById('adminPanelForm').classList.remove('hidden');
            loadCurrentDataToInputs();
        } else {
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
    } military {
        btn.innerText = "Masuk Ke Dashboard"; btn.disabled = false;
    }
}

function loadCurrentDataToInputs() {
    const data = getWebData();

    // Pemetaan manual untuk value input form di admin.html (Anti-Undefined)
    const inputMapping = {
        'input-school-name': data.schoolName,
        'input-hero-sub-title': data.heroSubTitle,
        'input-school-address': data.schoolAddress,
        'input-donation-title': data.donationTitle,
        'input-donation-sub': data.donationSub,
        'input-nav-title-1': data.navTitle1, 'input-nav-sub-1': data.navSub1,
        'input-nav-title-2': data.navTitle2, 'input-nav-sub-2': data.navSub2,
        'input-nav-title-3': data.navTitle3, 'input-nav-sub-3': data.navSub3,
        'input-nav-title-4': data.navTitle4, 'input-nav-sub-4': data.navSub4,
        'input-title-sec-profil': data.titleSecProfil,
        'input-title-welcome-speech': data.titleWelcomeSpeech,
        'input-welcome': data.welcomeSpeech,
        'input-title-vision': data.titleVision,
        'input-vision': data.visionText,
        'input-title-mission': data.titleMission,
        'input-misi-1': data.misi1,
        'input-misi-2': data.misi2,
        'input-misi-3': data.misi3,
        'input-title-sec-program': data.titleSecProgram,
        'input-prog-title-1': data.progTitle1, 'input-prog-desc-1': data.progDesc1,
        'input-prog-title-2': data.progTitle2, 'input-prog-desc-2': data.progDesc2,
        'input-prog-title-3': data.progTitle3, 'input-prog-desc-3': data.progDesc3,
        'input-text-cta-title': data.textCtaTitle,
        'input-text-cta-sub': data.textCtaSub,
        'input-footer-text-name': data.footerTextName,
        'input-footer-text-address': data.footerTextAddress,
        'input-footer-text-phone': data.footerTextPhone,
        'input-footer-text-email': data.footerTextEmail
    };

    Object.keys(inputMapping).forEach(id => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.value = inputMapping[id] || "";
        }
    });
}

function saveAllAdminChanges() {
    if (!auth.currentUser) { alert("Sesi kadaluarsa. Silakan login kembali."); return; }

    // Ambil value langsung dari masing-masing input ID secara presisi
    const updatedData = {
        schoolName: document.getElementById('input-school-name').value,
        heroSubTitle: document.getElementById('input-hero-sub-title').value,
        schoolAddress: document.getElementById('input-school-address').value,
        donationTitle: document.getElementById('input-donation-title').value,
        donationSub: document.getElementById('input-donation-sub').value,
        navTitle1: document.getElementById('input-nav-title-1').value,
        navSub1: document.getElementById('input-nav-sub-1').value,
        navTitle2: document.getElementById('input-nav-title-2').value,
        navSub2: document.getElementById('input-nav-sub-2').value,
        navTitle3: document.getElementById('input-nav-title-3').value,
        navSub3: document.getElementById('input-nav-sub-3').value,
        navTitle4: document.getElementById('input-nav-title-4').value,
        navSub4: document.getElementById('input-nav-sub-4').value,
        // Menu 5-8 opsional (ambil dari form atau fallback ke default)
        navTitle5: defaultWebData.navTitle5, navSub5: defaultWebData.navSub5,
        navTitle6: defaultWebData.navTitle6, navSub6: defaultWebData.navSub6,
        navTitle7: defaultWebData.navTitle7, navSub7: defaultWebData.navSub7,
        navTitle8: defaultWebData.navTitle8, navSub8: defaultWebData.navSub8,
        titleSecProfil: document.getElementById('input-title-sec-profil').value,
        titleWelcomeSpeech: document.getElementById('input-title-welcome-speech').value,
        welcomeSpeech: document.getElementById('input-welcome').value,
        titleVision: document.getElementById('input-title-vision').value,
        visionText: document.getElementById('input-vision').value,
        titleMission: document.getElementById('input-title-mission').value,
        misi1: document.getElementById('input-misi-1').value,
        misi2: document.getElementById('input-misi-2').value,
        misi3: document.getElementById('input-misi-3').value,
        titleSecProgram: document.getElementById('input-title-sec-program').value,
        progTitle1: document.getElementById('input-prog-title-1').value,
        progDesc1: document.getElementById('input-prog-desc-1').value,
        progTitle2: document.getElementById('input-prog-title-2').value,
        progDesc2: document.getElementById('input-prog-desc-2').value,
        progTitle3: document.getElementById('input-prog-title-3').value,
        progDesc3: document.getElementById('input-prog-desc-3').value,
        textCtaTitle: document.getElementById('input-text-cta-title').value,
        textCtaSub: document.getElementById('input-text-cta-sub').value,
        footerTextName: document.getElementById('input-footer-text-name').value,
        footerTextAddress: document.getElementById('input-footer-text-address').value,
        footerTextPhone: document.getElementById('input-footer-text-phone').value,
        footerTextEmail: document.getElementById('input-footer-text-email').value
    };

    localStorage.setItem('sps_tunas_melati_data', JSON.stringify(updatedData));
    alert("🎉 Selesai! Semua konten website berhasil diperbarui secara massal.");
    window.location.href = "index.html"; 
}

function setupAdminEventListeners() {
    document.getElementById('btnAdminLogin').addEventListener('click', handleAdminLogin);
    document.getElementById('btnAdminLogout').addEventListener('click', () => signOut(auth));
    document.getElementById('btnSaveAdminChanges').addEventListener('click', saveAllAdminChanges);
}
