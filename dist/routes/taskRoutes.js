"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const Task_1 = __importDefault(require("../models/Task"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = (0, multer_1.default)({ storage });
exports.default = (io) => {
    router.post('/', auth_1.authMiddleware, (0, auth_1.roleMiddleware)(['admin', 'leader']), upload.single('file'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { title, description, assignedTo, projectId } = req.body;
            if (!title || !description || !assignedTo) {
                res.status(400).json({ message: 'Missing required fields' });
                return;
            }
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
                res.status(500).json({ message: 'User ID not found' });
                return;
            }
            const task = new Task_1.default({
                title,
                description,
                assignedTo,
                projectId: projectId || undefined,
                file: (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename,
                progress: 0,
                createdBy: req.user._id,
            });
            yield task.save();
            io.emit('newTask', task); // Sử dụng io từ tham số
            res.status(201).json(task);
        }
        catch (error) {
            const err = error;
            console.error('Error creating task:', err.message);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
        next();
    }));
    router.get('/', auth_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }
            let tasks;
            if (user.role === 'admin') {
                tasks = yield Task_1.default.find().populate('assignedTo createdBy', 'username');
            }
            else if (user.role === 'leader') {
                tasks = yield Task_1.default.find({ createdBy: user._id }).populate('assignedTo createdBy', 'username');
            }
            else {
                tasks = yield Task_1.default.find({ assignedTo: user._id }).populate('assignedTo createdBy', 'username');
            }
            res.json(tasks);
        }
        catch (error) {
            const err = error;
            res.status(500).json({ message: 'Server error', error: err.message });
        }
        next();
    }));
    router.put('/:id/progress', auth_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { progress } = req.body;
            if (progress === undefined || progress < 0 || progress > 100) {
                res.status(400).json({ message: 'Invalid progress value' });
                return;
            }
            const task = yield Task_1.default.findById(req.params.id);
            if (!task || !req.user || task.assignedTo.toString() !== req.user._id) {
                res.status(403).json({ message: 'Unauthorized' });
                return;
            }
            task.progress = progress;
            yield task.save();
            io.emit('taskProgress', task); // Sử dụng io từ tham số
            res.json(task);
        }
        catch (error) {
            const err = error;
            res.status(500).json({ message: 'Server error', error: err.message });
        }
        next();
    }));
    router.delete('/:id', auth_1.authMiddleware, (0, auth_1.roleMiddleware)(['admin', 'leader']), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const task = yield Task_1.default.findById(req.params.id);
            if (!task || !req.user || (req.user.role === 'leader' && task.createdBy.toString() !== req.user._id)) {
                res.status(403).json({ message: 'Unauthorized' });
                return;
            }
            yield task.deleteOne();
            io.emit('taskDeleted', { id: req.params.id }); // Sử dụng io từ tham số
            res.json({ message: 'Task deleted' });
        }
        catch (error) {
            const err = error;
            res.status(500).json({ message: 'Server error', error: err.message });
        }
        next();
    }));
    return router;
};
