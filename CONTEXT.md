# xml-gcamcon — Project Context

## Ringkasan

GCam Config Maker: alat web untuk membuat, menyunting, mengimpor, dan mengekspor konfigurasi XML
untuk GCam (Google Camera port) di Android. Pengguna tidak perlu menyentuh XML mentah.

## Domain

Konfigurasi GCam berbeda antar port. Tiap port memakai nama tag dan struktur parameter sendiri,
sehingga aplikasi menyimpan **skema per port**:

| Port | Catatan |
| :--- | :--- |
| BSG | Basis konfigurasi paling umum |
| LMC | Varian dengan penamaan berbeda |
| Arnova | Struktur parameter sendiri |
| AGC | Format mendekati `.agc` |

Parameter disusun **per lensa** (utama, ultra-wide, tele) dan **per kategori**. Basis data memuat 23
perangkat, dengan 5 preset siap pakai yang dioptimalkan untuk Mi A1.

## Struktur

```
src/app/          Halaman dan layout (App Router)
src/components/   Editor, pemilih preset, panel parameter
src/lib/          Parser & serializer XML, basis data perangkat, preset
src/types/        Tipe parameter dan skema port
```

## Keputusan desain

- **Skema eksplisit, bukan heuristik.** Saat mengimpor XML, pengguna memilih port sumbernya; parser
  tidak menebak dari nama tag.
- **Draf disimpan di `localStorage`** dengan penulisan tertunda (debounce), sehingga perubahan tidak
  hilang saat tab ditutup tanpa harus ada akun server.
- **Ekspor menghasilkan berkas siap pakai** untuk folder konfigurasi GCam.

## Menjalankan

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start
```

## Jebakan yang diketahui

Daftar lengkap ada di `PLAN.md`. Yang paling berdampak:

- Pemilih preset masih memakai `miA1Presets` tanpa menghiraukan perangkat yang dipilih.
- Belum ada error boundary: `localStorage` yang rusak membuat aplikasi gagal render.
- Belum ada unit test, termasuk untuk parser/serializer XML.
