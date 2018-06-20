var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (sequelize, DataTypes) => {
    const Flight = sequelize.define('flight', {
        flight_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        trip_id: { type: DataTypes.INTEGER },
        flight_group_id: { type: DataTypes.INTEGER },
        status: { type: DataTypes.STRING },
        subtotal: { type: DataTypes.NUMERIC(7, 2) },
        taxes: { type: DataTypes.NUMERIC(7, 2) },
        total: { type: DataTypes.NUMERIC(7, 2) },
        charges_id: { type: DataTypes.INTEGER },
        passenger_count: { type: DataTypes.INTEGER },
        vendor: { type: DataTypes.STRING },
        booking_ref: { type: DataTypes.STRING },
        created: { type: DataTypes.TIME },
        created_by: { type: DataTypes.INTEGER },
    }, {
        timestamps: false,
    });
    Flight.associate = function (models) {
        Flight.hasMany(models.flight_leg, { foreignKey: 'flight_id' });
    };
    Flight.prototype.markAsSelected = function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield sequelize.models.flight_group.findOne({
                    where: { flight_group_id: this.flight_group_id },
                });
                if (group.confirmed) {
                    throw Error('FLIGHT_GROUP_CONFIRMED');
                }
                yield Flight.update({
                    status: 'proposed',
                }, {
                    where: { flight_group_id: group.flight_group_id },
                });
                yield Flight.update({
                    status: 'selected',
                }, {
                    where: { flight_id: this.flight_id },
                });
                return yield sequelize.models.flight_group.findAll({
                    where: { trip_id: this.trip_id },
                    include: [{ model: Flight, attributes: ['flight_id', 'status'] }],
                });
            }
            catch (e) {
                return { error: e.message };
            }
        });
    };
    return Flight;
};
