module.exports = (sequelize, DataTypes) => {
    const FlightLeg = sequelize.define('flight_leg', {
        flight_leg_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        flight_id: { type: DataTypes.INTEGER },
        flight_no: { type: DataTypes.INTEGER },
        operator_id: { type: DataTypes.INTEGER },
        duration: { type: DataTypes.INTEGER },
        departure_time: { type: DataTypes.TIME },
        arrival_time: { type: DataTypes.TIME },
        departure_airport_code: { type: DataTypes.STRING },
        departure_airport: { type: DataTypes.STRING },
        arrival_airport_code: { type: DataTypes.STRING },
        arrival_airport: { type: DataTypes.STRING },
        departure_place_id: { type: DataTypes.INTEGER },
        arrival_place_id: { type: DataTypes.INTEGER },
        fare_code: { type: DataTypes.STRING },
        fare_class: { type: DataTypes.STRING },
        meal_type: { type: DataTypes.STRING },
        wifi_on_board: { type: DataTypes.STRING },
        first_bag_fee: { type: DataTypes.NUMERIC(7, 2) },
        second_bag_fee: { type: DataTypes.NUMERIC(7, 2) },
        notes: { type: DataTypes.STRING },
        created: { type: DataTypes.TIME },
        created_by: { type: DataTypes.INTEGER },
    }, {
        timestamps: false,
    });
    FlightLeg.associate = function (models) {
        FlightLeg.belongsTo(models.operator, { foreignKey: 'operator_id' });
    };
    return FlightLeg;
};
