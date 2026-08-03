/**
 * NORTH CLASS — Events page.
 * Renders data/events.js into upcoming (with a live countdown) and
 * past sections. Countdown ticks every second; no page reload needed.
 */
(function(){
  const { qs, escapeHTML, formatDate, formatTime } = NCUtils;

  function countdownParts(target){
    const diff = Math.max(0, target - Date.now());
    const s = Math.floor(diff / 1000);
    return {
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60
    };
  }

  function cardHTML(e, isPast){
    return `
      <article class="event-card glass reveal ${isPast ? "event-card--past" : ""}">
        <span class="badge" data-cat="${escapeHTML(e.category || "General")}">${escapeHTML(e.category || "General")}</span>
        <h3>${escapeHTML(e.title)}</h3>
        ${e.description ? `<p style="color:var(--ink-muted);font-size:var(--fs-sm)">${escapeHTML(e.description)}</p>` : ""}
        <div class="event-card__meta">
          <span>${NCIcons.calendar}${formatDate(e.date)}</span>
          <span>${NCIcons.clock}${formatTime(e.date)}</span>
          ${e.location ? `<span>${NCIcons.mapPin}${escapeHTML(e.location)}</span>` : ""}
        </div>
        ${!isPast ? `
          <div class="countdown" data-countdown="${e.date}">
            <div class="countdown__unit"><strong data-u="d">0</strong><span>Days</span></div>
            <div class="countdown__unit"><strong data-u="h">0</strong><span>Hrs</span></div>
            <div class="countdown__unit"><strong data-u="m">0</strong><span>Min</span></div>
            <div class="countdown__unit"><strong data-u="s">0</strong><span>Sec</span></div>
          </div>` : ""}
      </article>`;
  }

  NCUtils.onReady(() => {
    const upcomingWrap = qs("#eventsUpcoming");
    const pastWrap = qs("#eventsPast");
    const pastSection = qs("#pastEventsSection");
    if (!upcomingWrap || typeof EVENTS === "undefined") return;

    const now = Date.now();
    const sorted = [...EVENTS].sort((a, b) => new Date(a.date) - new Date(b.date));
    const upcoming = sorted.filter(e => new Date(e.date).getTime() >= now);
    const past = sorted.filter(e => new Date(e.date).getTime() < now).reverse();

    if (!upcoming.length){
      upcomingWrap.innerHTML = `
        <div class="empty-state glass" style="grid-column:1/-1">
          <div class="empty-state__icon">${NCIcons.calendar}</div>
          <h3>${EVENTS.length ? "No upcoming events right now" : "No events yet"}</h3>
          <p>${EVENTS.length ? "Check back soon, or see past events below." : "Add dates to data/events.js and they'll show up here with a live countdown."}</p>
        </div>`;
    } else {
      upcomingWrap.innerHTML = upcoming.map(e => cardHTML(e, false)).join("");
    }

    if (past.length && pastWrap && pastSection){
      pastSection.style.display = "";
      pastWrap.innerHTML = past.map(e => cardHTML(e, true)).join("");
    }

    function tickCountdowns(){
      document.querySelectorAll("[data-countdown]").forEach(el => {
        const target = new Date(el.dataset.countdown).getTime();
        const p = countdownParts(target);
        el.querySelector('[data-u="d"]').textContent = p.d;
        el.querySelector('[data-u="h"]').textContent = String(p.h).padStart(2, "0");
        el.querySelector('[data-u="m"]').textContent = String(p.m).padStart(2, "0");
        el.querySelector('[data-u="s"]').textContent = String(p.s).padStart(2, "0");
      });
    }
    tickCountdowns();
    setInterval(tickCountdowns, 1000);
  });
})();
