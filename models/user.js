var mongoose = require("mongoose");


var userSchema = mongoose.Schema({
    name: {type: String, default: 'nameless'},
    username: String,
    score: {type: Number, default: '0'},
    streak: {type: String, default: 'loading...'},
    image: {type: String, default: 'https://avatars2.githubusercontent.com/u/30613835?v=4'},
    country: {type: String, default: 'gi'},
    certificate: String,
    updated: Date
});


module.exports = mongoose.model("User", userSchema);