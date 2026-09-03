(function () {
  "use strict";

  let currentLang = localStorage.getItem("lang") || "tr";

  const detailContent = document.getElementById("detailContent");
  const relatedGrid = document.getElementById("relatedGrid");
  const langBtn = document.getElementById("langToggle");

  function getProjectFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return PROJECTS[0]; // id verilmemişse ilk projeye düş
    return PROJECTS.find((p) => p.id === id);
  }

  // Video ve/veya statik görsel galerisini (örn. Python ile yapılmış gelişmiş
  // versiyonun ekran görüntüleri) birlikte render eder. İkisi de yoksa "yakında
  // eklenecek" gösterir.
  function buildMediaBlock(project, t) {
    const blocks = [];
    if (project.video) {
      blocks.push(`<div class="detail-media"><video src="${project.video}" controls></video></div>`);
    }
    if (project.images && project.images.length) {
      project.images.forEach((img) => {
        const caption = img.caption
          ? `<div class="detail-media-caption">${img.caption[currentLang]}</div>`
          : "";
        blocks.push(`<div class="detail-media"><img src="${img.src}" alt="">${caption}</div>`);
      });
    }
    if (!blocks.length) {
      blocks.push(`<div class="detail-media">${t.detail_soon}</div>`);
    }
    return blocks.join("");
  }

  // Sırayla metin/görsel bloklarını (Medium tarzı anlatı) render eder.
  // project.sections varsa bunu kullanır, yoksa eski tek-paragraf (long) davranışı.
  function buildBody(project) {
    if (project.sections && project.sections.length) {
      return project.sections.map((sec) => {
        if (sec.type === "text") {
          return `<p class="detail-long">${sec.content[currentLang]}</p>`;
        }
        if (sec.type === "image") {
          const cap = sec.caption
            ? `<div class="detail-image-caption">${sec.caption[currentLang]}</div>`
            : "";
          const alt = sec.caption ? sec.caption[currentLang] : "";
          return `<figure class="detail-image"><img src="${sec.src}" alt="${alt}">${cap}</figure>`;
        }
        return "";
      }).join("");
    }
    return `<p class="detail-long">${project.long[currentLang]}</p>`;
  }

  function relatedFor(project) {
    const ids = project.related && project.related.length
      ? project.related
      : PROJECTS.filter((p) => p.category === project.category && p.id !== project.id).map((p) => p.id);
    return ids.map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean);
  }

  function renderNotFound() {
    detailContent.innerHTML = `<p class="not-found">Proje bulunamadı. <a href="index.html#projeler" style="text-decoration:underline;">Proje listesine dön</a>.</p>`;
    relatedGrid.parentElement.style.display = "none";
  }

  function renderProject(project) {
    document.title = project.title[currentLang] + " — Sacit Alp Dalmış";

    const t = I18N[currentLang];
    const stackChips = project.stack.map((s) => `<span class="chip">${s}</span>`).join("");

    const githubBtn = project.github && project.github !== "#"
      ? `<a href="${project.github}" class="btn" target="_blank" rel="noopener">${t.detail_github}</a>`
      : `<span class="btn ghost" style="opacity:0.5; cursor:default;">${t.detail_soon}</span>`;

    const videoBtn = project.video
      ? `<a href="${project.video}" class="btn ghost" target="_blank" rel="noopener">${t.detail_video}</a>`
      : "";

    const mediaBlock = buildMediaBlock(project, t);
    const bodyHtml = buildBody(project);

    detailContent.innerHTML = `
      <div class="detail-tag">${project.tag[currentLang]}</div>
      <h1 class="detail-title">${project.title[currentLang]}</h1>
      ${bodyHtml}

      <div class="detail-stack-label">${t.detail_stack}</div>
      <div class="stack-chips">${stackChips}</div>

      ${mediaBlock}

      <div class="detail-ctas">
        ${githubBtn}
        ${videoBtn}
      </div>
    `;

    const related = relatedFor(project);
    relatedGrid.innerHTML = "";
    related.forEach((p) => {
      const card = document.createElement("a");
      card.className = "project-card";
      card.href = "project.html?id=" + encodeURIComponent(p.id);
      card.innerHTML = `
        <div class="pc-tag">${p.tag[currentLang]}</div>
        <h3>${p.title[currentLang]}</h3>
        <p>${p.desc[currentLang]}</p>
      `;
      relatedGrid.appendChild(card);
    });
  }

  function applyStaticTexts() {
    document.documentElement.dataset.lang = currentLang;
    document.documentElement.lang = currentLang;
    langBtn.textContent = currentLang === "tr" ? "EN" : "TR";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (I18N[currentLang][key]) el.textContent = I18N[currentLang][key];
    });
  }

  function render() {
    applyStaticTexts();
    const project = getProjectFromURL();
    if (!project) {
      renderNotFound();
      return;
    }
    renderProject(project);
  }

  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "tr" ? "en" : "tr";
    localStorage.setItem("lang", currentLang);
    render();
  });

  render();
})();
