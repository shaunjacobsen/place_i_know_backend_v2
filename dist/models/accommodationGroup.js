module.exports = (sequelize, DataTypes) => {
    const AccommodationGroup = sequelize.define('accommodation_group', {
        accommodation_group_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        trip_id: { type: DataTypes.INTEGER },
        title: { type: DataTypes.STRING },
        status: { type: DataTypes.STRING },
        start_date: { type: DataTypes.DATE },
        end_date: { type: DataTypes.DATE },
        created: { type: DataTypes.TIME },
        created_by: { type: DataTypes.INTEGER },
    }, {
        timestamps: false,
    });
    AccommodationGroup.hasMany(sequelize.models.accommodation, {
        foreignKey: 'accommodation_group_id',
    });
    return AccommodationGroup;
};
