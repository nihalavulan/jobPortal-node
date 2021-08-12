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
    },
    addJob:(jobDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.JOBS_COLLECTION).insertOne(jobDetails).then(({insertedId})=>{
                resolve(insertedId)
            })
        })
    },
    getEmployersJobs:(employerId)=>{
        return new Promise(async(resolve,reject)=>{
           let allJobs =await  db.get().collection(collection.JOBS_COLLECTION).find({employerId:ObjectId(employerId)}).toArray()
           resolve(allJobs)
        })
    },
    deleteJob:(jobId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.JOBS_COLLECTION).deleteOne({_id:ObjectId(jobId)}).then((response)=>{
                resolve()
            })
        })
    },
    findJob:(jobId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.JOBS_COLLECTION).findOne({_id:ObjectId(jobId)}).then((jobDetails)=>{
                resolve(jobDetails)
            })
        })
    },
    editJob:(jobDetails,jobId)=>{
        return new Promise((resolve,reject)=>{
            console.log(">>>",jobId);
            db.get().collection(collection.JOBS_COLLECTION).updateOne({_id:ObjectId(jobId)},{
                $set:{
                    instName:jobDetails.instName,
                    instLoc:jobDetails.instLoc,
                    jobName:jobDetails.jobName,
                    timeSchedule:jobDetails.timeSchedule,
                    skills:jobDetails.skills,
                    qualifications:jobDetails.qualifications,
                    expreq:jobDetails.expreq,
                    lang:jobDetails.lang,
                    pin:jobDetails.pin,
                    description:jobDetails.description,
                }
            }).then((response)=>{
                console.log(response);
                resolve()
            })
        })
    },
    getAllJobRequests:(employerId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.RESUME_REQUESTS).find({employerId:ObjectId(employerId)}).toArray().then((response)=>{
                resolve(response)
            })
        })
    },
    findResume:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.RESUME_REQUESTS).findOne({_id:ObjectId(id)}).then((response)=>{
                resolve(response)
            })
        })
    },
    approveResumeRequest:(resumeId,resumeDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.RESUME_REQUESTS).deleteOne({_id:ObjectId(resumeId)}).then(()=>{
                db.get().collection(collection.APPROVED_REQUESTS).insertOne(resumeDetails)
                resolve()
            })
        })
    },
    getAllApprovedRequests:(employerId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.APPROVED_REQUESTS).find({employerId:ObjectId(employerId)}).toArray().then((response)=>{
                resolve(response)
            })
        })
    },
    rejectResumeRequest:(resumeId,resumeDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.RESUME_REQUESTS).deleteOne({_id:ObjectId(resumeId)}).then(()=>{
                db.get().collection(collection.REJECTED_REQUESTS).insertOne(resumeDetails)
                resolve()
            })
        })
    },
    getAllRejectedRequests:(employerId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.REJECTED_REQUESTS).find({employerId:ObjectId(employerId)}).toArray().then((response)=>{
                resolve(response)
            })
        })
    },
    isEmplyerBanned:(email)=>{
        return new Promise(async(resolve,reject)=>{
            let status =await db.get().collection(collection.BANNED_EMPLOYERS).find({email}).count() > 0
            resolve(status)
        })
    },
    getCount:(employerId)=>{
        let COUNT = {}
        return new Promise(async(resolve,reject)=>{
            let totalJobs =await db.get().collection(collection.JOBS_COLLECTION).find({employerId:ObjectId(employerId)}).count()
            let jobRequests =await db.get().collection(collection.RESUME_REQUESTS).find({employerId:ObjectId(employerId)}).count()
            let approvedRequests =await db.get().collection(collection.APPROVED_REQUESTS).find({employerId:ObjectId(employerId)}).count()
            let rejectedRequests =await db.get().collection(collection.REJECTED_REQUESTS).find({employerId:ObjectId(employerId)}).count()
            let totalResume =await jobRequests+approvedRequests+rejectedRequests
            COUNT.totalJobs =totalJobs
            COUNT.jobRequests =jobRequests
            COUNT.approvedRequests =approvedRequests
            COUNT.rejectedRequests =rejectedRequests
            COUNT.totalResume =totalResume
            resolve(COUNT)
        })
    }
}


