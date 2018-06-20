var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (sequelize, DataTypes) => {
    const Accommodation = sequelize.define('accommodation', {
        accommodation_id: {
            field: 'proposed_accommodation_id',
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        trip_id: { type: DataTypes.INTEGER },
        place_id: { type: DataTypes.INTEGER },
        charge_id: { type: DataTypes.INTEGER },
        accommodation_group_id: { type: DataTypes.INTEGER },
        star_rating: { type: DataTypes.FLOAT(2, 1) },
        check_in: { type: DataTypes.DATE },
        check_out: { type: DataTypes.DATE },
        guests: { type: DataTypes.INTEGER },
        rooms: { type: DataTypes.INTEGER },
        beds: { type: DataTypes.INTEGER },
        breakfast_included: { type: DataTypes.BOOLEAN },
        subtotal: { type: DataTypes.DOUBLE },
        taxes: { type: DataTypes.DOUBLE },
        total: { type: DataTypes.DOUBLE },
        commission: { type: DataTypes.DOUBLE },
        commission_pct: { type: DataTypes.DOUBLE },
        status: { type: DataTypes.STRING },
        vendor: { type: DataTypes.STRING },
        booking_ref: { type: DataTypes.STRING },
        notes: { type: DataTypes.STRING },
        created: { type: DataTypes.TIME },
        created_by: { type: DataTypes.INTEGER },
    }, {
        timestamps: false,
        tableName: 'proposed_accommodations',
    });
    Accommodation.associate = function (models) {
        Accommodation.belongsTo(models.place, { foreignKey: 'place_id' });
    };
    Accommodation.prototype.getDetailsForUser = function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accommodations = yield Accommodation.findById(id, {
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
                });
                return accommodations;
            }
            catch (e) {
                console.log(e);
            }
        });
    };
    Accommodation.prototype.markAsSelected = function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield sequelize.models.accommodation_group.findOne({
                    where: { accommodation_group_id: this.accommodation_group_id },
                });
                if (group.status === 'confirmed') {
                    throw Error('ACCOMMODATION_GROUP_CONFIRMED');
                }
                yield Accommodation.update({
                    status: 'proposed',
                }, {
                    where: { accommodation_group_id: group.accommodation_group_id },
                });
                yield Accommodation.update({
                    status: 'selected',
                }, {
                    where: { accommodation_id: this.accommodation_id },
                });
                return yield sequelize.models.accommodation_group.findAll({
                    where: { trip_id: this.trip_id },
                    include: {
                        model: Accommodation,
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
                });
            }
            catch (e) {
                return { error: e.message };
            }
        });
    };
    return Accommodation;
};
