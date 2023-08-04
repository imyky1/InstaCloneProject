const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = require('../models/post')
const isLoggedIn = require('../middleware/isLoggedin')
const User = require('../models/User')

router.get('/user/:id', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')
        if (res) {
            const post = await Post.find({ postedBy: req.params.id }).populate('postedBy', '_id name')
            res.json({ user, post })
        }
    }
    catch (e) {
        res.status(422).json({ error: e })
    }

})
router.put('/follow', isLoggedIn, async (req, res) => {
    try {
        const updateduser = await User.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user._id }
        }, { new: true }).select('-password')
        const myuser =  await User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, { new: true })
        res.json(myuser)
    }
    catch (e) {
        res.status(422).json({ error: e })
    }
})
router.put('/unfollow', isLoggedIn, async (req, res) => {
    // console.log('unfollowing')
    try {
        const updateduser = await User.findByIdAndUpdate(req.body.unfollowId, {
            $pull: { followers: req.user._id }
        }, { new: true }).select('-password') 
        const myuser = await User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, { new: true })
        res.json(myuser)
    }
    catch (e) {
        res.status(422).json({ error: e })
    }
})
router.put('/editprofile',isLoggedIn, async (req, res) => {
    // console.log('changing........')
    try {
        const { userId,about,profilepic } = req.body
        const founduser = await User.findByIdAndUpdate(userId,{about:about,profilepic:profilepic},{new:true})
        // console.log(founduser)
        res.json(founduser)
    }
    catch(e){
        res.status(422).json({error:e.message})
    }
})

module.exports = router