/**
 * NORTH CLASS — motion layer.
 * Lenis (smooth scroll) + GSAP (hero reveal, count-up) with a safe
 * fallback to plain CSS/IntersectionObserver if the CDN libraries
 * don't load (e.g. no internet while testing locally).
 */
(function(){
  const { qs, qsa } = NCUtils;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Lenis smooth scroll ---------------- */
  function initLenis(){
    if (reduceMotion || typeof Lenis === "undefined") return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    document.documentElement.classList.add("has-lenis");
    function raf(time){
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (typeof gsap !== "undefined" && gsap.ticker){
      gsap.ticker.add((time) => lenis.raf(time * 1000));
    }
    window.__ncLenis = lenis;
  }

  /* ---------------- Hero title letter reveal ---------------- */
  function initHeroTitle(){
    const el = qs("[data-split-title]");
    if (!el) return;
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split("").map(ch =>
      `<span class="char" aria-hidden="true">${ch === " " ? "&nbsp;" : NCUtils.escapeHTML(ch)}</span>`
    ).join("");

    const chars = qsa(".char", el);
    if (reduceMotion){
      chars.forEach(c => c.style.opacity = 1);
      return;
    }
    if (typeof gsap !== "undefined"){
      gsap.set(chars, { opacity: 0, y: 28 });
      gsap.to(chars, { opacity: 1, y: 0, duration: 0.9, stagger: 0.035, ease: "power3.out", delay: 0.2 });
    } else {
      chars.forEach((c, i) => {
        c.style.transition = `opacity .6s ease ${i * 30}ms, transform .6s ease ${i * 30}ms`;
        c.style.opacity = 0; c.style.transform = "translateY(20px)";
        requestAnimationFrame(() => requestAnimationFrame(() => { c.style.opacity = 1; c.style.transform = "translateY(0)"; }));
      });
    }
  }

  /* ---------------- Scroll reveal ----------------
     Uses watchFor() rather than a one-time qsa() scan because most .reveal
     elements (cards, tiles, timeline items) are injected by page-specific
     scripts that run AFTER this file — a plain scan here would miss them. */
  function initReveal(){
    if (reduceMotion){
      NCUtils.watchFor(".reveal", el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const delay = entry.target.dataset.delay || 0;
          entry.target.style.animationDelay = `${delay}ms`;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    NCUtils.watchFor(".reveal", el => io.observe(el));
  }

  /* ---------------- Count-up stats ---------------- */
  function initCounters(){
    const animate = (el) => {
      const target = Number(el.dataset.countTo) || 0;
      if (reduceMotion || typeof gsap === "undefined"){
        el.textContent = target;
        return;
      }
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => el.textContent = Math.round(obj.val)
      });
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    NCUtils.watchFor("[data-count-to]", el => io.observe(el));
  }

  NCUtils.onReady(() => {
    initLenis();
    initHeroTitle();
    initReveal();
    initCounters();
  });
})();
