var db = require('../config/connection')
var bcrypt = require('bcrypt')
const collection = require('../config/collection')
const { ObjectId, Collection } = require('mongodb')
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
    },
    getAllEmployers:()=>{
        return new Promise(async(resolve,reject)=>{
            let employers =await db.get().collection(collection.EMPLOYER_COLLECTION).find().toArray()
            resolve(employers)
        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users =await db.get().collection(collection.USERS_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    deleteEmployer:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.EMPLOYER_COLLECTION).deleteOne({_id:ObjectId(id)}).then(()=>{
                resolve()
            })
        })
    },
    findEmployer:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.EMPLOYER_COLLECTION).findOne({_id:ObjectId(id)}).then((employer)=>{
                resolve(employer)
            })
        })
    },
    banEmployer:(employerId,employerDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.EMPLOYER_COLLECTION).deleteOne({_id:ObjectId(employerId)}).then(()=>{
                db.get().collection(collection.BANNED_EMPLOYERS).insertOne(employerDetails).then(()=>{
                    resolve()
                })
            })
        })
    },
    getBannedEmployers:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.BANNED_EMPLOYERS).find().toArray().then((banned)=>{
                resolve(banned)
            })
        })
    },
    unbanEmployer:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let employer =await db.get().collection(collection.BANNED_EMPLOYERS).findOne({_id:ObjectId(id)})
            db.get().collection(collection.BANNED_EMPLOYERS).deleteOne({_id:ObjectId(id)}).then(()=>{
                db.get().collection(collection.EMPLOYER_COLLECTION).insertOne(employer).then(()=>{
                    resolve()
                })
            })
        })
    },
    deleteUser:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USERS_COLLECTION).deleteOne({_id:ObjectId(id)}).then(()=>{
                resolve()
            })
        })
    },
    banUser:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let employer =await db.get().collection(collection.USERS_COLLECTION).findOne({_id:ObjectId(id)})
            db.get().collection(collection.USERS_COLLECTION).deleteOne({_id:ObjectId(id)}).then(()=>{
                db.get().collection(collection.BANNED_USERS).insertOne(employer).then(()=>{
                    resolve()
                })
            })
        })
    },
    getBannedUsers:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.BANNED_USERS).find().toArray().then((banned)=>{
                resolve(banned)
            })
        })
    },
    unbanUser:(id)=>{
        return new Promise(async(resolve,reject)=>{
            let user =await db.get().collection(collection.BANNED_USERS).findOne({_id:ObjectId(id)})
            db.get().collection(collection.BANNED_USERS).deleteOne({_id:ObjectId(id)}).then(()=>{
                db.get().collection(collection.USERS_COLLECTION).insertOne(user).then(()=>{
                    resolve()
                })
            })
        })
    }
}