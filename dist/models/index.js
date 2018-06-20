require('./../config/config');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
let db = {};
let shouldLogToConsole = () => {
    if (process.env.NODE_ENV === 'test') {
        return false;
    }
    else {
        return true;
    }
};
const sequelize = new Sequelize(process.env.PG_DB_URI, {
    dialect: 'postgres',
    logging: shouldLogToConsole(),
    dialectOptions: {
        ssl: true,
    },
});
fs
    .readdirSync(__dirname)
    .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
})
    .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
});
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
