const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please enter a name'] //[true,false]
    },
    email:{
        type:String,
        required:[true, 'Please enter a email'],
        unique: [true, 'Duplicate'],
        lowercase:true,
        validate: [isEmail, 'Please enter a valid email address']

    },
    password:{
        type:String,
        required:[true, 'Please enter a password'],
        minlength: [6, 'The password should be at least 6 character long']
    },
}) 
// whenever await is used write async before function
//performing mongoose hook  
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    // console.log('before save',this)
    next()
})

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if (user) {
        const isAuthenticated = await bcrypt.compare(password,user.password);
        if (isAuthenticated) {
            return user;
        }
        throw Error('incorrect pwd');
    } else {
        throw Error('incorrect email')
    }
}

const User = mongoose.model('user',userSchema)
module.exports = User;