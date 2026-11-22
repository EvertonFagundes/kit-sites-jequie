/* ==========================================================================
   site.js — comportamento compartilhado do kit
   O telefone do projeto fica em UM lugar: CONTACT.phone (abaixo).
   Todos os links de WhatsApp, tel: e textos de telefone saem daqui.
   ========================================================================== */
(function () {
  "use strict";

  var CONTACT = {
    phone: "5573988659878",        // somente dígitos, com DDI + DDD
    display: "(73) 98865-9878",
    tel: "+5573988659878"
  };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mobile = window.matchMedia("(max-width: 960px)");
  var doc = document;

  /* ---------- Telefone em todos os pontos ---------- */
  function waLink(message) {
    return "https://wa.me/" + CONTACT.phone + "?text=" + encodeURIComponent(message || "Olá! Vim pelo site.");
  }
  doc.querySelectorAll("[data-wa]").forEach(function (a) {
    a.setAttribute("href", waLink(a.getAttribute("data-wa")));
    a.setAttribute("rel", "noopener");
  });
  doc.querySelectorAll("[data-tel]").forEach(function (a) {
    a.setAttribute("href", "tel:" + CONTACT.tel);
  });
  doc.querySelectorAll("[data-phone-text]").forEach(function (el) {
    el.textContent = CONTACT.display;
  });

  /* ---------- Ano ---------- */
  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Header ao rolar ---------- */
  var header = doc.querySelector("[data-header]");
  if (header) {
    var last = -1;
    var onScroll = function () {
      var y = window.scrollY || doc.documentElement.scrollTop;
      if ((y > 8) !== (last > 8)) header.classList.toggle("is-scrolled", y > 8);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Menu mobile acessível ---------- */
  var toggle = doc.querySelector("[data-nav-toggle]");
  var nav = doc.querySelector("[data-nav]");
  var navOpen = false;

  function firstLink() {
    return nav ? nav.querySelector("a") : null;
  }
  function openNav() {
    if (!nav || !toggle) return;
    navOpen = true;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    var a = firstLink();
    if (a) a.focus();
  }
  function closeNav(restore) {
    if (!nav || !toggle) return;
    navOpen = false;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    if (restore) toggle.focus();
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      navOpen ? closeNav(true) : openNav();
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && mobile.matches) closeNav(false);
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navOpen) {
        e.preventDefault();
        closeNav(true);
      }
      if (e.key === "Tab" && navOpen && mobile.matches) {
        var links = [toggle].concat(Array.prototype.slice.call(nav.querySelectorAll("a")));
        var first = links[0], lastEl = links[links.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && doc.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      }
    });
    doc.addEventListener("click", function (e) {
      if (!navOpen || !mobile.matches) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav(false);
    });
    var onBreak = function () {
      if (!mobile.matches) closeNav(false);
    };
    if (mobile.addEventListener) mobile.addEventListener("change", onBreak);
    else mobile.addListener(onBreak);
  }

  /* ---------- Revelação ao rolar ---------- */
  var reveals = Array.prototype.slice.call(doc.querySelectorAll(".reveal"));
  if (reveals.length) {
    if (!("IntersectionObserver" in window) || reduce.matches) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Formulário -> WhatsApp ---------- */
  function labelFor(el) {
    if (el.getAttribute("data-label")) return el.getAttribute("data-label");
    var id = el.id;
    var lab = id ? doc.querySelector('label[for="' + id + '"]') : null;
    if (!lab && el.closest(".field")) lab = el.closest(".field").querySelector("label");
    return lab ? lab.textContent.replace(/\s*\*\s*$/, "").trim() : "";
  }
  function valueFor(el) {
    if (el.tagName === "SELECT") {
      var opt = el.options[el.selectedIndex];
      return opt && opt.value ? opt.textContent.trim() : "";
    }
    if (el.type === "date" && el.value) {
      var p = el.value.split("-");
      return p[2] + "/" + p[1] + "/" + p[0];
    }
    return el.value.trim();
  }
  function setError(el, msg) {
    var field = el.closest(".field");
    if (!field) return;
    field.classList.toggle("is-invalid", !!msg);
    var slot = field.querySelector(".error");
    if (slot && msg) slot.textContent = msg;
    if (msg) el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
  }

  doc.querySelectorAll("form[data-wa-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var submit = form.querySelector('[type="submit"]');
    var intro = form.getAttribute("data-wa-form") || "Olá! Vim pelo site.";

    form.querySelectorAll("input[type=date]").forEach(function (el) {
      var d = new Date();
      var iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      el.min = iso;
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var honey = form.querySelector('[name="website"]');
      if (honey && honey.value) return;

      var fields = Array.prototype.slice.call(form.querySelectorAll("input, select, textarea"))
        .filter(function (el) {
          return el.name && el.name !== "website" && el.type !== "hidden" && el.type !== "submit";
        });

      var firstBad = null;
      fields.forEach(function (el) {
        if (!el.required) return;
        var v = valueFor(el);
        var bad = !v;
        if (!bad && el.type === "text" && el.value.trim().length < 2) bad = true;
        if (!bad && el.type === "date" && el.min && el.value < el.min) {
          setError(el, "Escolha uma data a partir de hoje.");
          if (!firstBad) firstBad = el;
          return;
        }
        setError(el, bad ? "Preencha este campo." : "");
        if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) {
        firstBad.focus();
        if (status) {
          status.className = "form-status is-visible is-error";
          status.textContent = "Faltou preencher um campo. Confira os destaques em vermelho.";
        }
        return;
      }

      var lines = [intro];
      fields.forEach(function (el) {
        var v = valueFor(el);
        if (!v) return;
        var lab = labelFor(el);
        lines.push((lab ? lab + ": " : "") + v);
      });
      var url = waLink(lines.join("\n"));

      if (status) {
        status.className = "form-status is-visible is-ok";
        status.innerHTML = 'Tudo certo. Se o WhatsApp não abrir, <a href="' + url +
          '" rel="noopener"><strong>toque aqui para enviar</strong></a>.';
      }
      if (submit) submit.disabled = true;
      var win = window.open(url, "_blank", "noopener");
      if (!win) window.location.href = url;
      window.setTimeout(function () { if (submit) submit.disabled = false; }, 1200);
    });
  });

  /* ---------- Filtro de imóveis ---------- */
  var filterRoot = doc.querySelector("[data-filter]");
  if (filterRoot) {
    var controls = Array.prototype.slice.call(filterRoot.querySelectorAll("[data-filter-control]"));
    var cards = Array.prototype.slice.call(doc.querySelectorAll("[data-prop]"));
    var count = doc.querySelector("[data-filter-count]");
    var empty = doc.querySelector("[data-filter-empty]");
    var apply = function () {
      var shown = 0;
      cards.forEach(function (card) {
        var ok = controls.every(function (c) {
          var key = c.getAttribute("data-filter-control");
          var v = c.value;
          return !v || card.getAttribute("data-" + key) === v;
        });
        card.hidden = !ok;
        if (ok) shown++;
      });
      if (count) count.textContent = shown;
      if (empty) empty.hidden = shown !== 0;
    };
    controls.forEach(function (c) { c.addEventListener("change", apply); });
    var reset = doc.querySelector("[data-filter-reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        controls.forEach(function (c) { c.value = ""; });
        apply();
        if (controls[0]) controls[0].focus();
      });
    }
    apply();
  }

  /* ---------- Abas ---------- */
  doc.querySelectorAll("[data-tabs]").forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return doc.getElementById(t.getAttribute("aria-controls")); });
    function select(i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (panels[k]) panels[k].hidden = !on;
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i, false); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") n = 0;
        if (e.key === "End") n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });
    var current = tabs.findIndex(function (t) { return t.getAttribute("aria-selected") === "true"; });
    select(current < 0 ? 0 : current, false);
  });
})();
