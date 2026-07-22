# SmartFi — Catat Keuangan + Mentor AI Pribadi

> **"Cukup tulis seperti ngobrol, AI yang urus sisanya."**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=flat&logo=pwa)](https://web.dev/progressive-web-apps/)

---

## 📲 Install di HP Seperti Aplikasi Native!

SmartFi adalah **Progressive Web App (PWA)**. Kamu bisa menginstalnya ke layar utama HP secara langsung dari browser—tanpa perlu Play Store atau App Store.

- **Android (Chrome):** Buka website, lalu klik tombol **"Pasang Aplikasi"** atau icon `+` di address bar.
- **iOS (Safari):** Klik icon **"Share"** (kotak dengan panah ke atas), lalu pilih **"Add to Home Screen"**.

📲 **Update aplikasi cukup refresh browser!** Tidak perlu download update berkali-kali.

---

## 🧠 Tentang SmartFi

SmartFi adalah aplikasi pencatatan keuangan pribadi berbasis web yang menggabungkan **kemudahan input super cepat** dengan **kecerdasan buatan (AI)** sebagai mentor pribadi.

Berbeda dengan aplikasi keuangan konvensional yang memaksa pengguna mengisi banyak form (tipe, kategori, nominal, tanggal, deskripsi), SmartFi hadir dengan terobosan: **cukup tulis kalimat alami, AI yang memprosesnya menjadi data transaksi.**

---

## ✨ Fitur Unggulan

| Fitur | Deskripsi |
| :--- | :--- |
| **🧠 Smart Input (AI-Powered)** | Cukup ketik "Makan siang 25 ribu" atau "Gaji masuk 5 juta". AI (DeepSeek) langsung mengisi kategori, nominal, dan tipe transaksi. **1 langkah, selesai!** |
| **📊 Dashboard Interaktif** | Lihat saldo, total pemasukan, pengeluaran, grafik tren 7 hari, dan persentase kategori secara real-time. |
| **📱 Widget Lingkaran 2x2 (Mobile)** | Di beranda HP, lihat 4 metrik utama (Saldo, Pemasukan, Pengeluaran, Kategori Terbesar) dalam bentuk circular progress yang instan dipahami. |
| **🤖 Mentor AI Pribadi** | AI yang memiliki konteks penuh atas data keuanganmu. Berikan analisis, deteksi anomali, prediksi saldo, dan 3 saran hemat spesifik. |
| **⏰ Pengingat Harian (Bisa Diatur)** | Atur jam pengingat favoritmu (misal: 20.00 WIB). Dapatkan notifikasi browser atau email untuk mengingatkan mencatat transaksi setiap hari. |
| **📁 Manajemen Transaksi & Kategori** | Tambah, edit, hapus, filter, dan cari riwayat transaksi. Buat kategori sesuai kebutuhanmu. |
| **📄 Laporan & Ekspor** | Ekspor riwayat keuangan ke PDF (arsip) atau Excel (analisis lanjutan). |
| **🔒 Aman & Privasi** | Data pribadi dilindungi dengan autentikasi Supabase dan Row Level Security. Tanpa integrasi bank otomatis—data sepenuhnya di tanganmu. |

---

## 🎯 Target Pasar

**Untuk semua orang!** Mahasiswa, karyawan, freelancer, ibu rumah tangga, hingga pelaku UMKM—siapa pun yang ingin mengelola arus kas pribadi dengan lebih cerdas dan terbantu oleh AI.

---

## 💰 Model Bisnis (Freemium)

SmartFi menggunakan model **Freemium** untuk keberlanjutan produk:

| Paket | Harga | Fitur |
| :--- | :--- | :--- |
| **Trial** | 7 Hari Gratis | Semua fitur termasuk Mentor AI unlimited. |
| **Premium** | Rp 29.000 / bulan | Semua fitur + unlimited chat AI + ekspor unlimited + prioritas support. |
| **Lifetime** | Rp 299.000 (sekali bayar) | Selamanya. |

---

## 🛠️ Tech Stack

| Lapisan | Teknologi | Fungsi |
| :--- | :--- | :--- |
| **Frontend & Backend** | Next.js 14 (App Router) | Satu framework untuk semua, API Routes di dalamnya. |
| **Styling** | Tailwind CSS | Desain cepat, responsif, dan konsisten. |
| **Database & Autentikasi** | Supabase (PostgreSQL) | Auth siap pakai, RLS untuk keamanan data. |
| **AI Gateway** | OpenRouter (Model: DeepSeek) | Akses ke model AI murah dan cerdas untuk parsing & mentor. |
| **Pembayaran** | Midtrans (Snap API) | Mendukung pembayaran Indonesia (QRIS, VA, dll). |
| **Grafik** | Chart.js | Visualisasi data keuangan. |
| **PWA** | next-pwa | Installasi seperti aplikasi native di HP. |
| **Hosting** | Vercel + Supabase | Deployment cepat dan gratis untuk skala awal. |

---

## 📁 Struktur Folder (Inti)

```text
smartfi-app/
├── public/
│   ├── images/
│   │   └── smartfi_logo_2.png   # Logo utama aplikasi
│   ├── manifest.json            # Konfigurasi PWA
│   └── icons/                   # Icon untuk installasi HP
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login & Register (tanpa sidebar)
│   │   ├── (dashboard)/         # Halaman utama dengan sidebar
│   │   └── api/                 # API Routes (backend)
│   ├── components/              # Komponen UI reusable
│   ├── lib/                     # Utilitas (Supabase, OpenRouter, dll)
│   └── styles/                  # CSS global
├── .env.local                   # Environment variables (jangan commit!)
├── next.config.mjs              # Konfigurasi Next.js + PWA
├── package.json
├── README.md                    # File ini
├── PROJECT_CONTEXT.md           # Konteks lengkap untuk AI Coding
└── desain.md                    # Panduan desain & UI/UX