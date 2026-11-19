const PER_PAGE = 12;
let allVideos = [];
let currentPage = 1;
let currentCategory = "Semua";
let searchTerm = "";

const grid = document.getElementById("videoGrid");
const pagination = document.getElementById("pagination");
const resultCount = document.getElementById("resultCount");

async function loadVideos() {
  try {
    const response = await fetch("https://shiny-resonance-3716.dikinourmanwahyudi03.workers.dev/api/videos", { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    allVideos = await response.json();
    renderVideos();
    bukaDariAlamat();
  } catch (error) {
    grid.innerHTML = '<p class="empty">Daftar video belum dapat dimuat. Coba muat ulang halaman.</p>';
    resultCount.textContent = "Gagal memuat";
    console.error("VIDHUB:", error);
  }
}

function getFilteredVideos() {
  return allVideos.filter(video => {
    const categoryMatch = currentCategory === "Semua" || video.category === currentCategory;
    const textMatch = (video.title || "").toLowerCase().includes(searchTerm);
    return categoryMatch && textMatch;
  });
}

function renderVideos() {
  const filtered = getFilteredVideos();
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  if (totalPages && currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PER_PAGE;
  const pageVideos = filtered.slice(start, start + PER_PAGE);

  resultCount.textContent = filtered.length + " VIDEO";
  grid.replaceChildren();

  if (!pageVideos.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Video tidak ditemukan. Coba kata kunci lain.";
    grid.appendChild(empty);
  }

  pageVideos.forEach(video => {
    const card = document.createElement("article");
    card.className = "video-card";
    const thumb = document.createElement("div");
    thumb.className = "thumb";

    // Tampilkan cuplikan frame asli dari file video sebagai thumbnail.
    // Video hanya dimuat untuk preview; tidak diputar otomatis dengan suara.
    if (video.thumbnail) {
      const img = document.createElement("img");
      img.src = video.thumbnail;
      img.alt = "";
      img.loading = "lazy";
      img.onerror = () => img.remove();
      thumb.appendChild(img);
    } else if (video.url) {
      const preview = document.createElement("video");
      preview.className = "thumb-video";
      preview.src = video.url;
      preview.muted = true;
      preview.playsInline = true;
      preview.preload = "metadata";
      preview.setAttribute("aria-hidden", "true");
      preview.addEventListener("loadedmetadata", () => {
        try { preview.currentTime = Math.min(0.15, preview.duration || 0.15); }
        catch (_) {}
      }, { once: true });
      preview.addEventListener("error", () => {
        preview.remove();
        thumb.classList.add("thumb-fallback");
      }, { once: true });
      thumb.appendChild(preview);
    }

    const mark = document.createElement("span");
    mark.className = "thumb-mark";
    mark.textContent = "VIDHUB";
    const play = document.createElement("span");
    play.className = "play-circle";
    play.textContent = "▶";
    thumb.append(mark, play);

    const info = document.createElement("div");
    info.className = "video-info";
    const title = document.createElement("h3");
    title.textContent = video.title || "Video VIDHUB";
    const category = document.createElement("p");
    category.textContent = video.category || "Koleksi";
    info.append(title, category);
    card.append(thumb, info);

    card.addEventListener("click", () => {
      // Pemutar dibuka dulu (supaya tombol kembali HP tetap balik ke daftar video).
      bukaVideo(video.id, true);

      // Directlink hanya terbuka karena pengunjung mengeklik kartu video.
      if (window.VIDHUB_DIRECTLINK) {
        const adWindow = window.open(window.VIDHUB_DIRECTLINK, "_blank");
        if (adWindow) adWindow.opener = null;
      }
    });
    grid.appendChild(card);
  });

  pagination.replaceChildren();
  for (let number = 1; number <= totalPages; number++) {
    const button = document.createElement("button");
    button.textContent = number;
    if (number === currentPage) button.className = "active";
    button.setAttribute("aria-label", "Halaman " + number);
    button.addEventListener("click", () => {
      currentPage = number;
      renderVideos();
      document.getElementById("koleksi").scrollIntoView({ behavior: "smooth" });
    });
    pagination.appendChild(button);
  }
}

document.getElementById("searchInput").addEventListener("input", event => {
  searchTerm = event.target.value.trim().toLowerCase();
  currentPage = 1;
  renderVideos();
});

document.querySelectorAll("#categories [data-category]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#categories [data-category]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    currentCategory = button.dataset.category;
    currentPage = 1;
    renderVideos();
  });
});

/* ---------- PEMUTAR VIDEO (dulu video.html) ---------- */
const halamanDaftar = document.getElementById("halamanDaftar");
const halamanVideo = document.getElementById("halamanVideo");
const judulVideo = document.getElementById("videoTitle");
const pemutar = document.getElementById("mainVideo");
const judulAsli = document.title;

function bukaVideo(id, catatRiwayat) {
  const video = allVideos.find(item => String(item.id) === String(id));
  if (catatRiwayat) history.pushState({ video: String(id) }, "", "?id=" + encodeURIComponent(id));
  halamanDaftar.hidden = true;
  halamanVideo.hidden = false;
  window.scrollTo(0, 0);
  if (!video) {
    judulVideo.textContent = "Video tidak dapat ditemukan";
    pemutar.removeAttribute("src");
    return;
  }
  judulVideo.textContent = video.title || "Video VIDHUB";
  pemutar.autoplay = false;
  pemutar.src = video.url;
  pemutar.load(); // Tidak memanggil play(): autoplay tetap nonaktif.
  document.title = (video.title || "Video") + " — VIDHUB";
  if (window.VIDHUB_muatPopunder) window.VIDHUB_muatPopunder();
}

function tutupVideo() {
  pemutar.pause();
  pemutar.removeAttribute("src");
  pemutar.load();
  halamanVideo.hidden = true;
  halamanDaftar.hidden = false;
  document.title = judulAsli;
  document.getElementById("koleksi").scrollIntoView();
}

function bukaDariAlamat() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (id) bukaVideo(id, false); else if (!halamanVideo.hidden) tutupVideo();
}

/* tombol kembali HP & tombol "Kembali ke koleksi" = balik ke daftar video */
window.addEventListener("popstate", bukaDariAlamat);
document.getElementById("btnKembali").addEventListener("click", event => {
  event.preventDefault();
  if (history.state && history.state.video) history.back();
  else { history.replaceState(null, "", window.location.pathname); tutupVideo(); }
});

/* menu Koleksi / Komunitas / Gabung saat video terbuka: balik ke daftar dulu */
document.querySelectorAll('.header a[href^="#"]').forEach(link => {
  link.addEventListener("click", () => {
    if (halamanVideo.hidden) return;
    history.replaceState(null, "", window.location.pathname + link.getAttribute("href"));
    tutupVideo();
  });
});

loadVideos();
