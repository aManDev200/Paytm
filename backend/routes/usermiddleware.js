const {User} = require('../db')
const JWT_SECRET = require('../config')
const jwt = require('jsonwebtoken')

async function validateUserIsThere(req,res,next)
{
    const { username } = req.body;

    try{
        const val = await User.findOne({
            username: username
        });
        if(val)
            {
                res.status(409).json({
                    msg : "The User is Aldready there"
                })
            }
        else
        {
            next();
        }
    }
    catch(e)
    {
        return res.staus(500).json({
            msg : "Please input the correct details"
        })
    }
}

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer '))
        {
            return res.status(403).json({});
        }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token , JWT_SECRET);
        if(decoded.userId)
            {
                req.userId = decoded.userId;
                next();
            }
    }
    catch(e)
    {
        return res.status(403).json({})
    }
}
module.exports = { validateUserIsThere , authMiddleware };