const express = require('express')

const router = express.Router()

const { body } = require('express-validator')

const feedController = require('../controller/feed')

const isAuth = require('../middleware/is-auth');

//READ_ALL
router.get('/posts', isAuth, feedController.getPosts)

//CREATE
router.post('/post', isAuth, [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })
],
    feedController.createPost)

//READ BY TITLE
router.get('/post/:title', isAuth, feedController.getPost);

//UPDATE
router.put('/updatePost/:title', isAuth,  [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 5 })
],
    feedController.updatePost);

//DELETE
router.delete('/delete', isAuth, feedController.deletePost)

module.exports = router;