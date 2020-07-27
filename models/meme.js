const mongoose = require("mongoose");

const memeSchema = new mongoose.Schema({
    name: {type: String, default: "Un-Named Post"},
    low: {type: String, default: "0"},
    edited: {type: Boolean, default: false},
    image: {type: String, default: "https://wallpapercave.com/wp/wp2537078.jpg"},
    description: {type: String, default: " "},
    author: {
         id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         },
         username: {type: String, default: "unknown author"}
      },
    comments: [
       {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
       }
    ]
 });

module.exports = mongoose.model("Meme", memeSchema);