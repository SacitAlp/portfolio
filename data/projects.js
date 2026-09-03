// ---------------------------------------------------------
// TEK VERİ KAYNAĞI: Yeni proje eklemek için buraya bir obje
// eklemen yeterli. Radyal menü, proje ızgarası ve proje
// detay sayfası (project.html?id=...) hepsi bu diziyi okur.
// ---------------------------------------------------------

const PROJECTS = [
  {
    id: "bom-app",
    category: "is",
    tag: { tr: "Web Uygulaması", en: "Web App" },
    title: { tr: "Ürün Ağacı (BOM) Uygulaması", en: "Bill of Materials App" },
    desc: {
      tr: "Ürün ağacını yönetmek ve görselleştirmek için HTML/JS ile geliştirdiğim bağımsız web uygulaması.",
      en: "A standalone HTML/JS web app for managing and visualizing bill-of-materials structures."
    },
    long: {
      tr: "Üretimde kullanılan ürün ağacı (BOM) verisini statik tablolardan çıkarıp, arama/filtreleme ve hiyerarşik görünümle kullanılabilir bir web arayüzüne taşıdığım proje. Amaç, saha ekibinin bir parçanın hangi üst montaja ait olduğunu saniyeler içinde bulabilmesiydi.",
      en: "Moved bill-of-materials data out of static tables into a usable web interface with search, filtering, and a hierarchical view. The goal was letting the floor team find which parent assembly a part belongs to in seconds."
    },
    stack: ["HTML", "CSS", "JavaScript"],
    github: "#",
    video: null,
    related: ["hat-analizi", "uretim-programi"],
    department: { tr: "Mekanik Üretim", en: "Mechanical Production" },
    lines: [],
    // ÖRNEK veri — gerçek rakamlarla değiştir
    automation: {
      manHours: { tr: "Aylık ~20 saat", en: "~20 hrs/month" },
      cycleTimeBeforeMin: 30,
      cycleTimeAfterMin: 4
    }
  },
  {
    id: "hat-analizi",
    category: "is",
    tag: { tr: "Excel · Dashboard", en: "Excel · Dashboard" },
    title: { tr: "Hat Üretim Veri Analizi", en: "Production Line Data Analysis" },
    desc: {
      tr: "Hat verilerini toplayıp analiz eden, formül zincirleriyle otomatik güncellenen dashboard.",
      en: "A dashboard that collects and analyzes line data, auto-updating through chained formulas."
    },
    long: {
      tr: "Günlük hat verisini manuel toplama sürecini ortadan kaldırıp, LAMBDA/LET formül zincirleriyle otomatik güncellenen bir dashboard'a dönüştürdüğüm çalışma. Grafikler ve özet tablolar, ham veri girildiği anda kendini yeniliyor.",
      en: "Replaced manual daily line-data collection with a dashboard that auto-updates through chained LAMBDA/LET formulas. Charts and summary tables refresh the moment raw data is entered."
    },
    stack: ["Excel", "LAMBDA/LET", "Pivot"],
    github: "#",
    video: null,
    related: ["uretim-programi", "deneme-takip"],
    lines: ["alfa-sargi"],
    // ÖRNEK veri — gerçek rakamlarla değiştir
    automation: {
      manHours: { tr: "Aylık ~35 saat", en: "~35 hrs/month" },
      cycleTimeBeforeMin: 60,
      cycleTimeAfterMin: 8
    }
  },
  {
    id: "uretim-programi",
    category: "is",
    tag: { tr: "Excel · Planlama", en: "Excel · Planning" },
    title: { tr: "Üretim Programı Takip Sistemi", en: "Production Schedule Tracker" },
    desc: {
      tr: "Günlük/haftalık üretim programını takip eden, sevkiyat ve stok durumunu bir arada gösteren araç.",
      en: "Tracks the daily/weekly production schedule alongside shipment and stock status."
    },
    long: {
      tr: "Planlama, sevkiyat ve stok verisini ayrı tablolarda tutmak yerine tek bir panoda birleştirdiğim takip sistemi. Gecikme riski taşıyan kalemler otomatik olarak öne çıkıyor.",
      en: "Consolidated planning, shipment, and stock data — previously kept in separate sheets — into a single dashboard. Items at risk of delay are automatically flagged."
    },
    stack: ["Excel", "VBA", "Koşullu Biçimlendirme"],
    github: "#",
    video: null,
    related: ["hat-analizi", "egitim-takip"],
    department: { tr: "Planlama", en: "Planning" },
    lines: [],
    // ÖRNEK veri — gerçek rakamlarla değiştir
    automation: {
      manHours: { tr: "Aylık ~25 saat", en: "~25 hrs/month" },
      cycleTimeBeforeMin: 40,
      cycleTimeAfterMin: 10
    }
  },
  {
    id: "egitim-takip",
    category: "is",
    tag: { tr: "Excel · Matris", en: "Excel · Matrix" },
    title: { tr: "Eğitim Takip Sistemi", en: "Training Tracker" },
    desc: {
      tr: "Ekip bazında eğitim durumunu matris üzerinden izleyen ve eksikleri öne çıkaran takip tablosu.",
      en: "A team-level training matrix that tracks progress and surfaces gaps."
    },
    long: {
      tr: "Ekip üyelerinin hangi eğitimleri tamamladığını satır/sütun matrisiyle görünür kılan, eksik eğitimleri renkle işaretleyen bir takip aracı. Amaç, eğitim planlamasını tablo taramaktan çıkarıp tek bakışta görülebilir hale getirmekti.",
      en: "Makes completed trainings visible per team member through a row/column matrix, flagging gaps by color. The goal was turning training planning from spreadsheet-scanning into a single glance."
    },
    stack: ["Excel", "Koşullu Biçimlendirme"],
    github: "#",
    video: null,
    related: ["deneme-takip", "uretim-programi"],
    department: { tr: "Mekanik Üretim", en: "Mechanical Production" },
    lines: [], // belirli bir hatta değil, ekip/eğitim bazlı çalışıyor
    // ÖRNEK veri — gerçek rakamlarla değiştir
    automation: {
      manHours: { tr: "Aylık ~10 saat", en: "~10 hrs/month" },
      cycleTimeBeforeMin: 20,
      cycleTimeAfterMin: 5
    }
  },
  {
    id: "deneme-takip",
    category: "is",
    tag: { tr: "Excel · Kalite", en: "Excel · Quality" },
    title: { tr: "Deneme Takip Formu", en: "Test Tracking Form" },
    desc: {
      tr: "Üretim hatlarındaki test/deneme kayıtlarını standart bir formda toplayan takip sistemi.",
      en: "Collects test/trial records from production lines in a standardized tracking form."
    },
    long: {
      tr: "Farklı hatlarda dağınık şekilde tutulan test/deneme kayıtlarını tek bir standart form altında topladığım sistem. Böylece geçmiş kayıtlara erişmek ve hatlar arası kıyaslama yapmak kolaylaştı.",
      en: "Brought scattered test/trial records from different lines under a single standardized form, making historical lookups and cross-line comparisons much easier."
    },
    stack: ["Excel", "Form Tasarımı"],
    github: "#",
    video: null,
    related: ["hat-analizi", "bom-app"],
    lines: ["odawara-sargi", "alfa-sargi", "rotor-hatti", "muhafaza-otomasyon", "eksantrik-presler"],
    // ÖRNEK veri — gerçek rakamlarla değiştir
    automation: {
      manHours: { tr: "Aylık ~15 saat", en: "~15 hrs/month" },
      cycleTimeBeforeMin: 25,
      cycleTimeAfterMin: 6
    }
  },
  // ---------------------------------------------------------
  // Aşağıdaki 4 proje TASLAK — kendi chat'lerinde detaylandırılınca
  // tag/desc/long/stack/automation alanları güncellenecek.
  // ---------------------------------------------------------
  {
    id: "uretim-plani",
    category: "is",
    tag: { tr: "Excel · Planlama", en: "Excel · Planning" },
    title: { tr: "Mekanik Üretim Planı", en: "Mechanical Production Plan" },
    desc: {
      tr: "Tüm hatlardaki stok ve üretim sayılarının plan bazında takip edildiği çalışma.",
      en: "Tracks stock levels and production counts across all lines against the plan."
    },
    long: {
      tr: "Detaylandırılacak.",
      en: "To be detailed."
    },
    stack: ["Excel", "VBA"],
    github: "#",
    video: null,
    related: ["uretim-programi", "hat-analizi"],
    lines: ["odawara-sargi", "alfa-sargi", "rotor-hatti", "muhafaza-otomasyon", "eksantrik-presler"],
    automation: null // henüz işlenmedi
  },
  {
    id: "ariza-yedek-parca",
    category: "is",
    tag: { tr: "Excel · Kalite", en: "Excel · Quality" },
    title: { tr: "Arıza Kayıt & Yedek Parça Stok", en: "Fault Log & Spare Parts Stock" },
    desc: {
      tr: "Hat arızalarının kaydı ve yedek parça stok takibinin yapıldığı sistem.",
      en: "Logs line faults and tracks spare parts stock."
    },
    long: {
      tr: "Detaylandırılacak.",
      en: "To be detailed."
    },
    stack: ["Excel", "VBA"],
    github: "#",
    video: null,
    related: ["deneme-takip", "uretim-plani"],
    lines: ["odawara-sargi", "alfa-sargi", "rotor-hatti", "muhafaza-otomasyon", "eksantrik-presler"],
    automation: null // henüz işlenmedi
  },
  {
    id: "sap-entegrasyon",
    category: "is",
    tag: { tr: "Excel · SAP", en: "Excel · SAP" },
    title: { tr: "SAP Entegrasyon Araçları", en: "SAP Integration Tools" },
    desc: {
      tr: "SAP'tan veri çekme ve ürün ağacı (BOM) eşleştirme için geliştirilen araçlar.",
      en: "Tools for pulling data from SAP and matching bill-of-materials structures."
    },
    long: {
      tr: "Detaylandırılacak.",
      en: "To be detailed."
    },
    stack: ["Excel", "VBA", "SAP"],
    github: "#",
    video: null,
    related: ["bom-app", "uretim-programi"],
    department: { tr: "Planlama + Mekanik Üretim", en: "Planning + Mechanical Production" },
    lines: [],
    automation: null // henüz işlenmedi
  },
  {
    id: "sargi-vardiya-mesai",
    category: "is",
    tag: { tr: "Excel · Planlama", en: "Excel · Planning" },
    title: { tr: "Sargı Vardiya & Mesai Takibi", en: "Winding Shift & Overtime Tracker" },
    desc: {
      tr: "Sargı hatlarındaki vardiya ve mesai planlamasının yapıldığı çalışma.",
      en: "Manages shift and overtime planning for the winding lines."
    },
    long: {
      tr: "Detaylandırılacak.",
      en: "To be detailed."
    },
    stack: ["Excel", "VBA"],
    github: "#",
    video: null,
    related: ["hat-analizi", "uretim-plani"],
    lines: ["odawara-sargi", "alfa-sargi"],
    automation: null // henüz işlenmedi
  }
];

