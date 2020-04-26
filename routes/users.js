var express = require('express');
var router = express.Router();
const cors = require('cors');
let user = require('../util/handle')


/* post users listing. */
router.post('/login', function(req, res, next) {
  user.login(req, res, next);
});

/* post users listing. */
router.post('/logout', function(req, res, next) {
  user.logout(req, res, next);
});

module.exports = router;
