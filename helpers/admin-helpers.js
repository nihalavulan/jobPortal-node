var db = require('../config/connection')
var bcrypt = require('bcrypt')
module.exports={
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let response = {}
            let admin =await db.get().collection('admin').findOne({Email:adminData.email})
            if(admin){
                bcrypt.compare(adminData.password,admin.Password).then((status)=>{
                    if(status){
                        console.log("Login success");
                        response.admin=admin
                        response.status = true
                        resolve(response)
                    }else{
                        console.log("Incorrect Password");
                        resolve({status:false,Errmsg : "Incorrect Password"})
                    }
                })
            }else{
                console.log("Admin not Found");
                resolve({status:false,Errmsg : "Admin not Found"})
            }
        })
    }
}