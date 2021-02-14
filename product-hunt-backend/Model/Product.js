const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const productSchema = new Schema ({
    title:{type:String},
    slug:{type:String,slug:'title'},
    description:{type:String},
    body:{type:String},
    author:{type: Schema.Types.ObjectId, ref:"User",required:true},
    upvotes:{type:Number,default:0},
    interestsToHackathon:[{type:Schema.Types.ObjectId,ref:'User'}],
    comments:[{type:Schema.Types.ObjectId,ref:'Comment'}],
    images:[{type:String}],
    tagList:[{type:String}],
    comment: [{type:Schema.Types.ObjectId, ref:"Comment"}],
    acceptedUsers:[{type:Schema.Types.ObjectId,ref:'User'}]
},{timestamps:true})


module.exports = mongoose.model("Product",productSchema);


