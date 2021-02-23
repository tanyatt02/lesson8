exports.indexPage = (req, res, next) => {
    res.render('indexPage', { title: 'Task App', message: 'Hello, World!' })
}