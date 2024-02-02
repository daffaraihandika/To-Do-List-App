import express from "express";
import { register, login } from "../controllers/UserController.js";
import { createTask, getAllTasks, deleteTask, updateTask, getDetailTask, getTasksByDateRange, filterTaskByPriority, getCompleteTask, getIncompleteTask, completeTask } from "../controllers/TaskController.js";
import { createTag, getAllTags, getDetailTags, updateTags, deleteTags } from "../controllers/TagController.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.send('tess')
});

// User
router.post('/register', register)
router.post('/login', login)

// Task
router.post('/task', createTask)
router.get('/tasks/:userId', getAllTasks)
router.delete('/task/:userId/:taskId', deleteTask)
router.patch('/task/:userId/:taskId', updateTask)
router.patch('/complete-task/:userId/:taskId', completeTask)
router.get('/tasks/:userId/filter-by-date', getTasksByDateRange)
router.get('/tasks/:userId/filter-by-priority', filterTaskByPriority)
router.get('/tasks/:userId/completed', getCompleteTask);
router.get('/tasks/:userId/incomplete', getIncompleteTask);
router.get('/tasks/:userId/:taskId', getDetailTask)

// Tag
router.post('/tag', createTag)
router.get('/tags/:userId', getAllTags)
router.get('/tag/:userId/:tagsId', getDetailTags)
router.patch('/tag/:userId/:tagsId', updateTags)
router.delete('/tag/:userId/:tagsId', deleteTags)

export default router;