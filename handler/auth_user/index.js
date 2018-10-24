var express = require('express');
var hd = express.Router();
var dao = require('./dao')
var captcha = require("../../utils/captcha")
var verification = require('../../utils/verification').verification
var assert = require('assert');
var crypto = require('crypto');

// 登录页
hd.get('/login', function (req, res, next) {
  res.render('index')
});
hd.get('/blogList', function (req, res, next) {
  res.render('blog-list')
});

// 验证码
hd.get('/captcha', function (req, res, next) {
  captcha.getCode(req, res)
});

// 登录
hd.post('/singIn', function (req, res, next) {
  console.log(req)
  // 查询用户存在获取盐值
  dao.searchUser({
    ...req.body
  }, function (err, vals) {
    if (err) return res.json({ info: '查询错误', status: "1" });
    if (vals == '') {
      res.json({ info: '无该用户', status: "1" });
    } else {
      // 获取盐值验证用户是否正确
      if (crypto.createHash('md5').update(req.body.password + vals[0].salt).digest('hex') == vals[0].password) {
        req.session.user = vals[0];
        res.json({ info: '登陆成功', status: "0" });
      }else{
        res.json({ info: '密码错误', status: "1" });
      }
    }
  })
});

// 注册
hd.post('/register', function (req, res, next) {
  dao.searchUser({
    ...req.body
  }, function (err, vals) {
    if (err) return res.json({ info: '查询错误', status: "1" });
    if (vals == '') {
      dao.addUser({
        ...req.body,
        status: 0,
        // 增加盐值
        salt: new Date().getTime() + req.body.account,
        // 掩盖密码
        password: crypto.createHash('md5').update(req.body.password + (new Date().getTime() + req.body.account)).digest('hex')
      }, function (err, vals) {
        if (err) return res.json({ info: '添加错误', status: "1" });
        res.json({ info: '添加成功', status: "0" })
      })
    } else {
      res.json({ info: '已有该用户', status: "1" });
    }
  })
});

module.exports = {
  default: '/rest',
  hd
};
