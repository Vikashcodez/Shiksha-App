import pool from '../config/database.js';

// Get all students (Admin only)
export const getAllStudents = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, full_name, mobile_no, email_id, class, school_address, created_at FROM students ORDER BY created_at DESC'
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            students: result.rows
        });

    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get single student by ID (Admin only)
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT id, full_name, mobile_no, email_id, class, school_address, created_at FROM students WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            student: result.rows[0]
        });

    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete student (Admin only)
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM students WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });

    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Search students (Admin only)
export const searchStudents = async (req, res) => {
    try {
        const { query } = req.query;
        
        const result = await pool.query(
            `SELECT id, full_name, mobile_no, email_id, class, school_address, created_at 
             FROM students 
             WHERE full_name ILIKE $1 
                OR email_id ILIKE $1 
                OR mobile_no ILIKE $1
             ORDER BY created_at DESC`,
            [`%${query}%`]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            students: result.rows
        });

    } catch (error) {
        console.error('Search students error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get student statistics (Admin only)
export const getStudentStats = async (req, res) => {
    try {
        const totalStudents = await pool.query('SELECT COUNT(*) FROM students');
        const classWise = await pool.query(
            'SELECT class, COUNT(*) as count FROM students GROUP BY class ORDER BY class'
        );
        
        res.status(200).json({
            success: true,
            stats: {
                total: parseInt(totalStudents.rows[0].count),
                classWise: classWise.rows
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};