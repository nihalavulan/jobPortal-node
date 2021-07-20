var bcrypt = require('bcrypt')
var db = require('../config/connection')
var collection = require('../config/collection')
const { ObjectId } = require('mongodb')


module.exports={
    doRegister:(employerData)=>{
        return new Promise(async(resolve,reject)=>{
            employerData.password =await bcrypt.hash(employerData.password,10)
            db.get().collection(collection.EMPLOYER_COLLECTION).insertOne(employerData).then(({insertedId})=>{
               db.get().collection(collection.EMPLOYER_COLLECTION).findOne({_id:ObjectId(insertedId)}).then((employer)=>{
                resolve(employer)
               })
            })
        })
    },
    doLogin:(employerData)=>{
        return new Promise(async(resolve,reject)=>{
            let response = {}
            let employer =await db.get().collection(collection.EMPLOYER_COLLECTION).findOne({email:employerData.email})
            if(employer){
                bcrypt.compare(employerData.password,employer.password).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.employer = employer
                        response.status = true
                        resolve(response)
                    }else{
                        console.log("Incorrect Password");
                        resolve({status:false,Errmsg : "Incorrect Password"})
                    }
                })
            }else{
                console.log("Your account not found");
                resolve({status:false,Errmsg : "Your account not found"})
            }
        })
    }
}