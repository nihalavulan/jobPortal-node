var express = require('express');
const { ObjectId } = require('mongodb');
const employerHelper = require('../helpers/employer-helper');
var router = express.Router();




var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;

const verifyLogIn = ((req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/employer/login')
  }
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  employer = req.session.employer
  if(employer){
    res.render('employer/home',{employerH:true,employer})
  }else{
    res.redirect('/employer/login')
  }
});


//employer pages
router.get('/jobs',verifyLogIn,(req,res)=>{
  employerHelper.getAllJobs().then((allJobs)=>{
  employer = req.session.employer
  res.render('employer/jobs',{employerH:true,employer,allJobs})
  })
})

router.get('/resume-requests',verifyLogIn,(req,res)=>{
  employer = req.session.employer
  res.render('employer/resume-requests',{employerH:true,employer})
})

router.get('/approved-resumes',verifyLogIn,(req,res)=>{
  employer = req.session.employer
  res.render('employer/approved-resumes',{employerH:true,employer})
})

router.get('/rejected-resumes',verifyLogIn,(req,res)=>{
  employer = req.session.employer
  res.render('employer/rejected-resumes',{employerH:true,employer})
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
  req.session.destroy()
  res.redirect('/employer')
})


//emplyers CRUD
router.get('/add-job',verifyLogIn,(req,res)=>{
  res.render('employer/add-job',{employerH:true,employer})
})
router.post('/add-job',verifyLogIn,(req,res)=>{
  employerId = req.session.employer._id
  jobDetails = {...req.body,employerId,createdAt:today}
  employerHelper.addJob(jobDetails).then((jobId)=>{
    res.redirect('/employer/jobs')
    if(req.files.Image){
      let image = req.files.Image
      image.mv('./public/uploads/job-images/' + jobId + '.jpg')
      console.log("image success");
    }else{
      console.log("image upload error");
    }
  })
})

router.get('/delete-job',(req,res)=>{
  id = req.query.id
  employerHelper.deleteJob(id).then(()=>{
    res.redirect('/employer/jobs')
  })
})

module.exports = router;
