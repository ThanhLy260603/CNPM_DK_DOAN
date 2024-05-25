const Student = require('../models/Student')
//kiểm tra xem một sinh viên đã đăng nhập chưa
function checkAuthStudent(req, res) {
    const student = req.session.student 
    if (!student) return false 
    return true
}

//hiển thị thông tin cá nhân của sinh viên
exports.getStudents = async (req, res) => {
    if (!checkAuthStudent(req, res)) {
        res.render('unauthorized')
        return 
    }
    res.render('student/profile', {student: req.session.student})

}
