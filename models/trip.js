module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define(
    'trip',
    {
      trip_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      start_date: { type: DataTypes.DATE, allowNull: false },
      end_date: { type: DataTypes.DATE, allowNull: false },
      created: { type: DataTypes.TIME },
      tripAttributes: { field: 'attributes', type: DataTypes.JSON, allowNull: true },
      created_by: { type: DataTypes.INTEGER },
      attendees: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
    },
    {
      timestamps: false,
    }
  );

  Trip.image_id = Trip.belongsTo(sequelize.models.image, {
    foreignKey: 'image_id',
    targetKey: 'image_id',
  });

  Trip.findByUser = function(userId) {
    return this.findAll({
      where: {
        attendees: {
          $contains: [userId],
        },
      },
      include: [
        {
          model: sequelize.models.image,
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
      const attendees = await sequelize.models.user.findAll({
        attributes: ['profile_id', 'first_name', 'last_name', 'image_id'],
        where: {
          profile_id: {
            $in: this.attendees,
          },
        },
        include: [
          {
            model: sequelize.models.image,
            attributes: ['secure_url'],
          },
        ],
      });
      return attendees;
    } catch (e) {
      console.log(e);
    }
  };

  Trip.prototype.getListOfAccommodations = async function() {
    try {
      const accommodations = await sequelize.models.accommodation.findAll({
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
      });
      return accommodations;
    } catch (e) {
      console.log(e);
    }
  };

  Trip.prototype.listAccommodationsWithGroups = async function() {
    try {
      const accommodationGroups = await sequelize.models.accommodation_group.findAll({
        where: {
          trip_id: this.trip_id,
        },
        include: [
          {
            model: sequelize.models.accommodation,
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
                model: sequelize.models.place,
                include: [{ model: sequelize.models.image, attributes: ['secure_url'] }],
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

  Trip.prototype.getListOfAccommodationPlaces = async function() {
    try {
      return await sequelize.models.accommodation
        .findAll({
          attributes: ['place_id'],
          where: {
            trip_id: this.trip_id,
          },
        })
        .map(place => {
          return place.place_id;
        });
    } catch (e) {
      return e;
    }
  };

  Trip.prototype.getListOfAccommodationGroups = async function() {
    try {
      return await sequelize.models.accommodation_group.findAll({
        where: { trip_id: this.trip_id },
        include: [
          {
            model: sequelize.models.accommodation,
            attributes: ['accommodation_id', 'status'],
          },
        ],
      });
    } catch (e) {
      return e;
    }
  };

  Trip.prototype.getListOfFlightGroups = async function() {
    try {
      return await sequelize.models.flight_group.findAll({
        where: { trip_id: this.trip_id },
        include: [
          { model: sequelize.models.flight, attributes: ['flight_id', 'status'] },
        ],
      });
    } catch (e) {
      return e;
    }
  };

  Trip.prototype.getListOfFlights = async function() {
    try {
      return await sequelize.models.flight.findAll({
        where: { trip_id: this.trip_id },
        include: [
          {
            model: sequelize.models.flight_leg,
            include: [
              {
                model: sequelize.models.operator,
                include: [{ model: sequelize.models.image, attributes: ['secure_url'] }],
              },
            ],
            order: [['departure_time', 'ASC']],
          },
        ],
      });
    } catch (e) {
      return e;
    }
  };

  Trip.prototype.getListOfFlightPlaces = async function() {
    try {
      return await sequelize
        .query(
          'SELECT "flight_legs"."departure_place_id" AS "departure_place_id", "flight_legs"."arrival_place_id" AS "arrival_place_id" FROM "flights" AS "flight" LEFT OUTER JOIN "flight_legs" AS "flight_legs" ON "flight"."flight_id" = "flight_legs"."flight_id" WHERE "flight"."trip_id" = ?;',
          {
            type: sequelize.QueryTypes.SELECT,
            replacements: [this.trip_id],
          }
        )
        .map(row => [row.departure_place_id, row.arrival_place_id]);
    } catch (e) {
      return e;
    }
  };

  Trip.prototype.getListOfTrainGroups = async function() {
    try {
      return await sequelize.models.train_group.findAll({
        where: { trip_id: this.trip_id },
        include: [{ model: sequelize.models.train, attributes: ['train_id', 'status'] }],
      });
    } catch (e) {
      return e;
    }
  };

  Trip.prototype.getListOfTrains = async function() {
    try {
      return await sequelize.models.train.findAll({
        where: { trip_id: this.trip_id },
        include: [
          {
            model: sequelize.models.train_leg,
            include: [
              {
                model: sequelize.models.operator,
                include: [{ model: sequelize.models.image, attributes: ['secure_url'] }],
              },
            ],
            order: [['departure_time', 'ASC']],
          },
        ],
      });
    } catch (e) {
      return e;
    }
  };

  Trip.prototype.getListOfTrainPlaces = async function() {
    try {
      return await sequelize
        .query(
          'SELECT "train_legs"."departure_place_id" AS "departure_place_id", "train_legs"."arrival_place_id" AS "arrival_place_id" FROM "trains" AS "train" LEFT OUTER JOIN "train_legs" ON "train"."train_id" = "train_legs"."train_id" WHERE "train"."trip_id" = ?;',
          {
            type: sequelize.QueryTypes.SELECT,
            replacements: [this.trip_id],
          }
        )
        .map(row => [row.departure_place_id, row.arrival_place_id]);
    } catch (e) {
      return e;
    }
  };

  Trip.prototype.getListOfDocumentGroups = async function() {
    try {
      return await sequelize.models.document_group.findAll({
        where: { trip_id: this.trip_id },
        include: { model: sequelize.models.document },
      });
    } catch (e) {
      return e.message;
    }
  };

  return Trip;
};
