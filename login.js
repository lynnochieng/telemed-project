// routes/patients.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db');  // Database connection
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the patient route');
});

// Patient Registration
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
    await pool.query(
        'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [first_name, last_name, email, hashedPassword, phone, date_of_birth, gender, address]
    );
    res.status(201).send({ message: 'Patient registered successfully' });
    } catch (err) {
    }  
});

// Get all patients (admin only)
router.get('/', async (req, res) => {
    try {
        const [patients] = await pool.query('SELECT id, first_name, last_name, email, phone FROM patients');
        res.send(patients);
    } catch (err) {
        res.status(500).send({ error: 'Error fetching patients' });
    }
});


// Patient Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM patients WHERE email = ?', [email]);

    if (rows.length === 0) {
    return res.status(400).send({ error: 'User not found' });
    }

    const patient = rows[0];
    const isMatch = await bcrypt.compare(password, patient.password_hash);

    if (!isMatch) {
    return res.status(400).send({ error: 'Invalid credentials' });
    }

    req.session.patientId = patient.id;
    res.send({ message: 'Login successful' });
});

const checkAuth = (req, res, next) => {
    // Example logic: Check if user is authenticated
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};


// Update patient profile
router.put('/update', checkAuth, async (req, res) => {
    const { first_name, last_name, phone, address } = req.body;
    const patient_id = req.session.patientId; // Get patient ID from session

    try {
        await pool.query(
            'UPDATE patients SET first_name = ?, last_name = ?, phone = ?, address = ? WHERE id = ?',
            [first_name, last_name, phone, address, patient_id]
        );
        res.send({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error updating profile' });
    }
});

// Delete patient account
router.delete('/delete', checkAuth, async (req, res) => {
    const patient_id = req.session.patientId; // Get patient ID from session

    try {
        await pool.query('DELETE FROM patients WHERE id = ?', [patient_id]);
        req.session.destroy(); // Destroy the session
        res.send({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error deleting account' });
    }
});


module.exports = router;
