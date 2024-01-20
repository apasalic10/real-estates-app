const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const Nekretnina = sequelize.define(
    "Nekretnina",
    {
      tip_nekretnine: Sequelize.STRING,
      naziv: Sequelize.STRING,
      kvadratura: Sequelize.DOUBLE,
      cijena: Sequelize.DOUBLE,
      tip_grijanja: Sequelize.STRING,
      lokacija: Sequelize.STRING,
      godina_izgradnje: Sequelize.INTEGER,
      datum_objave: Sequelize.DATE,
      opis: Sequelize.STRING,
      klikovi: Sequelize.INTEGER,
      pretrage: Sequelize.INTEGER,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Nekretnina;
};