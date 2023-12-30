const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'html')));
app.use(session({
    secret: 'neka tajna sifra',
    resave: true,
    saveUninitialized: true
}));

let staraListaOsvjezenih = [];

app.post('/login', function(req,res){
    let objekat = req.body;

    let daLiJePrijavaUspjesna = false;

    fs.readFile('data/korisnici.json','utf-8',async function(err,data){
        if(err){
            throw err;
        }

        const korisnici = JSON.parse(data);

        const trazeniKorisnik = korisnici.find(korisnik => korisnik.username === objekat.username);
    
        if(trazeniKorisnik){
            let isPasswordCorrect = await bcrypt.compare(objekat.password, trazeniKorisnik.password);

            if(isPasswordCorrect){
                daLiJePrijavaUspjesna = true;
            }
            
        }

        if(daLiJePrijavaUspjesna){
            req.session.username = objekat.username;
            res.status(200).json({ poruka: "Uspješna prijava" });
        } 
        else{
            res.status(401).json({ greska: "Neuspješna prijava" });
        }
    });

});

app.post('/logout', function(req, res) {
    if (!req.session || !req.session.username) {
        res.status(401).json({ greska: "Neautorizovan pristup" });
    } else {
        req.session.destroy((err) => {
            if (err) {
                res.status(401).json({ greska: "Neautorizovan pristup" });
            } else {
                res.status(200).json({ poruka: "Uspješno ste se odjavili" });
            }
        });
    }
});

app.get('/korisnik', function(req, res) {
    if (!req.session || !req.session.username) {
        res.status(401).json({ greska: "Neautorizovan pristup" });
    } else {
        fs.readFile('data/korisnici.json','utf-8',function(err,data){
            if(err){
                throw err;
            }
    
            const korisnici = JSON.parse(data);
    
            for(let korisnik of korisnici){
                if(req.session.username === korisnik.username){
                    res.status(200).json({id:korisnik.id, ime:korisnik.ime, prezime:korisnik.prezime, username:korisnik.username, password:korisnik.password});
                    break;
                }
            }
        });
    }
});

app.post('/upit', function(req,res){
    if (!req.session || !req.session.username) {
        res.status(401).json({ greska: "Neautorizovan pristup" });
    } else {

        let objekat = req.body;

        let korisnikId;

        fs.readFile('data/korisnici.json','utf-8',function(err,data){
            if(err){
                throw err;
            }
    
            const korisnici = JSON.parse(data);

            const trazeniKorisnikIndex = korisnici.findIndex(korisnik => korisnik.username === req.session.username);
    
            korisnikId = korisnici[trazeniKorisnikIndex].id;
            
        });

        fs.readFile('data/nekretnine.json','utf-8',function(err,data){
            if(err){
                throw err;
            }

            const nekretnine = JSON.parse(data);

            const trazenaNekretnina = nekretnine.find(nekretnina => nekretnina.id === objekat.nekretnina_id);

            if (trazenaNekretnina) {
                trazenaNekretnina.upiti.push({korisnik_id:korisnikId,tekst_upita:objekat.tekst_upita});

                fs.writeFile('data/nekretnine.json', JSON.stringify(nekretnine, null, 4), 'utf-8', function(err) {
                    if (err) {
                        throw err;
                    }

                    res.status(200).json({ poruka: "Upit je uspješno dodan"});
                });
            } else {
                res.status(400).json({ greska: `Nekretnina sa id-em ${objekat.nekretnina_id} ne postoji` });
            }
        });
    }
});

app.put('/korisnik', function(req, res) {
    if (!req.session || !req.session.username) {
        res.status(401).json({ greska: "Neautorizovan pristup" });
    } else {
        let objekat = req.body;

        fs.readFile('data/korisnici.json','utf-8', async function(err,data){
            if(err){
                throw err;
            }
    
            const korisnici = JSON.parse(data);
    
            const trazeniKorisnik = korisnici.find(korisnik => korisnik.username === req.session.username);

            if(objekat.ime){
                trazeniKorisnik.ime = objekat.ime;
            }
            if(objekat.prezime){
                trazeniKorisnik.prezime = objekat.prezime;
            }
            if(objekat.username){
                req.session.username = objekat.username;
                trazeniKorisnik.username = objekat.username;
            }
            if(objekat.password){
                trazeniKorisnik.password = await bcrypt.hash(objekat.password, 10);
            }

            fs.writeFile('data/korisnici.json', JSON.stringify(korisnici, null, 4), 'utf-8', function(err) {
                if (err) {
                    throw err;
                }

                res.status(200).json({ poruka: "Podaci su uspješno ažurirani" });
            });
        });
    }
});

