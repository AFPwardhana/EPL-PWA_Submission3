let dbPromised = idb.open("epl", 2, (upgradeDb)=> {
    let matchesObjectStore = upgradeDb.createObjectStore("matches", {
      keyPath: "id"
    });
    let teamsObjectStore = upgradeDb.createObjectStore("teams", {
      keyPath: "id"
    });
    matchesObjectStore.createIndex("matches_title", "matches_title", { unique: false });
    teamsObjectStore.createIndex("teams_title", "teams_title", { unique: false });
  });


function saveForLaterMathces(article) {
dbPromised
    .then((db) =>{
    let tx = db.transaction("matches", "readwrite");
    let store = tx.objectStore("matches");
    // console.log(article);
    store.add(article.match);
    return tx.complete;
    })
    .then(()=> {
    M.toast({html: 'Jadwal berhasil di simpan.', classes: 'roundedToast'});
    // console.log("");
    }).catch(error=>{
      M.toast({html: `${(error === null)? "Jadwal telah Tersimpan sebelumnya":null}`, classes: 'roundedToast'})
    });
}

function saveForLaterTeams(article) {
  dbPromised
    .then((db) =>{
    let tx = db.transaction("teams", "readwrite");
    let store = tx.objectStore("teams");
    console.log(article);
    store.add(article);
    return tx.complete;
    })
    .then(()=> {
    M.toast({html: 'Team berhasil di simpan.', classes: 'roundedToast'});
    // console.log("Artikel berhasil di simpan.");
    }).catch(error=>{
      M.toast({html: `${(error === null)? "Team telah Tersimpan sebelumnya":null}`, classes: 'roundedToast'})
    });
}

function getAll(whichOne) {
    return new Promise((resolve, reject)=> {
      dbPromised
        .then((db)=> {
          let tx = db.transaction(whichOne, "readonly");
          let store = tx.objectStore(whichOne);
          return store.getAll();
        })
        .then((articles)=> {
          resolve(articles);
        });
    });
}

function getById(id,whichOne) {
  return new Promise((resolve, reject)=> {
    dbPromised
      .then((db)=> {
        let tx = db.transaction(whichOne, "readonly");
        let store = tx.objectStore(whichOne);
        let idstore =parseInt(id) ; 
        const storeID = store.get(idstore);
        return storeID;
      })
      .then((article)=> {
        // console.log(article);
        resolve(article);
      });
  });
}

function deletItem(id, whichOne) {
  dbPromised.then((db) =>{
    let tx = db.transaction(whichOne, 'readwrite');
    let store = tx.objectStore(whichOne);
    let idstore =parseInt(id) ; 
    store.delete(idstore);
    return tx.complete;
  }).then(() =>{
    M.toast({html: `${whichOne}List berhasil dihapus.`, classes: 'roundedToast'});
    console.log('Item deleted');
  });
}