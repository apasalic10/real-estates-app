let userUsername;
let tekstUpita;
let frameDiv;
let prijavaListItem,odjavaMenuItem,meni,profilMenuItem;

window.onload = function() {
    meni = document.getElementById("menu-screen");
    prijavaListItem = meni.contentWindow.document.getElementById("prijavaItem");
    profilMenuItem = meni.contentWindow.document.getElementById("profilItem");
    frameDiv = document.querySelector(".details-frame");
    PoziviAjax.getKorisnik(logovanKorisnik);   
}

function crtajFormu(divRef){
    let upitHTML = `<div class="form-upita">
    <form class="input-form">
    <input id="input_upita" type="text" placeholder="Unesi tekst upita" name="inputUpita"/>
    <button id="upitButton" type="button">Postavi upit</button>
    </form>
    </div>`;

    divRef.innerHTML += upitHTML;
}
        
function logovanKorisnik(err,data){
    if(data){
        let odjavaHTML = "<a id='meniOdjava' href='prijava.html' target='#'>Odjava</a>";
        profilMenuItem.style.display = "inline-block";
        prijavaListItem.innerHTML = odjavaHTML;

        odjavaMenuItem = meni.contentWindow.document.getElementById("meniOdjava");
        odjavaMenuItem.addEventListener("click", function () {
            PoziviAjax.postLogout(updateLogout);
        });

        crtajFormu(frameDiv);
        userUsername = data.username;

        document.getElementById("upitButton").addEventListener("click", () => {
            tekstUpita = document.getElementById("input_upita").value;
            PoziviAjax.postUpit(parseInt(idNekretnine, 10), tekstUpita, azurirajUpite);
        });

    }
}

function azurirajUpite(err,data){
    if(data){
        let listaUpita = document.querySelector(".lista-upita");
        let listItem = `<li>
        <div class="korisnik">${userUsername}</div>
        <div class="upit">${tekstUpita}</div>
        </li>`;
        listaUpita.innerHTML += listItem;
    }
}

function updateLogout(err,data){
    if(data){
        let prijavaHTML = "<a id='meniPrijava' href='prijava.html' target='#'>Prijava</a>";
        profilMenuItem.style.display = "none";
        prijavaListItem.innerHTML = prijavaHTML;
    }
}