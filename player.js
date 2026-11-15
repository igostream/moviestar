async function startPlayer(){
  const params=new URLSearchParams(location.search);
  const id=Number(params.get("id"));
  const title=document.getElementById("videoTitle");
  const player=document.getElementById("mainVideo");

  try{
    const response=await fetch("videos.json");
    if(!response.ok) throw new Error("Tidak dapat memuat daftar video");
    const videos=await response.json();
    const video=videos.find(item=>Number(item.id)===id);
    if(!video) throw new Error("Video tidak ditemukan");

    title.textContent=video.title || "VIDHUB Player";
    player.src=video.url;
    player.load();
    document.title=(video.title || "Video")+" - VIDHUB";
  }catch(error){
    title.textContent="Video tidak ditemukan";
    console.error(error);
  }
}
startPlayer();
