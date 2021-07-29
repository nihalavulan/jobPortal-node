var express = require('express');
const adminHelpers = require('../helpers/admin-helpers');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    let admin = req.session.admin
  if(admin){
      res.render('admin/home',{adminH:true})
  }else{
      res.redirect('/admin/login')
  }  
});

router.get('/employers',(req,res)=>{
    res.render('admin/employers',{adminH:true})
})

router.get('/users',(req,res)=>{
    res.render('admin/users',{adminH:true})
})

router.get('/login',(req,res)=>{
    if(req.session.admin){
        res.redirect('/admin')
    }else{
        res.render('admin/login',{msg:req.session.logginErr})
        req.session.logginErr=false
    }
})
router.post('/login',(req,res)=>{
        adminHelpers.doLogin(req.body).then((response)=>{
            if(response.status){
                req.session.admin = response.admin
                res.redirect('/admin')
            }else{
                req.session.logginErr = response.Errmsg
                res.redirect('/admin/login')
            }
         })
})

router.get('/logout',(req,res)=>{
    delete req.session.admin
    res.redirect('/admin')
})

router.get('/settings',(req,res)=>{
    res.render('admin/settings',{adminH:true})
})
module.exports = router;
