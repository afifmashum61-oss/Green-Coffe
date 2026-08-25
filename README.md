# 🍃 Green Cafe - Web POS Kasir & Food Ordering System

Web POS (Point of Sale) Kasir & Sistem Pemesanan Makanan/Minuman modern untuk **Green Cafe**, berbasis Single Page Application (SPA) responsive dengan nuansa tema hijau alami & fresh.

## 🌟 Fitur Utama
- **Kasir & Ordering System**:
  - Pencarian menu instan dengan keyboard shortcut `/`.
  - Filter kategori menu (Kopi, Teh, Cold-Pressed Juice, Makanan Utama, Pastry, Healthy Bowl, Dessert).
  - Modal kustomisasi pesanan (level gula, level es, tingkat pedas, extra topping, catatan khusus dapur).
  - Pilihan tipe pesanan (*Dine-In* Meja #1-15, *Takeaway*, *Delivery*).
  - Fitur member cafe & pencatatan poin pelanggan.
- **Perhitungan & Pembayaran**:
  - Kalkulasi otomatis Subtotal, Voucher Diskon, PPN (10%), Service Charge (5%), dan Grand Total.
  - Opsi pembayaran Tunai (dengan kalkulator uang kembalian instan), QRIS E-Wallet, dan Kartu Debit/Kredit EDC.
  - Dukungan voucher promo: `GREENSAVE15` (15% OFF), `TASTY30` (30% OFF), `MEMBER20` (20% OFF).
- **Cetak Struk Thermal**:
  - Modal Struk Belanja berformat kertas thermal 80mm/58mm yang siap dicetak langsung (`Ctrl + P`).
- **Dapur & Analytics**:
  - Monitoring antrean pesanan dapur (KDS) & cetak ulang struk.
  - Dashboard ringkasan omset penjualan harian & total transaksi.

## 🚀 Cara Menjalankan Secara Lokal

1. Clone repository ini:
   ```bash
   git clone <URL_REPO_GITHUB_ANDA>
   cd green-cafe-kasir
   ```

2. Jalankan server lokal Node.js:
   ```bash
   node server.js
   ```

3. Buka di browser:
   `http://localhost:8080`

## 🛠️ Teknologi yang Digunakan
- HTML5, CSS3 (Tailwind CSS CDN)
- JavaScript ES6 (Vanilla JS / State Management)
- FontAwesome 6 Icons
- Node.js (Built-in HTTP server module)

---
© 2026 Green Cafe & Roastery. All rights reserved.
