// Teacher.js
const mongoose = require('mongoose');


module.exports = mongoose.model('teachers', new mongoose.Schema({
    maGV: String,  
    password: String,
    firstName: String,
    lastName: String,
    gender: String, 
    dateOfBirth: String,
}))

