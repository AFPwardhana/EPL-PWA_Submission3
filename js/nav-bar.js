import {TableStanding,tampilDataMatces,tableScorers,
  tampilDataTeam,getSavedMatces,getSavedTeams} from "./home.js";

$(() => {
  // Activate sidebar nav
  const elems =  $(".sidenav");
  M.Sidenav.init(elems);
  loadnav2()   
  let page = window.location.hash.substr(1);
  if (page === "") page = "home";
  LoadPage2(page);
  
  function loadnav2() {
    fetch("nav-bar.html").then(respon=>{
      return respon.text();
    }).then(data=>{
      document.querySelectorAll(".topnav, .sidenav").forEach((elm)=> {
        elm.innerHTML = data;
      });
      // Daftarkan event listener untuk setiap tautan menu
      document.querySelectorAll(".sidenav a, .topnav a").forEach((elm)=> {
        elm.addEventListener("click", (event)=> {
          // Tutup sidenav
          var sidenav = document.querySelector(".sidenav");
          M.Sidenav.getInstance(sidenav).close();
  
          // Muat konten halaman yang dipanggil
          page = event.target.getAttribute("href").substr(1);
          LoadPage2(page);
        });
      });
    }).catch(error=>{
      console.log(error);
    })
  }
     
  function LoadPage2(page) {
    fetch(`pages/${page}.html`).then(status =>{
      if (status.status === 404) {
        return  Promise.resolve("<p>Halaman tidak ditemukan.</p>");
      }else if (status.status === 200) {
        console.log(status.status);
        return  Promise.resolve(status.text());
      }else {
        return Promise.reject(new Error(response.statusText),"<p>Ups.. halaman tidak dapat diakses.</p>") ;
      }
    }).then(data=>{
      // console.log(data);
      const content = $("#body-content");
      content.html(data);
      switch (page) {
        case "home":
          tampilDataMatces();
          $('select').formSelect();
          TableStanding();
          tableScorers();
          tampilDataTeam();
          break;
        case "team":
          getSavedMatces();
          getSavedTeams();
          break
        default:
          break;
      }
      $('.tabs').tabs();
    })
    .catch(error =>{
      console.log(error);
    });
  }
});


