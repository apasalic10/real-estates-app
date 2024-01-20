const db = require("./db.js");

db.sequelize.sync({ force: true }).then(async () => {
  try {
    await inicijalizacija();
    console.log("Kreirane tabele i popunjene početnim podacima!");
    process.exit();
  } catch (error) {
    console.error("Greška:", error);
  }
});

async function inicijalizacija() {
    var nekretnineListaPromisea=[];
    var korisniciListaPromisea=[];
    var upitiListaPromisea=[];
    return new Promise(function(resolve,reject){
    nekretnineListaPromisea.push(db.nekretnina.create(
    {
        tip_nekretnine: "Stan",
        naziv: "Useljiv stan Sarajevo",
        kvadratura: 58,
        cijena: 232000,
        tip_grijanja: "plin",
        lokacija: "Novo Sarajevo",
        godina_izgradnje: 2019,
        datum_objave: new Date("2023-10-01"),
        opis: "Sociis natoque penatibus.",
        klikovi: 0,
        pretrage: 0
    }));
    nekretnineListaPromisea.push(db.nekretnina.create(
    {
        tip_nekretnine: "Poslovni prostor",
        naziv: "Mali poslovni prostor",
        kvadratura: 20,
        cijena: 70000,
        tip_grijanja: "struja",
        lokacija: "Centar",
        godina_izgradnje: 2005,
        datum_objave: new Date("2023-08-20"),
        opis: "Magnis dis parturient montes.",
        klikovi: 0,
        pretrage: 0
    }));
    Promise.all(nekretnineListaPromisea).then(function(nekretnine){
        var stan=nekretnine.filter(function(n){return n.naziv==='Useljiv stan Sarajevo'})[0];
        var pp=nekretnine.filter(function(n){return n.naziv==='Mali poslovni prostor'})[0];

        korisniciListaPromisea.push(db.korisnik.create(
        {
            ime: "Almedin",
            prezime: "Pasalic",
            username: "apasalic1",
            password: "$2b$10$hCR/3UpzIByBrBT1If2KqOZO41eMk2MvQ9X2HVFk1cCHr.cmEVafW"
        }));

        korisniciListaPromisea.push(db.korisnik.create(
        {
            ime: "Neko2",
            prezime: "Nekic2",
            username: "username2",
            password: "$2b$10$JRWCF4OPfRIusX2T1KWai.Ti8cQRMU7RS6r2eFtNn0b6JAm7J9jM."
        }));
        
        Promise.all(korisniciListaPromisea).then(function(korisnici){
            var user1=korisnici.filter(function(k){return k.username==='apasalic1'})[0];
            var user2=korisnici.filter(function(k){return k.username==='username2'})[0];
           
            upitiListaPromisea.push(
                db.upit.create({tekst_upita:'Ma bomba'}).then(function(u){
                    return u.setNekretnina(stan).then(function(){
                        return u.setKorisnik(user1).then(function(){
                            return new Promise(function(resolve,reject){resolve(u);});
                        }); 
                    });
                })
            );
            Promise.all(upitiListaPromisea).then(function(b){resolve(b);}).catch(function(err){console.log("Upiti greska "+err);});
        }).catch(function(err){console.log("Korisnici greska "+err);});
    }).catch(function(err){console.log("Nekretnine greska "+err);});   
    });
}