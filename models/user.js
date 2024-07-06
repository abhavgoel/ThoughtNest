const mongoose =require("mongoose");
const { createHmac, randomBytes} = require("crypto");
const { createTokenForUser } = require("../utils/authentication");

const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    } , 
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    salt : {
        type : String,
    },
    password : {
        type:String,
        required:true
    }, 
    profileImageURL : {
        type:String,
        default : "/images/default.jpg",
    },
    role : {
        type:String,
        enum : ["USER", "ADMIN"],
        default:  "USER",

    }
}, 
{timestamps : true}
);

userSchema.pre("save", function(next){
    const user = this; //here this is the document being referred

    if(!user.isModified("password"))return ; //if the password is not changed , then we dont hash it again, helpful in cases when we want to update the users but not the password again and again

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();

});

userSchema.static("matchPasswordAndGenerateToken",async  function(email,password) {
    const user = await this.findOne({email});

    if(!user) throw new Error("User not found");

    const salt = user.salt;

    const hashedPasswd = user.password;
    const userPasswordToHash = createHmac("sha256", salt).update(password).digest("hex");

    if(hashedPasswd!==userPasswordToHash) throw new Error("Passwords do not match!");

    const token = createTokenForUser(user);
    return token;
});

const User = mongoose.model("user", userSchema);

module.exports = User;