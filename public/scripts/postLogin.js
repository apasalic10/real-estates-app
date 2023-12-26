function promijeniStranicu(err, data){
    if(data && data.poruka){
        window.location.href = "http://localhost:3000/nekretnine.html";
    }
    else{
        alert("Pogrešan username ili password!");
    }
}