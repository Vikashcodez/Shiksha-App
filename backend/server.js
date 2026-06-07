import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.Routes.js';
import adminRoutes from './routes/admin.Routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Coaching Centre API is running',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                studentLogin: 'POST /api/auth/login/student',
                adminLogin: 'POST /api/auth/login/admin',
                profile: 'GET /api/auth/profile',
                updateProfile: 'PUT /api/auth/profile'
            },
            admin: {
                getAllStudents: 'GET /api/admin/students',
                searchStudents: 'GET /api/admin/students/search',
                getStudentStats: 'GET /api/admin/students/stats',
                getStudentById: 'GET /api/admin/students/:id',
                deleteStudent: 'DELETE /api/admin/students/:id'
            }
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server only after database connection is verified
import pool from './config/database.js';

const startServer = async () => {
    try {
        // Test database connection
        await pool.query('SELECT 1');
        
        app.listen(PORT, () => {
            console.log(`\n🚀 Server is running on port ${PORT}`);
            console.log(`📱 API URL: http://localhost:${PORT}`);
            console.log('\n✨ Server ready for requests!\n');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();