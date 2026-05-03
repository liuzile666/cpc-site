// Scroll-triggered reveal (staggered within each section)
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger siblings within the same parent by small delay
          const el = entry.target;
          const siblings = Array.from(el.parentElement.querySelectorAll(".reveal"));
          const localIdx = siblings.indexOf(el);
          el.style.transitionDelay = (localIdx * 70) + "ms";
          el.classList.add("in-view");
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

// Nav background toggle on scroll
(function () {
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (window.scrollY > 20) {
      nav.style.background = "rgba(255, 255, 255, 0.85)";
    } else {
      nav.style.background = "rgba(255, 255, 255, 0.72)";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// Subtle parallax on hero background text
(function () {
  const bg = document.querySelector(".hero-bg-text");
  if (!bg) return;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      bg.style.transform = `translate(-50%, calc(-50% + ${y * 0.25}px))`;
    }
  }, { passive: true });
})();
