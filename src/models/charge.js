module.exports = (sequelize, DataTypes) => {
  const Charge = sequelize.define(
    'charge',
    {
      charge_id: {
        type: DataTypes.INTEGER,
        field: 'charges_id',
        primaryKey: true,
        autoIncrement: true,
      },
      trip_id: { type: DataTypes.INTEGER },
      type: { type: DataTypes.STRING },
      charge_date: { type: DataTypes.DATE },
      due_date: { type: DataTypes.DATE },
      product_name: { type: DataTypes.STRING },
      subtotal: { type: DataTypes.NUMERIC(8, 2) },
      taxes: { type: DataTypes.NUMERIC(8, 2) },
      total: { type: DataTypes.NUMERIC(8, 2) },
      commissionable_total: { type: DataTypes.NUMERIC(8, 2) },
      commission_percentage: { type: DataTypes.NUMERIC(5, 2) },
      commission_paid: { type: DataTypes.BOOLEAN },
      commission_paid_date: { type: DataTypes.DATE },
      payment_status: { type: DataTypes.STRING },
      client_paid: { type: DataTypes.BOOLEAN },
      client_paid_date: { type: DataTypes.DATE },
      paid_by: { type: DataTypes.INTEGER },
      payment_method: { type: DataTypes.STRING },
      reference: { type: DataTypes.STRING },
      notes: { type: DataTypes.STRING },
      vendor_id: { type: DataTypes.INTEGER },
      vendor_paid: { type: DataTypes.BOOLEAN },
      vendor_paid_date: { type: DataTypes.DATE },
      created: { type: DataTypes.TIME },
      created_by: { type: DataTypes.INTEGER },
    },
    {
      timestamps: false,
    }
  );

  Charge.associate = function(models) {
    Charge.hasOne(models.vendor, { foreignKey: 'vendor_id' });
  };

  return Charge;
};
