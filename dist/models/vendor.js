module.exports = (sequelize, DataTypes) => {
    const Vendor = sequelize.define('vendor', {
        vendor_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING },
        dba_name: { type: DataTypes.STRING },
        website: { type: DataTypes.STRING },
        phone: { type: DataTypes.STRING },
        agent_phone: { type: DataTypes.STRING },
        customer_service_phone: { type: DataTypes.STRING },
        address_1: { type: DataTypes.STRING },
        address_2: { type: DataTypes.STRING },
        city: { type: DataTypes.STRING },
        region: { type: DataTypes.STRING },
        postal: { type: DataTypes.STRING },
        country: { type: DataTypes.STRING },
        created: { type: DataTypes.TIME },
        created_by: { type: DataTypes.INTEGER },
    }, {
        timestamps: false,
    });
    return Vendor;
};
