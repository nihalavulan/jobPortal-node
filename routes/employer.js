var express = require("express");
const { ObjectId } = require("mongodb");
const employerHelper = require("../helpers/employer-helper");
var router = express.Router();
var fs = require("fs");

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

today = dd + "/" + mm + "/" + yyyy;

const verifyLogIn = (req, res, next) => {
  if (req.session.employer) {
    next();
  } else {
    res.redirect("/employer/login");
  }
};

/* GET users listing. */
router.get("/",async function (req, res, next) {
  employer = req.session.employer;
  if (employer) {
    let Count =await employerHelper.getCount(req.session.employer._id)
    res.render("employer/home", { employerH: true, employer ,Count});
  } else {
    res.redirect("/employer/login");
  }
});

//employer pages
router.get("/jobs", verifyLogIn, (req, res) => {
  employerId = req.session.employer._id;
  employerHelper.getEmployersJobs(employerId).then((allJobs) => {
    employer = req.session.employer;
    res.render("employer/jobs", { employerH: true, employer, allJobs });
  });
});


router.get("/resume-requests", verifyLogIn, (req, res) => {
  employer = req.session.employer;
  employerHelper.getAllJobRequests(employer._id).then((resumeRequests)=>{
    res.render("employer/resume-requests", { employerH: true, employer ,resumeRequests});
  })
});

router.get("/approved-resumes", verifyLogIn, (req, res) => {
  employer = req.session.employer;
  employerHelper.getAllApprovedRequests(employer._id).then((approvedRequests)=>{
    res.render("employer/approved-resumes", { employerH: true, employer,approvedRequests });
  })
});

router.get("/rejected-resumes", verifyLogIn, (req, res) => {
  employer = req.session.employer;
  employerHelper.getAllRejectedRequests(employer._id).then((rejectedRequests)=>{
    res.render("employer/rejected-resumes", { employerH: true, rejectedRequests });
  })
});

//employer login
router.get("/login", (req, res) => {
  emp = req.session.employer;
  if (emp) {
    res.redirect("/employer");
  } else {
    res.render("employer/login", { msg: req.session.empLogginErr });
    req.session.empLogginErr = false;
  }
});
router.post("/login", async(req, res) => {
  let emplyerBanned =await employerHelper.isEmplyerBanned(req.body.email)
  if(emplyerBanned){
    res.render('employer/banned-employer')
  }else{
    employerHelper.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.employer = response.employer;
        res.redirect("/employer");
      } else {
        req.session.empLogginErr = response.Errmsg;
        res.redirect("/employer/login");
      }
    });
  }
});

//employer register
router.get("/register", (req, res) => {
  emp = req.session.employer;
  if (emp) {
    res.redirect("/employer");
  } else {
    res.render("employer/register");
  }
});
router.post("/register", (req, res) => {
  employerDetails = { ...req.body, createdAt: today };
  employerHelper.doRegister(employerDetails).then((employer) => {
    req.session.employer = employer;
    res.redirect("/employer");
  });
});

//employer logout
router.get("/logout", (req, res) => {
  delete req.session.employer;
  res.redirect("/employer");
});

//emplyers CRUD
router.get("/add-job", verifyLogIn, (req, res) => {
  res.render("employer/add-job", { employerH: true, employer });
});
router.post("/add-job", verifyLogIn, (req, res) => {
  employerId = ObjectId(req.session.employer._id)
  jobDetails = { ...req.body, employerId, createdAt: today };
  employerHelper.addJob(jobDetails).then((jobId) => {
    res.redirect("/employer/jobs");
    if (req.files.Image) {
      let image = req.files.Image;
      image.mv("./public/uploads/job-images/" + jobId + ".jpg");
      console.log("image success");
    } else {
      console.log("image upload error");
    }
  });
});

router.get("/delete-job", (req, res) => {
  id = req.query.id;
  employerHelper.deleteJob(id).then(() => {
    fs.unlink("./public/uploads/job-images/" + id + ".jpg", function (err) {
      if (err) console.log("Image delete error", err);
      res.redirect("/employer/jobs");
      console.log("Image deleted successfully");
    });
  });
});

router.get("/edit-job", verifyLogIn, (req, res) => {
  id = req.query.id;
  employerHelper.findJob(id).then((jobDetails) => {
    res.render("employer/edit-job", { jobDetails, employerH: true });
  });
});
router.post("/edit-job", (req, res) => {
  jobId = req.query.id;
  employerHelper.editJob(req.body, jobId).then(() => {
    res.redirect("/employer/jobs");
    if (req.files.Image) {
      let image = req.files.Image;
      image.mv("./public/uploads/job-images/" + jobId + ".jpg");
      console.log("image success");
    } else {
      console.log("image upload error");
    }
  });
});

router.get('/approve-request',verifyLogIn,async(req,res)=>{
  let id=req.query.id
  let resume =await employerHelper.findResume(id)
  employerHelper.approveResumeRequest(id,resume).then(()=>{
    res.redirect('/employer/resume-requests')
  })
})
router.get('/reject-request',verifyLogIn,async(req,res)=>{
  let id=req.query.id
  let resume =await employerHelper.findResume(id)
  employerHelper.rejectResumeRequest(id,resume).then(()=>{
    res.redirect('/employer/resume-requests')
  })
})

module.exports = router;
