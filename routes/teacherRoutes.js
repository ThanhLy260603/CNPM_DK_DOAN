const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/teacherController')


router.get('/', teacherController.getTeacher) 
router.get('/projects/create', teacherController.getCreateProject)
router.post('/projects/create', teacherController.createProject)
router.get('/projects', teacherController.getProjects)
router.get('/projects/:id', teacherController.getEditProject)
router.post('/projects/:id', teacherController.editProject)
router.get('/projects/approval', teacherController.getApproval)
router.get('/projects/approval/:id', teacherController.getApprovalDetail)
router.post('/projects/approval/:id', teacherController.approvalDetail)

module.exports = router
