const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Trip } = require('./trip');
const { Image } = require('./image');
const { Place } = require('./place');

const Accommodation = sequelize.define(
  'accommodation',
  {
    accommodation_id: {
      field: 'proposed_accommodation_id',
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trip_id: { type: Sequelize.INTEGER },
    place_id: { type: Sequelize.INTEGER },
    charge_id: { type: Sequelize.INTEGER },
    accommodation_group_id: { type: Sequelize.INTEGER },
    star_rating: { type: Sequelize.FLOAT(2, 1) },
    check_in: { type: Sequelize.DATE },
    check_out: { type: Sequelize.DATE },
    guests: { type: Sequelize.INTEGER },
    rooms: { type: Sequelize.INTEGER },
    beds: { type: Sequelize.INTEGER },
    breakfast_included: { type: Sequelize.BOOLEAN },
    subtotal: { type: Sequelize.DOUBLE },
    taxes: { type: Sequelize.DOUBLE },
    total: { type: Sequelize.DOUBLE },
    commission: { type: Sequelize.DOUBLE },
    commission_pct: { type: Sequelize.DOUBLE },
    status: { type: Sequelize.STRING },
    vendor: { type: Sequelize.STRING },
    booking_ref: { type: Sequelize.STRING },
    notes: { type: Sequelize.STRING },
    created: { type: Sequelize.TIME },
    created_by: { type: Sequelize.INTEGER },
  },
  {
    timestamps: false,
    tableName: 'proposed_accommodations',
  }
);

Accommodation.belongsTo(Place, { foreignKey: 'place_id' });

Accommodation.prototype.getDetailsForUser = async function(id) {
  try {
    const accommodations = await Accommodation.findById(id, {
      attributes: [
        'accommodation_id',
        'trip_id',
        'place_id',
        'charge_id',
        'star_rating',
        'check_in',
        'check_out',
        'guests',
        'rooms',
        'beds',
        'breakfast_included',
        'subtotal',
        'taxes',
        'total',
        'status',
        'notes',
      ],
    });
    return accommodations;
  } catch (e) {
    console.log(e);
  }
};

Accommodation.prototype.markAsSelected = async function() {
  try {
    const group = await sequelize.models.accommodation_group.findOne({
      where: { accommodation_group_id: this.accommodation_group_id },
    });
    if (group.status === 'confirmed') {
      throw Error('ACCOMMODATION_GROUP_CONFIRMED');
    }
    await Accommodation.update(
      {
        status: 'proposed',
      },
      {
        where: { accommodation_group_id: group.accommodation_group_id },
      }
    );
    await Accommodation.update(
      {
        status: 'selected',
      },
      {
        where: { accommodation_id: this.accommodation_id },
      }
    );
    return await sequelize.models.accommodation_group.findAll({
      where: { trip_id: this.trip_id },
      include: {
        model: Accommodation,
        attributes: [
          'accommodation_id',
          'trip_id',
          'place_id',
          'charge_id',
          'star_rating',
          'check_in',
          'check_out',
          'guests',
          'rooms',
          'beds',
          'breakfast_included',
          'subtotal',
          'taxes',
          'total',
          'status',
          'notes',
        ],
        order: [['check_in', 'ASC'], ['total', 'ASC']],
        include: [
          {
            model: Place,
            include: [{ model: Image, attributes: ['secure_url'] }],
          },
        ],
      },
    });
  } catch (e) {
    return { error: e.message };
  }
};

module.exports = { Accommodation };
