const mongoose  = require('mongoose')

const Schema = mongoose.Schema;

const hackathonSchema = new Schema({
    product:{type:Schema.Types.ObjectId,ref:'Product'},

},{timestamps:true})

const Hackathon = mongoose.model('Hackathon',hackathonSchema)

module.exports = Hackathon