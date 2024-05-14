
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