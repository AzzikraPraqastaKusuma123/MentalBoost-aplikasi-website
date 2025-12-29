# MentalBoost

MentalBoost adalah aplikasi web full-stack yang dirancang untuk membantu pengguna memantau kesehatan mental mereka melalui tes DASS-42 (Depression Anxiety Stress Scale). Aplikasi ini memberikan penilaian berdasarkan jawaban pengguna untuk mengukur tingkat depresi, kecemasan, dan stres.

## ✨ Fitur Utama

- **Otentikasi Pengguna:** Sistem registrasi dan login yang aman.
- **Tes DASS-42:** Implementasi lengkap dari 42 pertanyaan DASS.
- **Perhitungan Hasil:** Skor otomatis dihitung setelah tes selesai.
- **Klasifikasi Status:** Hasil tes diklasifikasikan ke dalam beberapa tingkatan (Normal, Ringan, Sedang, Parah, Sangat Parah) untuk setiap kategori (Depresi, Kecemasan, Stres).
- **Antarmuka Modern:** Dibangun dengan React dan Tailwind CSS untuk pengalaman pengguna yang responsif dan modern.

## 🚀 Teknologi yang Digunakan

- **Backend:**
  - [Laravel](https://laravel.com/)
  - PHP
  - MySQL / SQLite
- **Frontend:**
  - [React](https://reactjs.org/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)

## 🛠️ Instalasi dan Setup

Berikut adalah panduan untuk menjalankan proyek ini di lingkungan pengembangan lokal Anda.

### Prasyarat

- Git
- PHP (versi 8.1 atau lebih baru)
- Composer
- Node.js & npm

### 1. Backend (Laravel)

```bash
# 1. Clone repositori ini
git clone [URL_REPOSITORI_ANDA]
cd MentalBoost

# 2. Masuk ke direktori backend
cd backend

# 3. Instal dependensi PHP dengan Composer
composer install

# 4. Salin file environment
cp .env.example .env

# 5. Buat kunci aplikasi Laravel
php artisan key:generate

# 6. Konfigurasi koneksi database Anda di file .env
# Contoh untuk SQLite:
# DB_CONNECTION=sqlite
# DB_DATABASE=/path/to/your/database.sqlite

# 7. Jalankan migrasi dan seeder untuk membuat tabel dan data awal (termasuk user default)
php artisan migrate --seed

# 8. Jalankan server pengembangan Laravel
php artisan serve
```
Server backend akan berjalan di `http://127.0.0.1:8000`.

### 2. Frontend (React)

```bash
# 1. Buka terminal baru dan masuk ke direktori frontend
cd frontend

# 2. Instal dependensi JavaScript dengan npm
npm install

# 3. Jalankan server pengembangan Vite
npm run dev
```
Server frontend akan berjalan di `http://127.0.0.1:3000` atau port lain jika 3000 sudah digunakan.

## 的使用 Cara Menggunakan

1.  Buka aplikasi frontend di browser Anda (`http://127.0.0.1:3000`).
2.  Daftar untuk membuat akun baru atau login menggunakan akun pengembangan default:
    - **Email:** `test@example.com`
    - **Password:** `password`
3.  Mulai tes DASS-42 dari dasbor Anda.
4.  Jawab semua 42 pertanyaan.
5.  Lihat halaman hasil untuk melihat skor dan klasifikasi tingkat depresi, kecemasan, dan stres Anda.

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
# MentalBoost-aplikasi-website
