const router = require('express').Router()
const signupValidator = require('../validator/signupValidator')

const { isAuthenticated, isUnAuthenticated } = require('../middleware/authMiddleware')



const {
    signupGetController,
    signupPostController,
    loginGetGetController,
    loginPostGetController,
    logoutController,
    userProfileController,
    dashboardController,
    userSettingController,
    allPost,
    allUser,
    singleViewPageController,
    searchGetController,
    adminController,
    deleteUserController
} = require('../controllers/authControllers')
const { findByIdAndDelete } = require('../models/Profile')


router.get('/signup', isUnAuthenticated, signupGetController)
router.post('/signup', signupValidator, signupPostController)
router.get('/login', isUnAuthenticated, loginGetGetController)
router.post('/login', loginPostGetController)
router.get('/userProfile', isAuthenticated, userProfileController)
router.get('/userSetting', isAuthenticated, userSettingController)
router.get('/dashboard', isAuthenticated, dashboardController)
router.get('/singlePage/:postId', singleViewPageController)
router.get('/search', searchGetController)


router.get('/delete/:userId', deleteUserController)


router.get('/admin', adminController)
router.get('/allPost', allPost)
router.get('/allUser', allUser)
router.get('/logout', logoutController)




module.exports = router