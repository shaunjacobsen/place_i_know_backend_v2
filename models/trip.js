const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Accommodation } = require('./accommodation');
const { AccommodationGroup } = require('./accommodationGroup');
const { Image } = require('./image');
const { Itinerary } = require('./itinerary');
const { Place } = require('./place');
const { User } = require('./user');

const Trip = sequelize.define(
  'trip',
  {
    trip_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: Sequelize.STRING, allowNull: false },
    start_date: { type: Sequelize.DATE, allowNull: false },
    end_date: { type: Sequelize.DATE, allowNull: false },
    created: { type: Sequelize.TIME },
    tripAttributes: { field: 'attributes', type: Sequelize.JSON, allowNull: true },
    created_by: { type: Sequelize.INTEGER },
    attendees: { type: Sequelize.ARRAY(Sequelize.INTEGER), allowNull: false },
  },
  {
    timestamps: false,
  }
);

Trip.hasMany(Itinerary, { foreignKey: 'trip_id' });
Trip.image_id = Trip.belongsTo(Image, { foreignKey: 'image_id', targetKey: 'image_id' });

Trip.findByUser = function(userId) {
  return this.findAll({
    where: {
      attendees: {
        $contains: [userId],
      },
    },
    include: [
      Itinerary,
      {
        model: Image,
        attributes: ['secure_url'],
      },
    ],
  })
    .then(trips => {
      if (!trips) {
        return Promise.reject();
      }
      return Promise.resolve(trips);
    })
    .catch(e => {
      console.log('error', e);
    });
};

Trip.prototype.isUserAuthorizedToView = function(user) {
  if (user.role === 'admin') {
    return true;
  }

  if (this.attendees.includes(user._id)) {
    return true;
  }
};

Trip.prototype.listAttendees = async function() {
  try {
    const attendees = await User.findAll({
      attributes: ['profile_id', 'first_name', 'last_name', 'image_id'],
      where: {
        profile_id: {
          $in: this.attendees,
        },
      },
      include: [
        {
          model: Image,
          attributes: ['secure_url'],
        },
      ],
    });
    return attendees;
  } catch (e) {
    console.log(e);
  }
};

Trip.prototype.listAccommodations = async function() {
  try {
    const accommodations = await Accommodation.findAll({
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
      where: {
        trip_id: this.trip_id,
      },
      include: [
        {
          model: Place,
          include: [{ model: Image, attributes: ['secure_url'] }],
        },
      ],
    });
    return accommodations;
  } catch (e) {
    console.log(e);
  }
};

Trip.prototype.listAccommodationsWithGroups = async function() {
  try {
    const accommodationGroups = await AccommodationGroup.findAll({
      where: {
        trip_id: this.trip_id,
      },
      include: [
        {
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
      ],
    });
    return accommodationGroups;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { Trip };
