const mysql = require('mysql');

require('dotenv').config();

const domain = process.env.DB_DOMAIN || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || 'Casci2318!';
const database = process.env.DB_NAME || 'blog_site';

const connection = mysql.createConnection({
    host: domain,
    port: dbPort,
    user: user,
    password: password,
    database: database
});

const conn = connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to database ' + database);
    }
});

function sanitizeInput(input) {
    let sanitizedInput = connection.escape(input);
    return sanitizedInput;
}

module.exports = {
    conn: connection,
    sanitizeInput: sanitizeInput
};

