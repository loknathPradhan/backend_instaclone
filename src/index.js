const express = require('express');
const cors = require('cors')
const app = express();
const Post = require('./model/post')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
let PORT = process.env.PORT || 8000

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
  });

app.use(fileUpload({useTempFiles: true}))
app.use(cors())
app.use(bodyParser.json())

const DB = "mongodb+srv://loknath:loknath@cluster0.elbvdba.mongodb.net/instapost?retryWrites=true&w=majority"



mongoose.connect(DB).then(() => {
    console.log("connection is sucess")
}).catch((e) => {
    console.log("no connection");
})

// const upload = multer({dest:'../Images'});

app.post("/upload", function (req,res) {
    const file = req.files.file;
    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(req.body)
            const post = Post.create({
                file: result.url,
                author: req.body.author,
                location: req.body.location,
                discription: req.body.discription
            });
            // console.log(req)
            try {
                res.status(200).json({
                    status: "Success",
                    post
                })
            } catch(e) {
                res.status(400).json({
                    status: "Failed",
                    message: e.message
                })
            }
        }
        
    })

})

app.get("/render", async (req,res) => {
   let po = await Post.find()
    .then((posts)=>{
        res.send(posts)
    }).catch(err=>{
        console.log(err)
    })
})

if(process.env.NODE_ENV == 'production') {
    app.use(express.static("client/build"))
}

app.listen(PORT, () => console.log("App listening on post 8000"));