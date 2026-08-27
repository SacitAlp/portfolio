# Portföy Sitesi — Anasayfa (v0.1)

## Klasör yapısı
```
site/
├── index.html
├── style.css
├── script.js
├── data/
│   ├── projects.js   ← Tek veri kaynağı: yeni proje eklemek için buraya obje ekle
│   └── i18n.js        ← TR/EN metin sözlüğü
└── assets/
    └── cv.pdf          ← (henüz yok, CV dosyanı buraya koyman yeterli)
```

## Neler çalışıyor
- Anasayfa hero + KPI kutuları + radyal seçim menüsü (masaüstünde hover, mobilde dokunma)
- Radyal menüdeki her dilim `data/projects.js` içindeki projelere referans veriyor,
  tıklanınca ilgili proje kartına kayarak gidiyor
- TR/EN dil değişimi (sağ üstteki buton), tüm metinler `data/i18n.js`'den geliyor
- "Öne Çıkan Projeler" ızgarası, projects.js'i otomatik render ediyor
- Her proje için `project.html?id=...` ile açılan detay sayfası (`project-detail.js`),
  ilgili proje verisini ve benzer projeleri otomatik gösteriyor

## Sırada ne var (henüz yapılmadı)
- [ ] Hobi bölümü için ayrı tema/renk seti
- [ ] GitHub linklerini gerçek repo adresleriyle doldurmak (`projects.js` içindeki `github: "#"`)
- [ ] Video/GIF alanlarını doldurmak (`projects.js` içindeki `video: null`)
- [ ] `assets/cv.pdf` dosyasını eklemek
- [ ] Kod indirme için mail/telefon formu (Formspree veya Netlify Forms entegrasyonu)
- [ ] Gerçek proje görselleri / ekran görüntüleri

## Yeni proje eklemek
`data/projects.js` içine yeni bir obje eklemen yeterli — anasayfa ve radyal menüler
otomatik güncellenir, HTML'e dokunmana gerek yok. İlgili bir KPI kutusunun altında
görünsün istersen `KPI_HUBS` içindeki ilgili `items` dizisine proje id'sini eklemen yeterli.

## Yayınlama (GitHub Pages)
1. Bu klasörü bir GitHub reposuna push et
2. Repo → Settings → Pages → Branch seç → Save
3. `https://kullaniciadin.github.io/repo-adi` adresinden yayında olur
