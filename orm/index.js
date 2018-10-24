var Sequelize = require('sequelize');
var sequelize = new Sequelize('Share', 'root', 'wangweijun', {
    host: '118.89.64.12',
    dialect: 'mysql'
});
module.exports = sequelize