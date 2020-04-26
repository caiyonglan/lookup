//handel.js
/*
    数据增删改查模块封装
    req.query 解析GET请求中的参数 包含在路由中每个查询字符串参数属性的对象，如果没有则为{}
    req.params 包含映射到指定的路线“参数”属性的对象,如果有route/user/：name，那么“name”属性可作为req.params.name
    req.body通常用来解析POST请求中的数据
     +req.query.id 可以将id转为整数
 */
// 引入mysql
var mysql = require('mysql');
// 引入mysql连接配置
var mysqlconfig = require('./mysql');
// 引入连接池配置
var poolextend = require('./poolextent');
// 引入SQL模块
var sql = require('./sql');
// 引入json模块
var json = require('./json');
// 使用连接池，提升性能
var pool = mysql.createPool(poolextend({}, mysqlconfig));
const crypto = require('crypto');
const csv = require('csv')

var userData = {
    add: function (req, res, next) {
        let users = req.session.user;
        if (!users || users === 'undefined') {
            let result = {
                result: 'nologin'
            }
            json(res, result)
            return 0;
        }
        pool.getConnection(function (err, connection) {
            var param = req.body;
            param.author = users.username
            connection.query(sql.insert, [, param.name, param.answer, param.classname, param.author], function (err, result) {
                if (err) {
                    console.log(err)
                }
                if (result) {
                    result = 'add'
                }
                // 以json形式，把操作结果返回给前台页面
                json(res, result);
                // 释放连接
                connection.release();
            });
        });
    },
    delete: function (req, res, next) {
        let users = req.session.user;
        if (!users || users === 'undefined') {
            let result = {
                result: 'nologin'
            }
            json(res, result)
            return 0;
        }
        pool.getConnection(function (err, connection) {
            let id = req.body.id;
            connection.query(sql.delete, [id], function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result.affectedRows > 0) {
                    result = 'delete';
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            });
        });
    },
    update: function (req, res, next) {
        var param = req.body;
        if (param.name == null || param.age == null || param.id == null) {
            json(res, undefined);
            return;
        }
        pool.getConnection(function (err, connection) {
            connection.query(sql.update, [param.name, param.age, +param.id], function (err, result) {
                if (result.affectedRows > 0) {
                    result = 'update'
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            });
        });
    },
    queryByName: function (req, res, next) {
        let name = req.body.name
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
            }
            let query = sql.queryByName + " WHERE name LIKE '%" + name + "%'"
            connection.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                }
                if (result != '') {
                    var _result = result;
                    result = {
                        result: 'select',
                        data: _result
                    }
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            });
        });
    },
    queryAll: function (req, res, next) {
        let users = req.session.user;
        if (!users || users === 'undefined') {
            let result = {
                result: 'nologin'
            }
            json(res, result)
            return 0;
        }
        let pageIndex = req.body.index || 1;
        let start = (pageIndex - 1) * 5;
        let end = pageIndex * 5;
        let queryCount = 'SELECT COUNT(*) AS id FROM questions';
        let queryArticle = 'SELECT * FROM questions ORDER BY id DESC LIMIT ' + start + ',' + end;
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
            }
            connection.query(queryArticle, function (err, rows, result) {
                let questions = rows;
                connection.query(queryCount, function (err, rows, result) {
                    if (result != '') {
                        let dataCount = rows[0].id
                        result = {
                            result: 'selectall',
                            data: {
                                questions,
                                index: pageIndex,
                                total: dataCount
                            },
                        }
                    } else {
                        result = undefined;
                    }
                    json(res, result);
                    connection.release();
                });
            });
        });
    },
    login: function (req, res, next) {
        let user = req.body.user;
        let password = req.body.password
        let hash = crypto.createHash('md5');
        hash.update(password);
        password = hash.digest('hex');
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(err)
            }
            let query = 'SELECT * FROM admin WHERE username=' + mysql.escape(user) + 'AND password=' + mysql.escape(password);
            connection.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                }
                if (result != '') {
                    var _result = result;
                    result = {
                        result: 'login'
                    }
                    req.session.user = _result[0];
                    req.session.userSign = true;
                    req.session.userId = _result[0].id;
                } else {
                    result = undefined;
                }
                json(res, result);
                connection.release();
            });
        });
    },
    checkedUsers: function (req, res, next) {
        let users = req.session.user;
        if (!users || users === 'undefined') {
            let result = {
                result: 'nologin'
            }
            json(res, result)
        } else {
            json(res, {result: 'login'})
        }
    },
    logout: function (req, res, next) {
        req.session.user = null;
        let result = {
            result: 'logout'
        }
        json(res, result)
    },
    upload: function (req, res, next) {
        let users = req.session.user;
        if (!users || users === 'undefined') {
            let result = {
                result: 'nologin'
            }
            json(res, result)
            return 0;
        }
        if (req.file.length !== 0) {
            let file = req.file
            let buffer = file.buffer
            let str = buffer.toString()
            str = str.split('\r\n')
            let datas = []
            for (let i of str) {
                datas.push(i.split(','))
            }
            let name, answer, classname;
            let count = 0;
            for (let index = 0; index < datas[0].length; index++) {
                if (datas[0][index] === 'name') {
                    name = index;
                    count++;
                    continue;
                } else if (datas[0][index] === 'answer') {
                    answer = index;
                    count++;
                    continue;
                } else if (datas[0][index] === 'classname') {
                    classname = index;
                    count++;
                    continue;
                }
            }
            if (count === 3) {
                pool.getConnection(function (err, connection) {
                    for (let index = 1; index < datas.length; index++) {
                      console.log(datas[index])
                        connection.query(sql.insert, [, datas[index][name], datas[index][answer], datas[index][classname], users.username], function (err, result) {
                            if (err) {
                                console.log(err)
                            }
                        });
                    }
                  connection.release();
                });
              json(res, {
                result: 'upload'
              })
            } else {
              res.json({
                    code: '406',
                    msg: '文件内容错误缺失,建议包含字段 ( name, answer, classname)'
                })
            }
        } else {
          res.json({
                code: '405',
                msg: '文件上传失败'
            })
        }
    }
};
module.exports = userData;
