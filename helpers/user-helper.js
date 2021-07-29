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
    }
}