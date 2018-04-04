const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');

const Image = sequelize.define('image', {
  image_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: Sequelize.STRING },
  cloudinary_public_id: { type: Sequelize.STRING },
  format: { type: Sequelize.STRING },
  created: { type: Sequelize.TIME },
  secure_url: { type: Sequelize.STRING },
},
{
  timestamps: false,
});

module.exports = { Image };