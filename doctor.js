// Importing dependencies
const express = require('express');
const db = require('./db');  // Database connection
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the doctor route');
});

// checkAdminAuth.js
const checkAdminAuth = (req, res, next) => {
    // Example: Check if the user has admin privileges
    if (req.user && req.user.isAdmin) { // Modify as needed
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admins only' });
    }
};


// Admin adds a new doctor
router.post('/add', checkAdminAuth, async (req, res) => {
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;

    try {
        await pool.query(
            'INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, specialization, email, phone, JSON.stringify(schedule)]
        );
        res.status(201).send({ message: 'Doctor added successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error adding doctor' });
    }
});

// Get all doctors
router.get('/doctor', async (req, res) => {
    try {
        const [doctors] = await pool.query('SELECT id, first_name, last_name, specialization, email, phone, schedule FROM doctors');
        res.send(doctors);
    } catch (err) {
        res.status(500).send({ error: 'Error fetching doctors' });
    }
});

// Update doctor profile
router.put('/update/:id', checkAdminAuth, async (req, res) => {
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;
    const doctor_id = req.params.id; 

    try {
        await pool.query(
            'UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, email = ?, phone = ?, schedule = ? WHERE id = ?',
            [first_name, last_name, specialization, email, phone, JSON.stringify(schedule), doctor_id]
        );
        res.send({ message: 'Doctor profile updated successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error updating doctor profile' });
    }
});

// Delete doctor profile
router.delete('/delete/:id', checkAdminAuth, async (req, res) => {
    const doctor_id = req.params.id; // Get doctor ID from request parameters

    try {
        await pool.query('DELETE FROM doctors WHERE id = ?', [doctor_id]);
        res.send({ message: 'Doctor profile deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error deleting doctor profile' });
    }
});

module.exports = router;