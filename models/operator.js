const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Image } = require('./image');

const Operator = sequelize.define(
  'operator',
  {
    operator_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: Sequelize.STRING },
    shortcode: { type: Sequelize.STRING },
    website: { type: Sequelize.STRING },
    customer_service_num: { type: Sequelize.STRING },
    travel_agent_num: { type: Sequelize.STRING },
    image_id: { type: Sequelize.INTEGER },
    created: { type: Sequelize.TIME },
    created_by: { type: Sequelize.INTEGER },
  },
  {
    timestamps: false,
  }
);

Operator.belongsTo(Image, { foreignKey: 'image_id' });

module.exports = { Operator };