// Üretim hatları. "kpi-lines" kutusunun radyal menüsü bu diziyi kullanır.
// Bir projenin hangi hat(lar)da kullanıldığı PROJECTS içindeki "lines" alanından okunur.
const LINES = [
  {
    id: "odawara-sargi",
    name: "Odawara Sargı Hattı",
    company: "Arçelik Kompresör İşletmesi",
    description: {
      tr: "BLDC motor statorunun Cu/Al tellerle sarımı yapılmaktadır.",
      en: "Cu/Al wire winding of the BLDC motor stator is performed on this line."
    }
  },
  {
    id: "alfa-sargi",
    name: "Alfa Sargı Hattı",
    company: "Arçelik Kompresör İşletmesi",
    description: {
      tr: "BLDC motor statorunun Cu/Al tellerle sarımı yapılmaktadır.",
      en: "Cu/Al wire winding of the BLDC motor stator is performed on this line."
    }
  },
  {
    id: "rotor-hatti",
    name: "Rotor Hattı",
    company: "Arçelik Kompresör İşletmesi",
    description: {
      tr: "BLDC motor rotoru üretimi yapılmaktadır.",
      en: "BLDC motor rotor production takes place on this line."
    }
  },
  {
    id: "muhafaza-otomasyon",
    name: "Muhafaza Otomasyon Hattı",
    company: "Arçelik Kompresör İşletmesi",
    description: {
      tr: "Muhafaza boru ve terminal kaynağı yapılmaktadır.",
      en: "Housing pipe and terminal welding is performed on this line."
    }
  },
  {
    id: "eksantrik-presler",
    name: "Eksantrik Presler",
    company: "Arçelik Kompresör İşletmesi",
    // ÖRNEK açıklama — gerçek süreç bilgisiyle değiştir
    description: {
      tr: "Eksantrik preslerle sac/metal parçaların zımbalanması ve şekillendirilmesi yapılmaktadır.",
      en: "Sheet metal stamping and forming is performed using eccentric presses on this line."
    }
  }
];

