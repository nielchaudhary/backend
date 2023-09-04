    const mongoose = require('mongoose');
    const dbConnect = ()=>{
        try{
            mongoose.connect('mongodb://localhost:27017/University', { useNewUrlParser: true, useUnifiedTopology: true })
            console.log("Database Connected")

        }catch(error){
            console.log("Error connecting database ")
        }


    }

    module.exports = dbConnect;