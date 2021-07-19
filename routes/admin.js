var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/home',{adminH:true})
});

router.get('/employers',(req,res)=>{
    res.render('admin/employers',{adminH:true})
})

router.get('/users',(req,res)=>{
    res.render('admin/users',{adminH:true})
})

module.exports = router;
