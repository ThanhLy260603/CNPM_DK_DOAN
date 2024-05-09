const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const session = require('express-session')
const hbs = require('hbs')
const path = require('path')
const partialsPath = path.join(__dirname, '/views/partials')


const Teacher = require('./models/Teacher')



async function connectDB(url) {
    try {
        await mongoose.connect(url)
        const teachers = await Teacher.find({})
        if (teachers.length == 0) { 
            const newTeacher1 = new Teacher({ 
                maGV: 'GV001',  
                password: '123456',
                firstName: 'Nguyễn',
                lastName: 'Bảo Ân',
                gender: 'Nam', 
                dateOfBirth: '07/07/1999',
            })
            await newTeacher1.save()
            const newTeacher2 = new Teacher({ 
                maGV: 'GV002',  
                password: '123456',
                firstName: 'Kim',
                lastName: 'Linh',
                gender: 'Nữ', 
                dateOfBirth: '07/07/1979',
            })
            await newTeacher2.save()
        } 
    }
    catch(err) {
        console.error('Could not connect to MongoDB', err)
    }

}

connectDB('mongodb://127.0.0.1:27017/dkdoan')








app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    cookie: { maxAge: 3600000  }}))

hbs.registerPartials(partialsPath)
app.use(express.static(__dirname + '/views'))
app.set('views', './views')
app.set('view engine', 'hbs')
app.use('/images', express.static(__dirname + '/views/images'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {


    // kiểm tra xem là sinh viên hay giáo viên
    if (req.session.teacher) { 
        let isTeacher = true
        res.render('home', {isTeacher}) 
    }
    else if (req.session.student) {
        let isStudent = true 
        res.render('home', {isStudent})
    }
    else {
        let isNotLogin = true
        res.render('home', {isNotLogin} )
    }
    
})

app.use('/auth', authRoutes)
app.use('/teachers', teacherRoutes)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
