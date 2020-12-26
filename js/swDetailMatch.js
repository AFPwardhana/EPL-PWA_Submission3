import { tampilDataMatcesId,getSavedMatcesById,getSavedMatcesDelete} from "./home.js";

if ("serviceWorker" in navigator) {
    window.addEventListener("load", ()=> {
      navigator.serviceWorker
        .register("./service-worker.js")
        .then(()=> {
          console.log("Pendaftaran ServiceWorker berhasil");
        })
        .catch(()=> {
          console.log("Pendaftaran ServiceWorker gagal");
        });
    });
  } else {
    console.log("ServiceWorker belum didukung browser ini.");
    
}

$(() => {
  const preload = $(".preloader-background");
  setTimeout(()=>{preload.hide()},1700);
  const urlParams = new URLSearchParams(window.location.search);
  const isFromSaved = urlParams.get("saved");
  const btnSave = $("#save");
  const btnDelete = $("#delete");
  let item ;
  if (isFromSaved) {
    // Hide fab jika dimuat dari indexed db
    // btnSave.style.display = 'none';
    btnSave.hide();
    
    // ambil artikel lalu tampilkan
    getSavedMatcesById();
  } else {
    btnDelete.hide();
    item = tampilDataMatcesId();
  }
  // const item = tampilDataMatcesId();
  $('.tabs').tabs();
  btnSave.click(()=>{
    console.log("clicked");
    item.then((article)=> {
      saveForLaterMathces(article);
    });
    btnSave.hide();
    btnDelete.show();
  });
  btnDelete.click(()=>{
    console.log("clicked");
    getSavedMatcesDelete("matches");
  });
});