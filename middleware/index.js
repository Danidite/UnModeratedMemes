const  Meme    = require("../models/meme"),
       Comment       = require("../models/comment");
const { count } = require("../models/meme");

//All the middleware goes here
const middlewareObj = {
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        } 
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    },
    checkMemeOwnership: async (req, res, next) => {
        try {
            if(req.isAuthenticated()) {
                let foundMeme = await Meme.findById(req.params.id);
                if (!foundMeme) {
                    req.flash("error", "Meme not found");
                    res.redirect("back");
                }
                if(req.user.username === "Danidite") {
                    return next();
                }
                if(foundMeme.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        } catch (err) {
            req.flash("error", "Meme not found");
            res.redirect("back");
        }
    },
    checkCommentOwnership: async (req, res, next) => {
        try {
            if(req.isAuthenticated()) {
                let foundComment = await Comment.findById(req.params.comment_id);
                if (!foundComment) {
                    req.flash("error", "Comment not found!");
                    res.redirect("back");
                }
                if(req.user.username === "Danidite") {
                    return next();
                }
                if(foundComment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        } catch (err) {
            req.flash("error", "Comment not found!");
            res.redirect("back");
        }
    }
};

module.exports = middlewareObj;