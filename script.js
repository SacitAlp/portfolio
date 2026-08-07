(function () {
  "use strict";

  let currentLang = localStorage.getItem("lang") || "tr";
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  const kpiWrap = document.getElementById("kpiWrap");
  const projectGrid = document.getElementById("projectGrid");
  const radialMenu = document.getElementById("radialMenu");
  const radialOverlay = document.getElementById("radialOverlay");
  const langBtn = document.getElementById("langToggle");

  // ---------- RENDER: KPI CARDS ----------
  function renderKPIs() {
    kpiWrap.innerHTML = "";
    KPI_HUBS.forEach((hub) => {
      const el = document.createElement("div");
      el.className = "kpi" + (hub.items.length ? " has-menu" : "");
      el.innerHTML = `
        <div class="num">${hub.num}</div>
        <div class="label">${hub.label[currentLang]}</div>
      `;
      if (hub.items.length) {
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

    const items = hub.items
      .map((id) => PROJECTS.find((p) => p.id === id))
      .filter(Boolean);

    const radius = 130;
    const count = items.length;
    const startAngle = -90; // yukarıdan başla
    const step = 360 / count;

    items.forEach((proj, i) => {
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
      item.className = "radial-item";
      item.style.setProperty("--tx", x + "px");
      item.style.setProperty("--ty", y + "px");
      item.innerHTML = `
        <div class="ri-inner">
          <div class="ri-tag">${proj.tag[currentLang]}</div>
          <div class="ri-title">${proj.title[currentLang]}</div>
        </div>
      `;
      item.addEventListener("mouseenter", cancelClose);
      item.addEventListener("mouseleave", scheduleClose);
      item.addEventListener("click", () => {
        window.location.href = "project.html?id=" + encodeURIComponent(proj.id);
      });
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
  }

  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "tr" ? "en" : "tr";
    applyLanguage();
  });

  // ---------- INIT ----------
  applyLanguage();
})();
