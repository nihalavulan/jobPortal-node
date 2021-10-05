
const mongoClient = require('mongodb').MongoClient
const state = {
    db:null
}
module.exports.connect = function(done){
    const url = 'mongodb+srv://nihalavulan:N9048133817l@cluster0.6np8u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    const dbname = 'job-portal'

    mongoClient.connect(url,{ useUnifiedTopology: true },(err,data)=>{
        if(err) return done(err)

        state.db = data.db(dbname)
        done()
    })
}

module.exports.get = function(){
    return state.db
}