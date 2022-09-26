const router = require('express').Router();
const Post = require('../db/Posts-SQL');

router.post('/create', (req, res) => {
    const post = new Post(req.body.title, req.body.content, req.body.author);
    const result = post.create();
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send('Error creating post');
    }
});

router.post('/update-title', (req, res) => {
    const post = new Post(req.body.title, req.body.content, req.body.author);
    const result = post.updateTitle(req.body.newTitle);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send('Error updating title');
    }
});

router.post('/update-content', (req, res) => {
    const post = new Post(req.body.title, req.body.content, req.body.author);
    const result = post.updateContent(req.body.newContent);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send('Error updating content');
    }
});

router.post('/update-author', (req, res) => {
    const post = new Post(req.body.title, req.body.content, req.body.author);
    const result = post.updateAuthor(req.body.newAuthor);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(400).send('Error updating author');
    }
});

module.exports = router;