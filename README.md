# xml-gcamcon — GCam Config Maker

Alat web untuk membuat, menyunting, mengimpor, dan mengekspor konfigurasi XML GCam — tanpa harus
mengedit XML secara manual.

Pemilik ponsel Android yang memasang GCam (Google Camera port) biasanya harus menyunting berkas
XML berisi ratusan parameter per lensa. Satu salah nama tag, kamera menolak konfigurasi atau hasil
foto memburuk. Alat ini memberi antarmuka visual untuk pekerjaan tersebut, plus basis data
perangkat yang sudah dikenal baik konfigurasinya.

## Fitur

- **Empat skema port** — BSG, LMC, Arnova, dan AGC, masing-masing dengan struktur parameter sendiri
- **23 perangkat** di basis data, konfigurasi disusun per lensa dan per kategori
- **Editor visual** — ubah nilai parameter lewat kontrol, bukan lewat teks XML
- **Impor XML** — unggah, seret-lepas, atau tempel langsung
- **Ekspor XML** — unduh berkas siap pakai untuk GCam
- **5 preset** siap pakai (optimasi Mi A1)
- **Penyimpanan lokal** — draf disimpan di `localStorage` dengan penulisan tertunda (debounce)
- **Tema gelap** dan TypeScript mode ketat

## Menjalankan

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm start
```

## Stack

Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS v4 · pnpm

## Struktur

```
src/app/          Halaman dan layout
src/components/   Editor, pemilih preset, panel parameter
src/lib/          Parser & serializer XML, basis data perangkat
src/types/        Tipe parameter dan skema port
```

## Status

MVP berjalan. Rencana perbaikan tercatat di [`PLAN.md`](PLAN.md) — antara lain: preset masih
mengabaikan filter perangkat, belum ada error boundary untuk `localStorage` yang rusak, dan belum
ada unit test.

## Lisensi

Lihat `LICENSE` di repository ini.
