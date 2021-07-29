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
    }
}