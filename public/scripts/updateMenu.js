let prijavaListItem,odjavaMenuItem,meni;
window.onload = function (){
    meni = document.getElementById("menu-screen");
    prijavaListItem = meni.contentWindow.document.getElementById("prijavaItem");
    PoziviAjax.getKorisnik(updateMenuSuccessLogin);
}


function updateMenuSuccessLogin(err,data){
    if(data){
        let odjavaHTML = "<a id='meniOdjava' href='prijava.html' target='#'>Odjava</a>";
        prijavaListItem.innerHTML = odjavaHTML;

        odjavaMenuItem = meni.contentWindow.document.getElementById("meniOdjava");
        odjavaMenuItem.addEventListener("click", function () {
            PoziviAjax.postLogout(updateLogout);
        });
    }
}

function updateLogout(err,data){
    if(data){
        let prijavaHTML = "<a id='meniPrijava' href='prijava.html' target='#'>Prijava</a>";
        prijavaListItem.innerHTML = prijavaHTML;
    }
}