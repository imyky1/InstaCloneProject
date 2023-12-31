const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/Keys')
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports=(req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
       return res.status(401).json({error:"You must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET,async(err,payload)=>{
       if(err){
        return res.status(401).json({error:"You must be logged in"})
       }
       const {_id} = payload
       const user = await User.findById(_id)
       req.user = user
       next()
    })
}