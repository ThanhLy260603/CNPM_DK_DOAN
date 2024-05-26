const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/teacherController')


router.get('/', teacherController.getTeacher) 
router.get('/students/create', teacherController.getCreateStudent)
router.post('/students/create', teacherController.createStudent)
router.get('/students', teacherController.getStudents)


// project  
router.get('/projects/create', teacherController.getCreateProject)
router.post('/projects/create', teacherController.createProject)
router.get('/projects', teacherController.getProjects)
router.get('/projects/approval', teacherController.getApproval)
router.get('/logout', teacherController.handleLogout)
router.get('/projects/approval/:id', teacherController.getApprovalDetail)
router.post('/projects/approval/:id', teacherController.approvalDetail)

// edit sinh viên
router.get('/students/:id', teacherController.getEditStudent)
router.post('/students/:id', teacherController.editStudent)
router.get('/projects/:id', teacherController.getEditProject)
router.post('/projects/:id', teacherController.editProject)

module.exports = router
