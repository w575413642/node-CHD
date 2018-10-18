var express = require('express');
var hd = express.Router();
var dao = require('./dao')
var captcha = require("../../utils/captcha")
var verification = require('../../utils/verification').verification
var assert = require('assert');
/* reset */
hd.get('/login', function (req, res, next) {
  res.render('login')
});

// 验证码
hd.get('/captcha', function (req, res, next) {
  captcha.getCode(req, res)
});

// 注册
hd.post('/register', function (req, res, next) {
  dao.searchUser({
    ...req.body
  }, function (err, vals) {
    if (err) return res.json({ info: '查询错误', status: "1" });
    if (vals == '') {
      dao.addUser({
        ...req.body
      }, function (err, vals) {
        if (err) return res.json({ info: '添加错误', status: "1" });
        res.json({ info: '添加错误', status: "1" })
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
