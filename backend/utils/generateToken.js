const jwt = require('jsonwebtoken');
const { cookie } = require('express');

require('dotenv').config();

const generateToken = (res, objId, role) => {
    const token = jwt.sign({objId, role}, process.env.JWT_SEC, {
        expiresIn : '1d',
    });

    res.cookie('jwt', token, {
        httpOnly : true,
        // if you want to use https only cookies set this value as true
        secure: true,
        sameSite:'strict',
        maxAge : 1000*60*60*24,
    });
}

module.exports = generateToken;