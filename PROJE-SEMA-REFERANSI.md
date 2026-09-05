# DalmisTech Portfolyo — Proje Veri Şeması Referansı

Bu, ana portfolyo sitesinin (github.com/SacitAlp/portfolio) veri modeline entegre
edilecek bir proje üzerinde çalışıyoruz. Tutarlılık için mevcut kimlikler ve şema:

## Mevcut proje id'leri (data/projects.js → PROJECTS)
bom-app, hat-analizi, uretim-programi, egitim-takip, deneme-takip

## Mevcut hat id'leri (data/projects.js → LINES)
odawara-sargi, alfa-sargi, rotor-hatti, muhafaza-otomasyon, eksantrik-presler

## Her PROJECTS objesinin alanları
```js
{
  id: "proje-id",                    // mevcut id'lerden biri, değiştirilmez
  category: "is",
  tag: { tr: "...", en: "..." },      // kısa etiket, örn "Excel · Dashboard"
  title: { tr: "...", en: "..." },
  desc: { tr: "...", en: "..." },     // 1-2 cümle kısa açıklama
  long: { tr: "...", en: "..." },     // proje detay sayfası için uzun açıklama
  stack: ["Excel", "VBA", ...],       // kullanılan araçlar
  github: "#" veya gerçek repo linki,
  video: null veya demo video/GIF linki,
  related: ["diger-proje-id", ...],
  lines: ["hat-id", ...],             // yukarıdaki mevcut hat id'lerinden, ilgisi yoksa []
  automation: {
    manHours: { tr: "Aylık ~X saat", en: "~X hrs/month" },
    cycleTimeBeforeMin: <sayı, dakika>,
    cycleTimeAfterMin: <sayı, dakika>
  },
  // OPSİYONEL — Medium tarzı iç içe metin/görsel anlatı istiyorsan (örn. Python
  // ile yapılmış gelişmiş bir versiyonun dashboard ekran görüntülerini göstermek
  // için). Varsa "long" alanı yerine bu kullanılır, sırayla render edilir.
  sections: [
    { type: "text", content: { tr: "...", en: "..." } },
    { type: "image", src: "assets/projects/<proje-id>/gorsel1.png", caption: { tr: "...", en: "..." } },
    { type: "text", content: { tr: "...", en: "..." } }
    // ... istediğin kadar tekrar edebilir
  ]
}
```

## Önemli kurallar
- Şirketin gerçek/hassas verileri (gerçek rakamlar, iç bilgiler) asla görsele/koda
  gömülmemeli — anonimleştirilmiş/örnek verilerle gösterime hazırlanmalı.
- Zaman kazancı yüzdesi elle girilmez, `cycleTimeBeforeMin`/`cycleTimeAfterMin`'den
  otomatik hesaplanır.
- Bu chat'in çıktısı: yukarıdaki şemaya uygun, doldurulmuş bir PROJECTS objesi +
  varsa ekran görüntüsü/GIF dosyası. Bu çıktıyı ana takip chat'ine (Claude.ai'de
  devam eden portfolyo sohbeti) götürüp `data/projects.js`'e entegre ettireceğim.

---

## Standart işleme süreci (her proje için aynı akış)

**⚠️ Teknik kısıt:** GitHub Pages sadece statik dosya sunar, sunucu tarafı kod
çalıştırmaz. Yani sitede *gerçekten çalışan* bir demo istiyorsak bu **HTML/CSS/JS**
olmak zorunda. Python vb. diller sadece arka planda bir şey üretmek (grafik, veri
seti) için offline araç olarak kullanılabilir, siteye gömülü çalışmaz.

1. **İnceleme** — Orijinal dosyayı (Excel/HTML) incele, ne işe yaradığını, temel
   mantığını/formüllerini/yapısını çıkar.
2. **Temizleme / Anonimleştirme** — Gerçek şirket verilerini (isim, rakam, iç bilgi)
   sahte ama gerçekçi verilerle değiştir. Ham dosya asla repoya girmez (`.gitignore`
   zaten koruyor).
3. **Görselleştirme** — Mümkünse HTML/CSS/JS ile interaktif bir demo/mockup
   oluştur. Emeğe değmiyorsa yüksek kaliteli ekran görüntüsü/GIF yeterli — bu karar
   proje bazında verilir, her projeye zorunlu değil.

   **Alternatif — gelişmiş versiyon + görsel anlatı:** Excel yerine Python (ya da
   uygun bir dille) projenin daha iyi bir versiyonunu ayrıca yazabilirsin. Bu,
   sitede *çalışmaz* (GitHub Pages sadece statik dosya sunar) — amaç, o aracın
   dashboard/ekran görüntülerini `sections` alanıyla Medium tarzı bir anlatıya
   (metin → görsel → metin → görsel...) dönüştürmek. Görselleri
   `assets/projects/<proje-id>/` klasörüne koy, `sections` içinde sırayla
   referans ver.
4. **Vaka Analizi Metni** — Problem → Yaklaşım → Çözüm → Sonuç formatında bir
   anlatı. Sitedeki `desc`/`long` alanlarının kaynağı olur; ayrıca Medium/LinkedIn'de
   kullanılabilecek ayrı bir `.md` dosyası olarak da teslim edilir.
5. **Şema Doldurma** — Yukarıdaki `PROJECTS` şemasındaki tüm alanları eksiksiz
   doldur.
6. **Teslim** — Tamamlanan şema objesi + varsa demo HTML dosyası + ekran
   görüntüsü/GIF + case study `.md` dosyasını ana takip chat'ine (Claude.ai'deki
   portfolyo sohbeti) getir, orada `data/projects.js`'e entegre edilip test edilir.
