/**
 * NORTH CLASS — Student Directory page.
 * Renders cards from data/students.js, supports live search, and
 * opens a detail modal on click/Enter.
 */
(function(){
  const { qs, qsa, escapeHTML, avatarHTML, debounce } = NCUtils;

  NCUtils.onReady(() => {
    const grid = qs("#studentsGrid");
    const searchInput = qs("#studentSearch");
    const countLabel = qs("#studentCount");
    const modal = qs("#studentModal");
    if (!grid || typeof STUDENTS === "undefined") return;

    function cardHTML(s){
      return `
        <article class="student-card glass reveal" tabindex="0" role="button"
                 aria-label="View ${escapeHTML(s.name || "student")} details" data-id="${escapeHTML(s.id)}">
          <div class="student-card__photo">${avatarHTML(s.photo, s.name)}</div>
          <h3>${escapeHTML(s.name || "Unnamed student")}</h3>
          ${s.nickname ? `<div class="student-card__nick">"${escapeHTML(s.nickname)}"</div>` : ""}
          <div class="student-card__meta">
            ${s.favoriteSubject ? `<span>${escapeHTML(s.favoriteSubject)}</span>` : ""}
            ${s.futureCareer ? `<span>${escapeHTML(s.futureCareer)}</span>` : ""}
          </div>
          ${s.admissionNumber ? `<div class="student-card__adm">#${escapeHTML(s.admissionNumber)}</div>` : ""}
        </article>`;
    }

    function render(list){
      if (!list.length){
        grid.innerHTML = `
          <div class="empty-state glass" style="grid-column:1/-1">
            <div class="empty-state__icon">${NCIcons.students}</div>
            <h3>${STUDENTS.length ? "No students match your search" : "The directory is empty"}</h3>
            <p>${STUDENTS.length ? "Try a different name or admission number." : "Students added in data/students.js will appear here as animated cards."}</p>
          </div>`;
        return;
      }
      grid.innerHTML = list.map(cardHTML).join("");
      qsa(".student-card", grid).forEach(card => {
        const open = () => openModal(card.dataset.id);
        card.addEventListener("click", open);
        card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " "){ e.preventDefault(); open(); } });
      });
    }

    function openModal(id){
      const s = STUDENTS.find(st => st.id === id);
      if (!s || !modal) return;
      qs("[data-modal-photo]", modal).innerHTML = avatarHTML(s.photo, s.name);
      qs("[data-modal-name]", modal).textContent = s.name || "Unnamed student";
      qs("[data-modal-nick]", modal).textContent = s.nickname ? `"${s.nickname}"` : "";
      qs("[data-modal-adm]", modal).textContent = s.admissionNumber || "—";
      qs("[data-modal-subject]", modal).textContent = s.favoriteSubject || "—";
      qs("[data-modal-career]", modal).textContent = s.futureCareer || "—";
      qs("[data-modal-bio]", modal).textContent = s.bio || "No bio added yet.";
      modal.classList.add("is-open");
      qs(".modal-card__close", modal)?.focus();
    }
    function closeModal(){ modal?.classList.remove("is-open"); }

    modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });
    qs(".modal-card__close", modal)?.addEventListener("click", closeModal);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

    function updateCount(n){
      if (countLabel) countLabel.textContent = `${n} student${n === 1 ? "" : "s"}`;
    }

    render(STUDENTS);
    updateCount(STUDENTS.length);

    searchInput?.addEventListener("input", debounce(() => {
      const q = searchInput.value.trim().toLowerCase();
      const filtered = !q ? STUDENTS : STUDENTS.filter(s =>
        (s.name || "").toLowerCase().includes(q) ||
        (s.nickname || "").toLowerCase().includes(q) ||
        (s.admissionNumber || "").toLowerCase().includes(q) ||
        (s.favoriteSubject || "").toLowerCase().includes(q)
      );
      render(filtered);
      updateCount(filtered.length);
    }, 150));
  });
})();
