(() => {
  const root = document.documentElement;

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme (matches React version behavior: html has 'light' or 'dark')
  const applyTheme = (theme) => {
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore
    }
  };

  const getSavedTheme = () => {
    try {
      const t = localStorage.getItem("theme");
      return t === "dark" || t === "light" ? t : null;
    } catch {
      return null;
    }
  };

  applyTheme(getSavedTheme() || (root.classList.contains("dark") ? "dark" : "light"));

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const syncLabel = () => {
      const isDark = root.classList.contains("dark");
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    };
    syncLabel();
    themeToggle.addEventListener("click", () => {
      applyTheme(root.classList.contains("dark") ? "light" : "dark");
      syncLabel();
    });
  }

  // Mobile menu
  const menuBtn = document.getElementById("mobileMenuBtn");
  const menu = document.getElementById("mobileMenu");
  if (menuBtn && menu) {
    const setOpen = (open) => {
      menu.hidden = !open;
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    setOpen(false);

    menuBtn.addEventListener("click", () => {
      setOpen(menu.hidden);
    });

    menu.addEventListener("click", (e) => {
      const a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (a) setOpen(false);
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Scroll progress bar
  const bar = document.querySelector(".scroll-progress__bar");
  if (bar) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? doc.scrollTop / max : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  // Counters (animate once when stats enters view)
  const counters = Array.from(document.querySelectorAll(".counter"));
  const animateCounter = (el) => {
    const target = Number(el.getAttribute("data-target") || "0");
    const suffix = el.getAttribute("data-suffix") || "";
    const durationMs = 1600;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(eased * target);
      el.textContent = `${val}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const stats = document.querySelector(".stats");
  if (stats && counters.length) {
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      counters.forEach(animateCounter);
    };

    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              run();
              obs.disconnect();
              break;
            }
          }
        },
        { threshold: 0.35 }
      );
      obs.observe(stats);
    } else {
      run();
    }
  }

  // Hero typing effect (line 1 then line 2)
  const heroLine1El = document.getElementById("heroLine1");
  const heroLine2El = document.getElementById("heroLine2");
  const heroConnectsEl = document.querySelector(".hero__word--connects");
  const heroInspiresEl = document.querySelector(".hero__word--inspires");

  if (heroLine1El && heroLine2El && heroConnectsEl && heroInspiresEl) {
    const typeText = (el, text, speed) =>
      new Promise((resolve) => {
        let i = 0;
        const tick = () => {
          if (i <= text.length) {
            el.textContent = text.slice(0, i);
            i += 1;
            setTimeout(tick, speed);
          } else {
            resolve();
          }
        };
        tick();
      });

    const runHeroTyping = async () => {
      heroLine1El.textContent = "";
      heroConnectsEl.textContent = "";
      heroInspiresEl.textContent = "";

      heroLine1El.classList.add("hero__line--visible");
      await typeText(heroLine1El, "We Create Content that", 80);

      heroLine2El.classList.add("hero__line--visible");
      await typeText(heroConnectsEl, "Connects", 80);
      await typeText(heroInspiresEl, "Inspires", 80);
    };

    runHeroTyping();
  }
})();



const canvas = document.getElementById('dynamicBG');
const ctx = canvas.getContext('2d');
let particles = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? '#F27D26' : '#00F2FF';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', initCanvas);
initCanvas();
for(let i=0; i<50; i++) particles.push(new Particle());
animate();