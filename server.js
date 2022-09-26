const express = require('express');
const app = express();
const cors = require('cors');

cors.config = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(cors.config));
app.use(express.json());


require('dotenv').config();

// Env Variables
const port = process.env.PORT || 3000;
const appName = process.env.APP_NAME || 'Blog Site Server';

// DB Connection
const conn = require('./db/conn').conn;

// Routes File Imports
const users = require('./Routes/Users');
const posts = require('./Routes/Posts');

// Routes Added to Server Path
app.use("/users", users);
app.use("/posts", posts);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});