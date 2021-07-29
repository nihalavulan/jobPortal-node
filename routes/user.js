var express = require('express');
const userHelper = require('../helpers/user-helper');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  userHelper.getRandomJobs().then((randomJobs)=>{
    res.render('user/home',{userH:true,userF:true,randomJobs})
  })
});

router.get('/find-job',(req,res)=>{
  userHelper.getAllJobs().then((response)=>{
    jobCount = response.jobCount
    allJobs = response.allJobs
    res.render('user/find-jobs',{userH:true,userF:true,jobCount,allJobs})
  })
})

router.get('/about',(req,res)=>{
  res.render('user/about',{userH:true,userF:true})
})
router.get('/contact',(req,res)=>{
  res.render('user/contact',{userH:true,userF:true})
})


module.exports = router;
