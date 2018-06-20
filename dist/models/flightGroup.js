module.exports = (sequelize, DataTypes) => {
    const FlightGroup = sequelize.define('flight_group', {
        flight_group_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        trip_id: { type: DataTypes.INTEGER },
        title: { type: DataTypes.STRING },
        confirmed: { type: DataTypes.BOOLEAN, default: false },
        sort_index: { type: DataTypes.INTEGER },
        created: { type: DataTypes.TIME },
        created_by: { type: DataTypes.INTEGER },
    }, {
        timestamps: false,
    });
    FlightGroup.associate = function (models) {
        FlightGroup.hasMany(sequelize.models.flight, { foreignKey: 'flight_group_id' });
    };
    return FlightGroup;
};
