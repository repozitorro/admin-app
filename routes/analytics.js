const express = require('express')
const passport = require('passport')
const router = express.Router()
const controller = require('../controllers/analytics')

// localhost:5000/api/analytics/overview
router.get('/overview', passport.authenticate('jwt', {session: false}), controller.overview)

// localhost:5000/api/analytics/analytics
router.get('/analytics', passport.authenticate('jwt', {session: false}), controller.analytics)





module.exports = router