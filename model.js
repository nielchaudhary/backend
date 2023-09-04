const mongoose = require('mongoose'); // Erase if already required


// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    universityId:{
        type:String,
        required:true,
        unique:true,

    },
    password:{
        type:String,
        required:true,

    },
    token:{
        type:String,
        required:true
    },
    Role : {
        type:String,
        default : "Student"
    }


});




//Export the model
module.exports = mongoose.model('User', userSchema);

