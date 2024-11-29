// Importing dependencies
const express = require('express');
const db = require('./db');  // Database connection
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the appointment route');
});

const checkAuth = (req, res, next) => {
    // Example: Check if the user has admin privileges
    if (req.user && req.user.isAdmin) { // Modify as needed
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admins only' });
    }
};


// Book an appointment
router.post('/appointment', checkAuth, async (req, res) => {
    const { doctor_id, appointment_date, appointment_time } = req.body;
    const patient_id = req.session.patientId; // Get patient ID from session

    try {
        await pool.query(
            'INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
            [patient_id, doctor_id, appointment_date, appointment_time, 'scheduled']
        );
        res.send({ message: 'Appointment booked successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error booking appointment' });
    }
});

// Get upcoming appointments for logged-in patient
router.get('/my_appointment', checkAuth, async (req, res) => {
    const patient_id = req.session.patientId; // Get patient ID from session

    try {
        const [appointment] = await pool.query('SELECT * FROM appointments WHERE patient_id = ?', [patient_id]);
        res.send(appointment);
    } catch (err) {
        res.status(500).send({ error: 'Error fetching appointments' });
    }
});

// Reschedule an appointment
router.put('/reschedule/:id', checkAuth, async (req, res) => {
    const appointment_id = req.params.id; // Get appointment ID from request parameters
    const { appointment_date, appointment_time } = req.body;

    try {
        await pool.query( 
            'UPDATE appointment SET appointment_date = ?, appointment_time = ? WHERE id = ?',
            [appointment_date, appointment_time, appointment_id]
        );
        res.send({ message: 'Appointment rescheduled successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error rescheduling appointment' });
    }
});

// Cancel an appointment
router.delete('/cancel/:id', checkAuth, async (req, res) => {
    const appointment_id = req.params.id; // Get appointment ID from request parameters

    try {
        await pool.query('UPDATE appointment SET status = ? WHERE id = ?', ['canceled', appointment_id]);
        res.send({ message: 'Appointment canceled successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Error canceling appointment' });
    }
});

module.exports = router;