var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ListRouter = require('./routes/list');
const session = require('express-session');
const cors = require('cors');

var app = express();

// app.use(cors({
//   origin:['http://localhost:3000/api'],
//   methods:['GET','POST'],
// }));
// 全局配置
app.use(cors());

// var corsOptions = {
//   origin: 'http://localhost:8080',
//   optionsSuccessStatus: 200
// }

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './dist')));

app.use(cookieParser('lookup'));
app.use(session({
  secret: 'lookup', //与cookieParser中的一致
  resave: false,
  saveUninitialized: true, // 是否保存未初始化的会话
  cookie : {
    maxAge : 1000 * 60 * 30, // 设置 session 的有效时间，单位毫秒
  },
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/list', ListRouter);

// // 指定的路由可以跨域访问
// app.get('/api/list', cors(corsOptions), function (req, res, next) {
//   res.json({msg: '只有百度可以访问'})
// })

module.exports = app;
