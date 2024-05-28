const express = require('express')
const router = express.Router()
const studentController = require('../controllers/studentController')

router.get('/', studentController.getStudents)
router.get('/projects', studentController.getRegisterProject)
router.post('/projects', studentController.registerProject)
module.exports = router

