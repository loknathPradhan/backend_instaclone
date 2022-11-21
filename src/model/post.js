const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    file: String,
    author: String,
    location: String,
    discription: String,
    likes: Number,
    date: { type: Date, default: '12/10/1990' }
})

const Post = new mongoose.model("Post", postSchema);
module.exports = Post;