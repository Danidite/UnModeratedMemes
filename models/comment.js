const mongoose = require("mongoose");
 
const commentSchema = new mongoose.Schema({
    text: {type: String, default: " "},
    edited: {type: Boolean, default: false},
    rating: {type: String, default: "?"},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: {type: String, default: "unknown author"}
    }
});
 
module.exports = mongoose.model("Comment", commentSchema);