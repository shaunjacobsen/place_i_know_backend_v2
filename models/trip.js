const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Itinerary } = require('./itinerary');
const { Image } = require('./image');
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

module.exports = { Trip };
