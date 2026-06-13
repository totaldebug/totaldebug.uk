/* total{debug} — terminal theme behaviour */
(function () {
  'use strict';

  /* ---- colour mode toggle (initial mode set inline in <head>) ---- */
  var modeBtn = document.getElementById('mode-toggle');
  if (modeBtn) {
    modeBtn.addEventListener('click', function () {
      var root = document.documentElement;
      var next = root.getAttribute('data-mode') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-mode', next);
      try { localStorage.setItem('td-mode', next); } catch (e) {}
      // keep the giscus comments iframe in sync
      var gf = document.querySelector('iframe.giscus-frame');
      if (gf) gf.contentWindow.postMessage({ giscus: { setConfig: { theme: next === 'light' ? 'light' : 'dark_dimmed' } } }, 'https://giscus.app');
    });
  }

  /* ---- live GitHub project data ---- */
  var cards = document.querySelectorAll('.pj[data-repo]');
  if (cards.length) {
    cards.forEach(function (card) {
      var slug = card.getAttribute('data-repo'); // owner/repo
      fetch('https://api.github.com/repos/' + slug, { headers: { Accept: 'application/vnd.github+json' } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d) return;
          var desc = card.querySelector('[data-desc]');
          if (desc && d.description) desc.textContent = d.description;
          var stars = card.querySelector('[data-stars]');
          if (stars) stars.textContent = '★ ' + (d.stargazers_count || 0);
          var lang = card.querySelector('[data-lang]');
          if (lang && d.language) { lang.textContent = d.language; lang.style.display = ''; }
          var upd = card.querySelector('[data-updated]');
          if (upd && d.pushed_at) upd.textContent = 'updated ' + new Date(d.pushed_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        })
        .catch(function () {});
    });
  }

  /* ---- reading progress ---- */
  var bar = document.getElementById('progress');
  if (bar) {
    var onScroll = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- build TOC + scrollspy ---- */
  var content = document.getElementById('content');
  var toc = document.getElementById('toc');
  if (content && toc) {
    var heads = content.querySelectorAll('h2, h3');
    if (!heads.length) {
      var wrap = document.getElementById('toc-wrap');
      if (wrap) wrap.style.display = 'none';
    } else {
      var ul = document.createElement('ul');
      heads.forEach(function (h, i) {
        if (!h.id) h.id = 'h-' + i + '-' + (h.textContent || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        var li = document.createElement('li');
        if (h.tagName === 'H3') li.style.marginLeft = '12px';
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        ul.appendChild(li);
      });
      toc.appendChild(ul);

      var links = toc.querySelectorAll('a');
      var spy = function () {
        var pos = window.scrollY + 120, cur = null;
        heads.forEach(function (h) { if (h.offsetTop <= pos) cur = h.id; });
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
        });
      };
      document.addEventListener('scroll', spy, { passive: true });
      spy();
    }
  }

  /* ---- mobile menu ---- */
  var sidebar = document.getElementById('sidebar');
  var menuBtn = document.getElementById('menu-btn');
  var scrim = document.getElementById('scrim');
  var toggle = function (open) {
    if (!sidebar) return;
    sidebar.classList.toggle('open', open);
    if (scrim) scrim.classList.toggle('show', open);
  };
  if (menuBtn) menuBtn.addEventListener('click', function () { toggle(!sidebar.classList.contains('open')); });
  if (scrim) scrim.addEventListener('click', function () { toggle(false); });

  /* ---- search palette (⌘K) ---- */
  var modal = document.getElementById('search-modal');
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var index = null, sel = -1;

  var openSearch = function () {
    if (!modal) return;
    modal.classList.add('open');
    input.value = '';
    render([]);
    input.focus();
    if (!index && window.SEARCH_JSON) {
      fetch(window.SEARCH_JSON).then(function (r) { return r.json(); }).then(function (d) { index = d; });
    }
  };
  var closeSearch = function () { if (modal) modal.classList.remove('open'); };

  var render = function (items) {
    sel = -1;
    if (!results) return;
    if (!items.length) { results.innerHTML = '<div class="empty"># type to search ' + (index ? index.length : '') + ' posts…</div>'; return; }
    results.innerHTML = items.slice(0, 8).map(function (p) {
      var meta = (p.date || '') + (p.tags && p.tags.length ? '  ·  #' + p.tags.slice(0, 3).join(' #') : '');
      return '<a href="' + p.url + '"><div class="rt">&gt; ' + p.title + '</div><div class="rm">' + meta + '</div></a>';
    }).join('');
  };

  var query = function (q) {
    if (!index) return;
    q = q.trim().toLowerCase();
    if (!q) { render([]); return; }
    var hits = index.filter(function (p) {
      return (p.title + ' ' + (p.tags || []).join(' ') + ' ' + (p.categories || []).join(' ') + ' ' + (p.excerpt || '')).toLowerCase().indexOf(q) > -1;
    });
    render(hits);
  };

  if (input) input.addEventListener('input', function () { query(input.value); });
  document.querySelectorAll('[data-search]').forEach(function (b) { b.addEventListener('click', openSearch); });

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); return; }
    if (e.key === 'Escape') closeSearch();
    if (modal && modal.classList.contains('open') && results) {
      var items = results.querySelectorAll('a');
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, items.length - 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); }
      else if (e.key === 'Enter' && items[sel]) { window.location = items[sel].getAttribute('href'); return; }
      else return;
      items.forEach(function (a, i) { a.classList.toggle('sel', i === sel); });
    }
  });
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeSearch(); });

  /* ---- reveal on scroll ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
})();
