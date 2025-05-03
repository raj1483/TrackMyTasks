const Project = require('../models/Project');
const Task = require('../models/Task');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all projects for a user
// @route   GET /api/v1/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Private
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Create new project
// @route   POST /api/v1/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
  // Check if user already has 4 projects
  const projectsCount = await Project.countDocuments({ user: req.user.id });
  if (projectsCount >= 4) {
    return next(
      new ErrorResponse('User can only have up to 4 projects', 400)
    );
  }

  // Add user to req.body
  req.body.user = req.user.id;

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project,
  });
});

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project owner
  if (project.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this project`,
        401
      )
    );
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project owner
  if (project.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this project`,
        401
      )
    );
  }

  // Delete all tasks associated with the project
  await Task.deleteMany({ project: req.params.id });

  await project.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});