const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/teacherController')


router.get('/', teacherController.getTeacher) 
router.get('/projects/create', teacherController.getCreateProject)
router.post('/projects/create', teacherController.createProject)
router.get('/projects', teacherController.getProjects)
router.get('/projects/:id', teacherController.getEditProject)
router.post('/projects/:id', teacherController.editProject)
module.exports = router
