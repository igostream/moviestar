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
    const response = await fetch("./videos.json?v=3", { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    allVideos = await response.json();
    renderVideos();
  } catch (error) {
    grid.innerHTML = '<p class="empty">Daftar video belum dapat dimuat. Pastikan videos.json berada satu folder dengan index.html.</p>';
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
      // Directlink hanya terbuka karena pengunjung mengeklik kartu video.
      if (window.VIDHUB_DIRECTLINK) {
        const adWindow = window.open(window.VIDHUB_DIRECTLINK, "_blank");
        if (adWindow) adWindow.opener = null;
      }

      // Tab VIDHUB menuju halaman pemutar; popunder dimuat di video.html.
      window.location.href = "./video.html?id=" + encodeURIComponent(video.id);
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

loadVideos();
