# WIRE HEIST
### Build Brief untuk AI Coding Agent (CLAUDE.md / AGENT.md)

## INSTRUKSI UTAMA (BACA DULU)
Bangun sebuah web game 2-pemain bernama **Wire Heist**, lengkap dan langsung bisa dimainkan, hanya dari brief ini — sekali jalan, tanpa nanya balik kecuali ada yang benar-benar ambigu. Output: file HTML/CSS/JS murni (tanpa build tool, tanpa dependency eksternal selain font dari Google Fonts) yang langsung jalan begitu `index.html` dibuka di browser.

Ikuti semua bagian di bawah dengan ketat, terutama **Arahan Visual** — itu bukan saran, itu batasan keras. Game ini akan didemoin langsung di depan murid-murid untuk promosi ekskul IT Club, jadi harus terlihat seperti hasil desain yang niat, bukan template generic bikinan AI.

## 1. Konsep Singkat
Dua anggota IT Club kerja sama dari **satu keyboard** — satu nge-pilot drone kecil yang penglihatannya kebatasi, satu lagi mantengin CCTV ruang server yang lihat semuanya tapi gak bisa gerak — untuk nyelametin maskot club yang "diculik" virus iseng.

- Genre: stealth-puzzle co-op, top-down grid, split-screen satu device.
- Durasi main: ~3-5 menit sekali tamat (didesain untuk demo singkat, bukan game panjang).
- Pemain: 2 orang, satu keyboard fisik.

## 2. Cerita & Karakter (ringan, jangan kepanjangan)
- **BOLT** — maskot IT Club, robot kecil kotak membulat, dua mata bulat, antena pendek. Diculik ke ruang server.
- **GLITCH** — virus prank yang nyusup pas technical meeting club, ngambil alih bot keamanan ruangan jadi suka patroli random/agresif.
- **Player 1 "Pilot Drone"** — gerakin drone yang fisik menyelinap ke ruangan, tapi cuma lihat sekitar dirinya doang.
- **Player 2 "Ground Control"** — lihat seluruh denah ruangan + posisi semua Glitch-Bot lewat CCTV, pegang saklar-saklar ruangan, tapi gak bisa gerakin dronenya.

Intro singkat (tampil sebelum Ruangan 1, skip dengan tombol apa saja):
> "Sistem keamanan IT Club ngaco gara-gara virus iseng bernama GLITCH. BOLT keseret masuk ruang server yang sekarang dijagain robot keamanan yang ke-prank. Saatnya kerja tim: satu nyelinap, satu mantau."

## 3. Aturan Main
Drone & peta pakai grid yang sama, sekitar 9x6 sampai 11x7 petak tergantung kebutuhan layout tiap ruangan.

**Drone (Player 1)**
- Gerak satu petak per input, 4 arah (grid-based, bukan free movement).
- Hanya "lihat" petak dalam radius pendek di sekitarnya (radius 2 petak cukup). Di luar itu = area redacted (lihat Arahan Visual).

**Ground Control (Player 2)**
- Lihat seluruh denah setiap saat, termasuk rute patroli tiap Glitch-Bot.
- Pegang 1-3 saklar tergantung ruangan, pilih dengan naik/turun, aktifkan dengan tombol aksi.
- Tiap saklar punya cooldown singkat (3-5 detik) supaya gak dispam — kasih indikator visual saklar lagi cooldown vs siap pakai.

**Glitch-Bot (musuh)**
- Wajib patroli sederhana: tiap bot punya rute tetap (array titik koordinat), jalan maju di rute itu, balik arah kalau sampai ujung. Jangan bikin AI kejar/pathfinding — di luar scope tim pemula 1-2 minggu.
- Bot "lihat" beberapa petak lurus di depan arah hadapnya (garis lurus saja, tanpa raycasting rumit). Drone yang masuk area itu = ketahuan.
- Ketahuan = ruangan saat ini saja yang restart (bukan dari Ruangan 1 lagi), supaya demo tetap cepat dan gak awkward di depan penonton.

**Menang ruangan:** drone sampai titik tujuan ruangan tanpa ketahuan.
**Menang game:** BOLT berhasil diambil di Ruangan 3 dan drone kabur lewat titik ekstraksi sebelum countdown alarm habis.

