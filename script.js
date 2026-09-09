(function () {
  "use strict";

  let currentLang = localStorage.getItem("lang") || "tr";
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  const kpiWrap = document.getElementById("kpiWrap");
  const projectGrid = document.getElementById("projectGrid");
  const radialMenu = document.getElementById("radialMenu");
  const radialOverlay = document.getElementById("radialOverlay");
  const radialHoverZone = document.getElementById("radialHoverZone");
  const langBtn = document.getElementById("langToggle");

  // Zaman kazancı (%) hesabı: (önce - sonra) / önce * 100
  function autoRate(p) {
    if (!p.automation) return null;
    const b = p.automation.cycleTimeBeforeMin;
    const a = p.automation.cycleTimeAfterMin;
    if (b == null || a == null || b <= 0) return null;
    return Math.round(((b - a) / b) * 100);
  }

  // Canlı Proje kutusu: tüm PROJECTS'ten otomatik türetilir
  (function computeLiveProjects() {
    const liveHub = KPI_HUBS.find((h) => h.id === "kpi-live");
    if (!liveHub) return;
    liveHub.items = PROJECTS.map((p) => p.id);
    liveHub.num = String(PROJECTS.length);
  })();

  // Programlar kutusunun sayısını SKILLS listesinden otomatik hesapla
  (function computeSkillCount() {
    const toolHub = KPI_HUBS.find((h) => h.id === "kpi-tools");
    if (!toolHub) return;
    toolHub.num = String(SKILLS.length);
  })();

  // Üretim Hattı kutusunun sayısını LINES listesinden otomatik hesapla
  (function computeLineCount() {
    const lineHub = KPI_HUBS.find((h) => h.id === "kpi-lines");
    if (!lineHub) return;
    lineHub.num = String(LINES.length);
  })();

  // Süreç Otomasyonu kutusu: sadece "automation" verisi girilmiş projelerden
  // otomatik türetilir (henüz işlenmemiş/taslak projeler otomatik dışarıda kalır)
  (function computeAutomationAvg() {
    const autoHub = KPI_HUBS.find((h) => h.id === "kpi-automation");
    if (!autoHub) return;
    const withAutomation = PROJECTS.filter((p) => p.automation);
    autoHub.items = withAutomation.map((p) => p.id);
    const rates = withAutomation.map(autoRate).filter((r) => r != null);
    if (!rates.length) return;
    const avg = Math.round(rates.reduce((sum, r) => sum + r, 0) / rates.length);
    autoHub.num = "%" + avg;
  })();

  // ---------- RENDER: KPI CARDS ----------
  function renderKPIs() {
    kpiWrap.innerHTML = "";
    KPI_HUBS.forEach((hub) => {
      const hasMenu = hub.type === "skills" ? SKILLS.length > 0
        : hub.type === "lines" ? LINES.length > 0
        : hub.items.length > 0;
      const el = document.createElement("div");
      el.className = "kpi" + (hasMenu ? " has-menu" : "");
      el.innerHTML = `
        <div class="num">${hub.num}</div>
        <div class="label">${hub.label[currentLang]}</div>
      `;
      if (hasMenu) {
        if (isTouch) {
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            openRadialMenu(el, hub);
          });
        } else {
          el.addEventListener("mouseenter", () => openRadialMenu(el, hub));
          el.addEventListener("mouseleave", scheduleClose);
        }
      }
      kpiWrap.appendChild(el);
    });
  }

  // ---------- RENDER: PROJECT GRID ----------
  function renderProjects() {
    projectGrid.innerHTML = "";
    PROJECTS.forEach((p) => {
      const card = document.createElement("a");
      card.className = "project-card";
      card.id = "project-" + p.id;
      card.href = "project.html?id=" + encodeURIComponent(p.id);
      card.innerHTML = `
        <div class="pc-tag">${p.tag[currentLang]}</div>
        <h3>${p.title[currentLang]}</h3>
        <p>${p.desc[currentLang]}</p>
      `;
      projectGrid.appendChild(card);
    });
  }

  // ---------- RADIAL MENU ----------
  let closeTimer = null;

  function scheduleClose() {
    closeTimer = setTimeout(closeRadialMenu, 220);
  }

  function cancelClose() {
    if (closeTimer) clearTimeout(closeTimer);
  }

  // Bir dilimin içeriğini (HTML + tıklama davranışı) üretir — hem daire hem
  // liste modunda aynı mantık kullanılır, tekrar yazılmaz.
  function buildItemContent(hub, entry) {
    if (hub.type === "skills") {
      const filled = "●".repeat(entry.level);
      const empty = "○".repeat(5 - entry.level);
      return {
        html: `
          <div class="ri-inner">
            <div class="ri-title">${entry.name}</div>
            <div class="ri-dots"><span class="dots-filled">${filled}</span><span class="dots-empty">${empty}</span></div>
          </div>
        `,
        onClick: null
      };
    }
    if (hub.type === "lines") {
      return {
        html: `
          <div class="ri-inner">
            <div class="ri-tag">${entry.company}</div>
            <div class="ri-title">${entry.name}</div>
          </div>
        `,
        onClick: () => { window.location.href = "line.html?id=" + encodeURIComponent(entry.id); }
      };
    }
    if (hub.type === "automation") {
      const rate = autoRate(entry);
      const rateLabel = rate != null ? "%" + rate : "—";
      const manHours = entry.automation && entry.automation.manHours ? entry.automation.manHours[currentLang] : "";
      const metricLabel = currentLang === "tr" ? "zaman kazancı" : "time saved";
      return {
        html: `
          <div class="ri-inner">
            <div class="ri-tag">${entry.tag[currentLang]}</div>
            <div class="ri-title">${entry.title[currentLang]}</div>
            <div class="ri-metric">${rateLabel} ${metricLabel}${manHours ? " · " + manHours : ""}</div>
          </div>
        `,
        onClick: () => { window.location.href = "project.html?id=" + encodeURIComponent(entry.id); }
      };
    }
    const deptLine = entry.department
      ? `<div class="ri-metric">${entry.department[currentLang]}</div>`
      : "";
    return {
      html: `
        <div class="ri-inner">
          <div class="ri-tag">${entry.tag[currentLang]}</div>
          <div class="ri-title">${entry.title[currentLang]}</div>
          ${deptLine}
        </div>
      `,
      onClick: () => { window.location.href = "project.html?id=" + encodeURIComponent(entry.id); }
    };
  }

  function getHubItems(hub) {
    return hub.type === "skills"
      ? SKILLS
      : hub.type === "lines"
      ? LINES
      : hub.items.map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean);
  }

  // Dokunmatik cihazlarda: dikey, kaydırılabilir basit liste (daire, dar
  // ekranlarda çok öğeyle çakışmadan sığmıyor — bu geometrik bir sınır,
  // sayı ayarlamayla çözülemiyor).
  function openListMenu(hub) {
    const items = getHubItems(hub);
    radialMenu.classList.add("list-mode");
    radialMenu.style.left = "";
    radialMenu.style.top = "";
    radialMenu.innerHTML = `
      <div class="list-header">
        <span class="list-num">${hub.num}</span>
        <span class="list-label">${hub.label[currentLang]}</span>
      </div>
    `;
    radialMenu.dataset.hub = hub.id;

    items.forEach((entry) => {
      const { html, onClick } = buildItemContent(hub, entry);
      const item = document.createElement("div");
      item.className = "radial-item" + (hub.type === "skills" ? " skill-item" : "");
      item.innerHTML = html;
      if (onClick) item.addEventListener("click", onClick);
      radialMenu.appendChild(item);
    });

    requestAnimationFrame(() => {
      radialMenu.classList.add("active");
      radialOverlay.classList.add("active");
    });
  }

  function openRadialMenu(triggerEl, hub) {
    cancelClose();

    if (isTouch) {
      openListMenu(hub);
      return;
    }

    const rect = triggerEl.getBoundingClientRect();
    let cx = rect.left + rect.width / 2;
    let cy = rect.top + rect.height / 2;

    const items = getHubItems(hub);
    const count = items.length;

    // Öğe genişliği CSS'teki .radial-item ile eşleşmeli (bkz. style.css medya sorgusu)
    const itemWidth = window.innerWidth <= 860 ? 120 : 150;
    const itemHalfWidth = itemWidth / 2;

    // Komşu dilimler çakışmasın diye, merkezler-arası uzaklık (kiriş) en az
    // öğe genişliği kadar olacak şekilde yarıçapı geometriden hesapla.
    const idealRadius = (itemWidth * 1.5) / (2 * Math.sin(Math.PI / count));
    // Küçük ekranlarda taşmayı önlemek için ekrana sığacak azami yarıçapla sınırla
    const maxRadius = Math.min(window.innerWidth, window.innerHeight) / 2 - itemHalfWidth - 16;
    const radius = Math.min(Math.max(110, idealRadius), Math.max(80, maxRadius));

    // Ekran kenarına taşmayı engelle (artık gerçek yarıçapa göre hesaplanıyor)
    const margin = radius + itemHalfWidth + 12;
    cx = Math.min(Math.max(cx, margin), window.innerWidth - margin);
    cy = Math.min(Math.max(cy, margin), window.innerHeight - margin);

    radialMenu.classList.remove("list-mode");
    radialMenu.style.left = cx + "px";
    radialMenu.style.top = cy + "px";
    radialMenu.innerHTML = "";
    radialMenu.dataset.hub = hub.id;

    // Dilimlerin dış sınırını kapsayan görünmez algılama dairesi — bunun
    // içindeyken fare hangi boşlukta olursa olsun menü açık kalır.
    const zoneDiameter = 2 * (radius + itemHalfWidth + 20);
    radialHoverZone.style.width = zoneDiameter + "px";
    radialHoverZone.style.height = zoneDiameter + "px";
    radialHoverZone.style.left = cx + "px";
    radialHoverZone.style.top = cy + "px";
    radialHoverZone.style.transform = "translate(-50%, -50%)";
    radialHoverZone.classList.add("active");

    const center = document.createElement("div");
    center.className = "radial-center";
    center.textContent = hub.num;
    radialMenu.appendChild(center);

    const startAngle = -90; // yukarıdan başla
    const step = 360 / count;

    items.forEach((entry, i) => {
      const angle = (startAngle + i * step) * (Math.PI / 180);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const line = document.createElement("div");
      line.className = "radial-line";
      const len = Math.sqrt(x * x + y * y);
      const rot = Math.atan2(y, x) * (180 / Math.PI);
      line.style.width = len + "px";
      line.style.transform = `rotate(${rot}deg)`;
      radialMenu.appendChild(line);

      const { html, onClick } = buildItemContent(hub, entry);
      const item = document.createElement("div");
      item.className = "radial-item" + (hub.type === "skills" ? " skill-item" : "");
      item.style.setProperty("--tx", x + "px");
      item.style.setProperty("--ty", y + "px");
      item.innerHTML = html;
      if (onClick) item.addEventListener("click", onClick);

      item.addEventListener("mouseenter", cancelClose);
      item.addEventListener("mouseleave", scheduleClose);
      radialMenu.appendChild(item);
    });

    radialMenu.addEventListener("mouseenter", cancelClose);
    radialMenu.addEventListener("mouseleave", scheduleClose);

    requestAnimationFrame(() => {
      radialMenu.classList.add("active");
      radialOverlay.classList.add("active");
    });
  }

  function closeRadialMenu() {
    radialMenu.classList.remove("active");
    radialOverlay.classList.remove("active");
    radialHoverZone.classList.remove("active");
  }

  radialOverlay.addEventListener("click", closeRadialMenu);
  radialHoverZone.addEventListener("mouseenter", cancelClose);
  radialHoverZone.addEventListener("mouseleave", scheduleClose);
  radialHoverZone.addEventListener("click", closeRadialMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeRadialMenu();
  });

  // ---------- MARQUEE: ekrana göre otomatik çoğaltan sonsuz şerit ----------
  function setupMarquee() {
    const strip = document.querySelector(".status-strip");
    const track = document.getElementById("marqueeTrack");
    const master = document.getElementById("marqueeMaster");
    if (!strip || !track || !master) return;

    // Önceki çoğaltmaları temizle, sadece orijinal seti bırak
    Array.from(track.children).forEach((child) => {
      if (child !== master) child.remove();
    });

    // En az bir kopya daha ekle (çift sayıda set şart - seamless döngü için)
    track.appendChild(master.cloneNode(true));

    let guard = 0;
    while (track.scrollWidth < strip.clientWidth * 2 && guard < 10) {
      track.appendChild(master.cloneNode(true));
      track.appendChild(master.cloneNode(true));
      guard++;
    }

    const speedPxPerSec = 70; // sabit kayma hızı
    const distance = track.scrollWidth / 2; // -50% kaydırma mesafesi
    const duration = Math.max(distance / speedPxPerSec, 10);
    track.style.animation = `scroll ${duration}s linear infinite`;
  }

  let marqueeResizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(marqueeResizeTimer);
    marqueeResizeTimer = setTimeout(setupMarquee, 200);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setupMarquee);
  }

  // ---------- CV: aktif dile göre doğru dosyayı indir ----------
  function updateCVLink() {
    const cvBtn = document.getElementById("cvDownload");
    if (!cvBtn) return;
    if (currentLang === "tr") {
      cvBtn.setAttribute("href", "assets/SACITALPDALMIS_CV_P.pdf");
      cvBtn.setAttribute("download", "SACITALPDALMIS_CV_P.pdf");
    } else {
      cvBtn.setAttribute("href", "assets/SACITALPDALMIS_CV_EN.pdf");
      cvBtn.setAttribute("download", "SACITALPDALMIS_CV_EN.pdf");
    }
  }

  // ---------- LANGUAGE TOGGLE ----------
  function applyLanguage() {
    document.documentElement.dataset.lang = currentLang;
    document.documentElement.lang = currentLang;
    langBtn.textContent = currentLang === "tr" ? "EN" : "TR";
    localStorage.setItem("lang", currentLang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (I18N[currentLang][key]) {
        el.textContent = I18N[currentLang][key];
      }
    });

    renderKPIs();
    renderProjects();
    updateCVLink();
    setupMarquee();
  }

  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "tr" ? "en" : "tr";
    applyLanguage();
  });

  // ---------- INIT ----------
  applyLanguage();
})();
