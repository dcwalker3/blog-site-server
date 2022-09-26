const dbConnection = require('../db/conn').conn;
const sanitizeInput = require('../db/conn').sanitizeInput;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/*
    Token Schema:
    {
        id: int,
        user_id: int,
        access_token: string,
        refresh_token: string,
        created_at: timestamp,
        expires_at: timestamp,
        updated_at: timestamp
    }
*/

class Token {
    constructor(userId, token=null) {
        this.userId = sanitizeInput(userId);

        if (token !== null) {
            this.token = sanitizeInput(token);
        } else {
            let tokens = this.create();
            this.token = {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token
            };
        }
    }

    // Function to create a new token
    create() {
        const access_token_secret = process.env.JWT_ACCESS_TOKEN_SECRET;
        const refresh_token_secret = process.env.JWT_REFRESH_TOKEN_SECRET;

        // Create the token
        const access_token = jwt.sign({ user_id: this.userId }, access_token_secret, { expiresIn: '15m' });
        const refresh_token = jwt.sign({ user_id: this.userId }, refresh_token_secret, { expiresIn: '30d' });

        // SQL to insert the token into the database
        const sql = `INSERT INTO tokens (user_id, access_token, refresh_token) VALUES (${this.userId}, ${access_token}, ${refresh_token})`;

        // Insert the token into the database
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
    validate() {
        // Find the token in the database
        const sql = `SELECT * FROM tokens WHERE token = ${this.token}`;
        dbConnection.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                // If the token exists, return the user
                if (result.length > 0) {
                    const token = result[0];
                    return token.user_id;
                } else {
                    return false;
                }
            }
        });
    }
}