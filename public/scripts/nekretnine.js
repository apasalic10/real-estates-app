function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine, min_kvadratura,max_kvadratura,min_cijena,max_cijena) {
    
    let nekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine, min_kvadratura: min_kvadratura, max_kvadratura: max_kvadratura, min_cijena: min_cijena, max_cijena:max_cijena });
    divReferenca.innerHTML = "";
    for(let nekretnina of nekretnine){

        let imgSrc;
        if(nekretnina.tip_nekretnine === "Stan"){
            imgSrc = "https://dupqmgrdwnev6.cloudfront.net/wp-content/uploads/2021/08/Mali-dvosobni-stan-19.jpg?x33891";
        }
        else if(nekretnina.tip_nekretnine === "Kuća"){
            imgSrc = "https://www.nekretnineinn.ba/wp-content/uploads/2018/02/Moderna-lepotica-Ku%C4%87a-koja-%C4%87e-vas-osvojiti-na-prvi-pogled-8-830x458.jpg";        }
        else{
            imgSrc = "https://jungic.hr/wp-content/uploads/2017/08/moderni-ured.jpg";
        }

        divReferenca.innerHTML += "<div class='real-estates-item'>" +
            "<img src='" + imgSrc + "' alt='" + nekretnina.tip_nekretnine + "'>" +
            "<div class='real-estates-details'>" +
            "<p class='real-estates-name'>" + nekretnina.naziv + "</p>" +
            "<p class='real-estates-quadrature'>Kvadratura: " + nekretnina.kvadratura + "</p>" +
            "<p class='real-estates-price'>Cijena: " + nekretnina.cijena + "</p>" +
            "</div>" +
            "<button class='details-button'>Detalji</button>" +
            "</div>";
    }    
   
};

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

let nekretnine = SpisakNekretnina();

function spajanjeNekretnina(error,data){
    if(data){
        nekretnine.init(data, []);

        spojiNekretnine(divStan, nekretnine, "Stan");
        spojiNekretnine(divKuca, nekretnine, "Kuća");
        spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
    }
}

PoziviAjax.getNekretnine(spajanjeNekretnina);


let filtirajDugme = document.getElementById("filtrirajButton").addEventListener("click", function () {

    let minCijenaInput = document.getElementById("minPrice");
    let maxCijenaInput = document.getElementById("maxPrice");
    let minKvadraturaInput = document.getElementById("minKvadratura");
    let maxKvadraturaInput = document.getElementById("maxKvadratura");

    minCijenaInput = minCijenaInput === "" ? undefined : parseInt(minCijenaInput.value, 10);
    maxCijenaInput = maxCijenaInput === "" ? undefined : parseInt(maxCijenaInput.value, 10);
    minKvadraturaInput = minKvadraturaInput === "" ? undefined : parseInt(minKvadraturaInput.value, 10);
    maxKvadraturaInput = maxKvadraturaInput === "" ? undefined : parseInt(maxKvadraturaInput.value, 10);
  
    spojiNekretnine(divStan, nekretnine, "Stan",minKvadraturaInput,maxKvadraturaInput,minCijenaInput,maxCijenaInput);
    spojiNekretnine(divKuca, nekretnine, "Kuća",minKvadraturaInput,maxKvadraturaInput,minCijenaInput,maxCijenaInput);
    spojiNekretnine(divPp, nekretnine, "Poslovni prostor",minKvadraturaInput,maxKvadraturaInput,minCijenaInput,maxCijenaInput);
});
