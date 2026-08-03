/**
 * NORTH CLASS — Timetable page.
 * Builds the grid from data/timetable.js and highlights whichever
 * lesson is happening right now, based on the visitor's device clock.
 * Re-checks every 30 seconds so the highlight moves on its own.
 */
(function(){
  const { qs, escapeHTML } = NCUtils;

  function toMinutes(hhmm){
    const [h, m] = (hhmm || "0:0").split(":").map(Number);
    return h * 60 + m;
  }

  NCUtils.onReady(() => {
    const wrap = qs("#timetableWrap");
    if (!wrap || typeof TIMETABLE === "undefined") return;

    const days = TIMETABLE.days || [];
    const periods = TIMETABLE.periods || [];

    if (!periods.length){
      wrap.innerHTML = `
        <div class="empty-state glass">
          <div class="empty-state__icon">${NCIcons.calendar}</div>
          <h3>The timetable hasn't been set up yet</h3>
          <p>Add lessons to data/timetable.js and they'll appear here in a live grid.</p>
        </div>`;
      return;
    }

    const slots = [...new Set(periods.map(p => p.start))].sort((a, b) => toMinutes(a) - toMinutes(b));

    const theadHTML = `<tr><th>Time</th>${days.map(d => `<th data-day="${escapeHTML(d)}">${escapeHTML(d)}</th>`).join("")}</tr>`;

    const tbodyHTML = slots.map(start => {
      const rowPeriods = days.map(day => periods.find(p => p.day === day && p.start === start));
      const end = rowPeriods.find(Boolean)?.end || "";
      return `
        <tr>
          <td class="time-col">${escapeHTML(start)}${end ? "–" + escapeHTML(end) : ""}</td>
          ${rowPeriods.map((p, i) => {
            if (!p) return `<td></td>`;
            return `
              <td>
                <div class="lesson-slot glass" data-day="${escapeHTML(p.day)}" data-start="${escapeHTML(p.start)}" data-end="${escapeHTML(p.end)}">
                  <span class="subject">${escapeHTML(p.subject || "—")}</span>
                  ${p.teacher ? `<span class="meta">${escapeHTML(p.teacher)}</span>` : ""}
                  ${p.room ? `<span class="meta">${escapeHTML(p.room)}</span>` : ""}
                </div>
              </td>`;
          }).join("")}
        </tr>`;
    }).join("");

    wrap.innerHTML = `
      <div class="timetable-scroll">
        <table class="timetable">
          <thead>${theadHTML}</thead>
          <tbody>${tbodyHTML}</tbody>
        </table>
      </div>`;

    function highlightNow(){
      const now = new Date();
      const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
      const nowMin = now.getHours() * 60 + now.getMinutes();

      document.querySelectorAll(".lesson-slot").forEach(el => el.classList.remove("is-now"));
      document.querySelectorAll("th[data-day]").forEach(el => el.style.color = "");

      document.querySelectorAll(`.lesson-slot[data-day="${dayName}"]`).forEach(el => {
        const start = toMinutes(el.dataset.start);
        const end = toMinutes(el.dataset.end);
        if (nowMin >= start && nowMin < end) el.classList.add("is-now");
      });
      const todayTh = document.querySelector(`th[data-day="${dayName}"]`);
      if (todayTh) todayTh.style.color = "var(--aurora-green)";
    }

    highlightNow();
    setInterval(highlightNow, 30000);
  });
})();
