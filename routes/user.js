const { Router } = require("express");
var express = require("express");
const employerHelper = require("../helpers/employer-helper");
const userHelper = require("../helpers/user-helper");
var router = express.Router();

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

today = dd + "/" + mm + "/" + yyyy;

const verifyLogIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};


/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.session.user) {
    userHelper.getRandomJobs().then((randomJobs) => {
      res.render("user/home", { userH: true, userF: true, randomJobs });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/find-job", verifyLogIn, (req, res) => {
  userHelper.getAllJobs().then((response) => {
    jobCount = response.jobCount;
    allJobs = response.allJobs;
    res.render("user/find-jobs", {
      userH: true,
      userF: true,
      jobCount,
      allJobs,
    });
  });
});

router.get("/about", verifyLogIn, (req, res) => {
  res.render("user/about", { userH: true, userF: true });
});
router.get('/applied-jobs',verifyLogIn,(req,res)=>{
  userHelper.getAppliedJobs(req.session.user._id).then((appliedJobs)=>{
  res.render("user/applied-jobs", { userH: true, userF: true,appliedJobs });
  })
})
router.get("/contact", verifyLogIn, (req, res) => {
  res.render("user/contact", { userH: true, userF: true });
});

router.get("/jobdetails", verifyLogIn, (req, res) => {
  jobId = req.query.id;
  employerHelper.findJob(jobId).then((jobDetails) => {
    res.render("user/jobdetails", { userH: true, userF: true, jobDetails });
  });
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    res.render("/");
  } else {
    res.render("user/login", { msg: req.session.userLogginErrr });
    req.session.userLogginErrr = false;
  }
});

router.post("/login", (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user;
      res.redirect("/");
    } else {
      req.session.userLogginErrr = response.Errmsg;
      res.redirect("/login");
    }
  });
});

router.get("/register", (req, res) => {
  res.render("user/register", { msg: req.session.userLogginErrr });
});

router.post("/register", (req, res) => {
  userHelper.checkUser(req.body.Email).then((response) => {
    if (response.status) {
      userDetails = { ...req.body, createdAt: today };
      userHelper.doRegister(userDetails).then((user) => {
        req.session.user = user;
        res.redirect("/");
      });
    } else {
      req.session.userLogginErrr = response.Errmsg;
      res.redirect("/register");
    }
  });
});

router.get("/logout", (req, res) => {
  delete req.session.user;
  res.redirect("/");
});

router.get("/apply-job", verifyLogIn, (req, res) => {
  userId = req.session.user._id
  employerHelper.findJob(req.query.id).then((jobDetails)=>{
    res.render("user/apply-job", { userH: true, userF: true,jobDetails,userId});
  })
});

router.post('/apply-job',verifyLogIn,(req,res)=>{
  let Image = req.files.Image
  let Resume = req.files.Resume
  let userDetails = {...req.body,appliedOn:today}
  userHelper.addResumeRequest(userDetails).then((id)=>{
    if(Image || Resume){
      Image.mv("./public/uploads/Resume-image/" + id + ".jpg");
      Resume.mv("./public/uploads/Resume-file/" + id + ".pdf");
      console.log("Moved Successfully");
      res.render('user/apply-success',{ userH: true, userF: true })
    }else{
      console.log("Resume Request Upload error");
    }
  })
})
module.exports = router;
