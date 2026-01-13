// script.js
// Minimal, non-flashy interactions:
// 1) Mobile nav toggle
// 2) Size guide tabs
// 3) Gallery thumb active state (placeholder swap)
// 4) Add-to-cart calm toast (no aggressive UI)

(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    // Close menu when clicking a link (mobile)
    navMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      const target = e.target;
      const isClickInside = navMenu.contains(target) || navToggle.contains(target);
      if (!isClickInside) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Tabs: Size guide
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      panels.forEach(p => {
        p.classList.toggle("is-active", p.dataset.panel === id);
      });
    });
  });

  // Gallery thumb buttons (placeholder only)
  const thumbBtns = document.querySelectorAll(".thumb-btn");
  const galleryPlaceholder = document.querySelector(".gallery-placeholder span");

  thumbBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      thumbBtns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      if (galleryPlaceholder) {
        galleryPlaceholder.textContent = `Product image — ${btn.textContent}`;
      }
    });
  });

  // Add-to-cart calm toast
  const addToCart = document.getElementById("addToCart");
  const sizeSelect = document.getElementById("size");

  const showToast = (message) => {
    // create toast
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    // inline styles to keep it minimal without extra CSS file complexity
    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "22px";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "rgba(255,255,255,0.96)";
    toast.style.border = "1px solid rgba(46,46,46,0.16)";
    toast.style.borderRadius = "999px";
    toast.style.padding = "10px 14px";
    toast.style.font = "500 12px Inter, system-ui, sans-serif";
    toast.style.color = "rgba(46,46,46,0.86)";
    toast.style.boxShadow = "0 10px 24px rgba(46,46,46,0.08)";
    toast.style.zIndex = "9999";

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  };

  if (addToCart) {
    addToCart.addEventListener("click", () => {
      const size = sizeSelect?.value || "";
      if (!size) {
        showToast("Please select a JP size to continue.");
        return;
      }
      showToast(`Added to cart (JP ${size}).`);
    });
  }

  // Snowfall effect when support FAQ details open
  const faq = document.querySelector('.faq');
  if (faq) {
    const detailsList = faq.querySelectorAll('details');

    const makeSnowflake = (container) => {
      const el = document.createElement('span');
      el.className = 'snowflake';
      const left = Math.random() * 100; // percent
      const size = 6 + Math.random() * 10; // px
      const duration = 4 + Math.random() * 6; // seconds
      const dx = -30 + Math.random() * 60; // horizontal drift px

      el.style.left = left + '%';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.animationDuration = duration + 's';
      el.style.setProperty('--dx', dx + 'px');

      container.appendChild(el);

      // remove after animation completes to avoid buildup
      setTimeout(() => {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }, (duration + 0.5) * 1000);
    };

    detailsList.forEach(detail => {
      let snowTimer = null;
      let container = null;

      const startSnow = () => {
        if (!container) {
          container = document.createElement('div');
          container.className = 'snow-container';
          detail.appendChild(container);
        }

        // generate a snowflake every 250-450ms
        if (!snowTimer) {
          snowTimer = setInterval(() => makeSnowflake(container), 300 + Math.random() * 150);
        }
      };

      const stopSnow = () => {
        if (snowTimer) {
          clearInterval(snowTimer);
          snowTimer = null;
        }
        if (container) {
          // gently clear any remaining flakes
          container.querySelectorAll('.snowflake').forEach(el => el.remove());
          container.remove();
          container = null;
        }
      };

      // support modern toggle event if available
      detail.addEventListener('toggle', () => {
        if (detail.open) startSnow(); else stopSnow();
      });

      // in case of prefilling open details on load
      if (detail.open) startSnow();
    });
  }

  // Update product image based on selected color
  document.getElementById("color").addEventListener("change", function (event) {
    const productImage = document.querySelector(".gallery-placeholder img");
    if (event.target.value === "Sand Beige") {
      productImage.src = "pics/sand_beige.jpeg";
      productImage.alt = "Sand Beige product image";
    } else if (event.target.value === "Winter Cream") {
      productImage.src = "pics/winter_white.jpeg";
      productImage.alt = "Winter Cream product image";
    } else if (event.target.value === "Soft Dune") {
      productImage.src = "pics/soft_dune.jpeg";
      productImage.alt = "Soft Dune product image";
    }
  });
})();

// --- Subtle Snow (low-density, calm) ---
(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const canvas = document.getElementById("snow");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  let w, h, dpr;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });

  // Low density: keep this small for calm Japanese aesthetic
  const FLAKE_COUNT = Math.round((w * h) / 90000); // scales gently by screen size
  const flakes = [];

  const rand = (min, max) => Math.random() * (max - min) + min;

  const makeFlake = () => ({
    x: rand(0, w),
    y: rand(-h, 0),
    r: rand(0.8, 2.2),          // small
    vy: rand(0.35, 0.95),       // slow fall
    vx: rand(-0.15, 0.15),      // slight drift
    alpha: rand(0.12, 0.28),    // subtle opacity
  });

  for (let i = 0; i < FLAKE_COUNT; i++) flakes.push(makeFlake());

  let rafId = null;

  const tick = () => {
    ctx.clearRect(0, 0, w, h);

    for (const f of flakes) {
      f.x += f.vx;
      f.y += f.vy;

      // wrap around
      if (f.y > h + 10) {
        f.y = rand(-30, -10);
        f.x = rand(0, w);
      }
      if (f.x < -10) f.x = w + 10;
      if (f.x > w + 10) f.x = -10;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
      ctx.fill();
    }

    rafId = requestAnimationFrame(tick);
  };

  tick();

  // Optional: pause animation when tab is hidden (keeps it lightweight)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!rafId) {
      tick();
    }
  });
})();
