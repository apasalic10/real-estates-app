let isCalled = false;
let novaFiltriranaLista = [];

const MarketingAjax = (() => {

    function impl_osvjeziPretrage(divNekretnine) {
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var jsonRez = JSON.parse(ajax.responseText);
                jsonRez.nizNekretnina.forEach(nekretnina => {
                    let divPretrage = divNekretnine.querySelector(`#pretrage-${nekretnina.id}`);
                    divPretrage.style.display = "block";
                    divPretrage.innerText = `Broj pretraga: ${nekretnina.pretrage}`;
                });
            }
        }
        ajax.open("POST","http://localhost:3000/marketing/osvjezi",true);


        if(!isCalled){
            ajax.send();
        }
        else{
            ajax.setRequestHeader("Content-Type", "application/json");
            ajax.send(JSON.stringify({nizNekretnina: novaFiltriranaLista}));
        }
    }

    function impl_osvjeziKlikove(divNekretnine) {
         let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var jsonRez = JSON.parse(ajax.responseText);
                jsonRez.nizNekretnina.forEach(nekretnina => {
                    let divKlikovi = divNekretnine.querySelector(`#klikovi-${nekretnina.id}`);
                    divKlikovi.style.display = "block";
                    divKlikovi.innerText = `Broj klikova: ${nekretnina.klikovi}`;
                });
            }
        }
        ajax.open("POST","http://localhost:3000/marketing/osvjezi",true);


        if(!isCalled){
            ajax.send();
        }
        else{
            isCalled = false;
            ajax.setRequestHeader("Content-Type", "application/json");
            ajax.send(JSON.stringify({nizNekretnina: novaFiltriranaLista}));
        }
    }

    function impl_novoFiltriranje(listaFiltriranihNekretnina) {
        isCalled = true;
        novaFiltriranaLista = Array.from(listaFiltriranihNekretnina);
        let ajax = new XMLHttpRequest();
        ajax.open("POST","http://localhost:3000/marketing/nekretnine",true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({nizNekretnina: listaFiltriranihNekretnina}));
    }

    function impl_klikNekretnina(idNekretnine) {
        let ajax = new XMLHttpRequest();
        isCalled = true;
        novaFiltriranaLista = Array.from([idNekretnine]);
        ajax.open("POST",`http://localhost:3000/marketing/nekretnina/${idNekretnine}`,true);
        ajax.send();
    }

    return {
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove,
        novoFiltriranje: impl_novoFiltriranje,
        klikNekretnina: impl_klikNekretnina
    };
})();