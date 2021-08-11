var express = require("express");
const adminHelpers = require("../helpers/admin-helpers");
const employerHelper = require("../helpers/employer-helper");
var fs = require("fs");
var router = express.Router();

const verifyLogIn = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

/* GET users listing. */
router.get("/", function (req, res, next) {
  let admin = req.session.admin;
  if (admin) {
    res.render("admin/home", { adminH: true });
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/employers", verifyLogIn, (req, res) => {
  adminHelpers.getAllEmployers().then((allEmployers) => {
    res.render("admin/employers", { adminH: true, allEmployers });
  });
});

router.get("/users", verifyLogIn, (req, res) => {
  adminHelpers.getAllUsers().then((allUsers)=>{
    res.render("admin/users", { adminH: true ,allUsers});
  })
});

router.get("/login", (req, res) => {
  if (req.session.admin) {
    res.redirect("/admin");
  } else {
    res.render("admin/login", { msg: req.session.adminLogginErr });
    req.session.adminLogginErr = false;
  }
});
router.post("/login", (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.admin = response.admin;
      res.redirect("/admin");
    } else {
      req.session.adminLogginErr = response.Errmsg;
      res.redirect("/admin/login");
    }
  });
});

router.get("/logout", (req, res) => {
  delete req.session.admin;
  res.redirect("/admin");
});

router.get("/settings", verifyLogIn, (req, res) => {
  res.render("admin/settings", { adminH: true });
});

router.get("/view-jobs", verifyLogIn, (req, res) => {
  employerId = req.query.id;
  employerHelper.getEmployersJobs(employerId).then((employerJobs) => {
    res.render("admin/view-job", { adminH: true, employerJobs, employerId });
  });
});
router.get("/delete-job", verifyLogIn, (req, res) => {
  id = req.query.id;
  employerId = req.query.employerId;
  employerHelper.deleteJob(id).then(() => {
    fs.unlink("./public/uploads/job-images/" + id + ".jpg", function (err) {
      if (err) console.log("Image delete error", err);
      res.redirect(`/admin/view-jobs?id=${employerId}`);
      console.log("Image deleted successfully");
    });
  });
});
module.exports = router;
