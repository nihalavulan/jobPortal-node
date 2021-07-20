var express = require('express');
const employerHelper = require('../helpers/employer-helper');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  employer = req.session.employer
  if(employer){
    res.render('employer/home',{employerH:true,employer})
  }else{
    res.redirect('/employer/login')
  }
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




//employer login
router.get('/login',(req,res)=>{
  emp = req.session.employer
  if(emp){
    res.redirect('/employer')
  }else{
    res.render('employer/login',{msg:req.session.logginErr})
  }
})
router.post('/login',(req,res)=>{
  employerHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.employer = response.employer
      req.session.loggedIn = true
      res.redirect('/employer')
    }else{
      req.session.logginErr = response.Errmsg
      res.redirect('/employer/login')
    }
  })
})




//employer register
router.get('/register',(req,res)=>{
  emp = req.session.employer
  if(emp){
    res.redirect('/employer')
  }else{
    res.render('employer/register')
  }
})
router.post('/register',(req,res)=>{
  employerHelper.doRegister(req.body).then((employer)=>{
    req.session.employer = employer
    req.session.loggedIn = true
    res.redirect('/employer')
  }) 
})

//employer logout
router.get('/logout',(req,res)=>{
  
})
module.exports = router;
