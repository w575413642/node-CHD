var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var sequelize = require('./orm/orm')
var fs = require('fs')
var app = express();
var assert = require("assert");
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var RedisStrore = require('connect-redis')(session);
var _ = require("./config/application");
var log4js = require('log4js');

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

// write Log
log4js.configure({
  appenders: {
    logfile: { type: 'dateFile', filename: 'logs/yapin.log' },
    display: { type: 'console' }
  },
  categories: { default: { appenders: ['logfile', 'display'], level: 'debug' } }
});
var LogFile = log4js.getLogger('/');
// global log

Object.defineProperty(global, "log", {
  get: function () {
    return LogFile
  }
})

// 跨域
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Origin", req.headers.origin); //需要显示设置来源
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //带cookies7     res.header("Content-Type", "application/json;charset=utf-8");
  next();
};

_.Access ? app.use(allowCrossDomain) : ''

// public静态资源托管
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/assets', express.static('public'))

/**
 * @function session - 注入session
 */
// redisClient.hmset("test", { username: '‘kris‘', password: '‘password‘' },function(err){
//   console.log(err)
// })
// redisClient.hgetall("test",function(err, object) {
//   console.log(object)
// })
app.use(session({
  ..._.session,
  store: new RedisStrore({ client: _.redis }),
}));

/**
 * @param element - 轮询注入控制器
 */

fs.readdir(`${__dirname}\\handler`, function (err, file) {
  let timeLock = 0;
  // Malicious access log
  app.use(function (req, res, next) {
    console.log(req.session)
    if (req.session.lastTime) {
      if ((new Date()).getTime() - req.session.lastTime > 1000) {
        timeLock = 0
      } else {
        if (req.session.times < 7) {
          timeLock++
        } else {
          return res.json({ info: '请勿重复访问', status: '1' });
        }
      }
    }
    req.session.lastTime = (new Date()).getTime()
    req.session.times = timeLock
    LogFile.info(`来源：${req.host} - 访问目标：${req.originalUrl} - 参数：${JSON.stringify(req.body)} - 方法：${req.method} - ip：${req.ip} - 请求头：${JSON.stringify(req.headers)} - 瞬间访问次数：${req.session.times} - 访问时间：${req.session.lastTime} - session：${JSON.stringify(req.session)}`);
    next();
  })
  // set handler
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
