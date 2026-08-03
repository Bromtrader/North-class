/**
 * NORTH CLASS — homepage logic.
 * Live clock, auto-counted stats, and a 3-card announcements preview.
 */
(function(){
  const { qs, formatDate, escapeHTML } = NCUtils;

  function initClock(){
    const timeEl = qs("[data-clock-time]");
    const dateEl = qs("[data-clock-date]");
    if (!timeEl && !dateEl) return;
    function tick(){
      const now = new Date();
      if (timeEl) timeEl.textContent = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      if (dateEl) dateEl.textContent = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    }
    tick();
    setInterval(tick, 1000);
  }

  function renderStats(){
    const grid = qs("#statsGrid");
    if (!grid || typeof CONFIG === "undefined") return;
    const stats = CONFIG.stats || [];
    if (!stats.length){ grid.closest(".section")?.remove(); return; }

    grid.innerHTML = stats.map(s => {
      const value = s.source ? NCUtils.getAutoCount(s.source) : (s.value ?? 0);
      const icon = NCIcons[s.icon] || NCIcons.compass;
      return `
        <div class="stat-card glass reveal">
          <div class="stat-card__icon">${icon}</div>
          <div class="stat-card__value" data-count-to="${value}">0</div>
          <div class="stat-card__label">${escapeHTML(s.label)}</div>
        </div>`;
    }).join("");
  }

  function renderAnnouncementsPreview(){
    const wrap = qs("#announcementsPreview");
    if (!wrap || typeof ANNOUNCEMENTS === "undefined") return;

    if (!ANNOUNCEMENTS.length){
      wrap.innerHTML = `
        <div class="empty-state glass">
          <div class="empty-state__icon">${NCIcons.megaphone}</div>
          <h3>No announcements yet</h3>
          <p>New updates will appear here as soon as they're added to data/announcements.js.</p>
        </div>`;
      return;
    }

    const sorted = [...ANNOUNCEMENTS].sort((a, b) => {
      if (!!b.pinned !== !!a.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      return new Date(b.date) - new Date(a.date);
    }).slice(0, 3);

    wrap.innerHTML = sorted.map(a => `
      <article class="announce-card glass reveal">
        <div class="announce-card__top">
          <span class="badge ${a.pinned ? "badge--pinned" : ""}" data-cat="${escapeHTML(a.category || "General")}">
            ${a.pinned ? NCIcons.pin : ""} ${escapeHTML(a.category || "General")}
          </span>
          <time>${formatDate(a.date)}</time>
        </div>
        <h3>${escapeHTML(a.title)}</h3>
        <p>${escapeHTML(a.message)}</p>
      </article>
    `).join("");
  }

  function renderTiles(){
    const wrap = qs("#quickTiles");
    if (!wrap) return;
    const tiles = [
      { href: "students.html", icon: "students", title: "Students", desc: "Meet every member of the class." },
      { href: "timetable.html", icon: "calendar", title: "Timetable", desc: "This week's lessons, live-highlighted." },
      { href: "assignments.html", icon: "book", title: "Assignments", desc: "Track due dates and progress." },
      { href: "gallery.html", icon: "gallery", title: "Gallery", desc: "Photos from our moments together." },
      { href: "announcements.html", icon: "megaphone", title: "Announcements", desc: "Everything you need to know." },
      { href: "events.html", icon: "calendar", title: "Events", desc: "What's coming up next." }
    ];
    wrap.innerHTML = tiles.map(t => `
      <a href="${t.href}" class="tile glass reveal">
        <div class="tile__icon">${NCIcons[t.icon] || ""}</div>
        <h3>${escapeHTML(t.title)}</h3>
        <p>${escapeHTML(t.desc)}</p>
        <span class="tile__arrow">Open ${NCIcons.arrowRight}</span>
      </a>`).join("");
  }

  NCUtils.onReady(() => {
    initClock();
    renderStats();
    renderTiles();
    renderAnnouncementsPreview();
  });
})();
