# Daftar Fitur SmartFi — Dokumentasi Lengkap (Versi Final)

Dokumen ini menjelaskan secara detail seluruh fitur yang tersedia di aplikasi SmartFi. Cocok untuk panduan tim internal, materi presentasi, atau sebagai panduan pengguna.

---

## 1. Smart Input (Input Transaksi Berbantuan AI) — Fitur Andalan!

**Deskripsi:**  
Pengguna tidak perlu repot memilih dropdown atau mengisi banyak form. Cukup mengetik deskripsi transaksi dalam bahasa alami, lalu AI (DeepSeek) akan memprosesnya menjadi data transaksi yang siap disimpan.

**Cara Kerja:**
- Pengguna mengetik di kotak teks, misal: *"Makan siang di warteg 25 ribu"*.
- AI mem-parsing kalimat dan menghasilkan:
  - **Tipe:** Pengeluaran (`expense`)
  - **Kategori:** Makanan
  - **Nominal:** Rp 25.000
  - **Deskripsi:** Makan siang di warteg
- Pengguna tinggal menekan tombol **"Simpan"** atau **"Edit dulu"** jika ingin mengubah kategori.

**Keunggulan:**
- Mengurangi *friction* (hanya 1 langkah input).
- Tetap mempertahankan efek *mindfulness* (pengguna sadar mengetik uangnya).
- Meningkatkan akurasi data karena AI membantu mengkategorikan dengan tepat.

**Contoh Lain:**
- *"Gaji masuk 5 juta"* → Pemasukan, Gaji, Rp 5.000.000.
- *"Beli kuota 100rb"* → Pengeluaran, Tagihan, Rp 100.000.
- *"Bayar kos 1.5 juta"* → Pengeluaran, Tagihan, Rp 1.500.000.
- *"Nonton film 50k"* → Pengeluaran, Hiburan, Rp 50.000.

---

## 2. Dashboard & Widget Statistik Lingkaran 2x2 (Mobile-First)

**Deskripsi:**  
Halaman utama yang memberikan gambaran utuh kondisi keuangan pengguna secara real-time.

### A. Desktop (≥ 768px)
| Komponen | Fungsi |
| :--- | :--- |
| **3 Kartu Saldo** | Menampilkan Total Pemasukan (hijau), Saldo Terkini (biru), dan Total Pengeluaran (merah) bulan ini. |
| **Grafik Batang** | Menampilkan tren pengeluaran harian selama 7 hari terakhir. |
| **Grafik Lingkaran** | Menampilkan persentase pengeluaran per kategori (Makanan 40%, Transport 25%, dll.). |
| **Riwayat Transaksi** | 5 transaksi terbaru dengan status (Selesai/Pending). |

### B. Mobile / HP (< 768px) — FITUR BARU!
Di bagian atas dashboard (tepat di bawah header), tampilkan **4 widget lingkaran (Doughnut Chart)** dalam grid 2x2:

| Widget | Judul | Isi / Visual |
| :--- | :--- | :--- |
| **1. Saldo** | 💰 Saldo | Angka saldo di tengah lingkaran. Progress melingkar menunjukkan persentase terhadap target tabungan bulanan (diatur di Pengaturan). Warna: Biru (`#60A5FA`). |
| **2. Pemasukan** | 📈 Pemasukan | Total pemasukan bulan ini. Lingkaran penuh sebagai indikator visual. Warna: Hijau (`#10B981`). |
| **3. Pengeluaran** | 📉 Pengeluaran | Total pengeluaran bulan ini. Jika mendekati batas budget (default Rp 3.000.000), warna berubah oranye/merah. Warna: Merah (`#EF4444`). |
| **4. Kategori Terbesar** | 🏷️ Terbanyak | Nama kategori pengeluaran terbesar + persentasenya (misal: Makanan 40%). Warna: Ungu (`#8B5CF6`). |

**Keunggulan:**
- Informasi keuangan langsung terlihat **tanpa scroll**.
- Desain modern dan menarik, meningkatkan engagement user.
- Dibangun menggunakan Chart.js (Doughnut Chart) dengan teks di tengah.

---

## 3. Mentor AI Pribadi

**Deskripsi:**  
Asisten AI yang menganalisis seluruh data transaksi pengguna dan memberikan saran personal. Berbeda dengan chatbot biasa, Mentor AI ini **memiliki konteks penuh** atas data keuangan pengguna.

**Cara Mengakses:**
- Tombol **"Tanya AI"** di Dashboard.
- Halaman khusus **"Mentor AI"** di sidebar.

**Fungsi Utama:**
| Fitur | Penjelasan |
| :--- | :--- |
| **Analisis Singkat** | Ringkasan kebiasaan keuangan user dalam 1-2 kalimat. |
| **3 Saran Praktis** | Rekomendasi spesifik dan *actionable* (bisa langsung dilakukan) berdasarkan data riil. Contoh: *"Coba bawa bekal 2x seminggu, hemat Rp 200.000/bulan."* |
| **Prediksi Saldo** | Proyeksi saldo akhir bulan berdasarkan rata-rata pengeluaran harian. |
| **Deteksi Anomali** | Jika ada pengeluaran tidak wajar (5x lipat dari rata-rata), AI akan memberitahu. |

**Contoh Output AI:**
```text
### 💡 Analisis Singkat
Pengeluaran terbesarmu bulan ini adalah Makanan (Rp 1.200.000) dan Transportasi (Rp 800.000). Ini hampir 60% dari total pengeluaranmu.

### 🎯 3 Saran Praktis untuk Kamu
1. Coba bawa bekal makan siang 3x seminggu. Hemat Rp 300.000/bulan.
2. Gunakan transportasi umum untuk perjalanan jarak dekat. Hemat Rp 200.000/bulan.
3. Kurangi jajan kopi di kafe. Hemat Rp 150.000/bulan.

### 📊 Prediksi Saldo Akhir Bulan
Dengan saran di atas, saldo akhir bulan diprediksi Rp 1.500.000. Tanpa saran, saldo hanya Rp 850.000. Selamat menabung!