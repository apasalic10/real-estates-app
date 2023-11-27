function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    
    let nekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });
    
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

const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 3,
    tip_nekretnine: "Kuća",
    naziv: "Kuća Hrasno brdo",
    kvadratura: 185,
    cijena: 240000,
    tip_grijanja: "struja",
    lokacija: "Hrasno brdo",
    godina_izgradnje: 2010,
    datum_objave: "20.09.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 4,
    tip_nekretnine: "Stan",
    naziv: "Stan Grbavica",
    kvadratura: 40,
    cijena: 132000,
    tip_grijanja: "plin",
    lokacija: "Grbavica",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 5,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Poslovni prostor Stari Grad",
    kvadratura: 35,
    cijena: 90000,
    tip_grijanja: "struja",
    lokacija: "Stari Grad",
    godina_izgradnje: 2001,
    datum_objave: "25.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 6,
    tip_nekretnine: "Kuća",
    naziv: "Kuća Dobrinja",
    kvadratura: 190,
    cijena: 205000,
    tip_grijanja: "plin",
    lokacija: "Dobrinja",
    godina_izgradnje: 2008,
    datum_objave: "20.05.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
}]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}];


let nekretnine = SpisakNekretnina();
nekretnine.init(listaNekretnina, listaKorisnika);


spojiNekretnine(divStan, nekretnine, "Stan");
spojiNekretnine(divKuca, nekretnine, "Kuća");
spojiNekretnine(divPp, nekretnine, "Poslovni prostor");

