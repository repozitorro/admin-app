const express = require('express')
const passport = require('passport')
const router = express.Router()
const controller = require('../controllers/position')

// localhost:5000/api/position/:category
router.get('/:categoryId', passport.authenticate('jwt', {session: false}), controller.getAllCategoryId)
router.post('/', passport.authenticate('jwt', {session: false}), controller.create)
router.patch('/:id', passport.authenticate('jwt', {session: false}), controller.update)
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove)






module.exports = router
