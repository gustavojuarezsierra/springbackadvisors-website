// Index URL resolved from this script's own location (works in any subfolder).
const SB_SEARCH_INDEX = new URL('blog-search-index.json', document.currentScript.src).href;
const SB_SEARCH_ROOT = new URL('../', document.currentScript.src);
// Blog search — loads a small pre-built JSON index and searches it with
// Fuse.js (fuzzy matching + relevance ranking). No server, no database.
// On the blog index page: filters the existing card grid in place.
// On article pages: renders a dropdown result list under the search box.
(function () {
  const input = document.getElementById('blogSearchInput');
  if (!input) return;

  const resultsBox = document.getElementById('blogSearchResults');
  const grid = document.getElementById('blogGrid');
  let fuse = null;

  // Resolve the index next to this script, so it works at the domain root or in /test/.
  const indexUrl = SB_SEARCH_INDEX;

  fetch(indexUrl)
    .then(r => r.json())
    .then(data => {
      const lang = document.documentElement.lang === 'es' ? 'es' : 'en';
      const posts = data[lang] || data.en;
      fuse = new Fuse(posts, {
        keys: ['title', 'excerpt', 'category'],
        threshold: 0.35,
        ignoreLocation: true,
      });
    })
    .catch(() => { /* fails silently — search box just won't return results */ });

  function toRelativeUrl(rootRelativeUrl) {
    // rootRelativeUrl looks like "/blog/some-slug.html" — convert it to a
    // proper relative link from the current page's actual location, so this
    // still works correctly on a subfolder deployment (e.g. /test/).
    return new URL(rootRelativeUrl.replace(/^\//, ''), SB_SEARCH_ROOT).href;
  }

  function renderDropdown(matches) {
    if (!resultsBox) return;
    if (matches.length === 0) {
      const emptyMsg = document.documentElement.lang === 'es' ? 'No se encontraron artículos.' : 'No articles found.';
      resultsBox.innerHTML = `<div class="blog-search-empty">${emptyMsg}</div>`;
    } else {
      resultsBox.innerHTML = matches.slice(0, 6).map(m => `
        <a class="blog-search-result" href="${toRelativeUrl(m.item.url)}">
          <div class="bsr-cat">${m.item.category}</div>
          <div class="bsr-title">${m.item.title}</div>
        </a>
      `).join('');
    }
    resultsBox.style.display = 'block';
  }

  function filterGrid(matches, query) {
    if (!grid) return;
    const cards = grid.querySelectorAll('.blog-card');
    if (!query) {
      cards.forEach(c => c.style.display = '');
      return;
    }
    const matchUrls = new Set(matches.map(m => m.item.url));
    cards.forEach(card => {
      const href = card.getAttribute('href');
      const normalizedHref = href.replace(/^(\.\.\/)+/, '/').replace(/^\.\//, '/');
      card.style.display = matchUrls.has(normalizedHref) ? '' : 'none';
    });
  }

  input.addEventListener('input', function () {
    const query = input.value.trim();

    if (!fuse) return;

    if (!query) {
      if (resultsBox) { resultsBox.style.display = 'none'; resultsBox.innerHTML = ''; }
      if (grid) filterGrid([], '');
      return;
    }

    const matches = fuse.search(query);

    if (grid) {
      filterGrid(matches, query);
    } else {
      renderDropdown(matches);
    }
  });

  // Close dropdown when clicking outside (article-page mode only)
  document.addEventListener('click', function (e) {
    if (resultsBox && !e.target.closest('.blog-search')) {
      resultsBox.style.display = 'none';
    }
  });
})();
