/**
 * NORTH CLASS — shared utilities.
 * Loaded before every other script. Plain global functions on `NCUtils`.
 */
const NCUtils = (() => {

  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function debounce(fn, wait = 150){
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  // Escapes user-authored strings before they're inserted as HTML.
  function escapeHTML(str){
    if (str === null || str === undefined) return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function initials(name = ""){
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function formatDate(dateStr, opts = {}){
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", {
      weekday: opts.weekday ?? "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      ...opts
    });
  }

  function formatTime(dateStr){
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  // Renders an <img> if `src` is provided, otherwise a gradient initials avatar.
  function avatarHTML(src, name, alt){
    if (src){
      return `<img src="${escapeHTML(src)}" alt="${escapeHTML(alt || name || "")}" loading="lazy">`;
    }
    return `<span aria-hidden="true">${escapeHTML(initials(name))}</span>`;
  }

  function getAutoCount(source){
    const map = {
      students: typeof STUDENTS !== "undefined" ? STUDENTS.length : 0,
      announcements: typeof ANNOUNCEMENTS !== "undefined" ? ANNOUNCEMENTS.length : 0,
      events: typeof EVENTS !== "undefined" ? EVENTS.length : 0,
      assignments: typeof ASSIGNMENTS !== "undefined" ? ASSIGNMENTS.length : 0
    };
    return map[source] ?? 0;
  }

  function onReady(fn){
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // Runs `callback` for every element matching `selector` that exists right
  // now, AND for any matching element added to the page later. This matters
  // here because page-specific scripts (page-students.js, page-gallery.js,
  // etc.) render their cards *after* the shared animation setup in
  // animations.js has already run its first pass — without this, dynamically
  // rendered cards would never get their scroll-reveal/count-up animation.
  function watchFor(selector, callback){
    qsa(selector).forEach(callback);
    const mo = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.matches?.(selector)) callback(node);
          node.querySelectorAll?.(selector).forEach(callback);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return mo;
  }

  return { qs, qsa, debounce, escapeHTML, initials, formatDate, formatTime, avatarHTML, getAutoCount, onReady, watchFor };
})();
