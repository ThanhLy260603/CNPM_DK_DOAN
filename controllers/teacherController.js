const Student = require('../models/Student')
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
//xử lý việc tạo dự án mới
exports.createProject = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
    }
    else {
        await new Project({
            name: req.body.name, 
            note: req.body.note, 
            teacher: req.session.teacher._id, 
            deadline: req.body.time + " " + req.body.date, 
            student: null, 
            approvalStudents: [] // chua co sv nao !.
        }).save()
        res.redirect('/teachers/projects') 
    }
}
//  hiển thị danh sách các dự án
exports.getProjects = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }
    try {
        const projects = await Project.find({})
            .populate('teacher') 
            .populate('student') 
            .exec()
        res.render('projects', {projects}) 
    } catch (err) {
        res.render('error',{message: err.message})
    }
}  

//Hàm này hiển thị trang chỉnh sửa thông tin của một dự án
exports.getEditProject = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }   
    const idProject = req.params.id
    const project = await Project.findById(idProject).populate('teacher').exec()
    // chia cắt chuỗi. 
    let timeDate = project.deadline.split(" ")
    const time = timeDate[0]
    const date = timeDate[1]
    res.render('teacher/editProject', {
        project, time, date
    })

}
//xử lý việc chỉnh sửa thông tin của một dự án
exports.editProject = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }   
    const idProject = req.params.id
    const project = await Project.findById(idProject) 
    project.name = req.body.name 
    project.note = req.body.note 
    project.deadline = req.body.time + " " + req.body.date 
    await project.save()
    res.redirect('/teachers/projects')
} 
//hiển thị danh sách các dự án cần phê duyệt cho giáo viên
exports.getApproval = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }


    const idTeacher = req.session.teacher._id
    const projects = await Project.find({
        teacher: idTeacher, 
        student: { $exists: true, $eq: null }  
    }).populate('approvalStudents').exec()
    res.render('teacher/approvalProject', {projects})
}

    

// hiển thị chi tiết của một dự án cần phê duyệt
exports.getApprovalDetail = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }
    let message = null
    if (req.query.studentApproved == 'true') {
        message = "Sinh viên đã được duyệt đồ án rồi, vui lòng chọn sinh viên khác!"
    }
    const idProject = req.params.id 
    const project = await Project.findById(idProject).populate('approvalStudents').exec()
    res.render('teacher/detailApprovalProject', {project, message})


  
}  
//xử lý việc phê duyệt dự án cho sinh viên
exports.approvalDetail = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }

    const idStudent = req.body.idStudent
    const idProject = req.params.id 


    // trước tiên kiểm tra xem sinh viên đó đã được duyệt trong đồ án nào chưa để khỏi bị nhầm lẫn. 
    // làm sao tìm kiếm => sử dụng findOne

    const project = await Project.findOne({
        student: idStudent
    })
    
    if (project) {
        res.redirect('/teachers/projects/approval/' + idProject + "?studentApproved=true")
        return 
    }

    
    const projectApproval = await Project.findById(idProject).populate('student').exec()    
    projectApproval.student = idStudent
    await projectApproval.save()



    res.redirect('/teachers/projects/approval')   
}
//hiển thị trang để giáo viên tạo sinh viên mới
exports.getCreateStudent = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }

    // lấy ra từ param 
    let message = null 
    if (req.query.coincide == 'student') {
        message = "Trùng mã số sinh viên!"
    }
    else if (req.query.coincide == 'teacher') {
        message = "Trùng mã số giáo viên!"
    }

    else if (req.query.error == 'password') {
        message = "Mật khẩu mà mật khẩu xác nhận không giống nhau!"
    }

    const error = req.query.error
    if (error == 'invalid') res.render('createStudent', {error: 'invalid credentials'})
    else res.render('createStudent', {message})
}
// xử lý việc tạo sinh viên mới
exports.createStudent = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }

    // trước tiên check với lỗi xem có trùng không đã. 
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    if (password != confirmPassword) {
        res.redirect('/teachers/students/create?error=password') 
        return 
    }

    // kiểm tra mã sinh viên.  
    const maSV = req.body.maSV
    // kiểm tra xem có tồn tại mã sinh viên nào không. 
    const student = await Student.findOne({
        maSV // tìm kiêm theo mã sinh viên 
    })
    const teacher = await Teacher.findOne({
        maGV: maSV
    })

    console.log(student + " student")


    if (student != null) { 
        console.log("Vào đây")
        res.redirect('/teachers/students/create?coincide=student') 
        return 
    }
    else if (teacher != null) {
        res.redirect('/teachers/students/create?coincide=teacher') 
        return 
    }

    const newStudent = new Student({ 
        maSV: req.body.maSV,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender, 
        dateOfBirth: req.body.dateOfBirth, 
    })
    await newStudent.save()
    res.redirect('/teachers/students') 
}

// hiển thị danh sách sinh viên
exports.getStudents = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }
    const students = await Student.find({})
    res.render('students', {students: students})    
}
//hiển thị trang chỉnh sửa thông tin của một sinh viên
exports.getEditStudent = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }
    const idStudent = req.params.id
    const student = await Student.findById(idStudent)
    res.render('teacher/editStudent', {student})
}
//xử lý việc chỉnh sửa thông tin của một sinh viên
exports.editStudent = async(req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }
    const idStudent = req.params.id
    const student = await Student.findById(idStudent)
    student.firstName = req.body.firstName 
    student.lastName = req.body.lastName
    student.gender = req.body.gender
    student.dateOfBirth = req.body.dateOfBirth  
    await student.save()
    res.redirect('/teachers/students')
}
//xử lý việc đăng xuất giáo viên
exports.handleLogout = async (req, res) => {
    if (!checkAuthTeacher(req, res)) { 
        res.render('unauthorized')
        return
    }
    req.session.teacher = null 
    res.redirect('/')
}