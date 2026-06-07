import express from 'express';
import { 
    getAllStudents, 
    getStudentById, 
    deleteStudent,
    searchStudents,
    getStudentStats
} from '../controllers/admin.Controller.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const adminRouter = express.Router();


adminRouter.get('/students', authenticateToken, isAdmin, getAllStudents);
adminRouter.get('/students/search', authenticateToken, isAdmin, searchStudents);
adminRouter.get('/students/stats', authenticateToken, isAdmin, getStudentStats);
adminRouter.get('/students/:id', authenticateToken, isAdmin, getStudentById);
adminRouter.delete('/students/:id', authenticateToken, isAdmin, deleteStudent);

export default adminRouter;