const router = require('express').Router()
const path = require('path')


const postValidator = require('../validator/postValidator')
const { isAuthenticated } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')


const {
    createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    deletePostGetController,
    postsGetcontroller
} = require('../controllers/postController')

router.get('/create', isAuthenticated, createPostGetController)

router.post('/create', isAuthenticated, upload.single('post-thumbnail'), postValidator, createPostPostController)



router.get('/edit/:postId', editPostGetController)
router.post('/edit/:postId', upload.single('post-thumbnail'), postValidator, editPostPostController)
router.get('/delete/:postId', deletePostGetController)
router.get('/post', postsGetcontroller)

module.exports = router