async function spojiDetaljeNekretnine(nekretnina){
    let detailsHTML = `
        <div class="details">
        <h3>OSNOVNO</h3>
        <div id="osnovno">
            <img src="https://dupqmgrdwnev6.cloudfront.net/wp-content/uploads/2021/02/Mali-dvosobni-stan-ruzicasto-bijeli-7-930x616.jpg?x33891" alt="${nekretnina.tip_nekretnine}">
            <p><strong>Naziv: </strong>${nekretnina.naziv}</p>
            <p><strong>Kvadratura: </strong>${nekretnina.kvadratura} m2</p>
            <p><strong>Cijena: </strong>${nekretnina.cijena} KM</p>
        </div>
        
        <h3 id="detalji-naslov">DETALJI</h3>
        <div id="detalji">
            <p class="grid-item"><strong>Tip grijanja: </strong>${nekretnina.tip_grijanja}</p>
            <p class="grid-item"><strong>Godina izgradnje: </strong>${nekretnina.godina_izgradnje}</p>
            <p class="grid-item"><strong>Lokacija: </strong>${nekretnina.lokacija}</p>
            <p class="grid-item"><strong>Datum objave: </strong>${nekretnina.datum_objave}</p>
            <p class="grid-item-description"><strong>Opis: </strong>${nekretnina.opis}</p>
        </div>   
        </div>

        <h3>UPITI</h3>`;
        detailsHTML += `<div id="upiti">
        <ul class="lista-upita">`;

        if(nekretnina.upiti.length !== 0){
            nekretnina.upiti.forEach(upit => {
                detailsHTML += `<li>
                <div class="korisnik">${upit.korisnik_username}</div>
                <div class="upit">${upit.tekst_upita}</div>
                </li>`;
            });
        }

        detailsHTML += `</ul>
        </div>`;
        
    let frameDetails = document.querySelector(".details-frame");
    frameDetails.innerHTML = detailsHTML;
}

const urlSearchParams = new URLSearchParams(window.location.search);
let idNekretnine = urlSearchParams.get('id');

PoziviAjax.getNekretninaById(idNekretnine,popuniDetalje);

function popuniDetalje(err,data) {
    if(data){
        spojiDetaljeNekretnine(data);
    }
}