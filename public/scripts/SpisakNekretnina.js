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

