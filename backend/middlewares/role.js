const role = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role){
            return res.status(403).json({
                success: failed,
                message: "Access Denied"
            });
        }
        next();
    }
}

module.exports = role;