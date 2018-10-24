var pool = require('../../orm/mysql');
module.exports = {
    // 增加用户
    addUser: function (parameter, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(`insert into auth_user (name, account, password, type, salt, qq, weChat, level, status, idCard) VALUES(${pool.escape(parameter.name)},${pool.escape(parameter.account)},${pool.escape(parameter.password)},${pool.escape(parameter.type)},${pool.escape(parameter.salt)},${pool.escape(parameter.qq)},${pool.escape(parameter.weChat)},${pool.escape(parameter.level)},${pool.escape(parameter.status)},${pool.escape(parameter.idCard)}) `, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                });
            }
        });
    },
    // 查询用户
    searchUser: function (parameter, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(`SELECT * FROM auth_user where account = ${pool.escape(parameter.account)}`, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                });
            }
        });
    },
    // 登录
    singIn: function (parameter, callback) {
        pool.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            } else {
                conn.query(``, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                });
            }
        });
    },
}