const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token){
        return res.status(401).json({
            message : "unaunthenticated",
            success : false,
        });
    }

    jwt.verify(token, process.env.JWT_SEC, (err, user)=> {
        if(err){
            return res.status(401).json({
                message : "Forbiden",
                success : false,
                err,
            });
        }

        req.user = user;
        next();
    });
}

module.exports = verifyToken;