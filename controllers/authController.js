
const Teacher = require('../models/Teacher')
const Student = require('../models/Student')

//xử lý yêu cầu đăng nhập
exports.login = async function(req, res) {
    const username = req.body.username
    const password = req.body.password
    const isTeacher = req.body.isTeacher

    if (isTeacher == 'on') { 
        const teacher = await Teacher.findOne({ 
            maGV: username, 
            password: password 
        })
        if (teacher) {
            req.session.teacher = teacher
            res.redirect('/teachers')
        }
        else { 
            res.redirect('login?error=invalid')
        }

    }
    else {
        
        const student = await Student.findOne({
            maSV: username, 
            password
        })

        if (student) {
            req.session.student = student
            res.redirect('/students')
        }
        else {
            res.redirect('login?error=invalid')
        }
    }    
}


//xử lý hiển thị trang đăng nhập
exports.getLogin = async function(req, res) {
    const error = req.query.error // check xem có error không. 
    if (error == 'invalid') { 
        res.render('login', {error: 'invalid login!'})
    }
    else { 
        res.render('login')
    }
}

//xử lý yêu cầu đăng ký giáo viên mới
exports.register = async function(req, res) { 
    // const username = req.body.username
    // const password = req.body.password

    const newTeacher = new Teacher({
        maGV: 'GV001',
        password: '123',
        firstName: 'Alice',
        lastName: 'Smith',
        gender: 'Female',
        dateOfBirth: '1985-05-10',
        classIds: [] 
    })
    try { 
        const result = await newTeacher.save()  
        res.json(result)
    }
    catch(error) {
        res.json(error)
    }
  

}