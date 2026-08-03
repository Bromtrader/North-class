/**
 * NORTH CLASS — Gallery page.
 * Renders images from data/gallery.js with category filter chips
 * and a keyboard-friendly lightbox (arrow keys + Escape).
 */
(function(){
  const { qs, qsa, escapeHTML } = NCUtils;

  NCUtils.onReady(() => {
    const grid = qs("#galleryGrid");
    const filterBar = qs("#galleryFilters");
    const lightbox = qs("#lightbox");
    if (!grid || typeof GALLERY === "undefined") return;

    let activeCategory = "All";
    let currentList = GALLERY;
    let currentIndex = 0;

    function itemHTML(item, index){
      return `
        <figure class="gallery-item reveal" data-index="${index}" tabindex="0" role="button"
                aria-label="Open ${escapeHTML(item.caption || "photo")}">
          <img src="${escapeHTML(item.src)}" alt="${escapeHTML(item.alt || item.caption || "")}" loading="lazy">
          <div class="gallery-item__overlay"><span>${escapeHTML(item.caption || item.category || "")}</span></div>
        </figure>`;
    }

    function render(){
      currentList = activeCategory === "All" ? GALLERY : GALLERY.filter(g => g.category === activeCategory);

      if (!currentList.length){
        grid.innerHTML = `
          <div class="empty-state glass" style="grid-column:1/-1">
            <div class="empty-state__icon">${NCIcons.gallery}</div>
            <h3>${GALLERY.length ? "Nothing in this category yet" : "The gallery is empty"}</h3>
            <p>${GALLERY.length ? "Try a different filter." : "Upload photos to assets/images/gallery/ and list them in data/gallery.js."}</p>
          </div>`;
        return;
      }

      grid.innerHTML = currentList.map(itemHTML).join("");
      qsa(".gallery-item", grid).forEach(fig => {
        const open = () => openLightbox(Number(fig.dataset.index));
        fig.addEventListener("click", open);
        fig.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); open(); } });
      });
    }

    if (filterBar){
      const categories = ["All", ...new Set(GALLERY.map(g => g.category).filter(Boolean))];
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

    function openLightbox(index){
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add("is-open");
      qs(".lightbox__close", lightbox)?.focus();
    }
    function updateLightbox(){
      const item = currentList[currentIndex];
      if (!item) return;
      qs("[data-lightbox-img]", lightbox).src = item.src;
      qs("[data-lightbox-img]", lightbox).alt = item.alt || item.caption || "";
      qs("[data-lightbox-caption]", lightbox).textContent = item.caption || "";
    }
    function closeLightbox(){ lightbox.classList.remove("is-open"); }
    function step(dir){
      currentIndex = (currentIndex + dir + currentList.length) % currentList.length;
      updateLightbox();
    }

    lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
    qs(".lightbox__close", lightbox)?.addEventListener("click", closeLightbox);
    qs(".lightbox__nav--prev", lightbox)?.addEventListener("click", () => step(-1));
    qs(".lightbox__nav--next", lightbox)?.addEventListener("click", () => step(1));
    document.addEventListener("keydown", e => {
      if (!lightbox?.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });

    render();
  });
})();
