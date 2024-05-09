const { validationResult, Result } = require('express-validator')
const Post = require('../models/post');

//READ ALL
exports.getPosts = (req, res, next) => {
    Post
        .find()
        .then(posts => {
            if (!posts) {
                const error = new Error('No data found!')
                error.statusCode = 404
                throw error
            }
            res.status(200).json({
                message: "Fetch sucessfully",
                post: posts
            })
        }).catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error)
        })
}

//CREATE
exports.createPost = (req, res, next) => {
    const errors = validationResult(req); //validate input format of the user
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({
                message: "Dear User, you have entered incorret data please check and re-enter",
                errors: errors.array()
            })
    }
    let title = req.body.title;
    let content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        creator: { name: "Rahul Desai" },
    })
    post
        .save()
        .then(result => {
            console.log(result)
            //post method
            res.status(201).json({
                message: "Post created sucessfully",
                post: result
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                err.statusCode = 500
            }
            next(error)
        })

};

//READ BY ID
exports.getPost = (req, res, next) => {
    const title = req.params.title;
    Post
        //.findById(postId)
        .find({ "title": title })
        .then(post => {
            if (!post) {
                const error = new Error("Post not found")
                error.statusCode = 404;
                throw error
            }
            res.status(200).json({
                message: 'Post fetch sucessfully',
                post: post
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
        })
}

//UPDATE
exports.updatePost = (req, res, next) => {
    const title = req.params.title
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const content = req.body.content;
    Post
        .findOne({ "title": title })
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            post.content = content;
            return post.save();
        })
        .then(result => {
            res
                .status(200)
                .json({ message: 'Post updated!', post: result });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

//DELETE
exports.deletePost = (req, res, next) => {
    let title = req.body.title;
    console.log("title", title);
    Post
        .findOneAndDelete({ title: title })
        .then(post => {
            if (!post) {
                const error = new Error("No Data Found");
                error.statusCode = 404;
                throw error;
            }
            console.log(post);
            res.status(200).json({
                message: "Post Deleted Successfully",
            });
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};
