const express = require('express')
const router = express.Router()
const studentController = require('../controllers/studentController')

router.get('/', studentController.getStudents)
router.get('/projects', studentController.getRegisterProject)
router.post('/projects', studentController.registerProject)
router.get('/logout', studentController.handleLogout)
router.post('/cancel-registration', studentController.cancelRegistration)
router.get('/change-password', studentController.getChangePassword)
router.post('/change-password', studentController.changePassword)
module.exports = router