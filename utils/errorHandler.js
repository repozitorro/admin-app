module.exports = (res, error) => {
    res.status(500).json({
        success: false,
        message: error.massage ? error.massage : error
    })
}