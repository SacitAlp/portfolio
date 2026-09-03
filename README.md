# DalmisTech Portfolyo Sitesi

Sacit Alp Dalmış'ın üretim mühendisliği projelerini, kullandığı hat/otomasyon
verilerini ve program becerilerini gösteren statik portfolyo sitesi.
GitHub Pages üzerinde yayında: `https://sacitalp.github.io/portfolio/`

---

## Klasör yapısı

```
├── index.html          ← Anasayfa (hero, KPI kutuları, proje ızgarası, CV, hobi)
├── project.html         ← Proje detay şablonu — URL: project.html?id=<proje-id>
├── line.html             ← Hat detay şablonu — URL: line.html?id=<hat-id>
├── script.js             ← Anasayfa davranışı (KPI render, radyal menü, marquee, dil)
├── project-detail.js     ← project.html'in davranışı
├── line-detail.js        ← line.html'in davranışı
├── style.css             ← Tüm sayfalar için tek stil dosyası
├── .gitignore            ← Hassas/ham dosyaların yanlışlıkla push edilmesini engeller
├── data/
│   ├── projects.js       ← TEK VERİ KAYNAĞI: PROJECTS, LINES, SKILLS, KPI_HUBS
│   └── i18n.js            ← TR/EN metin sözlüğü (data-i18n anahtarları)
├── assets/
│   ├── SACITALPDALMIS_CV_P.pdf   ← TR CV (indirme linki script.js'te dile göre değişir)
│   └── SACITALPDALMIS_CV_EN.pdf  ← EN CV
└── preview/               ← Sadece geliştirme sırasında hızlı önizleme için,
                              siteye dahil değil (tek dosyada birleştirilmiş kopyalar)
```

---

## Veri modeli (`data/projects.js`)

Site tamamen bu tek dosyadaki dört diziden besleniyor, HTML/JS'e dokunmadan
içerik güncellenebiliyor:

