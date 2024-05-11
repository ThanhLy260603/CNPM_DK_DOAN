
const Project = require('../models/Project')
const Teacher = require('../models/Teacher')


//kiểm tra xem giáo viên đã đăng nhập hay chưa
function checkAuthTeacher(req, res) {
    const teacher = req.session.teacher
    if (!teacher) {
        return false
    }
    return true
}

//hiển thị thông tin cá nhân của giáo viên
exports.getTeacher = async (req, res) => {
    
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }
    const teacher = req.session.teacher 
     res.render('teacher/profile', {teacher})
}

//hiển thị trang để giáo viên tạo dự án mới
exports.getCreateProject = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
    }
    else {
        const fullNameTeacher  =req.session.teacher.firstName + " " + req.session.teacher.lastName
        res.render('createProject', {fullNameTeacher})  
    }
}