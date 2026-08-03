/**
 * NORTH CLASS — Assignments page.
 * Renders cards from data/assignments.js with live search and
 * status/priority filter chips.
 */
(function(){
  const { qs, qsa, escapeHTML, formatDate, debounce } = NCUtils;

  NCUtils.onReady(() => {
    const grid = qs("#assignmentsGrid");
    const searchInput = qs("#assignmentSearch");
    const filterBar = qs("#assignmentFilters");
    if (!grid || typeof ASSIGNMENTS === "undefined") return;

    let activeFilter = "All";

    function cardHTML(a){
      const progress = Math.max(0, Math.min(100, Number(a.progress) || 0));
      return `
        <article class="assignment-card glass reveal">
          <div class="assignment-card__top">
            <div>
              <h3>${escapeHTML(a.title || a.subject)}</h3>
              <div class="subject-tag">${escapeHTML(a.subject)} · ${escapeHTML(a.teacher || "")}</div>
            </div>
            <span class="priority-dot" data-p="${escapeHTML(a.priority || "Medium")}">${escapeHTML(a.priority || "Medium")}</span>
          </div>
          ${a.description ? `<p style="color:var(--ink-muted);font-size:var(--fs-sm)">${escapeHTML(a.description)}</p>` : ""}
          <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
          <div class="assignment-card__foot">
            <span>Due ${formatDate(a.dueDate)}</span>
            <span class="status-tag" data-s="${escapeHTML(a.status || "Not Started")}">${escapeHTML(a.status || "Not Started")}</span>
          </div>
        </article>`;
    }

    function render(){
      const q = (searchInput?.value || "").trim().toLowerCase();
      let list = ASSIGNMENTS;
      if (activeFilter !== "All") list = list.filter(a => a.status === activeFilter);
      if (q) list = list.filter(a =>
        (a.subject || "").toLowerCase().includes(q) ||
        (a.teacher || "").toLowerCase().includes(q) ||
        (a.title || "").toLowerCase().includes(q)
      );

      if (!list.length){
        grid.innerHTML = `
          <div class="empty-state glass" style="grid-column:1/-1">
            <div class="empty-state__icon">${NCIcons.book}</div>
            <h3>${ASSIGNMENTS.length ? "No assignments match" : "No assignments yet"}</h3>
            <p>${ASSIGNMENTS.length ? "Try clearing your search or filter." : "New work added to data/assignments.js will show up here automatically."}</p>
          </div>`;
        return;
      }
      grid.innerHTML = list.map(cardHTML).join("");
    }

    if (filterBar){
      const statuses = ["All", ...new Set(ASSIGNMENTS.map(a => a.status).filter(Boolean))];
      filterBar.innerHTML = statuses.map(s =>
        `<button class="filter-chip ${s === "All" ? "is-active" : ""}" data-status="${escapeHTML(s)}">${escapeHTML(s)}</button>`
      ).join("");
      qsa(".filter-chip", filterBar).forEach(chip => {
        chip.addEventListener("click", () => {
          qsa(".filter-chip", filterBar).forEach(c => c.classList.remove("is-active"));
          chip.classList.add("is-active");
          activeFilter = chip.dataset.status;
          render();
        });
      });
    }

    searchInput?.addEventListener("input", debounce(render, 150));
    render();
  });
})();
