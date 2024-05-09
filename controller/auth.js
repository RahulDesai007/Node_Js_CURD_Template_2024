const express = require('express')
const { validationResult } = require('express-validator')
const router = express.Router()
const bcrypt = require('bcryptjs'); //for encrypting password
const jwt = require('jsonwebtoken'); // authenticating sesions
const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt
        .hash(password, 12)
        // how many rounds it will take in this case its 12 rounds of computation / encryption
        // max will take more time but it will be secured
        .then(hashedPw => {
            const user = new User({
                email: email,
                password: hashedPw,
                name: name
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({ message: 'User created Sucessfully', userId: result._id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password
    console.log("email", email)
    console.log("password", password)
    User.findOne({ email: email }).then(user => {
        if (!user) {
            let error = new Error('User not found')
            error.statusCode = 404
            throw error
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    }).then(isEqual => {
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
        );

        res.status(200).json({ token: token, userId: loadedUser._id.toString(), message: "Login Sucessfull" });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getUsers = (req, res, next) => {
    User
        .find()
        .then(users => {
            if (!users) {
                const error = new Error('No data found!')
                error.statusCode = 404
                throw error
            }
            res.status(200).json({
                message: "Fetch sucessfully",
                user: users
            })
        }).catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error)
        })
}
