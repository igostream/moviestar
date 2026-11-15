/*
  PENGATURAN IKLAN VIDHUB
  Directlink: terbuka hanya setelah pengunjung mengeklik kartu video.
  Popunder: script jaringan iklan dimuat satu kali per halaman.
*/
window.VIDHUB_DIRECTLINK = "https://uplcm.com/4/11962718";

(function loadPopunder() {
  const scriptUrl = "https://al5sm.com/tag.min.js";
  const zoneId = "11962701";
  if (!scriptUrl || !zoneId) return;
  if (document.querySelector('script[data-vidhub-popunder="1"]')) return;

  const script = document.createElement("script");
  script.src = scriptUrl;
  script.async = true;
  script.dataset.zone = zoneId;
  script.dataset.vidhubPopunder = "1";
  (document.body || document.head).appendChild(script);
})();
