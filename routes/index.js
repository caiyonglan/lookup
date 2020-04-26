var express = require('express');
var router = express.Router();
const cors = require('cors');
let user = require('../util/handle')


/* get home page. */
router.get('/checkLogin', function(req, res, next) {
  user.checkedUsers(req,res,next);
});


/* post home page. */
router.post('/search', function(req, res, next) {
  user.queryByName(req,res,next);
});

module.exports = router;
