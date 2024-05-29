const Student = require('../models/Student')
const Project = require('../models/Project')
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

//hiển thị thông tin cá nhân của sinh viên
exports.getStudents = async (req, res) => {
    if (!checkAuthStudent(req, res)) {
        res.render('unauthorized')
        return 
    }
    res.render('student/profile', {student: req.session.student})

}
//hiển thị trang để sinh viên đăng ký các dự án
exports.getRegisterProject = async (req, res) => {
    if (!checkAuthStudent(req, res)) {
        res.render('unauthorized')
        return 
    }

    const student = req.session.student
    const idStudent = student._id
    

    const projectApproal = await Project.findOne({
            student: idStudent // + tìm kiếm
        }).populate('student').populate('teacher').exec()
    
        
    

    // đề tài đã được duyệt ( có student )
    const projectsApproached = await Project.find({ student: { $ne: null }})
        .populate('student') // lấy ra thông tin của sinh viên được duyệt
        .populate('teacher')
        .exec()

    // đề tài chưa được đăng ký ( không có student )
    const projectsNotResgiter= await Project.find({
        student: null, 
        approvalStudents: { $nin: [idStudent] }
    })
        .populate('teacher')
        .exec() 

    // lấy ra danh sách đề tài sinh viên đăng ký
    const projectsResgiter= await Project.find({
        student: null,
        approvalStudents: idStudent
    })
        .populate('teacher')
        .exec()
    
    
    // tiếp theo kiểm tra xem sinh viên này đã được duyệt đề tài hay chưa. nếu được duyệt rồi -> không cho đăng ký. 


    if (projectApproal) { 
        for (let i = 0; i < projectsNotResgiter.length; i++) {
            projectsNotResgiter[i].isApproached = true 
        } 
    }




    res.render('student/registerProject', {projectApproal, projectsApproached, projectsNotResgiter, projectsResgiter})
}
//xử lý việc đăng ký dự án cho sinh viên
exports.registerProject = async (req, res) => {
    if (!checkAuthStudent(req, res)) {
        res.render('unauthorized')
        return 
    } 

    const idProject = req.body.idProject    
    const project = await Project.findById(idProject).populate('student')
    const student = req.session.student
    project.approvalStudents.push(student._id)  
    await project.save()
    res.redirect('/students/projects') // chuyển người dùng về lại giao diện đăng ký
}
//hiển thị trang để sinh viên thay đổi mật khẩu
exports.getChangePassword = async(req, res) => {
    if (!checkAuthStudent(req, res)) {
        res.render('unauthorized')
        return 
    } 
    let message = ""
    if (req.query.error == 'password') {
        message = 'Password và confirm password không giống nhau!'
        console.log(message)
        res.render('student/changePassword', {message})
        return
    }
    else if (req.query.success == 'true') {
        message = 'Thay đổi mật khẩu thành công!'
        res.render('student/changePassword', {message})
        return
    }
//xử lý việc thay đổi mật khẩu của sinh viên
exports.changePassword = async(req, res) => {
    if (!checkAuthStudent(req, res)) {
        res.render('unauthorized')
        return 
    } 
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword    
    if (password != confirmPassword) {
        res.redirect('/students/change-password?error=password')
        return
    }


    const idStudent = req.session.student._id
    const student = await Student.findById(idStudent)
    student.password = password
    await student.save()
    res.redirect('/students/change-password?success=true')
}
    res.render('student/changePassword')
}
