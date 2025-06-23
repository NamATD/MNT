import { Router } from 'express';
import { Server } from 'socket.io';
import multer from 'multer';
import Task from '../models/Task';
import { authMiddleware, roleMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

export default (io: Server) => {
  router.post(
    '/',
    authMiddleware,
    roleMiddleware(['admin', 'leader']),
    upload.single('file'),
    async (req: AuthRequest, res, next) => {
      try {
        console.log('Received request body:', req.body); // Debug
        const { title, description, assignedTo, projectId } = req.body;
        if (!title || !description || !assignedTo) {
          console.log('Missing required fields:', { title, description, assignedTo }); // Debug
          res.status(400).json({ message: 'Missing required fields' });
          return;
        }
        if (!req.user?._id) {
          console.log('User ID not found in request'); // Debug
          res.status(500).json({ message: 'User ID not found' });
          return;
        }
        const task = new Task({
          title,
          description,
          assignedTo,
          projectId: projectId || undefined,
          file: req.file?.filename,
          progress: 0,
          createdBy: req.user._id,
        });
        console.log('Task to save:', task); // Debug
        await task.save();
        io.emit('newTask', task);
        res.status(201).json(task);
      } catch (error) {
        const err = error as Error;
        console.error('Error creating task:', err.message); // Debug
        res.status(500).json({ message: 'Server error', error: err.message });
      }
      next();
    }
  );

  router.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      let tasks;
      if (user.role === 'admin') {
        tasks = await Task.find().populate('assignedTo createdBy', 'username');
      } else if (user.role === 'leader') {
        tasks = await Task.find({ createdBy: user._id }).populate('assignedTo createdBy', 'username');
      } else {
        tasks = await Task.find({ assignedTo: user._id }).populate('assignedTo createdBy', 'username');
      }
      res.json(tasks);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: 'Server error', error: err.message });
    }
    next();
  });

  router.put('/:id/progress', authMiddleware, async (req: AuthRequest, res, next) => {
    try {
      const { progress } = req.body;
      if (progress === undefined || progress < 0 || progress > 100) {
        res.status(400).json({ message: 'Invalid progress value' });
        return;
      }
      const task = await Task.findById(req.params.id);
      if (!task || !req.user || task.assignedTo.toString() !== req.user._id) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }
      task.progress = progress;
      await task.save();
      io.emit('taskProgress', task);
      res.json(task);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: 'Server error', error: err.message });
    }
    next();
  });

  router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware(['admin', 'leader']),
    async (req: AuthRequest, res, next) => {
      try {
        const task = await Task.findById(req.params.id);
        if (!task || !req.user || (req.user.role === 'leader' && task.createdBy.toString() !== req.user._id)) {
          res.status(403).json({ message: 'Unauthorized' });
          return;
        }
        await task.deleteOne();
        io.emit('taskDeleted', { id: req.params.id });
        res.json({ message: 'Task deleted' });
      } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: 'Server error', error: err.message });
      }
      next();
    }
  );

  return router;
};