const mysqls = require('mysql');
var pool = mysqls.createPool({
    host: '118.89.64.12',
    user: 'root',
    password: 'wangweijun',
    database: 'Share'
});
module.exports = pool