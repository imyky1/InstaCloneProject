// Instagram Clone Project
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')//assigning token to the logged in user
const cors = require('cors')// Use the cors middleware to allow requests from all origins
const PORT = process.env.PORT || 3000
// Schemas
const User = require('./models/User')
const Post = require('./models/post')

//Routers
const loginroutes = require('./Routes/auth')
const Postroutes = require('./Routes/post')
const Userroutes = require('./Routes/user')

//Initializing Mongoose
const mongoose = require('mongoose')
const {DB_URL} = require('./config/Keys')
mongoose.connect(DB_URL)
.then(()=>{
    console.log("Mongo is connected")
})
.catch(err=>{
    console.log(err)
})

//middleware
app.use(express.json())
app.use(cors());// Use the cors middleware to allow requests from all origins

if (process.env.NODE_ENV == "production") {
    app.use(express.static('InstacloneClient/dist'))
    const path = require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'InstacloneClient','dist','index.html'))
    })
}

//Routes Miiddelware
app.use('/',loginroutes)
app.use('/',Postroutes)
app.use('/',Userroutes)

app.listen(PORT,()=>{
    console.log("Listening on port 3000")
})