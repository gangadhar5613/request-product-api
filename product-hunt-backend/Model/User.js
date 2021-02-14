const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// const bcrypt = require('bcrypt')
const {hash} = require("bcrypt");

const userSchema = new Schema ({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true, match: /@/},
    password:{type:String,required:true},
    bio:{type: String},
    image: {type: String},
    products:[{type:Schema.Types.ObjectId,ref:'Product'}],
    hackathons:[{type:Schema.Types.ObjectId,ref:'Hackathon'}],
},{timestamps:true})


userSchema.pre('save',function (next) {
    if(this.password){
        hash(this.password,12,(err,hash) => {
           if(err) return next();
           this.password = hash;
           next()
       })
    }else{
        next();
    }
})

// userSchema.methods.verifyPassword = async function(password){
//   return  await bcrypt.compare(password,this.password)
// }

module.exports = mongoose.model("User",userSchema);


