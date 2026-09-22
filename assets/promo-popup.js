/*
 * Promo popup. Opens after a delay, once per visitor, and remembers the
 * dismissal in localStorage against a key the merchant can change to show it
 * again. Every storage access is wrapped because localStorage throws in
 * private windows and when site data is blocked -- in that case the popup
 * simply behaves as if it had not been seen.
 */
(function () {
  var root = document.querySelector('[data-promo-popup]');
  if (!root) return;

  var storageKey = root.dataset.storageKey || 'promo-popup';
  var lastFocused = null;

  function seen() {
    try {
      return localStorage.getItem(storageKey) === 'seen';
    } catch (e) {
      return false;
    }
  }

  function remember() {
    try {
      localStorage.setItem(storageKey, 'seen');
    } catch (e) {
      /* no-op */
    }
  }

  function open() {
    if (root.classList.contains('is-open')) return;
    lastFocused = document.activeElement;
    root.hidden = false;
    root.classList.add('is-open');
    var field = root.querySelector('.promo-popup__field');
    if (field) field.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    root.classList.remove('is-open');
    root.hidden = true;
    remember();
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function onKeydown(event) {
    if (event.key === 'Escape') close();
  }

  root.addEventListener('click', function (event) {
    // The overlay closes on a click that lands outside the dialog itself.
    if (event.target === root) close();
    if (event.target.closest('[data-promo-popup-close]')) close();
  });

  // A submitted form reloads the page, so reopen to show the outcome and do
  // not let the delay or the stored dismissal suppress it.
  if (root.dataset.openOnLoad === 'true') {
    open();
    return;
  }

  if (seen()) return;

  var delay = parseInt(root.dataset.delay, 10);
  if (isNaN(delay)) delay = 5;
  window.setTimeout(open, delay * 1000);
})();
