// Import the dependencies
const mysql = require('mysql2');

// Create the connection
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'@0798277123Vol',
    database:'telemed_db'
})

// Connecting to the database
db.connect((error) => {
    if(error){
        console.log('There was an error connecting to DB', error.stack)
        return;
    }

    console.log('Successfully connected to the DB')
});

// Exporting the connection
exports.modules = db;