/**
 * NORTH CLASS — core site behaviour.
 * Runs on every page: loader, theme, navigation, scroll progress,
 * back-to-top, cursor glow, particle backdrop, and applying CONFIG
 * (title / logo / favicon / footer / socials) so nothing is hardcoded.
 */
(function(){
  const { qs, qsa } = NCUtils;

  /* ---------------- Apply CONFIG across the page ---------------- */
  function applyConfig(){
    if (typeof CONFIG === "undefined") return;

    // Theme accent colors
    const root = document.documentElement;
    if (CONFIG.theme?.auroraGreen) root.style.setProperty("--aurora-green", CONFIG.theme.auroraGreen);
    if (CONFIG.theme?.auroraViolet) root.style.setProperty("--aurora-violet", CONFIG.theme.auroraViolet);
    if (CONFIG.theme?.auroraMagenta) root.style.setProperty("--aurora-magenta", CONFIG.theme.auroraMagenta);

    // Saved theme > CONFIG default
    const saved = localStorage.getItem("nc-theme");
    root.setAttribute("data-theme", saved || CONFIG.theme?.defaultMode || "dark");

    // Brand text
    qsa("[data-site-title]").forEach(el => el.textContent = CONFIG.site?.shortName || "NORTH CLASS");
    qsa("[data-site-motto]").forEach(el => el.textContent = CONFIG.site?.motto || "");
    qsa("[data-site-tagline]").forEach(el => el.textContent = CONFIG.site?.tagline || "");
    qsa("[data-site-welcome]").forEach(el => el.textContent = CONFIG.site?.welcomeMessage || "");
    qsa("[data-site-year]").forEach(el => el.textContent = CONFIG.site?.foundedYear || new Date().getFullYear());
    qsa("[data-footer-year]").forEach(el => el.textContent = new Date().getFullYear());

    // Logo & favicon
    if (CONFIG.site?.logo){
      qsa("[data-site-logo]").forEach(el => el.src = CONFIG.site.logo);
      const favicon = qs('link[rel="icon"]');
      if (favicon && CONFIG.site.favicon) favicon.href = CONFIG.site.favicon;
    }

    // Document title (keeps whatever page suffix is already there)
    const suffix = document.title.includes("—") ? document.title.split("—").slice(1).join("—").trim() : "";
    if (CONFIG.site?.shortName) document.title = suffix ? `${CONFIG.site.shortName} — ${suffix}` : CONFIG.site.shortName;

    // Footer social icons — only render the ones with a real URL
    const socialWraps = qsa("[data-social-list]");
    if (socialWraps.length){
      const socials = CONFIG.contact?.socials || {};
      const iconMap = { instagram: "instagram", x: "x", facebook: "facebook", whatsapp: "whatsapp", tiktok: "tiktok" };
      const items = Object.entries(socials)
        .filter(([, url]) => url)
        .map(([key, url]) => `<a href="${NCUtils.escapeHTML(url)}" class="icon-btn" target="_blank" rel="noopener" aria-label="${key}">${NCIcons[iconMap[key]] || ""}</a>`)
        .join("");
      socialWraps.forEach(el => el.innerHTML = items || `<p style="color:var(--ink-faint);font-size:var(--fs-xs)">Add your social links in data/config.js</p>`);
    }

    // Music button visibility
    if (CONFIG.music?.enabled === false){
      qsa("#musicToggle").forEach(el => el.style.display = "none");
    }
  }

  /* ---------------- Shared chrome icons ---------------- */
  function wireChrome(){
    const musicBtn = qs("#musicToggle");
    if (musicBtn) musicBtn.innerHTML = `<span class="icon-on">${NCIcons.musicOn}</span><span class="icon-off">${NCIcons.musicOff}</span>`;

    const themeBtn = qs("#themeToggle");
    if (themeBtn) themeBtn.innerHTML = `<span class="icon-on">${NCIcons.moon}</span><span class="icon-off">${NCIcons.sun}</span>`;

    const burger = qs("#navBurger");
    if (burger) burger.innerHTML = NCIcons.menu;

    const backTop = qs("#backToTop");
    if (backTop) backTop.innerHTML = NCIcons.arrowUp;

    qsa("[data-icon]").forEach(el => {
      if (NCIcons[el.dataset.icon]) el.innerHTML = NCIcons[el.dataset.icon];
    });
  }

  /* ---------------- Loader ---------------- */
  function initLoader(){
    const loader = qs("#loader");
    if (!loader) return;
    const hide = () => loader.classList.add("is-hidden");
    window.addEventListener("load", () => setTimeout(hide, 450));
    // Safety net in case 'load' is slow/blocked
    setTimeout(hide, 3500);
  }

  /* ---------------- Theme toggle ---------------- */
  function initTheme(){
    const btn = qs("#themeToggle");
    const root = document.documentElement;
    const sync = () => {
      const isLight = root.getAttribute("data-theme") === "light";
      if (btn){
        btn.setAttribute("data-active", isLight);
        btn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      }
    };
    sync();
    btn?.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("nc-theme", next);
      sync();
    });
  }

  /* ---------------- Mobile nav ---------------- */
  function initMobileNav(){
    const burger = qs("#navBurger");
    const panel = qs("#mobilePanel");
    if (!burger || !panel) return;
    const close = () => { panel.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); };
    burger.addEventListener("click", () => {
      const open = panel.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    qsa("a", panel).forEach(a => a.addEventListener("click", close));
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  /* ---------------- Navbar scroll state + scroll progress + back-to-top ---------------- */
  function initScrollFx(){
    const navbar = qs("#navbar");
    const progress = qs("#scrollProgress");
    const backTop = qs("#backToTop");

    const onScroll = () => {
      const y = window.scrollY;
      navbar?.classList.toggle("is-scrolled", y > 12);
      backTop?.classList.toggle("is-visible", y > 480);
      if (progress){
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        progress.style.width = max > 0 ? `${(y / max) * 100}%` : "0%";
      }
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Cursor glow (desktop only) ---------------- */
  function initCursorGlow(){
    const glow = qs("#cursorGlow");
    if (!glow || matchMedia("(hover: none)").matches) return;
    window.addEventListener("pointermove", e => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      glow.classList.add("is-active");
    }, { passive: true });
    window.addEventListener("pointerleave", () => glow.classList.remove("is-active"));
  }

  /* ---------------- Particle backdrop (aurora dust) ---------------- */
  function initParticles(){
    const canvas = qs("#particlesCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles = [];
    let w, h;

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function makeParticles(){
      const count = Math.min(70, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.25 + 0.05,
        drift: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.15
      }));
    }

    function tick(){
      ctx.clearRect(0, 0, w, h);
      const styles = getComputedStyle(document.documentElement);
      const c = styles.getPropertyValue("--aurora-green").trim() || "#35FFC0";
      particles.forEach(p => {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -5) p.y = h + 5;
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        ctx.beginPath();
        ctx.fillStyle = c;
        ctx.globalAlpha = p.alpha;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (!reduceMotion) requestAnimationFrame(tick);
    }

    resize();
    makeParticles();
    tick();
    window.addEventListener("resize", NCUtils.debounce(() => { resize(); makeParticles(); }, 200));
  }

  NCUtils.onReady(() => {
    applyConfig();
    wireChrome();
    initLoader();
    initTheme();
    initMobileNav();
    initScrollFx();
    initCursorGlow();
    initParticles();
  });
})();
