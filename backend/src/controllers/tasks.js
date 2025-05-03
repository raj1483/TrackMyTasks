const Task = require('../models/Task');
const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all tasks for a project
// @route   GET /api/v1/projects/:projectId/tasks
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  if (req.params.projectId) {
    const tasks = await Task.find({
      project: req.params.projectId,
      user: req.user.id,
    });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate({
    path: 'project',
    select: 'name description',
  });

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Create new task
// @route   POST /api/v1/projects/:projectId/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  // Add user and project to req.body
  req.body.user = req.user.id;
  req.body.project = req.params.projectId;

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return next(
      new ErrorResponse(`No project with the id of ${req.params.projectId}`, 404)
    );
  }

  // Make sure user is project owner
  if (project.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a task to project ${project._id}`,
        401
      )
    );
  }

  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task,
  });
});

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is task owner
  if (task.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this task`,
        401
      )
    );
  }

  // Set completedAt if status is being updated to 'completed'
  if (req.body.status === 'completed' && task.status !== 'completed') {
    req.body.completedAt = Date.now();
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is task owner
  if (task.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this task`,
        401
      )
    );
  }

  await task.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});