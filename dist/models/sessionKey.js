module.exports = (sequelize, DataTypes) => {
    const SessionKey = sequelize.define('session_key', {
        session_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        token: { type: DataTypes.STRING },
        created_at: { type: DataTypes.TIME },
        user_id: { type: DataTypes.INTEGER },
        valid: { type: DataTypes.BOOLEAN },
        expires: { type: DataTypes.TIME },
    }, {
        timestamps: false,
    });
    SessionKey.getDetails = function (token) {
        return this.findOne({ where: { token } })
            .then(result => {
            console.log('result', result);
            if (!!result) {
                return Promise.resolve(result);
            }
            return Promise.reject();
        })
            .catch(() => {
            return Promise.reject();
        });
    };
    SessionKey.invalidate = function (token) {
        SessionKey.destroy({ where: { token: token } })
            .then(() => {
            return Promise.resolve();
        })
            .catch(e => {
            return Promise.reject(e);
        });
    };
    return SessionKey;
};
