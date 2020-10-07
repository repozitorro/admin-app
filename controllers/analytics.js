const Order = require('../models/Order')
const moment = require('moment')
const errorHandler = require('../utils/errorHandler')


module.exports.overview = async function (req, res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort(1)
        const orderMap = getOrdersMap(allOrders)
        // Вчерашний день заказов
        const yesterdayOrders = orderMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || []
        // Количество заказов вчера
        const yesterdayOrdersNumber = yesterdayOrders.length
        // Количество заказов
        const totalOrdersNumber = allOrders.length
        // Количество дней всего
        const daysNumber = Object.keys(orderMap).length
        // Заказов в день
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0)
        // Процент от количества заказов вчера
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)
        // Общая выручка
        const totalGain = calculatePrice(allOrders)
        // Выручка в день
        const gainPerDay = totalGain / daysNumber
        // Выручка за вчера
        const yesterdayGain = calculatePrice(yesterdayOrders)
        // Процент выручки
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2)
        // Сравнение выручки
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
        // Сравнение количества заказов
        const compareNumbers = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumbers),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.analytics = function (req, res) {
    res.status(200).json({
        analytics: 'from controller'
    })
}

function getOrdersMap(orders = []) {
    const dayOrders = {}
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')
        if (date === moment().format('DD.MM.YYYY')) {
            return
        }

        if (!dayOrders[date]) {
            dayOrders[date] = []
        }
        dayOrders[date].push(order)
    })
    return dayOrders
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const ordersPrice = order.list.reduce((orderTotal, item) => {
            orderTotal += item.cost
        }, 0)
        return total += ordersPrice
    }, 0)
}