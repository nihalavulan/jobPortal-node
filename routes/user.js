var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/home',{userH:true,userF:true})
});

module.exports = router;
