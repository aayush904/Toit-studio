
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

  var TOKEN_POLL_MS = 200;
  var TOKEN_POLL_TRIES = 15;
  var nativeAllowed = false;
  var sending = false;

  function setBusy(state) {
    var button = root.querySelector('button.promo-popup__button');
    if (!button) return;
    if (state) button.setAttribute('aria-busy', 'true');
    else button.removeAttribute('aria-busy');
  }

  function swapResult(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var fresh = doc.querySelector('.promo-popup__content');
    var current = root.querySelector('.promo-popup__content');
    if (!fresh || !current) return false;
    current.innerHTML = fresh.innerHTML;
    return true;
  }

  function submitNatively(form) {
    nativeAllowed = true;
    if (typeof form.requestSubmit === 'function') form.requestSubmit();
    else form.submit();
  }

  function send(form) {
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'text/html' }
    })
      .then(function (response) {
        return response.text();
      })
      .then(function (html) {
        if (swapResult(html)) {
          sending = false;
          setBusy(false);
          return;
        }
        submitNatively(form);
      })
      .catch(function () {
        submitNatively(form);
      });
  }

  function waitForToken(form, tries) {
    var field = form.querySelector('[name="h-captcha-response"], [name="g-recaptcha-response"]');
    if (field && field.value) {
      send(form);
      return;
    }
    if (tries >= TOKEN_POLL_TRIES) {
      submitNatively(form);
      return;
    }
    window.setTimeout(function () {
      waitForToken(form, tries + 1);
    }, TOKEN_POLL_MS);
  }

  root.addEventListener('submit', function (event) {
    var form = event.target.closest('form');
    if (!form) return;
    if (nativeAllowed) return;

    var captcha = window.Shopify && window.Shopify.captcha;
    if (!captcha || typeof captcha.protect !== 'function') return;

    event.preventDefault();
    if (sending) return;
    sending = true;
    setBusy(true);

    try {
      captcha.protect(form, function () {
        waitForToken(form, 0);
      });
    } catch (e) {
      submitNatively(form);
    }
  });

  if (root.querySelector('[data-promo-popup-result]')) {
    open();
    return;
  }

  if (seen()) return;

  var delay = parseInt(root.dataset.delay, 10);
  if (isNaN(delay)) delay = 5;
  window.setTimeout(open, delay * 1000);
})();
