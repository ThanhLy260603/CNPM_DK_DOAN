
const mongoose = require('mongoose');
module.exports = mongoose.model('students', new mongoose.Schema({
    maSV: String, // sử dụng làm username 
    password: String,
    firstName: String,
    lastName: String,
    gender: String, 
    dateOfBirth: String, 
}))

const mongoose = require('mongoose');
module.exports = mongoose.model('students', new mongoose.Schema({
    maSV: String, // sử dụng làm username 
    password: String,
    firstName: String,
    lastName: String,
    gender: String, 
    dateOfBirth: String, 
}))