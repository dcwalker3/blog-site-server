const dbConnection = require('../db/conn').conn;
const sanitizeInput = require('../db/conn').sanitizeInput;

const bcrypt = require('bcrypt');

class User {
    constructor(email, username, password) {
        this.email = sanitizeInput(email);
        this.username = sanitizeInput(username);
        this.password = sanitizeInput(password);
    }

    // Function to create a new user
    create() {
        // Hash the password
        const saltRounds = 15;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(this.password, salt);

        // Insert the user into the database
        const sql = `INSERT INTO users (email, username, password, salt) VALUES (${this.email}, ${this.username}, '${hash}', '${salt}')`;
        dbConnection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                console.log(result);
                return result;
            }
        });    
    }

    // Function to validate a user login
    login() {
        // Find the user in the database
        const sql = `SELECT * FROM users WHERE username = '${this.username}' OR email = '${this.email}'`;
        dbConnection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                // If the user exists, compare the password
                if (result.length > 0) {
                    const user = result[0];
                    const hash = bcrypt.hashSync(this.password, user.salt);
                    if (hash === user.password) {
                        return user;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        });
    }

    // Function to reset a user's password
    resetPassword(newPassword) {
        // Hash the password
        const saltRounds = 15;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(newPassword, salt);

        // Update the user's password in the database
        const sql = `UPDATE users SET password = '${hash}', salt = '${salt}' WHERE username = '${this.username}' OR email = '${this.email}'`;
        dbConnection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                this.password = sanitizeInput(newPassword);
                console.log(result);
                return result;
            }
        });
    }

}

module.exports = User;