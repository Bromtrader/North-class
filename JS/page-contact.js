/**
 * NORTH CLASS — Contact page.
 * Renders teacher cards + map from data/config.js, and wires up a
 * frontend-only contact form (opens the visitor's email client —
 * there's no backend on GitHub Pages. See README for adding a real
 * form service like Formspree if you want direct submissions).
 */
(function(){
  const { qs, escapeHTML } = NCUtils;

  function renderTeachers(){
    const wrap = qs("#teacherList");
    if (!wrap || typeof CONFIG === "undefined") return;
    const teachers = CONFIG.teachers || [];
    if (!teachers.length){
      wrap.innerHTML = `
        <div class="empty-state glass">
          <div class="empty-state__icon">${NCIcons.students}</div>
          <h3>No teacher contacts added yet</h3>
          <p>Add entries to the "teachers" list in data/config.js.</p>
        </div>`;
      return;
    }
    wrap.innerHTML = teachers.map(t => `
      <div class="teacher-card glass reveal">
        <div class="teacher-card__photo">${NCUtils.avatarHTML(t.photo, t.name)}</div>
        <div>
          <h4>${escapeHTML(t.name || "")}</h4>
          <p>${escapeHTML(t.role || "Teacher")}${t.subject ? " · " + escapeHTML(t.subject) : ""}</p>
          ${t.email ? `<p><a href="mailto:${escapeHTML(t.email)}" style="color:var(--aurora-green)">${escapeHTML(t.email)}</a></p>` : ""}
        </div>
      </div>`).join("");
  }

  function renderMap(){
    const wrap = qs("#mapEmbed");
    if (!wrap || typeof CONFIG === "undefined") return;
    const url = CONFIG.contact?.mapEmbedUrl;
    if (url){
      wrap.innerHTML = `<iframe src="${escapeHTML(url)}" width="100%" height="100%" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="School location map"></iframe>`;
    } else {
      wrap.innerHTML = `
        <div class="map-placeholder">
          ${NCIcons.mapPin}
          <p>Add a Google Maps embed link in data/config.js (contact.mapEmbedUrl) to show your location here.</p>
        </div>`;
    }
  }

  function renderContactDetails(){
    const c = (typeof CONFIG !== "undefined" && CONFIG.contact) || {};
    const emailEl = qs("[data-contact-email]");
    const phoneEl = qs("[data-contact-phone]");
    const addrEl = qs("[data-contact-address]");
    if (emailEl) emailEl.textContent = c.email || "Not set — add one in data/config.js";
    if (phoneEl) phoneEl.textContent = c.phone || "Not set — add one in data/config.js";
    if (addrEl) addrEl.textContent = c.address || "Not set — add one in data/config.js";
  }

  function initForm(){
    const form = qs("#contactForm");
    const status = qs("#formStatus");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = qs("#cf-name").value.trim();
      const email = qs("#cf-email").value.trim();
      const subject = qs("#cf-subject").value.trim() || "Message from NORTH CLASS site";
      const message = qs("#cf-message").value.trim();

      if (!name || !email || !message){
        if (status) status.textContent = "Please fill in your name, email and message.";
        return;
      }

      const to = (typeof CONFIG !== "undefined" && CONFIG.contact?.email) || "bromtrader199@gmail.com";
      const body = `From: ${name} (${email})\n\n${message}`;
      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;
      if (status) status.textContent = "Opening your email app to send this message…";
    });
  }

  NCUtils.onReady(() => {
    renderTeachers();
    renderMap();
    renderContactDetails();
    initForm();
  });
})();
