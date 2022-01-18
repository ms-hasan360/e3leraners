const { body } = require('express-validator')
const User = require('../models/User')

const signupValidator = [
    body('username')
        .isLength({ min: 2, max: 15 })
        .withMessage('Username Must Be between  2 to 15')
        .custom(async username => {
            let user = await User.findOne({ username })
            if (user) {
                return Promise.reject('Username already used')
            }
        }).trim()
    ,
    body('email')
        .isEmail()
        .withMessage('Please provide a valid Email')
        .custom(async email => {
            let Email = await User.findOne({ email })
            if (Email) {
                return Promise.reject('Email already used')
            }
        }).normalizeEmail()
    ,
    body('password')
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be greater than 4 chars')

]

module.exports = signupValidator