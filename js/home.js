
const base_url = "https://api.football-data.org/v2/";
let filterMatch ;
const getUrl = id => {
    return fetch(`${base_url}${id}`, {
      headers: {
        "X-Auth-Token": " 4ad0855aedb842f2993c589af5b9c6e1"
      },
      dataType: 'json',
      type: 'GET'
    });
}
  
const status1 = response => {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

const json = response => {
  return response.json();
}

const error = error => {
  console.log("Error : " + error);
}

function dataMatches() {
   return new Promise((resolve)=>{
    getUrl(`competitions/2021/matches`)
    .then(status1).then(json).then(data=>{
        // console.log(data);
        resolve(data);
    }).catch(error);
})
}

function dataTeam(id ="") {
  return new Promise((resolve)=>{
    getUrl(`teams/${id}`)
    .then(status1).then(json).then(data=>{
        resolve(data);
    }).catch(error);
  })
}

function dataStanding(filter = "") {
  return new Promise((resolve)=>{
    getUrl(`competitions/2021/standings${filter}`)
    .then(status1).then(json).then(data=>{
        resolve(data);
    }).catch(error);
})
}

function dataScorers() {
  return new Promise((resolve)=>{
    getUrl(`competitions/2021/scorers`)
    .then(status1).then(json).then(data=>{
        resolve(data);
    }).catch(error);
})
}


function tampilmatch(data) {
  const xMatchesTable = $('#MatchesTable');
  let Match = "";
  data.map(data1=>{
    let {id:idMatch,awayTeam:{name:Away},homeTeam:{name:Home},score:{fullTime:{awayTeam:awayScorer,homeTeam:homeScorer}}} = data1;
    Match += `
    <tr onclick="window.location='./detailMatch.html?id=${idMatch}';" style="cursor: pointer;">
      <td>${Away}</td>
      <td class="right-align">${(awayScorer === null) ? awayScorer = "-" : awayScorer}</td>
      <td class="center-align">VS</td>
      <td>${(homeScorer === null) ? homeScorer = "-" : homeScorer}</td>
      <td style ="width: 41%;"class="right-align">${Home}</td>
    </tr>
    `
  });
  xMatchesTable.html(Match);
}
function tampilDataMatces() {
  if ('caches' in window) {
    caches.match(`${base_url}competitions/2021/matches`).then((response)=> {
      if (response){
        response.json().then((data)=>{
          let selectedCountry = $("#optionsMatch").children("option:selected").val();
          const {matches:matches} = data;
          let [{season:{currentMatchday:currentMatchday}}] =matches;
          let choosenMatch ;
          let filter = matches.filter(matchdata => matchdata.matchday === currentMatchday);
          $("select").change(()=>{
            selectedCountry = $("#optionsMatch").children("option:selected").val();
            switch (selectedCountry) {
              case "C":
                choosenMatch =currentMatchday;
                break;
              case "P":
                choosenMatch =currentMatchday -1;
                break;
              case "N":
                choosenMatch = currentMatchday +1;
                break;
              default:
                break;
            }
            console.log(selectedCountry,choosenMatch);
            filter = matches.filter(matchdata => matchdata.matchday === choosenMatch)
            tampilmatch(filter);
            $("#MatchWeek p").html(`MatchWeek: ${choosenMatch}`);
          });
          tampilmatch(filter);
          $("#MatchWeek p").html(`MatchWeek: ${currentMatchday}`)
        });
      }
    });
  }

  dataMatches().then(data=>{
    let selectedCountry = $("#optionsMatch").children("option:selected").val();
    const {matches:matches} = data;
    let [{season:{currentMatchday:currentMatchday}}] =matches;
    let choosenMatch ;
    let filter = matches.filter(matchdata => matchdata.matchday === currentMatchday);
    $("select").change(()=>{
      selectedCountry = $("#optionsMatch").children("option:selected").val();
      switch (selectedCountry) {
        case "C":
          choosenMatch =currentMatchday;
          break;
        case "P":
          choosenMatch =currentMatchday -1;
          break;
        case "N":
          choosenMatch = currentMatchday +1;
          break;
        default:
          break;
      }
      console.log(selectedCountry,choosenMatch);
      filter = matches.filter(matchdata => matchdata.matchday === choosenMatch)
      tampilmatch(filter);
      $("#MatchWeek p").html(`MatchWeek: ${choosenMatch}`);
    });
    tampilmatch(filter);
    $("#MatchWeek p").html(`MatchWeek: ${currentMatchday}`)
  });
}


function tampilTableStanding(data) {
  const xStandingTable = $('#StandingTable');
  let Standings = "";
  const {standings:[{table:table}]} = data;
  table.map(standing =>{
    const {draw:draw,lost:lost,won:won,position:position,playedGames:played} = standing;
    let {team:{crestUrl:gambar,name:nama}} = standing;
    if (gambar !== null) {            
      gambar = gambar.replace(/^http:\/\//i, 'https://');        
    }
    Standings += `
      <tr>
        <td class="center-align">${position}</td>
        <td ><img class ="logo" src="${gambar}" alt="Club Logo"></td>
        <td >${nama}</td>
        <td class="center-align">${won}</td>
        <td class="center-align">${draw}</td>
        <td class="center-align">${lost}</td>
      </tr>`
  });
  xStandingTable.html(Standings);
}
function TableStanding() {
  const filter ="?standingType=TOTAL";
  if ('caches' in window) {
    caches.match(`${base_url}competitions/2021/standings${filter}`).then((response)=> {
      if (response) {
        response.json().then((data) =>{
        
          tampilTableStanding(data);
        });
      }
    });
  }

  dataStanding(filter).then(data=>{
    tampilTableStanding(data);
  })
}


function tampilTableScorers(scorer) {
  const {scorers:scorers} =scorer;
  const xScorersTable = $('#ScorersTable');
  let Scorers = "";
  scorers.map(data=>{
    const {numberOfGoals:goal,player:{firstName:nama,position:posisi},team:{name:namaClub}} = data;
    Scorers += `
      <tr>
        <td >${nama}</td>
        <td >${posisi}</td>
        <td >${namaClub}</td>
        <td >${goal}</td>
      </tr>`
  })
  xScorersTable.html(Scorers);
}
function tableScorers() {
  if ('caches' in window) {
    caches.match(`${base_url}competitions/2021/scorers`).then((response)=> {
      if (response) {
        response.json().then((scorer) =>{
      
          tampilTableScorers(scorer)
        })
      }
    });
  }

  dataScorers().then(scorer=>{
    tampilTableScorers(scorer);
  })
}


function tampilTeam(data) {
  const {teams:teams} = data;
  const xTeamCards = $('#TeamCards');
  let Teams = "";
  teams.map(dataTeams=>{
    let {id:idTeams,name:namaClub,crestUrl:logoClub} = dataTeams;
    if (logoClub !== null) {            
      logoClub = logoClub.replace(/^http:\/\//i, 'https://');        
    }
    Teams += `
    <div class="col s6 m4 l3">
      <div class="card waves-effect  blue-grey lighten-5 teams hoverable">
        <a href="./detail.html?id=${idTeams}">
          <div class="card-image logoClubs">
            <img src="${logoClub}">
          </div>
          <div class="card-content center-align" style="padding:5px">
            <span class="card-title black-text">${namaClub}</span>
          </div>
        </a>
      </div>
    </div>
    `
  })
  xTeamCards.html(Teams);
}
function tampilDataTeam() {
  if ('caches' in window) {
    caches.match(`${base_url}teams/ `).then((response)=> {
      if (response) {
        response.json().then((data) =>{

          tampilTeam(data);
        })
      }
    });
  }

  dataTeam().then(data=>{
    tampilTeam(data);
  });
}


function tampilDataTeamId() {
  return new Promise((resolve, reject) =>{
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = urlParams.get("id");
  let TeamId;
  let TeamIdSquad = "";
  const xLogo = $('.detailImg img');
  const xNama = $('#Details thead th');
  const xTable = $('#DetailsTable');
  const xTableSquad = $('#SquadTable');
  if ('caches' in window) {
    caches.match(`${base_url}teams/${idParam}`).then((response)=> {
      if (response) {
        response.json().then((data) =>{
       
          let {name:nama,venue:venue,website:website,founded:founded,
            crestUrl:gambar,squad:squad,address:address} =data;
          if (gambar !== null) {            
            gambar = gambar.replace(/^http:\/\//i, 'https://');        
          }
          TeamId =`
          <tr>
            <th>Address</th>
            <td>${address}</td>
          </tr>
          <tr>
            <th>Venue</th>
            <td>${venue}</td>
          </tr>
          <tr>
            <th>Founded</th>
            <td>${founded}</td>
          </tr>         
          <tr>
            <th>WebSite:</th>
            <td><a href="${website}">${website}</a></td>
          </tr> 
          `
          squad.map(dataSquad=>{
            const {name:name,position:position} = dataSquad;
            TeamIdSquad +=`
            <tr>
              <td>${name}</td>
              <td>${position}</td>
            </tr> 
            `
          })
          xLogo.attr("src",`${gambar}`);
          xNama.html(nama);
          xTable.html(TeamId);
          xTableSquad.html(TeamIdSquad);
          resolve(data);
        })
      }
    });
  }

  dataTeam(idParam).then(data=>{
    // console.log(data);
    let {name:nama,venue:venue,website:website,founded:founded,
      crestUrl:gambar,squad:squad,address:address} =data;
    if (gambar !== null) {            
      gambar = gambar.replace(/^http:\/\//i, 'https://');        
    }
    TeamId =`
    <tr>
      <th>Address</th>
      <td>${address}</td>
    </tr>
    <tr>
      <th>Venue</th>
      <td>${venue}</td>
    </tr>
    <tr>
      <th>Founded</th>
      <td>${founded}</td>
    </tr>         
    <tr>
      <th>WebSite:</th>
      <td><a href="${website}">${website}</a></td>
    </tr> 
    `
    squad.map(dataSquad=>{
      const {name:name,position:position} = dataSquad;
      TeamIdSquad +=`
      <tr>
        <td>${name}</td>
        <td>${position}</td>
      </tr> 
      `
    })
    xLogo.attr("src",`${gambar}`);
    xNama.html(nama);
    xTable.html(TeamId);
    xTableSquad.html(TeamIdSquad);
    resolve(data);
  });
 
  });
}


function tampilMatchId(data) {
  const {match:match} =data;
    const {awayTeam:{name:awayName},homeTeam:{name:homeName},group:group,venue:venue,utcDate:date,score:score} =match;
    let {fullTime:{awayTeam:awayScorer,homeTeam:homeScorer},halfTime:{awayTeam:awayScoreHalf,homeTeam:homeScoreHalf},winner:winner} =score;
    let d = new Date(date);
    let dDate = d.toLocaleDateString('pt-PT');
    let dHour = d.getHours();
    let dMinute = d.getMinutes();
    dHour = (`0${dHour}`).slice(-2);
    dMinute = (`0${dMinute}`).slice(-2);
    const xDetail = $('.MatchDeta');
    const xDetailThead = $('.tabledeta thead');
    const xDetailTbody = $('.tabledeta tbody');
    
    const detailHtml =`
    <h3>${group}</h3>
    <h4><i class="material-icons Medium">event</i>  ${dDate} ${dHour}:${dMinute} WIB</h4>
    <h5><i class="material-icons Medium">place</i>  ${venue}</h5>
    `;
    const detailTheadHtml=`
    <tr>
      <th>${awayName}</th>
      <th>VS</th>
      <th>${homeName}</th>
    </tr>
    `;
    const detailTbodyHtml=`
    <tr>
      <td>${(awayScorer === null) ? awayScorer = "-" : awayScorer}</td>
      <td>Fulltime</td>
      <td>${(homeScorer === null) ? homeScorer = "-" : homeScorer}</td>
    </tr>
    <tr>
      <td>${(awayScoreHalf === null) ? awayScoreHalf = "-" : awayScoreHalf}</td>
      <td>Halftime</td>
      <td>${(homeScoreHalf === null) ? homeScoreHalf = "-" : homeScoreHalf}</td>
    </tr>
    `;
    xDetail.html(detailHtml);
    xDetailThead.html(detailTheadHtml);
    xDetailTbody.html(detailTbodyHtml);
}
function tampilDataMatcesId() {
  return new Promise((resolve, reject)=> {
  let urlParams = new URLSearchParams(window.location.search);
  let idParam = urlParams.get("id");
  if ('caches' in window) {
    caches.match(`${base_url}matches/${idParam}`).then((response)=> {
      if (response) {
        response.json().then((data) =>{
          tampilMatchId(data);
          resolve(data);
        })
      }
    });
  }
  getUrl(`matches/${idParam}`)
    .then(status1).then(json).then(data=>{
        // console.log(data);
        tampilMatchId(data);
        resolve(data);
    }).catch(error);
  })
}



function getSavedMatces() {
  getAll("matches").then((articles) =>{
    const xMatchesTableSaved = $('#MatchesTableSaved');
    
    let savedMatch = (articles.length === 0)?"<h1>No Data Yet</h1>": "";
    articles.map(data1=>{
      const {id:idMatch,awayTeam:{name:Away},homeTeam:{name:Home}} = data1;
      // console.log(idMatch);
      savedMatch +=`
        <tr onclick="window.location='./detailMatch.html?id=${idMatch}&saved=true';" style="cursor: pointer;">
          <td>${Away}</td>
          <td class="center-align">VS</td>
          <td class="right-align" style="width: 46%;">${Home}</td>
        </tr>
        `
    })
    xMatchesTableSaved.html(savedMatch);
  });
}

function getSavedMatcesById() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  getById(idParam,"matches").then((article) =>{
    const {awayTeam:{name:awayName},homeTeam:{name:homeName},group:group,venue:venue,utcDate:date,score:score} =article;
    let {fullTime:{awayTeam:awayScore,homeTeam:homeScore},halfTime:{awayTeam:awayScoreHalf,homeTeam:homeScoreHalf},winner:winner} =score;
    let d = new Date(date);
    let dDate = d.toLocaleDateString('pt-PT');
    let dHour = d.getHours();
    let dMinute = d.getMinutes();
    dHour = (`0${dHour}`).slice(-2);
    dMinute = (`0${dMinute}`).slice(-2);
    const xDetail = $('.MatchDeta');
    const xDetailThead = $('.tabledeta thead');
    const xDetailTbody = $('.tabledeta tbody');
    
    const detailHtml =`
    <h3>${group}</h3>
    <h4><i class="material-icons Medium">event</i>  ${dDate} ${dHour}:${dMinute} WIB</h4>
    <h5><i class="material-icons Medium">place</i>  ${venue}</h5>
    `;
    const detailTheadHtml=`
    <tr>
      <th>${awayName}</th>
      <th>VS</th>
      <th>${homeName}</th>
    </tr>
    `;
    const detailTbodyHtml=`
    <tr>
      <td>${(awayScore === null) ? awayScore = "-" : awayScore}</td>
      <td>Fulltime</td>
      <td>${(homeScore === null) ? homeScore = "-" : homeScore}</td>
    </tr>
    <tr>
      <td>${(awayScoreHalf === null) ? awayScoreHalf = "-" : awayScoreHalf}</td>
      <td>Halftime</td>
      <td>${(homeScoreHalf === null) ? homeScoreHalf = "-" : homeScoreHalf}</td>
    </tr>
    `;
    xDetail.html(detailHtml);
    xDetailThead.html(detailTheadHtml);
    xDetailTbody.html(detailTbodyHtml);
  });

}

function getSavedTeams() {
  getAll("teams").then((articles) =>{
    const xTeamCardsSaved = $('#TeamCardsSaved');
    let Teams = (articles.length === 0)?"<h1>No Data Yet</h1>": "";
    articles.map(dataTeams=>{
      const {id:idTeams,name:namaClub,crestUrl:logoClub} = dataTeams;
      Teams += `
      <div class="col s6 m4 l3">
        <div class="card waves-effect  blue-grey lighten-5 teams hoverable">
          <a href="./detail.html?id=${idTeams}&saved=true">
            <div class="card-image logoClubs">
              <img src="${logoClub}">
            </div>
            <div class="card-content center-align" style="padding:5px">
              <span class="card-title black-text">${namaClub}</span>
            </div>
          </a>
        </div>
      </div>
      `
    })
    xTeamCardsSaved.html(Teams);
  });
}

function getSavedTeamsById(){
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  let TeamId;
  let TeamIdSquad = "";
  const xLogo = $('.detailImg img');
  const xNama = $('#Details thead th');
  const xTable = $('#DetailsTable');
  const xTableSquad = $('#SquadTable');
  let Teams = "";
  getById(idParam,"teams").then((teams) =>{
    // console.log(teams);
    const {name:nama,venue:venue,website:website,founded:founded,
      crestUrl:gambar,squad:squad,address:address} =teams;
    TeamId =`
    <tr>
      <th>Address</th>
      <td>${address}</td>
    </tr>
    <tr>
      <th>Venue</th>
      <td>${venue}</td>
    </tr>
    <tr>
      <th>Founded</th>
      <td>${founded}</td>
    </tr>         
    <tr>
      <th>WebSite:</th>
      <td><a href="${website}">${website}</a></td>
    </tr> 
    `
    squad.map(dataSquad=>{
      const {name:name,position:position} = dataSquad;
      TeamIdSquad +=`
      <tr>
        <td>${name}</td>
        <td>${position}</td>
      </tr> 
      `
    })
    xLogo.attr("src",`${gambar}`);
    xNama.html(nama);
    xTable.html(TeamId);
    xTableSquad.html(TeamIdSquad);
  });

}

function getSavedMatcesDelete(whichOne) {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  let message = `Apakah Anda yakin Ingin Menghapus ${whichOne}List ?`;
  let conf = confirm(message);
  if (conf === true){
    deletItem(idParam,whichOne);
    history.go(-1);
  }
}

export {TableStanding,tampilDataMatces,tableScorers,tampilDataTeam
,tampilDataTeamId,tampilDataMatcesId,
getSavedMatces,getSavedMatcesById,getSavedTeams,getSavedTeamsById,
getSavedMatcesDelete};