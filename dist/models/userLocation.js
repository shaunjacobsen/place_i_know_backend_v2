module.exports = (sequelize, DataTypes) => {
    const UserLocation = sequelize.define('user_location', {
        location_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        type: { type: DataTypes.STRING },
        user_id: { type: DataTypes.INTEGER },
        latitude: { type: DataTypes.DOUBLE },
        longitude: { type: DataTypes.DOUBLE },
        timestamp: { type: DataTypes.TIME },
        arrival_time: { type: DataTypes.TIME },
        departure_time: { type: DataTypes.TIME },
        precision: { type: DataTypes.DOUBLE },
        altitude: { type: DataTypes.DOUBLE },
        heading: { type: DataTypes.DOUBLE },
        geocoded_address: { type: DataTypes.STRING },
    }, {
        timestamps: false,
        tableName: 'locations',
    });
    return UserLocation;
};
