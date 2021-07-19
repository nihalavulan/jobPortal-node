var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('employer/home',{employer:true})
});

module.exports = router;
