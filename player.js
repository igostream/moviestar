async function initPlayer() {
  const title = document.getElementById("videoTitle");
  const player = document.getElementById("mainVideo");
  const id = new URLSearchParams(window.location.search).get("id");

  try {
    const response = await fetch("https://shiny-resonance-3716.dikinourmanwahyudi03.workers.dev/api/videos", { cache: "no-store" });
    if (!response.ok) throw new Error("Daftar video tidak tersedia");
    const videos = await response.json();
    const video = videos.find(item => String(item.id) === String(id));
    if (!video) throw new Error("Video tidak ditemukan");

    title.textContent = video.title || "Video VIDHUB";
    player.autoplay = false;
    player.src = video.url;
    player.load(); // Tidak memanggil play(): autoplay tetap nonaktif.
    document.title = (video.title || "Video") + " — VIDHUB";
  } catch (error) {
    title.textContent = "Video tidak dapat ditemukan";
    console.error("VIDHUB player:", error);
  }
}
initPlayer();
