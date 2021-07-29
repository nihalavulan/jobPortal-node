var express = require('express');
const userHelper = require('../helpers/user-helper');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  userHelper.getRandomJobs().then((randomJobs)=>{
    res.render('user/home',{userH:true,userF:true,randomJobs})
  })
});

module.exports = router;
