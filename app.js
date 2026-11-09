const root=document.getElementById("reels");let sections=[];
const DIRECTLINK="https://apartmentthumbdigestive.com/exxiy8k45?key=ca148b31d37f592e093f740cd1b84e8a";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function render(items){
 if(!items.length){root.innerHTML='<div class="loading">Belum ada video.</div>';return;}
 root.innerHTML=items.map((v,i)=>`<section class="reel" data-index="${i}">
 ${v.thumbnail?`<img class="poster" src="${esc(v.thumbnail)}" alt="">`:""}
 ${v.video?`<video src="${esc(v.video)}" ${v.thumbnail?`poster="${esc(v.thumbnail)}"`:""} playsinline loop preload="metadata"></video>`:""}
 <div class="shade"></div><button class="sound-toggle">⌁</button><button class="play-overlay">▶</button>
 <div class="reel-content"><div class="account"><div class="avatar">${v.avatar?`<img src="${esc(v.avatar)}" alt="">`:esc((v.creator||"K").charAt(0))}</div><span class="account-name">${esc(v.creator)}</span><button class="follow">Follow</button></div><div class="caption">${esc(v.caption)}</div><div class="audio-label">♫ Audio asli · ${esc(v.creator)}</div></div>
 <div class="side-actions"><button class="like"><span class="symbol">♡</span><small>${esc(v.likes)}</small></button><button class="comment"><span class="symbol">▢</span><small>${esc(v.comments)}</small></button><button class="share"><span class="symbol">➦</span><small>Bagikan</small></button><button class="more"><span class="symbol">•••</span><small>Lainnya</small></button></div><div class="progress"><span></span></div></section>`).join("");
 sections=[...root.querySelectorAll(".reel")];setup();
}
function startPlayback(video,section){
 // Buka directlink pada tab baru sebagai respons langsung dari klik pengguna.
 window.open(DIRECTLINK,"_blank","noopener,noreferrer");
 video.play().catch(()=>section.classList.add("paused"));
}
function setup(){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  const s=entry.target,v=s.querySelector("video");
  if(entry.isIntersecting&&entry.intersectionRatio>.65){sections.forEach(o=>{if(o!==s){const ov=o.querySelector("video");if(ov)ov.pause();}});}
  else if(v)v.pause();
 }),{threshold:[.2,.65,.9]});
 sections.forEach(s=>{
  observer.observe(s);const v=s.querySelector("video");
  if(v){v.muted=true;v.pause();s.classList.add("paused");v.addEventListener("play",()=>s.classList.remove("paused"));v.addEventListener("pause",()=>s.classList.add("paused"));v.addEventListener("timeupdate",()=>{if(v.duration)s.querySelector(".progress span").style.width=(v.currentTime/v.duration*100)+"%";});s.addEventListener("click",e=>{if(e.target.closest("button"))return;if(v.paused)startPlayback(v,s);else v.pause();});}
  else{s.classList.add("paused");s.querySelector(".play-overlay").style.display="none";}
  s.querySelector(".play-overlay").onclick=()=>v&&startPlayback(v,s);
  s.querySelector(".sound-toggle").onclick=()=>{if(v){v.muted=!v.muted;s.querySelector(".sound-toggle").textContent=v.muted?"⌁":"♪";}};
  s.querySelector(".like").onclick=e=>{const x=e.currentTarget.querySelector(".symbol");x.textContent=x.textContent==="♡"?"♥":"♡";};
  s.querySelector(".follow").onclick=e=>e.currentTarget.textContent=e.currentTarget.textContent==="Follow"?"Following":"Follow";
  s.querySelector(".share").onclick=()=>{const url=location.href.split("#")[0]+"#reel-"+s.dataset.index;if(navigator.share)navigator.share({title:"Reels video",url}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(url).then(()=>alert("Link disalin"));else prompt("Salin link:",url);};
  s.querySelector(".comment").onclick=()=>alert("Komentar permanen memerlukan backend/database.");
  s.querySelector(".more").onclick=()=>alert("Menu video");
 });
}
fetch("videos.json").then(r=>{if(!r.ok)throw Error();return r.json();}).then(render).catch(()=>root.innerHTML='<div class="loading">Gagal memuat videos.json.</div>');