app.get('/nekretnine', function(req, res) {
    fs.readFile('data/nekretnine.json','utf-8',function(err,data){
        if(err){
            throw err;
        }

       let nekretnine = JSON.parse(data);

       res.status(200).json(nekretnine);
    });
});

app.post('/marketing/nekretnine', function(req, res) {

    const objekat = req.body;

    fs.readFile('data/nekretnineMarketing.json','utf-8', function(err,data){
        if(err){
            throw err;
        }

        const nekretnine = JSON.parse(data);

        for(let id of objekat.nizNekretnina){
            const trazenaNekretnina = nekretnine.find(nekretnina => nekretnina.id === id);

            if(trazenaNekretnina){
                trazenaNekretnina.pretrage++;
            }
            else{
                nekretnine.push({id: id, klikovi: 0, pretrage: 1});
            }
        }

        fs.writeFile('data/nekretnineMarketing.json', JSON.stringify(nekretnine, null, 4), 'utf-8', function(err) {
            if (err) {
                throw err;
            }

            res.status(200).end();
        });
    });
});

app.post('/marketing/nekretnina/:id', function(req, res) {
    const idNekretnine = parseInt(req.params.id,10);

    fs.readFile('data/nekretnineMarketing.json','utf-8', function(err,data){
        if(err){
            throw err;
        }

        const nekretnine = JSON.parse(data);

        const trazenaNekretnina = nekretnine.find(nekretnina => nekretnina.id === idNekretnine);

        if(trazenaNekretnina){
            trazenaNekretnina.klikovi++;
        }
        else{
            nekretnine.push({id: idNekretnine, klikovi: 1, pretrage: 0});
        }
        

        fs.writeFile('data/nekretnineMarketing.json', JSON.stringify(nekretnine, null, 4), 'utf-8', function(err) {
            if (err) {
                throw err;
            }

            res.status(200).end();
        });
    });
});

app.post('/marketing/osvjezi', function(req, res) {
    if (req.body && req.body.nizNekretnina) {
        req.session.nizNekretnina = Array.from(req.body.nizNekretnina);

        fs.readFile('data/nekretnineMarketing.json', 'utf-8', function (err, data){
            if (err) {
                throw err;
            }
            
            const nekretnine = JSON.parse(data);

            let izmijenjeneNekretnine = [];

            req.session.nizNekretnina.forEach(id => {
                const trazenaNekretnina = nekretnine.find(nekretnina => nekretnina.id === id);
                izmijenjeneNekretnine.push(trazenaNekretnina);
            });

            staraListaOsvjezenih = Array.from(izmijenjeneNekretnine);
            res.status(200).json({nizNekretnina: izmijenjeneNekretnine})
            
        });
    }
    else{
        if(req.session && req.session.nizNekretnina){
            fs.readFile('data/nekretnineMarketing.json', 'utf-8', function (err, data){
                if (err) {
                    throw err;
                }
                
                const nekretnine = JSON.parse(data);
    
                let izmijenjeneNekretnine = [];
    
                req.session.nizNekretnina.forEach(id => {
                    const trazenaNekretnina = nekretnine.find(nekretnina => nekretnina.id === id);
                    izmijenjeneNekretnine.push(trazenaNekretnina);
                });
    
                if(jesuLiIstiNizovi(staraListaOsvjezenih,izmijenjeneNekretnine)){
                    res.status(200).json({nizNekretnina: []});
                }
                else{
                    staraListaOsvjezenih = Array.from(izmijenjeneNekretnine);
                    res.status(200).json({nizNekretnina: izmijenjeneNekretnine})
                }
            });
        }
        else{
            res.status(200).json({nizNekretnina: []});
        }
    }
});

function jesuLiIstiNizovi(stariNizDatoteka,noviNizDatoteka){
    noviNizDatoteka.forEach(nekretninaNova => {
        let trazenaNekretnina = stariNizDatoteka.find(nekretnina => nekretnina.id === nekretninaNova.id);
        if(trazenaNekretnina){
            if(trazenaNekretnina.id === nekretninaNova.id && trazenaNekretnina.pretrage === nekretninaNova.pretrage && trazenaNekretnina.klikovi === nekretninaNova.klikovi){
                return true;
            }
        }
    });

    return false;
}

app.listen(3000);