const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check if jwt exists & is verified
    if (token) {
        jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        if (token) {
            jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
                if (err) {
                    console.error(err.message);
                    res.locals.user = null;

                    next();
                } else {
                    console.log(decodedToken);

                    let user = await User.findById(decodedToken.id);
                    res.locals.user = user;
                    next();
                }
            })
        } else {
            res.locals.user = null;
            next();
        }
    } catch(err) {
        console.error(err);
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };