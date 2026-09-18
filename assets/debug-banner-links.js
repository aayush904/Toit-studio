/*
 * TEMPORARY diagnostic. Runs only when ?debug=links is in the URL, so it is
 * invisible during normal browsing. Added to find out what Safari puts on top
 * of the collection banner links; remove once that is answered.
 */
(function () {
  if (!/[?&]debug=links/.test(location.search)) return;

  var errors = [];
  window.addEventListener('error', function (e) {
    errors.push((e.message || 'error') + ' @ ' + (e.filename || '').split('/').pop() + ':' + e.lineno);
  });

  function report() {
    var out = {
      browser: navigator.userAgent.slice(0, 80),
      viewport: innerWidth + 'x' + innerHeight,
      slickInitialised: !!document.querySelector('.slick-initialized'),
      jquery: typeof window.jQuery !== 'undefined',
      links: [],
      jsErrors: errors.length ? errors : 'none'
    };

    var wrap = document.querySelector('.overlay-text');
    if (!wrap) {
      out.links = 'no .overlay-text on this page';
    } else {
      var anchors = [].slice.call(wrap.querySelectorAll('a')).filter(function (a) {
        return a.getBoundingClientRect().width > 0;
      });
      anchors.forEach(function (a) {
        var b = a.getBoundingClientRect();
        var hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        out.links.push({
          text: a.textContent.trim().slice(0, 14),
          onTop: hit ? hit.tagName + '.' + (hit.className || '').toString().slice(0, 40) : 'nothing',
          isTheLink: hit === a || a.contains(hit),
          pointerEvents: getComputedStyle(a).pointerEvents,
          zIndex: getComputedStyle(a).zIndex
        });
      });
    }

    var box = document.createElement('pre');
    box.textContent = JSON.stringify(out, null, 2);
    box.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;max-height:60vh;overflow:auto;z-index:2147483647;' +
      'margin:0;padding:12px;background:#111;color:#0f0;font:11px/1.45 ui-monospace,Menlo,monospace;' +
      'white-space:pre-wrap;border-top:3px solid #0f0';
    document.body.appendChild(box);

    // Report what a real tap actually reaches, not just what is on top.
    document.addEventListener(
      'click',
      function (e) {
        var a = e.target.closest ? e.target.closest('.overlay-text a') : null;
        box.textContent =
          'TAP RESULT\n' +
          JSON.stringify(
            {
              tappedElement: e.target.tagName + '.' + (e.target.className || '').toString().slice(0, 40),
              reachedALink: !!a,
              linkHref: a ? a.getAttribute('href') : null,
              defaultPrevented: e.defaultPrevented
            },
            null,
            2
          ) +
          '\n\n' +
          box.textContent;
      },
      true
    );
  }

  if (document.readyState === 'complete') setTimeout(report, 600);
  else window.addEventListener('load', function () { setTimeout(report, 600); });
})();
