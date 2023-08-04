const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')//for hashing the password
const mongoose = require('mongoose')
const User = require('../models/User')
const jwt = require('jsonwebtoken')//assigning token to the logged in user
const {JWT_SECRET} = require('../config/Keys')
const isLoggedIn = require('../middleware/isLoggedin')
router.get("/", (req, res) => {
    res.send("Instagram")
})

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body

        const founduser1 = await User.findOne({ email: email })
        if (founduser1) {
            return res.status(422).json({ error: "This email Already Exist" })
        }
        const founduser2 = await User.findOne({ name: name })
        if (founduser2) {
            return res.status(422).json({ error: "This username Already Exist" })
        }
        const hashedpassword = await bcrypt.hash(password, 12)
        const newUser = new User({
            name: name,
            email: email,
            password: hashedpassword
        })
        await newUser.save()
        res.json({ message: "saved successfully" })
    }
    catch (e) {
        res.json({ message: e.message })
    }
})
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body
        const founduser = await User.findOne({ email: email })
        if (!founduser) {
            return res.status(422).json({ error: "Inavalid credentials" })
        }
        const validated = await bcrypt.compare(password, founduser.password)
        if (validated) {
            const{_id,name,email,followers,following,about,profilepic} = founduser
            const token = jwt.sign({_id:founduser._id},JWT_SECRET)
            res.json({ token: token, user:{_id,name,email,followers,following,profilepic,about} })
        }
        else{
            res.status(422).json({ error: "Invalid credentials" })
        }
    }
    catch(e){
        res.status(422).json({error:e.message})
    }
})
module.exports = router