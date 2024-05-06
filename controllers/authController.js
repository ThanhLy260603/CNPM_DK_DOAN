
//xử lý hiển thị trang đăng nhập
exports.getLogin = async function(req, res) {
    const error = req.query.error // check xem có error không. 
    if (error == 'invalid') { 
        res.render('login', {error: 'invalid login!'})
    }
    else { 
        res.render('login')
    }
}