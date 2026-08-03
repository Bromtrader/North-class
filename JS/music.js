/**
 * NORTH CLASS — background music controller.
 * Never autoplays with sound (browsers block it anyway). If no audio
 * file has been added yet, the button disables itself instead of
 * throwing errors — see README.md → "Music" for how to add a track.
 */
(function(){
  const { qs } = NCUtils;

  NCUtils.onReady(() => {
    const btn = qs("#musicToggle");
    const audio = qs("#bgMusic");
    if (!btn || !audio) return;
    if (typeof CONFIG !== "undefined" && CONFIG.music?.enabled === false) return;

    const volume = (typeof CONFIG !== "undefined" && CONFIG.music?.defaultVolume) ?? 0.35;
    audio.volume = volume;

    let ready = true;
    audio.addEventListener("error", () => {
      ready = false;
      btn.disabled = true;
      btn.style.opacity = "0.4";
      btn.title = "Add a track to assets/audio/ to enable music";
    });

    btn.addEventListener("click", () => {
      if (!ready) return;
      if (audio.paused){
        audio.play().then(() => btn.setAttribute("data-active", "true"))
                     .catch(() => { /* playback blocked — user can try again */ });
      } else {
        audio.pause();
        btn.setAttribute("data-active", "false");
      }
    });

    audio.addEventListener("pause", () => btn.setAttribute("data-active", "false"));
    audio.addEventListener("play", () => btn.setAttribute("data-active", "true"));
  });
})();
