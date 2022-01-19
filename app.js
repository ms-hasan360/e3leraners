const express = require('express')
const mongoose = require('mongoose')


//impost middlewaer
const setmiddleware = require('./middleware/middleware')
//import route
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoute')
const Post = require('./models/Post')
const User = require('./models/User')

const flash = require('./utils/Flash')
const middleware = require('./middleware/middleware')

const app = express()

const MONGODB_URL = 'mongodb+srv://aaaaaaaa:aaaaaaaa@cluster0.lj19d.mongodb.net/qwert?retryWrites=true&w=majority'

app.set('view engine', 'ejs')

//using middleware
setmiddleware(app)

// app.use(middleware)

app.use('/auth', authRoutes)
app.use('/post', postRoutes)

app.get('/', async (req, res) => {

    let posts = await Post.find({})
    let users = await User.find({})

    res.render('pages/index',
        {
            title: 'Home page',
            flashMessage: flash.getMessage(req),
            posts: posts,
            error: {},
            users
        })
})

app.use((req, res, next) => {
    let error = new Error('404 Page Not Found')
    error.status = 404
    next(error)

})

app.use((error, req, res, next) => {
    if (error.status == 404) {
        return res.render('pages/error/404', { flashMessage: {} })
    }
    res.render('pages/error/500', { flashMessage: {} })
})


app.get('*', (req, res) => {
    res.render('pages/error/404', { flashMessage: {} })
})





PORT = process.env.PORT || 8080

mongoose.connect(MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected')
        app.listen(PORT, () => {
            console.log(`server is running http://localhost:${PORT}`)
        })
    })
    .catch(e => {
        return console.log(e)
    })
