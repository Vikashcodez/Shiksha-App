import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

// Student Registration
export const registerStudent = async (req, res) => {
    try {
        const { full_name, mobile_no, email_id, class: studentClass, school_address, password } = req.body;

        // Validate required fields
        if (!full_name || !mobile_no || !email_id || !studentClass || !school_address || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate mobile number (10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile_no)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid mobile number. Must be 10 digits.'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email_id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Check if student already exists
        const existingStudent = await pool.query(
            'SELECT email_id, mobile_no FROM students WHERE email_id = $1 OR mobile_no = $2',
            [email_id, mobile_no]
        );

        if (existingStudent.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Student with this email or mobile number already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new student
        const result = await pool.query(
            `INSERT INTO students (full_name, mobile_no, email_id, class, school_address, password) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, full_name, email_id, mobile_no, class`,
            [full_name, mobile_no, email_id, studentClass, school_address, hashedPassword]
        );

        // Generate JWT token
        const token = jwt.sign(
            { id: result.rows[0].id, email: email_id, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            token,
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Student Login
export const loginStudent = async (req, res) => {
    try {
        const { email_id, password } = req.body;

        if (!email_id || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find student by email
        const result = await pool.query(
            'SELECT * FROM students WHERE email_id = $1',
            [email_id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const student = result.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, student.password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: student.id, email: student.email_id, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        // Remove password from response
        delete student.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: student
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Admin Login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Check against environment variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { email: email, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );

            return res.status(200).json({
                success: true,
                message: 'Admin login successful',
                token,
                user: {
                    email: email,
                    role: 'admin'
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get Student Profile
export const getStudentProfile = async (req, res) => {
    try {
        const studentId = req.user.id;

        const result = await pool.query(
            'SELECT id, full_name, mobile_no, email_id, class, school_address, created_at FROM students WHERE id = $1',
            [studentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update Student Profile
export const updateStudentProfile = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { full_name, mobile_no, class: studentClass, school_address } = req.body;

        const result = await pool.query(
            `UPDATE students 
             SET full_name = COALESCE($1, full_name),
                 mobile_no = COALESCE($2, mobile_no),
                 class = COALESCE($3, class),
                 school_address = COALESCE($4, school_address),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5
             RETURNING id, full_name, mobile_no, email_id, class, school_address`,
            [full_name, mobile_no, studentClass, school_address, studentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};