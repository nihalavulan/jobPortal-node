var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('employer/home',{employerH:true})
});

router.get('/jobs',(req,res)=>{
  res.render('employer/jobs',{employerH:true})
})

router.get('/resume-requests',(req,res)=>{
  res.render('employer/resume-requests',{employerH:true})
})

router.get('/approved-resumes',(req,res)=>{
  res.render('employer/approved-resumes',{employerH:true})
})

router.get('/rejected-resumes',(req,res)=>{
  res.render('employer/rejected-resumes',{employerH:true})
})

router.get('/logout',(req,res)=>{
  
})
module.exports = router;
