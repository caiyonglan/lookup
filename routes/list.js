var express = require('express');
var router = express.Router();
const cors = require('cors');
let user = require('../util/handle')
const multer = require('multer')



// router.get('/', function(req, res, next) {
//   user.checkedUsers(req, res, next);
// });

router.post('/queryAll', function(req, res, next) {
  user.queryAll(req, res, next);
});

router.post('/add', function(req, res, next) {
  user.add(req,res,next);
});

router.post('/deleteById', function(req, res, next) {
  user.delete(req,res,next);
});

router.post('/upload', multer().single('file'), function(req, res, next) {
  user.upload(req, res, next);
});

module.exports = router;
