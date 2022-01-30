const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

const User = require('../models/User')
const flash = require('../utils/Flash')
const Post = require('../models/Post')
const Profile = require('../models/Profile')
const errorFormatter = require('../utils/validationErrorFormatter')


exports.signupGetController = (req, res, next) => {

    res.render('pages/signup',
        {
            title: 'Create A New Account',
            error: {},
            value: {},
            flashMessage: flash.getMessage(req)
        })
}

exports.signupPostController = async (req, res, next) => {

    let { username, email, password } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check form input field')
        console.log(errors.mapped());
        return res.render('pages/signup', {
            title: 'Create A New Account',
            error: errors.mapped(),
            value: {
                username,
                email
            },
            flashMessage: flash.getMessage(req)
        })
    }
    try {
        let hashedPassword = await bcrypt.hash(password, 11)

        let user = new User({
            username,
            email,
            password: hashedPassword
        })
        await user.save()
        req.flash('success', 'Successfully created new user')
        return res.redirect('/auth/login')
    } catch (e) {
        next(e)

    }
}


exports.loginGetGetController = (req, res, next) => {
    res.render('pages/login',
        {
            title: 'Login Your Account',
            flashMessage: flash.getMessage(req)
        })
}

exports.loginPostGetController = async (req, res, next) => {
    let { email, password } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please provide valid value')
        return res.render('pages/login',
            {
                title: 'Login Your Account',
                error: errors.mapped(),
                flashMessage: flash.getMessage(req)
            })
    }

    try {
        let user = await User.findOne({ email })
        if (!user) {
            req.flash('fail', 'Please provide valid value')
            return res.render('pages/login',
                {
                    title: 'Login Your Account',
                    error: {},
                    flashMessage: flash.getMessage(req)
                })
        }

        let match = await bcrypt.compare(password, user.password)
        if (!match) {
            req.flash('fail', 'Please provide valid value')
            return res.render('pages/login',
                {
                    title: 'Login Your Account',
                    error: {},
                    flashMessage: flash.getMessage(req)
                })
        }

        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(e => {
            if (e) {
                return next(e)
            }
            req.flash('success', 'Login successfully')
            return res.redirect('/')

        })
    } catch (e) {
        next(e)
    }
}

exports.userProfileController = (req, res, next) => {

    res.render('pages/userProfile',
        {
            title: 'Profile',
            flashMessage: flash.getMessage(req),
            error: {}
        })
}


exports.userSettingController = (req, res, next) => {

    res.render('pages/userSetting',
        {
            title: 'Setting',
            flashMessage: flash.getMessage(req),
            error: {}
        })
}

exports.dashboardController = (req, res, next) => {
    res.render('pages/dashboard',
        {
            title: 'Dashboard',
            flashMessage: flash.getMessage(req),
            error: {}
        })
}



exports.adminController = (req, res, next) => {
    res.render('pages/admin',
        {
            title: 'Admin',
            flashMessage: flash.getMessage(req),
            error: {}
        })
}


exports.allPost = async (req, res, next) => {

    try {
        let posts = await Post.find({})
        res.render('pages/allPost',
            {
                title: 'All post',
                flashMessage: flash.getMessage(req),
                error: {},
                posts
            })
    } catch (e) {
        next(e)
    }
}


exports.allUser = async (req, res, next) => {

    let userStatus = req.session

    try {
        let users = await User.find({})

        res.render('pages/allUser',
            {
                title: 'All user',
                flashMessage: flash.getMessage(req),
                error: {},
                users,
                userStatus
            })
    } catch (e) {
        next(e)
    }
}



exports.searchGetController = async (req, res, next) => {
    let term = req.query.term
    try {
        let post = await Post.find({
            $text: {
                $search: term
            }
        })
        res.render('pages/search',
            {
                title: 'Search Result',
                flashMessage: flash.getMessage(req),
                error: {},
                post,
                term
            })

    } catch (e) {
        next(e)
    }
}




exports.singleViewPageController = async (req, res, next) => {
    let { postId } = req.params
    try {
        let post = await Post.findById(postId)
        res.render('pages/singleViewPage',
            {
                title: 'single page view',
                flashMessage: flash.getMessage(req),
                error: {},
                post
            })

    } catch (e) {
        next(e)
    }
}


exports.deleteUserController = async (req, res, next) => {
    let { userId } = req.params
    try {
        let user = await User.findOne({ _id: userId })
        if (!user) {
            let error = new Error('404 Page not Found')
            error.status = 404
            throw error
        }
        await User.findOneAndDelete({ _id: userId })
        await Profile.findOneAndDelete(
            { _id: req.user._id },
            { $pull: { 'auth': userId } }
        )
        res.redirect('/auth/allUser')
    } catch (e) {
        next(e)
    }
}





exports.logoutController = (req, res, next) => {
    req.session.destroy(e => {
        if (e) {
            return next(e)
        }
        return res.redirect('/')
    })
}