## 4. Kontrol

| | Drone (Player 1) | Ground Control (Player 2) |
|---|---|---|
| Gerak / pilih | W A S D | Panah Atas/Bawah (pilih saklar) |
| Aksi | (opsional) Spasi = diam sejenak | Enter = aktifkan saklar terpilih |

Catatan teknis: panggil `event.preventDefault()` untuk tombol panah & spasi supaya halaman tidak ikut scroll saat main. Tambahkan overlay "Klik untuk mulai" di awal supaya fokus keyboard ke game benar.

## 5. Struktur Level
Satu alur cerita berkesinambungan, 3 ruangan — bukan level lepas-lepas.

**Ruangan 1 — Lobi (tutorial halus)**
1 Glitch-Bot, 1 saklar ("Buka Pintu"). Drone nunggu di balik tembok, Ground Control lihat kapan bot membelakangi pintu, buka pintu, drone menyelinap. Tampilkan hint kecil sekali saja di percobaan pertama (skip otomatis sesudahnya).

**Ruangan 2 — Aula Server (inti puzzle)**
2 Glitch-Bot jalur menyilang. 2 saklar: "Decoy" (memancing bot terdekat menjauh sebentar) dan "Lampu Mati" (memperkecil sementara jarak pandang bot). Pemain harus kombinasikan timing dua saklar ini.

**Ruangan 3 — Inti Server (klimaks)**
Drone menemukan BOLT di tengah ruangan. Begitu diambil, alarm menyala, countdown 15-20 detik muncul, satu saklar baru ("Override Pintu Keluar") untuk buka titik ekstraksi. Drone harus kembali ke titik ekstraksi sebelum waktu habis.

Layar menang — pesan singkat + kalimat penutup (boleh dipakai presenter untuk nyambung ke pitch club), contoh:
> "BOLT balik dengan selamat. Semua ini dibangun pakai programming + desain — kalau penasaran caranya, gabung IT Club."

## 6. Arahan Visual — WAJIB DIIKUTI
Tema: **poster mata-mata/heist jadul** (vintage spy-heist poster & arsip kasus rahasia). Bukan tema hacker-futuristik.

### Jangan
- Warna neon (cyan/magenta/hijau neon), gradient ungu-biru-pink ala SaaS app generic.
- `box-shadow` blur/glow, glassmorphism (panel transparan blur).
- Font futuristik/techy (Orbitron, Audiowide, dsb).
- Emoji Unicode dipakai sebagai ikon UI (kunci, pintu, lampu, dsb) — bikin ikon SVG sendiri, bukan emoji.
- Background gradient blob besar melayang-layang (khas landing page AI generic).
- `border-radius` besar di semua elemen (kesan "card AI generic").
- Dua default lain yang juga harus dihindari: tema cream-serif-terracotta editorial, dan tema hitam-pekat-aksen-hijau/vermillion tunggal — keduanya sama generic-nya walau bukan neon.

### Pakai
Token warna (sebagai CSS variable):
```css
--ink:   #1E1A16;  /* background utama, hampir hitam tapi hangat */
--paper: #EDE3CF;  /* panel terang, teks di atas gelap */
--amber: #E2A33B;  /* aksen utama: drone, sorotan, saklar aktif */
--rust:  #B6452C;  /* bahaya: Glitch-Bot, area pandang bot */
--teal:  #3E7068;  /* aksen kedua: ground control, panel CCTV */
```

Tipografi (3 peran, jangan dicampur sembarangan), load via `<link>` Google Fonts di `<head>`:
- Display/judul: **Big Shoulders Display** — pakai hanya untuk judul & teks cerita, bold dan tegas seperti judul poster.
- Body/UI/HUD: **Archivo** — semua teks instruksi & label, netral dan gampang dibaca dari jarak jauh (ingat, ini didemoin lewat proyektor).
- Stempel/aksen dokumen rahasia: **Special Elite** (font mesin ketik) — sangat terbatas, hanya untuk nomor ruangan, status saklar, atau stempel "RAHASIA" saat transisi ruangan. Ini pengganti peran yang biasanya diisi font monospace techy, tapi kesannya arsip dokumen lama, bukan terminal hacker.

