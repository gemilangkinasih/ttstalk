<p align="center">
  <h1 align="center">TTSTALK ANALYTICS CLI</h1>
  <p align="center">
    <strong>Alat CLI Analitik Profil TikTok Ringan, Cepat & Tanpa API Key</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Version">
    <img src="https://img.shields.io/badge/TikTok-SSR%20Scraper-000000?style=for-the-badge&logo=tiktok&logoColor=white" alt="TikTok Scraper">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
    <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-informational?style=for-the-badge" alt="Platform">
  </p>
</p>

---

## 📌 Deskripsi

**TTStalk Analytics CLI** adalah alat command-line interface (CLI) berbasis Node.js untuk mengekstrak metadata profil TikTok, statistik metrik (Followers, Following, Likes, Total Video, Teman), informasi akun (Bio, Status Verifikasi, Akun Privat, Link Bio), serta daftar video terbaru secara real-time langsung melalui data Server-Side Rendering (SSR) TikTok tanpa memerlukan API Key atau login akun.

Hasil ekstraksi data secara otomatis disimpan dalam format **JSON** dan **CSV** untuk analisis lebih lanjut.

---

## ✨ Fitur Utama

- 🔓 **Tanpa Login / API Key:** Mengakses data profil langsung melalui ekstraksi data *Universal Rehydration* TikTok SSR.
- 🎨 **Tampilan Terminal Modern (Hermes Agent Theme):** Dilengkapi *ANSI 256-color palette*, status ikon, dan animasi *loading spinner* yang responsif.
- 📊 **Export Otomatis (JSON & CSV):**
  - `<username>_tiktok_data.json` : Detail profil lengkap & video terbaru.
  - `<username>_videos.csv` : Statistik per video (Views, Likes, Comments, Shares, URL).
- 🧹 **Pembersihan Teks Otomatis:** Mengosongkan emoji berlebih, *surrogate pairs* tak valid, dan karakter khusus agar hasil ekspor bersih.
- 🌐 **Dukungan Unicode & Encoding:** Otomatis mengatur `CHCP 65001` (UTF-8) di Windows Terminal agar emoji dan karakter internasional tampil sempurna.
- 📝 **Sistem Logging File (`tikstalker.log`):** Setiap aktivitas dan histori error dicatat rapi dalam file log.
- ⚡ **Dua Mode Penggunaan:** Mode Interaktif (Prompt) dan Mode Argument (Command Line).

---

## 🛠️ Persyaratan Sistem

- **Node.js**: v18.0.0 atau lebih baru (menggunakan fitur bawaan `fetch` & `readline/promises`).
- **OS**: Windows, macOS, atau Linux.

---

## 🚀 Cara Instalasi & Penggunaan

### 1. Kloning Repositori & Masuk Ke Direktori

```bash
git clone https://github.com/username/ttstalk.git
cd ttstalk
```

### 2. Jalankan Program

Program ini menggunakan modul bawaan Node.js (ES Module), sehingga tidak memerlukan instalasi dependensi tambahan (`node_modules`).

#### 🔹 Mode 1: Interaktif (Prompt)
Cukup jalankan perintah berikut, lalu masukkan username target saat diminta:

```bash
npm start
# atau
node index.js
```

**Contoh Tampilan Prompt:**
```text
  ❯ Masukkan Username TikTok: @gemilangkinasih
```

#### 🔹 Mode 2: Argumen CLI Langsung
Anda juga dapat menyertakan username langsung melalui argumen terminal:

```bash
node index.js username
# atau
node index.js --username=username
# atau
node index.js -u username
```

---

## 📂 Struktur Output File

Setelah proses pencarian selesai, **TTStalk** akan menghasilkan file output secara otomatis:

### 1. File JSON (`<username>_tiktok_data.json`)
```json
{
    "status": true,
    "data": {
        "profile": {
            "id": "6988853725860021274",
            "username": "dccamel",
            "name": "disa",
            "photo": "https://p16-common-sign.tiktokcdn.com/...",
            "bio": "Business inq : 0877-2774-6187",
            "bioLink": "https://example.com",
            "posts": 2118,
            "followers": 1100000,
            "following": 360,
            "likes": 148100000,
            "friends": 358,
            "verified": false,
            "private": false,
            "region": "Indonesia (ID)",
            "language": "id"
        },
        "recentVideos": [
            {
                "id": "7123456789012345678",
                "description": "Deskripsi video...",
                "url": "https://www.tiktok.com/@dccamel/video/7123456789012345678",
                "views": 150000,
                "likes": 12000,
                "comments": 450,
                "shares": 120
            }
        ]
    }
}
```

### 2. File CSV (`<username>_videos.csv`)
Tabel statistik video siap diimpor ke Excel, Google Sheets, atau Python Pandas:
```csv
Description,URL,Views,Likes,Comments,Shares
"Video review produk...","https://www.tiktok.com/@username/video/123",150000,12000,450,120
```

---

## 📁 Struktur Repositori

```text
ttstalk/
├── index.js                  # Script utama CLI TikTok Analytics
├── package.json              # Konfigurasi Node.js Package (ES Module)
├── tikstalker.log            # Catatan riwayat/log aplikasi (di-generate otomatis)
└── README.md                 # Dokumentasi proyek
```

---

## ⚙️ Cara Kerja Ringkas

1. **HTTP Request:** Menghubungi URL profil TikTok (`https://www.tiktok.com/@username`) dengan header Mobile Safari khusus.
2. **Rehydration Parsing:** Mengekstrak tag `<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">` dari HTML response.
3. **Data Normalization:** Mengambil objek `webapp.user-detail` dan menyaring emoji / karakter tak valid.
4. **Visual Display & Export:** Menampilkan antarmuka terminal bergaya *Hermes Agent* dan menuliskan file JSON & CSV.

---

## ⚠️ Penanganan Kendala (Troubleshooting)

- **Error: "Terhalang Captcha/WAF"**
  TikTok secara berkala memblokir IP server atau request yang terlalu sering. Jika ini terjadi, tunggu beberapa saat atau gunakan koneksi jaringan lain.
- **Karakter Terpotong di Windows Command Prompt:**
  Gunakan **Windows Terminal**, **PowerShell**, atau **VS Code Integrated Terminal** untuk tampilan warna ANSI dan font UTF-8 yang optimal.

---

## ⚖️ Lisensi & Penolakan Tanggung Jawab (Disclaimer)

Proyek ini dibuat untuk tujuan pembelajaran, edukasi, dan riset analitik data publik. 

Alat ini **tidak terafiliasi**, **diresmikan**, atau **didukung** oleh TikTok / ByteDance Ltd. Penggunaan alat ini harus mematuhi syarat & ketentuan layanan platform (Terms of Service) yang berlaku.

Dispesifikasikan di bawah lisensi [MIT](LICENSE).
