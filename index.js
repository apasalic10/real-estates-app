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

app.post('/login', function(req,res){
    let objekat = req.body;

    let daLiJePrijavaUspjesna = false;

    fs.readFile('data/korisnici.json','utf-8',async function(err,data){
        if(err){
            throw err;
        }

        const korisnici = JSON.parse(data);

        const verification = async ()=> {
            for(let korisnik of korisnici){
                if(objekat.username === korisnik.username){
                    let isPasswordCorrect = await bcrypt.compare(objekat.password, korisnik.password);

                    if(isPasswordCorrect){
                        daLiJePrijavaUspjesna = true;
                    }
                    break;
                }
            }
        }

        await verification();

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

        let korisnikId, daLiPostojiNekretnina;

        fs.readFile('data/korisnici.json','utf-8',function(err,data){
            if(err){
                throw err;
            }
    
            const korisnici = JSON.parse(data);
    
            for(let korisnik of korisnici){
                if(req.session.username === korisnik.username){
                   korisnikId = korisnik.id;
                    break;
                }
            }
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
                res.status(404).json({ greska: `Nekretnina sa id-em ${objekat.nekretnina_id} ne postoji` });
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
    res.status(200).end();
});

app.post('/marketing/nekretnina/:id', function(req, res) {
    res.status(200).end();
});

app.post('/marketing/osvjezi', function(req, res) {
    
});

app.listen(3000);