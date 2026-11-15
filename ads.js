/*
  PENGATURAN IKLAN VIDHUB

  Directlink:
  Saat pengunjung membuka halaman pemutar melalui klik kartu,
  directlink dibuka di tab baru. Pemutaran video tetap manual.

  Popunder:
  Script dimuat satu kali saat halaman dibuka.
  Sesuaikan ketentuan dan kebijakan jaringan iklan Anda.
*/
const DIRECTLINK_URL = "https://uplcm.com/4/11962718";\nwindow.VIDHUB_DIRECTLINK = DIRECTLINK_URL;
const POPUNDER_SCRIPT = "https://al5sm.com/tag.min.js";
const POPUNDER_ZONE = "11962701";

(function(){
  // Muat popunder satu kali per pemuatan halaman.
  if(POPUNDER_SCRIPT && POPUNDER_ZONE){
    const script=document.createElement("script");
    script.src=POPUNDER_SCRIPT;
    script.dataset.zone=POPUNDER_ZONE;
    script.async=true;
    document.body.appendChild(script);
  }
})();
