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
