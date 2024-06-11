const mongoose = require('mongoose')


mongoose.connect("mongodb+srv://amandev200:Yourname%401@cluster0.fzhdktd.mongodb.net/Paytm")

const userSchema =  new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        minLength :3   
    },
    password : {
        type : String,
        required : String,
        minLength : 6
    },
    firstname : {
        type : String,
        required : true,
        trim : true,
        minLength : 3,
    },
    lastname : {
        type : String,
        required : true,
        trim : true,
        maxLength : 30 
    }
});

const User = mongoose.model('User',userSchema);

const AccountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    balance : {
        type : Number,
        required : true,
    }
});

const Account = mongoose.model('Account',AccountSchema);

module.exports = {
    User,
    Account    
}