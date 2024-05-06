const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const session = require('express-session')
const hbs = require('hbs')
const path = require('path')
const partialsPath = path.join(__dirname, '/views/partials')
hbs.registerPartials(partialsPath)


app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    cookie: { maxAge: 3600000  }}))

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
