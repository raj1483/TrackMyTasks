const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
    const { title, description } = req.body;
    try {
        const task = await Task.create({ title, description, project: req.params.projectId });
        await Project.findByIdAndUpdate(req.params.projectId, { $push: { tasks: task._id } });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.taskId);
        await Project.findByIdAndUpdate(req.params.projectId, { $pull: { tasks: req.params.taskId } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};