const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('User' , userSchema);
