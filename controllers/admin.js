exports.getWebcam = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('admin/webcam', {
        path: '/webcam',
        pageTitle: 'Take a Pic',
        errorMessage: message
    })
};

exports.postWebcam = (req, res, next) => {
    // const img = req.body.imgscr;
    // console.log(img);

    res.redirect('admin/webcam');
};