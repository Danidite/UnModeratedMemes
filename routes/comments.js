const express       = require("express"),
      Meme    = require("../models/meme"),
      router        = express.Router({mergeParams:true}),
      Comment       = require("../models/comment"),
      middleware    = require("../middleware");

//Comments NEW
router.get("/new", middleware.isLoggedIn, (req,res) => {
    Meme.findById(req.params.id, (err, meme) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("/memes");
        } else {
            res.render("comments/new", {meme: meme});
        }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, (req,res) => {
    Meme.findById(req.params.id, async (err, meme) => {
        try {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong!");
                res.redirect("/memes");
            } else {
                let comment = await Comment.create(req.body.comment);
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                meme.comments.push(comment);
                meme.save();
                req.flash("success", "Successfully added comment!");
                res.redirect(`/memes/${meme._id}`);
            }
        } catch(error) {
            req.flash("error", "Something went wrong!");
            console.log(error);
            res.redirect("/memes");
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, async(req, res) => {
    try {
        let foundComment = await Comment.findById(req.params.comment_id);
        res.render("comments/edit", {meme_id: req.params.id, comment: foundComment});
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("back");
    }
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, async(req, res) => {
    try {
        req.body.comment.edited = true;
        await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
        req.flash("success", "Successfully edited comment!");
        res.redirect(`/memes/${req.params.id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("back");
    }
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, async(req, res) => {
    try {
        await Comment.findByIdAndRemove(req.params.comment_id);
        req.flash("success", "Successfully deleted comment!");
        res.redirect(`/memes/${req.params.id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("back");
    }
});

module.exports = router;
