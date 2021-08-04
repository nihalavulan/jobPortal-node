var bcrypt = require('bcrypt')
var db = require('../config/connection')
var collection = require('../config/collection')
const { ObjectId } = require('mongodb')

module.exports={
    getRandomJobs:()=>{
        return new Promise(async(resolve,reject)=>{
            let jobs =await db.get().collection(collection.JOBS_COLLECTION).aggregate([{$sample:{size : 4}}]).toArray()
            resolve(jobs)
        })
    },
    getAllJobs:()=>{
        return new Promise(async(resolve,reject)=>{
            let allJobs =await db.get().collection(collection.JOBS_COLLECTION).find().toArray()
            let jobCount = await db.get().collection(collection.JOBS_COLLECTION).countDocuments()
            resolve({jobCount,allJobs})
        })
    },
    doRegister:(userDetails)=>{
        return new Promise(async(resolve,reject)=>{
            userDetails.Password =await bcrypt.hash(userDetails.Password,10)
            db.get().collection(collection.USERS_COLLECTION).insertOne(userDetails).then(({insertedId})=>{
               db.get().collection(collection.USERS_COLLECTION).findOne({_id:ObjectId(insertedId)}).then((user)=>{
                resolve(user)
               })
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let response = {}
            let user =await db.get().collection(collection.USERS_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.user = user
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
    },
    checkUser:(userEmail)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USERS_COLLECTION).findOne({Email:userEmail}).then((res)=>{
                if(!res){
                    resolve({status:true})
                }else{
                    resolve({status:false,Errmsg:"Email already Exist"})
                }
            })
        })
    },
    addResumeRequest:(userDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.RESUME_REQUESTS).insertOne(userDetails).then(({insertedId})=>{
                resolve(insertedId)
            })
        })
    }
}