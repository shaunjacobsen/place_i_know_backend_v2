module.exports = (sequelize, DataTypes) => {
  const TravelRequest = sequelize.define(
    'travel_request',
    {
      request_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER },
      destinations: { type: DataTypes.STRING },
      traveler_type: { type: DataTypes.STRING },
      num_travelers: { type: DataTypes.INTEGER },
      num_adults: { type: DataTypes.INTEGER },
      num_children: { type: DataTypes.STRING },
      trip_start_date: { type: DataTypes.STRING },
      trip_end_date: { type: DataTypes.STRING },
      duration_of_trip: { type: DataTypes.INTEGER },
      interests: { type: DataTypes.STRING },
      needs_flights: { type: DataTypes.STRING },
      departure_airport: { type: DataTypes.STRING },
      secondary_departure_airport: { type: DataTypes.STRING },
      needs_hotels: { type: DataTypes.STRING },
      star_rating: { type: DataTypes.STRING },
      hotel_budget: { type: DataTypes.INTEGER },
      additional_info: { type: DataTypes.STRING },
      deposit: { type: DataTypes.NUMERIC(7, 2) },
      total_cost: { type: DataTypes.NUMERIC(7, 2) },
      charge_id: { type: DataTypes.INTEGER },
      paid: { type: DataTypes.BOOLEAN },
      paid_at: { type: DataTypes.TIME },
      stripe_charge_id: { type: DataTypes.STRING },
      raw_data: { type: DataTypes.STRING },
      created_at: { type: DataTypes.TIME },
    },
    {
      timestamps: false,
    }
  );

  return TravelRequest;
};
