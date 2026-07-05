(function(){
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- header state ---- */
  const header = document.getElementById("header");
  const toTop  = document.getElementById("toTop");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    toTop.classList.toggle("is-show", y > 600);
  };
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  toTop.addEventListener("click", () => {
    window.scrollTo({top:0, behavior: reduceMotion ? "auto" : "smooth"});
  });

  /* ---- mobile menu ---- */
  const menuBtn = document.getElementById("menuBtn");
  const mMenu   = document.getElementById("mMenu");
  const setMenu = (open) => {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    mMenu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  menuBtn.addEventListener("click", () => {
    setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
  });
  mMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if(e.key === "Escape") setMenu(false); });

  /* ---- reveal on scroll ---- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.classList.add("is-in");
        revealIO.unobserve(en.target);
      }
    });
  }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
  document.querySelectorAll(".reveal").forEach(el => revealIO.observe(el));

  /* ---- count up ---- */
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if(!en.isIntersecting) return;
      countIO.unobserve(en.target);
      const el = en.target, target = +el.dataset.count;
      if(reduceMotion){ el.textContent = target; return; }
      const t0 = performance.now(), dur = 1400;
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(target * easeOut(p));
        if(p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, {threshold:.6});
  document.querySelectorAll("[data-count]").forEach(el => countIO.observe(el));
})();
