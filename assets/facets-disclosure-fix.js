/*
 * Desktop filter disclosures toggle explicitly rather than relying on the
 * browser's native <details> behaviour, which was not opening them in Safari.
 *
 * Delegated from the document on purpose: Dawn replaces the facets markup
 * wholesale after every filter change, so listeners bound to the summaries
 * themselves would be lost on the first use.
 *
 * Scoped to `.facets__disclosure`, which is the desktop markup only. The
 * mobile panel uses `.mobile-facets__details` inside a menu-drawer element and
 * is driven by Dawn's own JS -- preventing default there would break its
 * slide-in.
 */
document.addEventListener('click', function (event) {
  const summary = event.target.closest('.facets__disclosure > summary');
  if (!summary) return;

  const details = summary.parentElement;
  if (!details || details.tagName !== 'DETAILS') return;

  // Take over from the native toggle so the behaviour is identical in every
  // browser; without preventDefault the two would fight and cancel out.
  event.preventDefault();
  const willOpen = !details.open;
  details.open = willOpen;
  summary.setAttribute('aria-expanded', String(willOpen));

  // Close any sibling disclosure, matching how the theme behaves elsewhere.
  if (willOpen) {
    const form = details.closest('form') || document;
    form.querySelectorAll('.facets__disclosure[open]').forEach(function (other) {
      if (other === details) return;
      other.open = false;
      const otherSummary = other.querySelector(':scope > summary');
      if (otherSummary) otherSummary.setAttribute('aria-expanded', 'false');
    });
  }
});