Layout — dua panel sama besar dipisah garis tebal `--ink` di tengah:
```
+------------------------+------------------------+
|     PANDANGAN DRONE    |   PETA GROUND CONTROL  |
|   (gelap, redacted di  |   (terang, lengkap +    |
|    luar radius drone)  |    panel saklar)        |
+------------------------+------------------------+
|     HUD bawah: nama ruangan, status, timer        |
+----------------------------------------------------+
```
Pembagian ini bukan cuma estetika — ini representasi visual dari asimetri informasi yang jadi inti game-nya, dan sekaligus bikin penonton demo bisa ikut "ngeh" sama dua sisi puzzle-nya secara bersamaan di satu layar.

Elemen penanda (signature element) — yang bikin hasilnya kerasa niat:
1. **Fog-of-war "redacted"** — petak di luar jangkauan lihat drone JANGAN dirender sebagai gelap/blur biasa. Render sebagai blok warna solid `--ink` dengan pola garis diagonal tipis (kesan dokumen disensor), bukan vignette.
2. **Stempel transisi** — tiap pindah ruangan, munculkan teks stempel (font Special Elite) yang "nge-stamp" ke layar dengan animasi cepat & tegas (scale dari besar ke ukuran asli dalam <0.2 detik, bukan fade halus) — kesan stempel fisik, bukan efek glow.

Ikon: semua ikon (pintu, saklar, mata/kamera, baterai) digambar sendiri pakai inline SVG sederhana 1-2 warna sesuai token di atas — bentuk geometris jelas (persegi, garis, lingkaran). Bukan emoji, bukan icon library generic.

Shadow & depth: kalau perlu kesan "nempel" (tombol/panel), pakai hard offset shadow gaya stiker, misal `box-shadow: 4px 4px 0 var(--ink);` — bukan shadow blur lembut.

## 7. Struktur Teknis
```
index.html   -> struktur halaman, 2 panel, overlay start/win/lose
style.css    -> semua styling, variabel warna di atas, font-face
game.js      -> game loop, input handler, state ruangan, logic Glitch-Bot, win/lose
```
- Vanilla JS murni, tanpa framework/build tool (sesuai timeline 1-2 minggu & skill level pemula).
- Render peta lewat DOM (div per petak diatur CSS Grid) lebih disarankan daripada Canvas — lebih gampang dipahami tim pemula untuk belajar & dimodifikasi belakangan.
- Tidak perlu asset gambar/audio eksternal — semua visual dari CSS/SVG. SFX opsional pakai Web Audio API bikin beep sederhana, boleh di-skip kalau waktu mepet.
- Tidak perlu desain mobile-responsive — ini didemoin dari satu laptop/proyektor, fokus ke satu ukuran layar yang nyaman dibaca dari jarak penonton.
- Tidak ada backend, tidak ada penyimpanan data — semua state cukup di memory JS, reset tiap reload (justru bagus untuk demo berulang).

## 8. Definition of Done
- Buka `index.html` langsung jalan tanpa setup apa pun.
- Dua pemain bisa main bareng dari satu keyboard fisik tanpa tombol bentrok.
- Bisa tamat dari Ruangan 1 sampai layar menang dalam waktu wajar (di bawah 5 menit kalau lancar).
- Glitch-Bot patroli sesuai rute tetap, tidak ada bug nyangkut/tembus tembok.
- Tampilan sesuai Arahan Visual — tidak ada gradient neon, glow, glassmorphism, atau emoji sebagai ikon.

## 9. Catatan Tambahan
- File ini bisa disimpan sebagai `CLAUDE.md` (Claude Code) atau diduplikat jadi `AGENT.md` kalau tool yang dipakai butuh nama itu — isinya sama persis.
- Kalau waktu mepet di tengah jalan, yang paling aman dipangkas duluan: SFX, animasi stempel transisi, saklar "Lampu Mati" di Ruangan 2 (bisa diganti cukup pakai Decoy saja). Jangan pangkas bagian Arahan Visual — itu yang bikin hasilnya tidak terlihat generic.