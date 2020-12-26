import { tampilDataTeamId,getSavedTeamsById,getSavedMatcesDelete } from "./home.js";
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
  let item ;
  $('.tabs').tabs();
  const btnSave = $("#save");
  const btnDelete = $("#delete");
  if (isFromSaved) {
   btnSave.hide();
    // ambil artikel lalu tampilkan
    getSavedTeamsById();
  } else {
    btnDelete.hide();
    item = tampilDataTeamId();
  }
  btnSave.click(()=>{
    console.log("clicked");
    item.then((article)=> {
      saveForLaterTeams(article);
    });
    btnSave.hide();
    btnDelete.show();
  });
  btnDelete.click(()=>{
    console.log("clicked");
    getSavedMatcesDelete("teams");
  })
});
