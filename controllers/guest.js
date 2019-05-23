exports.getIndex = (req, res, next) => {
    res.render('guest/index', {
        path: '/',
        pageTitle: 'Camagru'
    })
};