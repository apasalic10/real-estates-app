const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt24", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.nekretnina = sequelize.import(__dirname + "/../models/nekretnina.js");
db.korisnik = sequelize.import(__dirname + "/../models/korisnik.js");
db.upit = sequelize.import(__dirname + "/../models/upit.js");

// veza 1-n vise upita može biti vezano za jednu nekretninu
db.nekretnina.hasMany(db.upit, { as: "upitiNekretnine" });

// veza 1-n vise upita može biti napisano od jednog korisnika
db.korisnik.hasMany(db.upit, { as: "upitiKorisnici" });

db.upit.belongsTo(db.nekretnina);
db.upit.belongsTo(db.korisnik);

module.exports = db;