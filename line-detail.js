(function () {
  "use strict";

  let currentLang = localStorage.getItem("lang") || "tr";

  const detailContent = document.getElementById("detailContent");
  const relatedGrid = document.getElementById("relatedGrid");
  const langBtn = document.getElementById("langToggle");

  function getLineFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return LINES[0]; // id verilmemişse ilk hatta düş
    return LINES.find((l) => l.id === id);
  }

  function projectsForLine(line) {
    return PROJECTS.filter((p) => p.lines && p.lines.includes(line.id));
  }

  function renderNotFound() {
    const msg = currentLang === "tr"
      ? 'Hat bulunamadı. <a href="index.html" style="text-decoration:underline;">Anasayfaya dön</a>.'
      : 'Line not found. <a href="index.html" style="text-decoration:underline;">Back to homepage</a>.';
    detailContent.innerHTML = `<p class="not-found">${msg}</p>`;
    relatedGrid.parentElement.style.display = "none";
  }

  function renderLine(line) {
    document.title = line.name + " — Sacit Alp Dalmış";

    detailContent.innerHTML = `
      <div class="detail-tag">${line.company}</div>
      <h1 class="detail-title">${line.name}</h1>
      <p class="detail-long">${line.description[currentLang]}</p>
    `;

    const related = projectsForLine(line);
    relatedGrid.innerHTML = "";

    if (related.length === 0) {
      const empty = currentLang === "tr"
        ? "Bu hatla ilişkili proje henüz eklenmedi."
        : "No related projects added yet.";
      relatedGrid.innerHTML = `<p style="color:var(--steel); grid-column:1/-1;">${empty}</p>`;
      return;
    }

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
    const line = getLineFromURL();
    if (!line) {
      renderNotFound();
      return;
    }
    renderLine(line);
  }

  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "tr" ? "en" : "tr";
    localStorage.setItem("lang", currentLang);
    render();
  });

  render();
})();
