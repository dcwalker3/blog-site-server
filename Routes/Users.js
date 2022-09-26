const router = require('express').Router();

const User = require('../db/User-SQL');
const Token = require('../db/Token-SQL');

router.post('/create', (req, res) => {
    let user = new User(req.body.email, req.body.username, req.body.password);
    const result = user.create();
    if (result !== false) {
        res.status(200).send(result);
    } else {
        res.status(400).send('Error creating user');
    }
});

router.post('/login', (req, res) => {
    let user = new User(req.body.email, req.body.username, req.body.password);
    user.login(user => {
        if (user !== false) {
            res.status(200).send(user);
        } else {
            res.status(400).send('Error logging in');
        }
    });
});

router.post('/reset-password', (req, res) => {
    let user = new User(req.body.email, req.body.username, req.body.password);
    const result = user.resetPassword(req.body.newPassword);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send('Error resetting password');
    }
});

module.exports = router;