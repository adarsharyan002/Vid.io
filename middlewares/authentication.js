const User=require('../models/User');
const jwt=require('jsonwebtoken');
const {BadRequestError,UnauthenticatedError} = require('../error')

const auth=async (req,res,next)=>{

    //check header

    const authHeader =req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
 throw new UnauthenticatedError('Authentication invalid')
    }


const token= authHeader.split(' ')[1]

try {
    const payload=jwt.verify(token,process.env.JWT_SECRET_KEY)
    
    req.user={userId:payload.userId,name:payload.name}
    next()
} catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
    
}
}

module.exports=auth;