# NURISYA - Sistem Manajemen Gudang Multi-User

Aplikasi gudang berbasis web (HTML/JS + PHP + MySQL). Mendukung multi-user (Warehouse, Manager, divisi lain) dan sinkron data lintas komputer via backend API.

## Fitur
- Inventory: tambah/edit/hapus barang, filter, stok rendah
- Permintaan barang: pembuatan & alur persetujuan (Staff -> Manager)
- Transaksi barang masuk/keluar (UI sudah ada; backend transaksi opsional)
- Notifikasi aktivitas dan polling sinkron

## Arsitektur
- Frontend: HTML + Tailwind + JS (tanpa framework) di `index.html` dan `js/`
- Backend: PHP API di `api/` (PDO MySQL)
- Database: MySQL (skema di `api/schema.sql`)

## Setup Lokal (XAMPP)
1. Jalankan Apache dan MySQL di XAMPP
2. Import database:
   - Buka phpMyAdmin → Import → pilih `api/schema.sql` → jalankan
3. Konfigurasi kredensial DB (tanpa commit ke GitHub):
   - Buat file `.env` di folder project, isi variabel berikut (lihat `.env.example`):
     - DB_HOST, DB_NAME, DB_USER, DB_PASS
   - Di server shared hosting, set environment variables via panel (opsi lebih aman), atau gunakan `.htaccess`/Apache SetEnv
4. Buka http://localhost/NURISYA

Catatan: `api/config.php` membaca kredensial dari environment variables. Jika tidak di-set, dia fallback ke `127.0.0.1`, db `nurisya`, user `root`, password kosong.

## Deploy / Publish
- GitHub digunakan untuk hosting kode (repository). PHP API tidak bisa berjalan di GitHub Pages.
- Untuk live production:
  1) Shared hosting/cPanel (paling mudah):
     - Upload seluruh folder repo (atau clone melalui Git) ke public_html/NURISYA
     - Import `api/schema.sql` via phpMyAdmin
     - Set environment variables untuk DB
     - Akses via https://DOMAIN/NURISYA/
  2) VPS/Cloud (Apache + PHP + MySQL):
     - Pasang Apache, PHP, MySQL
     - Clone repo ke /var/www/NURISYA
     - Import `api/schema.sql`
     - Set environment variables
     - Konfigurasi virtual host
  3) Pisahkan frontend & backend:
     - Frontend di static hosting (Netlify/Vercel), backend PHP di shared hosting / VPS
     - Pastikan CORS di `api/config.php` disesuaikan (jangan gunakan `*` untuk production — set origin spesifik)

## Variabel Lingkungan
Buat file `.env` (jangan commit), contoh isi:
```
DB_HOST=127.0.0.1
DB_NAME=nurisya
DB_USER=root
DB_PASS=
```
`api/config.php` mengambil ini via `getenv()`.

## Keamanan & Praktik Baik
- Jangan commit `.env` atau secrets ke Git
- Restrict CORS origin untuk domain produksi (ganti `*` menjadi domain Anda)
- Pastikan extension `pdo_mysql` aktif di server

## Menjalankan di LAN (multi komputer)
- Jalankan XAMPP di 1 PC sebagai server
- PC lain akses via http://IP_SERVER/NURISYA/
- Pastikan firewall mengizinkan port 80

## Push ke GitHub
Inisialisasi repo dan push (PowerShell):
```
git init
git add .
git commit -m "Initial commit: NURISYA warehouse system"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```

## Lisensi
Tambahkan lisensi jika diperlukan (MIT, GPL, dsb).