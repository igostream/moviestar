/*
  VIDHUB — PENGATURAN IKLAN
  Alur:
  1. Klik kartu video -> directlink dibuka pada tab baru.
  2. Saat video dibuka -> popunder dimuat (tidak di daftar video).
*/
window.VIDHUB_DIRECTLINK = "https://uplcm.com/4/11962718";

// Popunder hanya dimuat saat pengunjung membuka video (bukan di daftar video).
window.VIDHUB_muatPopunder = function () {
  if (document.querySelector('script[data-vidhub-popunder="1"]')) return;

  const script = document.createElement("script");
  script.src = "https://al5sm.com/tag.min.js";
  script.async = true;
  script.dataset.zone = "11962701";
  script.dataset.vidhubPopunder = "1";
  (document.body || document.head).appendChild(script);
};
