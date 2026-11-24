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
    document.querySelectorAll("[data-i18n-content]").forEach(function (el) {
      el.setAttribute("content", t(el.getAttribute("data-i18n-content")));
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

  /* ---------- Reduzir fotografias antes do envio (máx. 1600 px, JPEG) ---------- */
  function shrinkImage(file) {
    return new Promise(function (resolve) {
      if (!/^image\//.test(file.type) || !window.createImageBitmap) return resolve(file);
      createImageBitmap(file).then(function (bmp) {
        var s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
        var c = document.createElement("canvas");
        c.width = Math.round(bmp.width * s);
        c.height = Math.round(bmp.height * s);
        c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
        c.toBlob(function (b) {
          resolve(b ? new File([b], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file);
        }, "image/jpeg", 0.8);
      }).catch(function () { resolve(file); });
    });
  }

  /* ---------- Formulários (contacto: Formspree · orçamento: Netlify Forms) ---------- */
  var form = document.querySelector(".contact-form form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      status.textContent = "";

      function post(url, data) {
        return fetch(url, { method: "POST", body: data, headers: { Accept: "application/json" } });
      }

      var okKey = form.getAttribute("data-ok") || "form.ok";
      var photosDropped = false;
      var sending;
      if (form.hasAttribute("data-fallback")) {
        /* Netlify Forms (com fotografias reduzidas); se falhar, Formspree sem anexos */
        var fileInputs = Array.prototype.slice.call(form.querySelectorAll("input[type=file]"));
        var picked = fileInputs.filter(function (i) { return i.files.length; });
        sending = Promise.all(picked.map(function (i) { return shrinkImage(i.files[0]); }))
          .then(function (small) {
            var data = new FormData(form);
            picked.forEach(function (i, n) { data.set(i.name, small[n], small[n].name); });
            /* Email mais limpo: sem campos técnicos nem campos vazios, assunto com nome e localidade */
            data.delete("_subject");
            data.delete("_gotcha");
            Array.from(data.entries()).forEach(function (e) {
              var empty = e[1] === "" || (e[1] instanceof File && !e[1].size);
              if (empty && e[0] !== "form-name" && e[0] !== "bot-field") data.delete(e[0]);
            });
            var who = data.get("Nome") || data.get("name") || "";
            var where = data.get("Localidade") || data.get("assunto") || "";
            data.set("subject", (form.getAttribute("data-subject") || "Formulário") + " — " + who + (where ? " (" + where + ")" : ""));
            return post(location.pathname, data);
          })
          .catch(function () { return { ok: false }; })
          .then(function (r) {
            if (r.ok) return r;
            var data = new FormData(form);
            fileInputs.forEach(function (i) { data.delete(i.name); });
            data.delete("form-name");
            data.delete("bot-field");
            data.delete("subject");
            if (picked.length) {
              data.append("Fotografias", picked.length + " selecionada(s), não anexadas — pedir ao cliente");
              okKey = form.getAttribute("data-ok-nofiles") || okKey;
              photosDropped = true;
            }
            return post(form.getAttribute("data-fallback"), data);
          });
      } else {
        sending = post(form.action, new FormData(form));
      }

      sending.then(function (r) {
        if (r.ok) {
          form.reset();
          /* Página de obrigado: confirma ao visitante e serve de conversão para Google/Meta Ads */
          window.location.href = "/obrigado.html" + (photosDropped ? "?fotos=0" : "");
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

  /* ---------- Origem do visitante (utm_source / utm_medium / utm_campaign) ---------- */
  try {
    var qs = new URLSearchParams(location.search);
    if (qs.get("utm_source")) {
      sessionStorage.setItem("lsc-origem", ["utm_source", "utm_medium", "utm_campaign"]
        .map(function (k) { return qs.get(k); }).filter(Boolean).join(" / "));
    }
    var origem = sessionStorage.getItem("lsc-origem");
    if (origem) {
      document.querySelectorAll('input[name="Origem"]').forEach(function (i) { i.value = origem; });
    }
  } catch (e) { /* sem sessionStorage: segue sem origem */ }

  /* ---------- Anúncios: consentimento + Google tag / Meta Pixel ----------
     Preencher os IDs quando as contas de anúncios estiverem criadas:
     - googleTag: ID "AW-..." do Google Ads (ou "G-..." do GA4)
     - googleConvLabel: etiqueta de conversão do Google Ads (ex.: "AbCdEfGh")
     - metaPixel: ID numérico do Meta Pixel
     O banner de consentimento só aparece quando houver pelo menos um ID. */
  var ADS = {
    googleTag: "",
    googleConvLabel: "",
    metaPixel: "1153682660781933"
  };

  function loadAds() {
    if (ADS.googleTag) {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + ADS.googleTag;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      gtag("js", new Date());
      gtag("consent", "default", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" });
      gtag("config", ADS.googleTag);
    }
    if (ADS.metaPixel) {
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      fbq("init", ADS.metaPixel);
      fbq("track", "PageView");
    }
    /* Conversão na página de obrigado */
    if (location.pathname.indexOf("obrigado") !== -1) {
      if (window.fbq) fbq("track", "Lead");
      if (window.gtag && ADS.googleConvLabel) gtag("event", "conversion", { send_to: ADS.googleTag + "/" + ADS.googleConvLabel });
    }
  }

  (function consentInit() {
    if (!ADS.googleTag && !ADS.metaPixel) return;
    var choice = null;
    try { choice = localStorage.getItem("lsc-consent"); } catch (e) {}
    if (choice === "yes") { loadAds(); return; }
    if (choice === "no") return;
    var box = document.createElement("div");
    box.className = "consent";
    box.innerHTML = '<span data-i18n-html="consent.msg"></span>' +
      '<div class="consent-actions"><button class="yes" data-i18n="consent.yes">Aceitar</button>' +
      '<button class="no" data-i18n="consent.no">Rejeitar</button></div>';
    document.body.appendChild(box);
    box.querySelector(".yes").addEventListener("click", function () {
      try { localStorage.setItem("lsc-consent", "yes"); } catch (e) {}
      box.remove(); loadAds();
    });
    box.querySelector(".no").addEventListener("click", function () {
      try { localStorage.setItem("lsc-consent", "no"); } catch (e) {}
      box.remove();
    });
  })();

  /* ---------- Arranque ---------- */
  applyLang();
})();
