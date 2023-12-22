import express from "express";
import { register, login } from "../controllers/UserController.js";
import { createTask, getAllTasks, deleteTask, updateTask } from "../controllers/TaskController.js";


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
router.delete('/task/:taskId', deleteTask)
router.patch('/task/:taskId', updateTask)



export default router;