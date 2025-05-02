const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
    const { title, description } = req.body;
    try {
        const project = await Project.create({ title, description, user: req.user.id });
        await User.findByIdAndUpdate(req.user.id, { $push: { projects: project._id } });
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};