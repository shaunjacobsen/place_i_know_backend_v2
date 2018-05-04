const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Image } = require('./image');

const Place = sequelize.define('place', {
  place_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: Sequelize.STRING, allowNull: false },
  name: { type: Sequelize.STRING, allowNull: false },
  full_address: { type: Sequelize.STRING },
  address1: { type: Sequelize.STRING },
  address2: { type: Sequelize.STRING },
  city: { type: Sequelize.STRING },
  state: { type: Sequelize.STRING },
  postal: { type: Sequelize.STRING },
  country: { type: Sequelize.STRING },
  phone: { type: Sequelize.STRING },
  website: { type: Sequelize.STRING },
  google_id: { type: Sequelize.STRING },
  latitude: { type: Sequelize.STRING, allowNull: false },
  longitude: { type: Sequelize.STRING, allowNull: false },
  tags: { type: Sequelize.ARRAY(Sequelize.STRING) },
  place_attributes: { field: 'attributes', type: Sequelize.STRING },
  notes: { type: Sequelize.STRING },
  hours: { type: Sequelize.JSONB },
  created: { type: Sequelize.TIME },
  created_by: { type: Sequelize.INTEGER },
},
{
  timestamps: false,
});

Place.belongsTo(Image, { foreignKey: 'image_id', targetKey: 'image_id' });

module.exports = { Place };