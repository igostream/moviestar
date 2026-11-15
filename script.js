const PER_PAGE = 12;
let videos = [];
let page = 1;
let category = "Semua";
let query = "";

const grid = document.getElementById("videoGrid");
const pager = document.getElementById("pagination");

async function loadVideos(){
  try{
    const response = await fetch("videos.json");
    if(!response.ok) throw new Error("Gagal membaca videos.json");
    videos = await response.json();
    renderVideos();
  }catch(error){
    grid.innerHTML = '<p class="empty">Daftar video gagal dimuat. Periksa file videos.json.</p>';
    console.error(error);
  }
}

function filteredVideos(){
  return videos.filter(v => {
    const categoryOK = category === "Semua" || v.category === category;
    const queryOK = (v.title || "").toLowerCase().includes(query);
    return categoryOK && queryOK;
  });
}

function renderVideos(){
  const result = filteredVideos();
  const total = Math.ceil(result.length / PER_PAGE);
  if(total && page > total) page = total;
  const visible = result.slice((page-1)*PER_PAGE, page*PER_PAGE);
  grid.replaceChildren();

  if(!visible.length){
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Video tidak ditemukan.";
    grid.appendChild(empty);
  }

  visible.forEach(video => {
    const card = document.createElement("article");
    card.className = "video-card";
    const thumb = document.createElement("div");
    thumb.className = "thumb";

    if(video.thumbnail){
      const img = document.createElement("img");
      img.src = video.thumbnail;
      img.alt = "";
      img.loading = "lazy";
      thumb.appendChild(img);
    }

    const play = document.createElement("span");
    play.className = "play-icon";
    play.textContent = "▶";
    thumb.appendChild(play);

    const info = document.createElement("div");
    info.className = "video-info";
    const title = document.createElement("h3");
    title.textContent = video.title || "Video";
    const cat = document.createElement("p");
    cat.textContent = video.category || "Koleksi";
    info.append(title,cat);
    card.append(thumb,info);
    card.addEventListener("click",()=>{
      if(window.VIDHUB_DIRECTLINK) window.open(window.VIDHUB_DIRECTLINK, "_blank", "noopener");
      location.href="video.html?id="+encodeURIComponent(video.id);
    });
    grid.appendChild(card);
  });

  pager.replaceChildren();
  for(let i=1;i<=total;i++){
    const button=document.createElement("button");
    button.textContent=i;
    if(i===page) button.className="active";
    button.addEventListener("click",()=>{
      page=i;renderVideos();
      document.getElementById("videos").scrollIntoView({behavior:"smooth"});
    });
    pager.appendChild(button);
  }
}

document.getElementById("searchInput").addEventListener("input",e=>{
  query=e.target.value.trim().toLowerCase();page=1;renderVideos();
});

document.querySelectorAll("#categories button").forEach(button=>{
  button.addEventListener("click",()=>{
    document.querySelectorAll("#categories button").forEach(b=>b.classList.remove("active"));
    button.classList.add("active");
    category=button.dataset.category;page=1;renderVideos();
  });
});

loadVideos();
