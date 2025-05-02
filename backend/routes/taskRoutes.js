const express = require('express');
const router = express.Router();
const { createTask, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:projectId', authMiddleware, createTask);
router.put('/:projectId/:taskId', authMiddleware, updateTask);
router.delete('/:projectId/:taskId', authMiddleware, deleteTask);

module.exports = router;