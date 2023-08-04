const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = require('../models/post')
const isLoggedIn = require('../middleware/isLoggedin')
const User = require('../models/User')

router.get('/allpost',isLoggedIn,async(req,res)=>{
    const foundpost = await Post.find().populate("postedBy","_id name").populate("Comments.postedBy","_id name")
    res.json({foundpost})
 })
router.get('/followingpost',isLoggedIn,async(req,res)=>{
    const foundpost = await Post.find({postedBy:{$in:req.user.following}}).populate("postedBy","_id name").populate("Comments.postedBy","_id name")
    res.json({foundpost})
 })

router.post('/createpost', isLoggedIn, async (req, res) => {
    try {
        let date = new Date().toUTCString().slice(5, 16);
        const { title, description, url } = req.body
        // console.log(title,description,url)
        if (!title || !description || !url) {
            return res.status(422).json({ error: "please enter all the fields" })
        }
        const newPost = new Post({ title: title, description: description,photo:url, postedBy: req.user._id,date })
        await newPost.save()

        res.json(await newPost.populate('postedBy'))
    }
    catch(e){
        res.json({error:e.message})
    }
})

router.get('/mypost',isLoggedIn,async(req,res)=>{
    const foundpost = await Post.find({postedBy:req.user._id}).populate("postedBy","_id name")
    res.json({foundpost})

})

router.put('/like',isLoggedIn,async(req,res)=>{
    const updatedpost = await Post.findById(req.body.postId).populate("postedBy","_id name").populate("Comments.postedBy","_id name")

    // Check if the user has already liked the post
    const hasLiked = updatedpost.likes.includes(req.user._id);
    
    if (hasLiked) {
        // User already liked the post, so unlike it and set isLiked to false
        updatedpost.likes.pull(req.user._id); // Remove user ID from likes array
      } else {
        // User has not liked the post, so like it and set isLiked to true
        updatedpost.likes.push(req.user._id); // Add user ID to likes array
    }
    await updatedpost.save()
    
    res.json({updatedpost,user_id:req.user._id})
})

router.put('/comment',isLoggedIn,async(req,res)=>{
    const comment = {
        text : req.body.text,
        postedBy: req.user._id
    }
    const updatedpost = await Post.findByIdAndUpdate(req.body.postId,{
        $push:{Comments:comment}
    },{
        new:true
    }).populate("Comments.postedBy","_id name").populate("postedBy","_id name")
    // console.log(updatedpost)
    res.json(updatedpost)
})
router.delete('/deletepost/:postId',isLoggedIn,async(req,res)=>{
    try {
        const foundpost = await Post.findById(req.params.postId).populate('postedBy', '_id');
        if (!foundpost) {
            return res.status(422).json({ error: 'Post not found' });
        }
        if (foundpost.postedBy._id.toString() === req.user._id.toString()) {
            const deletedpost =  await Post.deleteOne({ _id: req.params.postId });
            // console.log(foundpost)
            res.json(foundpost);
        } else {
            res.status(401).json({ error: 'Unauthorized: You can only delete your own posts' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the post' });
    }

})

module.exports = router