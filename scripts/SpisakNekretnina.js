let SpisakNekretnina = function () {
    
    let listaNekretnina = [];
    let listaKorisnika = [];
    
    let init = function (novaListaNekretnina, novaListaKorisnika) {
        listaNekretnina = novaListaNekretnina;
        listaKorisnika = novaListaKorisnika;
    }

    let filtrirajNekretnine = function (kriterij) {

        if (!kriterij) {
            return listaNekretnina;
        }

        let rezultantnaListaNekretnina = [];

        for (let nekretnina of listaNekretnina) {

            if ((!kriterij.tip_nekretnine || nekretnina.tip_nekretnine === kriterij.tip_nekretnine) &&
                (!kriterij.min_kvadratura || nekretnina.kvadratura >= kriterij.min_kvadratura) &&
                (!kriterij.max_kvadratura || nekretnina.kvadratura <= kriterij.max_kvadratura) &&
                (!kriterij.min_cijena || nekretnina.cijena >= kriterij.min_cijena) &&
                (!kriterij.max_cijena || nekretnina.cijena <= kriterij.max_cijena)){

                rezultantnaListaNekretnina.push(nekretnina);
            }
        }

        return rezultantnaListaNekretnina;
    }

    let ucitajDetaljeNekretnine = function (id) {
        for (let nekretnina of listaNekretnina){
            if(nekretnina.id === id){
                return nekretnina;
            }
        }

        return null;
    }

    let vratiNekretnine = function(){
        return listaNekretnina;
    }

    let vratiKorisnike = function(){
        return listaKorisnika;
    }


    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine,
        vratiNekretnine: vratiNekretnine,
        vratiKorisnike: vratiKorisnike
    }
};


let spNekretnina = SpisakNekretnina();

const listaNekretnina = [
    {
        id: 1,
        tip_nekretnine: "Stan",
        naziv: "Useljiv stan Sarajevo",
        kvadratura: 58,
        cijena: 132000,
        tip_grijanja: "plin",
        lokacija: "Novo Sarajevo",
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
        id: 3,
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
        }]
    }
];

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
}]
    



spNekretnina.init(listaNekretnina, listaKorisnika);
const kriterij = {
    tip_nekretnine: "Stan",
    max_cijena: 200000,
    max_kvadratura: 50
}
spNekretnina.filtrirajNekretnine(kriterij);