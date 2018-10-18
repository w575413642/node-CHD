var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var sequelize = require('./orm')
var fs = require('fs')
var app = express();
var assert = require("assert");
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var redis = require('redis');
var redisClient = redis.createClient('6379', '127.0.0.1');
var RedisStrore = require('connect-redis')(session);
var _ = require("./config/application")

/**
 * @function path.join - 注入原型html模板
 */

app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

/**
 * @function sequelize - 注入orm/可不用
 */

sequelize.authenticate().then(() => {
}).catch(err => {
});

// 跨域
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Origin", req.headers.origin); //需要显示设置来源
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //带cookies7     res.header("Content-Type", "application/json;charset=utf-8");
  next();
};

_.config.Access ? app.use(allowCrossDomain) : ''

// public静态资源托管
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static('public'))

/**
 * @function session - 注入session
 */

app.use(session({
  ..._.config.session,
  
  store: new RedisStrore({ client: redisClient }),
}));

/**
 * @param element - 轮询注入控制器
 */

fs.readdir(`${__dirname}\\handler`, function (err, file) {
  file.forEach(element => {
    // handler
    app.use(require(`${__dirname}\\handler\\${element}`).default, require(`${__dirname}\\handler\\${element}`).hd);
  });

  // catch 404
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
})

module.exports = app;
