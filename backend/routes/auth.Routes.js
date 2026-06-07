import express from 'express';
import { 
    registerStudent, 
    loginStudent, 
    loginAdmin,
    getStudentProfile,
    updateStudentProfile
} from '../controllers/auth.Controller.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerStudent);
router.post('/login/student', loginStudent);
router.post('/login/admin', loginAdmin);

// Protected routes
router.get('/profile', authenticateToken, getStudentProfile);
router.put('/profile', authenticateToken, updateStudentProfile);

export default router;