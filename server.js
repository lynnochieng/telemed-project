// Importing the dependencies
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const db = require('./db');  // Database connection
const myRouter = require('./patient.js');

// Importing patient routes from patient
const patientRoutes = require('./patient');
const doctorRoutes = require('/doctor')
const appointmentRoutes = require('./appointment');

//initializing the express
const app = express();

// Middleware
app.use(bodyParser.json());

// Session
const sessionStore = new MySQLStore({}, db);
app.use(session({
    key: 'session_cookie_name',
    secret: 'your_secret_key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// Define routes
app.use('/patients', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/doctor', appointmentRoutes);


// Creating port
const port = 5500;

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});