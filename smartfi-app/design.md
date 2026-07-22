# Panduan Desain SmartFi: Neobrutalism

File ini merupakan sumber kebenaran tunggal (*Single Source of Truth*) untuk panduan UI/UX aplikasi SmartFi. Seluruh komponen dan halaman baru harus mengacu pada aturan gaya Neobrutalism berikut untuk menjaga konsistensi desain.

## 1. Filosofi & Karakteristik Utama
- **Gaya**: Neobrutalism murni.
- **Ciri Khas**: Kontras tinggi, warna solid/datar, garis tepi hitam tebal, bayangan hitam padat (tanpa *blur*), dan efek tombol mekanis. Desain ini mengutamakan keterbacaan, batasan elemen yang jelas, serta interaksi yang *playful*.

## 2. Palet Warna (*Tailwind Classes*)
- **Background Utama (Body/Layar)**: Biru pudar (`bg-[#e6f0ff]`) dengan pola grid putih tipis seperti *blueprint* (`bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]`).
- **Background Kartu/Kontainer**: Putih murni (`bg-white`).
- **Aksen/Tombol Utama**: Biru cerah (`bg-blue-500`).
- **Garis Tepi & Bayangan**: Hitam pekat (`#000000`).
- **Teks**: Hitam untuk teks biasa (`text-black`), atau putih (`text-white`) untuk teks di dalam tombol beraksen gelap.

## 3. Aturan Utilitas Tailwind (*Design Tokens*)

### Garis Tepi (*Borders*)
- **Komponen Kecil (Input, Tombol)**: Gunakan `border-2 border-black`.
- **Kontainer/Kartu Besar**: Gunakan `border-4 border-black`.

### Bayangan (*Shadows - Solid*)
- **Bayangan Kecil (Input, Tombol)**: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
- **Bayangan Besar (Kartu, Modal)**: `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`

### Border Radius
Gunakan bentuk yang kaku, hindari sudut yang terlalu melingkar. Gunakan bawaan komponen atau maksimal `rounded-md` (jika benar-benar diperlukan).

## 4. Status Interaksi (*Hover, Focus, Active*)

### Tombol (*Click/Hover*)
- **Saat di-hover**: Elemen bergeser sedikit ke atas dan bayangan memanjang.
  ```html
  hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
  ```
- **Saat diklik (active)**: Elemen tertekan ke arah bayangannya (efek mekanis tertekan).
  ```html
  active:translate-y-1 active:translate-x-1 active:shadow-none transition-all
  ```

### Input Field (*Focus*)
- **Saat aktif (focus)**: Hapus *outline/ring* bawaan browser dan munculkan bayangan solid kecil.
  ```html
  focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow
  ```

## 5. Aturan Tambahan
- **Ikon/Logo**: Setiap ikon atau logo utama harus dibingkai dalam kontainer bergaya Neobrutalism (contoh: kotak putih bergaris tebal dengan *hard shadow*) agar menyatu dengan tema.
- **Responsivitas**: Desain harus responsif. Pastikan ukuran bayangan dan ketebalan garis tepi tidak merusak tata letak atau meluap (*overflow*) di layar ponsel (*mobile*). Gunakan penyesuaian kelas *breakpoint* Tailwind jika perlu (misalnya memperkecil ukuran bayangan/garis pada layar kecil).