// KPI kutuları: her biri (opsiyonel olarak) bir radyal menüye bağlanır.
// items -> PROJECTS içindeki id'lere referans verir (skills/lines tipi hariç).
const KPI_HUBS = [
  {
    id: "kpi-live",
    num: null, // script.js içinde PROJECTS.length'ten otomatik hesaplanır
    label: { tr: "Canlı Proje", en: "Live Projects" },
    items: [] // script.js içinde PROJECTS'ten otomatik türetilir
  },
  {
    id: "kpi-lines",
    type: "lines",
    num: null, // script.js içinde LINES.length'ten otomatik hesaplanır
    label: { tr: "Üretim Hattı", en: "Production Lines" },
    items: []
  },
  {
    id: "kpi-automation",
    type: "automation",
    num: null, // script.js içinde projelerin zaman kazancı ortalamasından otomatik hesaplanır
    label: { tr: "Süreç Otomasyonu", en: "Process Automation" },
    items: [] // script.js içinde "automation" verisi olan projelerden otomatik türetilir
  },
  {
    id: "kpi-tools",
    type: "skills",
    num: null, // script.js içinde SKILLS.length'ten otomatik hesaplanır
    label: { tr: "Programlar", en: "Software" },
    items: []
  }
];

// Kullanılan program/araçlar ve beceri seviyesi (1-5).
// "kpi-tools" kutusunun radyal menüsü bu diziyi kullanır (projelere değil).
const SKILLS = [
  { name: "Siemens NX", level: 4 },
  { name: "Solidworks", level: 5 },
  { name: "Teamcenter", level: 4 },
  { name: "SAP ERP", level: 3 },
  { name: "Python / Excel VBA / Matlab", level: 5 },
  { name: "C++", level: 4 },
  { name: "Arduino IDE", level: 4 },
  { name: "Tecnomatix / TIA Portal", level: 3 }
];
