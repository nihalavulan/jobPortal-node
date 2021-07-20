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
    }
}