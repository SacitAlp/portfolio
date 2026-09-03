(function () {
  "use strict";

  let currentLang = localStorage.getItem("lang") || "tr";
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  const kpiWrap = document.getElementById("kpiWrap");
  const projectGrid = document.getElementById("projectGrid");
  const radialMenu = document.getElementById("radialMenu");
  const radialOverlay = document.getElementById("radialOverlay");
  const langBtn = document.getElementById("langToggle");

  // Zaman kazancı (%) hesabı: (önce - sonra) / önce * 100
  function autoRate(p) {
    if (!p.automation) return null;
    const b = p.automation.cycleTimeBeforeMin;
    const a = p.automation.cycleTimeAfterMin;
    if (b == null || a == null || b <= 0) return null;
    return Math.round(((b - a) / b) * 100);
  }

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

  // Süreç Otomasyonu kutusunun sayısını projelerin zaman kazancı ortalamasından hesapla
  (function computeAutomationAvg() {
    const autoHub = KPI_HUBS.find((h) => h.id === "kpi-automation");
    if (!autoHub) return;
    const rates = autoHub.items
      .map((id) => PROJECTS.find((p) => p.id === id))
      .filter(Boolean)
      .map(autoRate)
      .filter((r) => r != null);
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

  function openRadialMenu(triggerEl, hub) {
    cancelClose();
    const rect = triggerEl.getBoundingClientRect();
    let cx = rect.left + rect.width / 2;
    let cy = rect.top + rect.height / 2;

    // Ekran kenarına taşmayı engelle
    const margin = 170;
    cx = Math.min(Math.max(cx, margin), window.innerWidth - margin);
    cy = Math.min(Math.max(cy, margin), window.innerHeight - margin);

    radialMenu.style.left = cx + "px";
    radialMenu.style.top = cy + "px";
    radialMenu.innerHTML = "";
    radialMenu.dataset.hub = hub.id;

    const center = document.createElement("div");
    center.className = "radial-center";
    center.textContent = hub.num;
    radialMenu.appendChild(center);

    const items = hub.type === "skills"
      ? SKILLS
      : hub.type === "lines"
      ? LINES
      : hub.items.map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean);

    const radius = 130 + Math.max(0, items.length - 5) * 12;
    const count = items.length;
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

      const item = document.createElement("div");
      item.className = "radial-item" + (hub.type === "skills" ? " skill-item" : "");
      item.style.setProperty("--tx", x + "px");
      item.style.setProperty("--ty", y + "px");

      if (hub.type === "skills") {
        const filled = "●".repeat(entry.level);
        const empty = "○".repeat(5 - entry.level);
        item.innerHTML = `
          <div class="ri-inner">
            <div class="ri-title">${entry.name}</div>
            <div class="ri-dots"><span class="dots-filled">${filled}</span><span class="dots-empty">${empty}</span></div>
          </div>
        `;
      } else if (hub.type === "lines") {
        item.innerHTML = `
          <div class="ri-inner">
            <div class="ri-tag">${entry.company}</div>
            <div class="ri-title">${entry.name}</div>
          </div>
        `;
        item.addEventListener("click", () => {
          window.location.href = "line.html?id=" + encodeURIComponent(entry.id);
        });
      } else if (hub.type === "automation") {
        const rate = autoRate(entry);
        const rateLabel = rate != null ? "%" + rate : "—";
        const manHours = entry.automation && entry.automation.manHours ? entry.automation.manHours[currentLang] : "";
        const metricLabel = currentLang === "tr" ? "zaman kazancı" : "time saved";
        item.innerHTML = `
          <div class="ri-inner">
            <div class="ri-tag">${entry.tag[currentLang]}</div>
            <div class="ri-title">${entry.title[currentLang]}</div>
            <div class="ri-metric">${rateLabel} ${metricLabel}${manHours ? " · " + manHours : ""}</div>
          </div>
        `;
        item.addEventListener("click", () => {
          window.location.href = "project.html?id=" + encodeURIComponent(entry.id);
        });
      } else {
        item.innerHTML = `
          <div class="ri-inner">
            <div class="ri-tag">${entry.tag[currentLang]}</div>
            <div class="ri-title">${entry.title[currentLang]}</div>
          </div>
        `;
        item.addEventListener("click", () => {
          window.location.href = "project.html?id=" + encodeURIComponent(entry.id);
        });
      }

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
  }

  radialOverlay.addEventListener("click", closeRadialMenu);
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
