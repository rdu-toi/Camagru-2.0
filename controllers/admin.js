exports.getWebcam = (req, res, next) => {
    res.render('admin/webcam', {
      path: '/webcam',
      pageTitle: 'Take a Pic'
    })
  };