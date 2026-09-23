
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

    if (event.target === root) close();
    if (event.target.closest('[data-promo-popup-close]')) close();
  });

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-promo-popup-open]');
    if (!trigger) return;
    event.preventDefault();
    open();
  });

  if (root.dataset.openOnLoad === 'true') {
    open();
    return;
  }

  if (seen()) return;

  var delay = parseInt(root.dataset.delay, 10);
  if (isNaN(delay)) delay = 5;
  window.setTimeout(open, delay * 1000);
})();
