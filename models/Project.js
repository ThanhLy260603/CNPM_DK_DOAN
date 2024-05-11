const mongoose = require('mongoose');
module.exports = mongoose.model('projects', new mongoose.Schema({
    name: String, // sử dụng làm username 
    teacher: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'teachers' 
    },
    note: String,
    deadline: String, 
    student: {// chứa danh sách được duyệt.
        type: mongoose.Schema.Types.ObjectId, ref: 'students' 
    }, 
    approvalStudents: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'students' 
    }]
}))
