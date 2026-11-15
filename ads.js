/*
  VIDHUB — PENGATURAN IKLAN
  Alur:
  1. Klik kartu video -> directlink dibuka pada tab baru.
  2. Halaman pemutar video -> popunder dimuat di halaman ini saja.
*/
window.VIDHUB_DIRECTLINK = "https://uplcm.com/4/11962718";

(function loadPopunderOnPlayerPage() {
  const isPlayerPage = /(?:^|\/)video\.html$/i.test(window.location.pathname);
  if (!isPlayerPage) return;
  if (document.querySelector('script[data-vidhub-popunder="1"]')) return;

  const script = document.createElement("script");
  script.src = "https://al5sm.com/tag.min.js";
  script.async = true;
  script.dataset.zone = "11962701";
  script.dataset.vidhubPopunder = "1";
  (document.body || document.head).appendChild(script);
})();
