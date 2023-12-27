const MarketingAjax = (() => {

    function impl_osvjeziPretrage(divNekretnine) {
    }

    function impl_osvjeziKlikove(divNekretnine) {
    
    }

    function impl_novoFiltriranje(listaFiltriranihNekretnina) {
        let ajax = new XMLHttpRequest();
        ajax.open("POST","http://localhost:3000/marketing/nekretnine",true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({nizNekretnina: listaFiltriranihNekretnina}));
    }

    function impl_klikNekretnina(idNekretnine) {
        let ajax = new XMLHttpRequest();
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