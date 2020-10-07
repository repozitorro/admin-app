const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
// плагин для тестов в Postman
const bodyParser = require('body-parser')

const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')
const categoryRoutes = require('./routes/category')
const keys = require('./config/keys')
const app = express()

mongoose.connect(keys.mongoURI)
    .then(()=> console.log('MongoDB connected...'))
    .catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use('/uploads', express.static('uploads'))

app.use(require('morgan')('dev')) // показывает что происходит с сервером в данный момент

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(require('cors')())

app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)
app.use('/api/category', categoryRoutes)


module.exports = app