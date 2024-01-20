const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("./config/db.js");
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

    db.korisnik.findOne({ where: { username: objekat.username } })
    .then(async function (korisnik) {
      const jeLiIspravnaLozinka = await bcrypt.compare(objekat.password,korisnik.password);

      if (jeLiIspravnaLozinka) {
        req.session.username = korisnik.username;
        res.status(200).json({ poruka: "Uspješna prijava" });
      } else {
        res.status(401).json({ greska: "Neuspješna prijava" });
      }
    })
    .catch(function (err) {
      res.status(401).json({ greska: "Neuspješna prijava" });
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
        db.korisnik.findOne({ where: { username: req.session.username } })
        .then(function (korisnik) {
            res.status(200).json(korisnik);
        })
        .catch(function (error) {
            res.status(500).json({ greska: "Internal Server Error" });
        });
    }
});

app.post('/upit', function(req,res){
    if (!req.session || !req.session.username) {
        res.status(401).json({ greska: "Neautorizovan pristup" });
    } else {

        let objekat = req.body;

        db.korisnik.findOne({ where: { username: req.session.username } }).then(
        function (korisnik) {
            db.nekretnina.findById(objekat.nekretnina_id)
            .then(function (n) {
                if(n){
                    db.upit.create({tekst_upita: objekat.tekst_upita,NekretninaId: objekat.nekretnina_id,KorisnikId: korisnik.id,}).then(function (upit){
                        res.status(200).json({ poruka: "Upit uspješno dodan" });
                    });
                } else{
                    res.status(400).json({greska: `Nekretnina sa id-em ${objekat.nekretnina_id} ne postoji`});
                }
                
            })
            .catch(function (err) {
                res.status(400).json({greska: `Nekretnina sa id-em ${objekat.nekretnina_id} ne postoji`});
            });
        });
    }
});

app.put('/korisnik', async function(req, res) {
    if (!req.session || !req.session.username) {
        res.status(401).json({ greska: "Neautorizovan pristup" });
    } else {
        let objekat = req.body;

        const noviPodaci = {};
        if (objekat.ime) noviPodaci.ime = objekat.ime;
        if (objekat.prezime) noviPodaci.prezime = objekat.prezime;
        if (objekat.username) noviPodaci.username = objekat.username;
        if (objekat.password) noviPodaci.password = await bcrypt.hash(objekat.password, 10);

        db.korisnik.update(noviPodaci, {where: { username: req.session.username }}).then(function (u) {
            res.status(200).json({ poruka: "Podaci su uspješno ažurirani" });
        });
    }
});

app.get('/nekretnine', function(req, res) {
    db.nekretnina.findAll().then(function (nekretnine) {
        res.status(200).json(nekretnine);
    });
});

app.post('/marketing/nekretnine', function(req, res) {

    const objekat = req.body;

    objekat.nizNekretnina.forEach((idNekretnine) => {
        db.nekretnina.findOne({ where: { id: idNekretnine } }).then(function (trazenaNekretnina) {
            db.nekretnina.update(
                { pretrage: trazenaNekretnina.pretrage + 1 },
                { where: { id: trazenaNekretnina.id } }
            ).then(function (update) {
                res.status(200).end();
            });
        });
    });
});

app.post('/marketing/nekretnina/:id', function(req, res) {
    const idNekretnine = parseInt(req.params.id,10);

    db.nekretnina.findOne({ where: { id: idNekretnine } }).then(function (trazenaNekretnina) {
        db.nekretnina.update(
          { klikovi: trazenaNekretnina.klikovi + 1 },
          { where: { id: trazenaNekretnina.id } }
        ).then(function (update) {
            res.status(200).end();
        });
    });
});

app.post('/marketing/osvjezi', async function(req, res) {
    const nekretnine = await db.nekretnina.findAll();

    if (req.body && req.body.nizNekretnina) {
        req.session.nizNekretnina = Array.from(req.body.nizNekretnina);

        let izmijenjeneNekretnine = [];

        req.session.nizNekretnina.forEach(id => {
            const trazenaNekretnina = nekretnine.find(nekretnina => nekretnina.id === id);
            izmijenjeneNekretnine.push(trazenaNekretnina);
        });

        staraListaOsvjezenih = Array.from(izmijenjeneNekretnine);
        res.status(200).json({nizNekretnina: izmijenjeneNekretnine})        
    }
    else{
        if(req.session && req.session.nizNekretnina){
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
        }
        else{
            res.status(200).json({nizNekretnina: []});
        }
    }
});

app.get('/nekretnina/:id', async function(req, res) {
    const idNekretnine = parseInt(req.params.id,10);

    const nekretnina = await db.nekretnina.findOne({ where: { id: idNekretnine } });

    if (nekretnina) {
        let odgovor = nekretnina.toJSON();

        const upitiNekretnine = await nekretnina.getUpitiNekretnine();

        const upitiJSON = await Promise.all(upitiNekretnine.map(async (upit) => {
            const korisnik = await db.korisnik.findOne({ where: { id: upit.KorisnikId } });

            return {
                korisnik_username: korisnik.username,
                tekst_upita: upit.tekst_upita
            };
        }));

        odgovor.upiti = upitiJSON;

        res.status(200).json(odgovor);
    } else {
        res.status(400).json({ greska: `Nekretnina sa id-em ${idNekretnine} ne postoji` });
    }
});

function jesuLiIstiNizovi(stariNizDatoteka,noviNizDatoteka){
    if(stariNizDatoteka.length !== noviNizDatoteka.length){
        return false;
    }
    
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