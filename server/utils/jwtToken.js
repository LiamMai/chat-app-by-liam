//Create and send token and save in the cookie.

const sendToken = (user, statusCode, res, message) => {

    //Create Jwt token
    const token = user.getJwtToken();

    //Options for cookies
    const options = {
        expires: new Date(Date.now() + process.env.COOKIES_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user,
        message
    })

}

module.exports = sendToken