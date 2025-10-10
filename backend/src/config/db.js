const path = require('path');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../data/db.sqlite'),
  logging: false // cambia a true si querés ver las queries SQL
});

module.exports = sequelize;
