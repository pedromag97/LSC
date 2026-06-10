/* ============================================================
   GRUPO LSC — JavaScript principal
   (sem dependências externas)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- i18n ---------- */
  var LANGS = ["pt", "en", "fr"];
  var lang = localStorage.getItem("lsc-lang");
  if (LANGS.indexOf(lang) === -1) {
    var nav = (navigator.language || "pt").slice(0, 2).toLowerCase();
    lang = LANGS.indexOf(nav) !== -1 ? nav : "pt";
  }

  function t(key) {
    var dict = window.I18N[lang] || window.I18N.pt;
    return dict[key] || window.I18N.pt[key] || key;
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.placeholder = t(el.getAttribute("data-i18n-ph"));
    });
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-lang") === lang);
    });
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".lang-switch button");
    if (!b) return;
    lang = b.getAttribute("data-lang");
    localStorage.setItem("lsc-lang", lang);
    applyLang();
  });

  /* ---------- Header: sombra ao fazer scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* ---------- Hero: crossfade de fundos ---------- */
  var bgs = document.querySelectorAll(".hero-bg");
  if (bgs.length > 1) {
    var cur = 0;
    setInterval(function () {
      bgs[cur].classList.remove("on");
      cur = (cur + 1) % bgs.length;
      bgs[cur].classList.add("on");
    }, 5200);
  }

  /* ---------- Animações de entrada ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- Contadores animados ---------- */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      var el = en.target;
      var target = parseInt(el.getAttribute("data-count"), 10);
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / 1400, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });

  /* ---------- Marquee de clientes: duplicar para loop contínuo ---------- */
  var track = document.querySelector(".marquee-track");
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* ---------- Carrossel de projetos (setas) ---------- */
  document.querySelectorAll(".proj-rail-wrap").forEach(function (wrap) {
    var rail = wrap.querySelector(".proj-rail");
    wrap.querySelectorAll(".rail-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = btn.classList.contains("next") ? 1 : -1;
        rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: "smooth" });
      });
    });
  });

  /* ---------- Filtros de galeria ---------- */
  document.querySelectorAll(".filters").forEach(function (bar) {
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      bar.querySelectorAll("button").forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      var f = btn.getAttribute("data-filter");
      document.querySelectorAll(".gallery .g-item").forEach(function (item) {
        item.classList.toggle("hide", f !== "*" && item.getAttribute("data-cat") !== f);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.querySelector(".lb");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var lbCap = lb.querySelector(".lb-cap");
    var items = [];
    var idx = 0;

    function visibleItems() {
      return Array.prototype.filter.call(
        document.querySelectorAll(".gallery .g-item[data-full]"),
        function (el) { return !el.classList.contains("hide"); }
      );
    }
    function show(i) {
      items = visibleItems();
      if (!items.length) return;
      idx = (i + items.length) % items.length;
      var el = items[idx];
      lbImg.src = el.getAttribute("data-full");
      var capEl = el.querySelector(".cap");
      lbCap.textContent = capEl ? capEl.textContent : "";
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("open");
      lbImg.src = "";
      document.body.style.overflow = "";
    }

    document.addEventListener("click", function (e) {
      var g = e.target.closest(".g-item[data-full]");
      if (g) {
        show(visibleItems().indexOf(g));
        return;
      }
      if (e.target.closest(".lb-close") || e.target === lb) close();
      if (e.target.closest(".lb-prev")) show(idx - 1);
      if (e.target.closest(".lb-next")) show(idx + 1);
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- Formulário de contacto (Formspree) ---------- */
  var form = document.querySelector(".contact-form form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (r) {
        if (r.ok) {
          form.reset();
          status.textContent = t("form.ok");
          status.style.color = "#15803d";
        } else {
          status.textContent = t("form.err");
          status.style.color = "#b91c1c";
        }
      }).catch(function () {
        status.textContent = t("form.err");
        status.style.color = "#b91c1c";
      }).finally(function () {
        btn.disabled = false;
      });
    });
  }

  /* ---------- Arranque ---------- */
  applyLang();
})();
