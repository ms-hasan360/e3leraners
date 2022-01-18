const express = require('express')
const morgan = require('morgan')
const path = require('path')
const session =require('express-session')
const mongoDBStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')

const { blindUserWithRequest } = require('./authMiddleware')
const setLocals = require('./setLocals')


const MONGODB_URL = 'mongodb+srv://aaaaaaaa:aaaaaaaa@cluster0.lj19d.mongodb.net/qwert?retryWrites=true&w=majority'
const store = new mongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 60 * 60 * 60 * 2
});



const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.static(path.join(__dirname, 'public')),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        store: store
    }),
    blindUserWithRequest(),
    setLocals(),
    flash()
]

module.exports = app => {
    middleware.forEach(m => {
        app.use(m)
    })
}