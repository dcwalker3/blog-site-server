const dbConnection = require('../db/conn').conn;
const sanitizeInput = require('../db/conn').sanitizeInput;

const token = require('../db/Token-SQL');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

class User {
    constructor(email, username, password) {
        this.email = sanitizeInput(email);
        this.username = sanitizeInput(username);
        this.password = sanitizeInput(password);
    }

    generateToken() {
        // Check if the user already has a refresh token
        const sql = `SELECT * FROM tokens WHERE user_id = ${this.user_id}`;
        dbConnection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                if (result.length > 0) {
                    // If the user already has a refresh token, set the token to the existing refresh token
                    this.refresh_token = result[0].refresh_token;
                    this.access_token = jwt.sign({user_id: this.user_id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});

                    // Update the refresh token and accsess token in the database
                    const sql = `UPDATE tokens SET refresh_token = '${this.refresh_token}', access_token = '${this.access_token}' WHERE user_id = ${this.user_id}`;
                    dbConnection.query(sql, (err, result) => {
                        if (err) {
                            console.log(err);
                            return false;
                        }
                    });
                } else {
                    // If the user doesn't have a refresh token, create a new one
                    const access_token_secret = process.env.JWT_ACCESS_TOKEN_SECRET;
                    const refresh_token_secret = process.env.JWT_REFRESH_TOKEN_SECRET;

                    // Create the token
                    const access_token = jwt.sign({ user_id: this.userId }, access_token_secret, { expiresIn: '15m' });
                    const refresh_token = jwt.sign({ user_id: this.userId }, refresh_token_secret, { expiresIn: '30d' });

                    this.access_token = access_token;
                    this.refresh_token = refresh_token;

                    // Save the token to the database
                    const sql = `INSERT INTO jwt (user_id, access_token, refresh_token) VALUES (${this.userId}, ${this.access_token}, ${this.refresh_token})`;
                    dbConnection.query(sql, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(result);
                        }
                    });
                }
            }
        });
    }

    // Function to create a new user
    create(Callback) {
        // Hash the password
        const saltRounds = 15;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(this.password, salt);

        // Insert the user into the database
        const sql = `INSERT INTO users (email, username, password, salt) VALUES (${this.email}, ${this.username}, '${hash}', '${salt}')`;
        dbConnection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                Callback(false);
            } else {
                this.generateToken();
                let results = {
                    user_id: result.id,
                    email: this.email,
                    username: this.username,
                    access_token: this.access_token,
                    refresh_token: this.refresh_token
                };

                Callback(results);
            }
        });    
    }

    // Function to validate a user login
    login(Callback) {
        // Find the user in the database
        const sql = `SELECT * FROM users WHERE email = ${this.email}`;
        dbConnection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                Callback(false);
            } else {
                // If the user exists, compare the password
                if (result.length > 0) {
                    const user = result[0];
                    const hash = bcrypt.hashSync(this.password, user.salt);
                    if (hash === user.password) {
                        this.generateToken();
                        let results = {
                            user_id: user.id,
                            email: user.email,
                            username: user.username,
                            access_token: this.access_token,
                            refresh_token: this.refresh_token
                        };

                        Callback(results);
                    } else {
                        Callback(false);
                    }
                } else {
                    Callback(false);
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