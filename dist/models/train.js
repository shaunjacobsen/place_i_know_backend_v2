var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (sequelize, DataTypes) => {
    const Train = sequelize.define('train', {
        train_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        trip_id: { type: DataTypes.INTEGER },
        train_group_id: { type: DataTypes.INTEGER },
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
    Train.associate = function (models) {
        Train.hasMany(models.train_leg, { foreignKey: 'train_id' });
    };
    Train.prototype.markAsSelected = function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield sequelize.models.train_group.findOne({
                    where: { train_group_id: this.train_group_id },
                });
                if (group.confirmed) {
                    throw Error('TRAIN_GROUP_CONFIRMED');
                }
                yield Train.update({
                    status: 'proposed',
                }, {
                    where: { train_group_id: group.train_group_id },
                });
                yield Train.update({
                    status: 'selected',
                }, {
                    where: { train_id: this.train_id },
                });
                return yield sequelize.models.train_group.findAll({
                    where: { trip_id: this.trip_id },
                    include: [{ model: Train, attributes: ['train_id', 'status'] }],
                });
            }
            catch (e) {
                return { error: e.message };
            }
        });
    };
    return Train;
};