### `PROJECTS`
Her proje şu alanları taşır:
- `tag`, `title`, `desc`, `long` — TR/EN metinler
- `stack` — kullanılan araçlar (proje detay sayfasındaki "Kullanılan Araçlar"
  çipleri için; Programlar KPI kutusundaki sayı ise ayrı olarak `SKILLS`'ten gelir)
- `github`, `video` — henüz doldurulmadıysa `"#"` / `null` bırakılır, sayfa buna göre
  "yakında eklenecek" gösterir
- `related` — proje detay sayfasındaki "İlgili Projeler" için diğer proje id'leri
- `lines` — bu projenin hangi üretim hat(lar)ında kullanıldığı (`LINES` id referansı).
  Hatlardan bağımsız bir proje ise (örn. planlama/kadro çalışması) boş dizi (`[]`)
  bırakılır.
- `department` — sadece `lines: []` olan (hatlardan bağımsız) projelerde kullanılır,
  hangi birime ait olduğunu gösterir (örn. "Planlama", "Mekanik Üretim"). "Canlı
  Proje" kutusunun radyal menüsünde bu bilgi varsa küçük bir alt satır olarak
  görünür; hat bazlı projelerde bu alan hiç eklenmez.
- `sections` — opsiyonel. Medium tarzı iç içe metin/görsel anlatı için (`long`
  yerine kullanılır, varsa öncelikli). Her biri `{type:"text", content:{tr,en}}`
  ya da `{type:"image", src:"...", caption:{tr,en}}` şeklinde, proje detay
  sayfasında yazdığın sırayla render edilir.
- `automation` — `cycleTimeBeforeMin` / `cycleTimeAfterMin` (dakika) ve `manHours`
  (TR/EN metin). **Zaman kazancı yüzdesi bu iki dakika değerinden otomatik hesaplanır**
  (`script.js` içindeki `autoRate()`), elle yüzde girilmez.

  ⚠️ Şu anki `cycleTimeBeforeMin`/`cycleTimeAfterMin`/`manHours` değerleri **örnek**
  veridir — gerçek rakamlar eline geçtikçe bu alanları güncelle, yüzdeler otomatik
  yeniden hesaplanır. `automation: null` olan projeler (henüz detaylandırılmamış
  taslaklar) "Süreç Otomasyonu" kutusunun radyal menüsünde otomatik olarak
  görünmez, dahil olmaları için gerçek `automation` verisi girilmesi yeterli.

### `LINES`
Üretim hatları: `id`, `name`, `company`, `description` (TR/EN). "Üretim Hattı" KPI
kutusunun radyal menüsü bu diziyi kullanır, her dilim `line.html?id=...`'e gider.
O sayfa, `PROJECTS` içinde `lines` alanında bu hat id'sini taşıyan projeleri otomatik
listeler — ayrıca bir "ilişki" tanımlamana gerek yok, tek yönlü (`PROJECTS.lines`)
yeterli.

### `SKILLS`
Kullanılan program/yazılımlar ve 1-5 arası beceri seviyesi. "Programlar" KPI
kutusunun radyal menüsü bu diziyi kullanır — bilgi amaçlıdır, tıklanınca bir yere
yönlendirmez.

### `KPI_HUBS`
Anasayfadaki 4 KPI kutusunu tanımlar. Her biri bir `type` taşıyabilir:
- `type` yok (varsayılan) → `items` dizisindeki proje id'lerine açılan radyal menü
- `type: "lines"` → `LINES` dizisine açılır (Üretim Hattı kutusu)
- `type: "automation"` → `items`'taki projelerin zaman kazancı/adam-saat bilgisini
  gösterir (Süreç Otomasyonu kutusu)
- `type: "skills"` → `SKILLS` dizisine açılır (Programlar kutusu)

Dört kutunun da `num` değeri (kaç tane olduğu) **otomatik hesaplanıyor**
(`script.js`'teki `computeSkillCount`/`computeLineCount`/`computeAutomationAvg`),
elle sayı girilmesi gerekmiyor.

---

## Neler çalışıyor

- Anasayfa hero + 4 KPI kutusu + radyal seçim menüsü (masaüstünde hover, mobilde dokunma)
- Ekran genişliğine göre otomatik çoğalan, boşluksuz kayan durum şeridi (marquee)
- Proje detay sayfası (`project.html?id=...`): uzun açıklama, kullanılan araçlar,
  video/demo alanı, GitHub linki, ilişkili projeler
- Hat detay sayfası (`line.html?id=...`): hat/firma bilgisi, o hatla ilişkili projeler
- TR/EN dil değişimi — tercih `localStorage`'da tutulur, sayfalar arası korunur
- Dile göre değişen CV indirme linki (`assets/SACITALPDALMIS_CV_P.pdf` / `_EN.pdf`)
- `.gitignore` ile ham/hassas dosyaların (`.xlsm`, `private/` vb.) yanlışlıkla
  repoya girmesini engelleyen güvenlik ağı

## Yol haritası / öncelik sırası

**1. Öncelik (şu an aktif):** Mevcut 5 projenin (BOM App, Hat Üretim Veri
Analizi, Üretim Programı Takibi, Eğitim Takip, Deneme Takip Formu) gerçek
verilerini temizlemek/anonimleştirmek, doğru hat(lara) bağlamak ve gerçek
`automation` rakamlarını girmek. Her proje ayrı bir chat'te işleniyor, bu chat
genel mimari/entegrasyon takibini yapıyor.

**Paralel yürüyen işler (öncelik 1 ile birlikte, aynı temizleme sürecinden çıkacak):**
- [ ] GitHub linklerini gerçek repo adresleriyle doldurmak (`projects.js` → `github: "#"`)
- [ ] Video/GIF alanlarını doldurmak (`projects.js` → `video: null`)
- [ ] Gerçek proje ekran görüntüleri
- [ ] Gerçek `automation` rakamlarını (örnek verinin yerine) girmek

**2. Öncelik (projeler yayınlandıktan sonra):**
- [ ] Kod indirme için mail/telefon formu (Formspree/Netlify Forms)
- [ ] Domain (`dalmistech.com` vb.) bağlama — bu noktada tekrar değerlendirilecek

**En son (en düşük öncelik):**
- [ ] Hobi bölümü için ayrı tema/renk seti (şu an anasayfadaki boş bir bölüm)

## Yeni proje / hat / beceri eklemek

`data/projects.js` içine ilgili diziye (`PROJECTS`, `LINES` ya da `SKILLS`) yeni bir
obje eklemen yeterli — anasayfa, radyal menüler ve KPI sayıları otomatik güncellenir,
HTML/JS'e dokunmana gerek yok. Bir projenin bir KPI kutusunun altında görünmesini
istersen `KPI_HUBS` içindeki ilgili `items` dizisine proje id'sini eklemen yeterli.

## Yayınlama (GitHub Pages)

1. Bu klasörü bir GitHub reposuna push et
2. Repo → Settings → Pages → Branch seç → Save
3. `https://kullaniciadin.github.io/repo-adi` adresinden yayında olur
