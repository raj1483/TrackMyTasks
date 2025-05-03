const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/tasks');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(protect, getTasks);

router.route('/:id')
  .get(protect, getTask)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/projects/:projectId/tasks')
  .get(protect, getTasks)
  .post(protect, createTask);

module.exports = router;