/**
 * NORTH CLASS — Announcements page.
 * Full timeline built from data/announcements.js, pinned items float
 * to the top, with category filter chips.
 */
(function(){
  const { qs, qsa, escapeHTML, formatDate } = NCUtils;

  NCUtils.onReady(() => {
    const wrap = qs("#announcementsTimeline");
    const filterBar = qs("#announcementFilters");
    if (!wrap || typeof ANNOUNCEMENTS === "undefined") return;

    let activeCategory = "All";

    function itemHTML(a){
      return `
        <div class="timeline-item glass reveal" data-pinned="${!!a.pinned}">
          <div class="timeline-item__head">
            <span class="badge ${a.pinned ? "badge--pinned" : ""}" data-cat="${escapeHTML(a.category || "General")}">
              ${a.pinned ? NCIcons.pin : ""} ${escapeHTML(a.category || "General")}
            </span>
            <time>${formatDate(a.date, { weekday: undefined })}</time>
          </div>
          <h3>${escapeHTML(a.title)}</h3>
          <p style="color:var(--ink-muted)">${escapeHTML(a.message)}</p>
        </div>`;
    }

    function render(){
      let list = activeCategory === "All" ? ANNOUNCEMENTS : ANNOUNCEMENTS.filter(a => a.category === activeCategory);
      list = [...list].sort((a, b) => {
        if (!!b.pinned !== !!a.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
        return new Date(b.date) - new Date(a.date);
      });

      if (!list.length){
        wrap.innerHTML = `
          <div class="empty-state glass">
            <div class="empty-state__icon">${NCIcons.megaphone}</div>
            <h3>${ANNOUNCEMENTS.length ? "Nothing in this category" : "No announcements yet"}</h3>
            <p>${ANNOUNCEMENTS.length ? "Try a different filter." : "Add updates to data/announcements.js and they'll appear here as a timeline."}</p>
          </div>`;
        return;
      }
      wrap.innerHTML = list.map(itemHTML).join("");
    }

    if (filterBar){
      const categories = ["All", ...new Set(ANNOUNCEMENTS.map(a => a.category).filter(Boolean))];
      if (categories.length > 1){
        filterBar.innerHTML = categories.map(c =>
          `<button class="filter-chip ${c === "All" ? "is-active" : ""}" data-cat="${escapeHTML(c)}">${escapeHTML(c)}</button>`
        ).join("");
        qsa(".filter-chip", filterBar).forEach(chip => {
          chip.addEventListener("click", () => {
            qsa(".filter-chip", filterBar).forEach(c => c.classList.remove("is-active"));
            chip.classList.add("is-active");
            activeCategory = chip.dataset.cat;
            render();
          });
        });
      }
    }

    render();
  });
})();
