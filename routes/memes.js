const express       = require("express"),
      Meme    = require("../models/meme"),
      router        = express.Router(),
      Comment       = require("../models/comment"),
      middleware    = require("../middleware");

// INDEX ROUTE
router.get("/", (req, res) => {
    Meme.find({}, (err, memes) => {
        if (err) {
            console.log(err);
        } else {
            res.render("memes/index", {memes:memes});
        }
    });
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let low = req.body.low;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newMeme = {name: name, low: low, image: image, description:desc, author: author};
    Meme.create (newMeme, (err, meme) => {
        if(err) {
            req.flash("error", "Failed to create a new Meme!");
            res.redirect("/memes");
        } else {
            req.flash("success", "Meme successfully created");
            res.redirect("/memes");
        }
    });
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("memes/new");
});

// SHOW ROUTE
router.get("/:id", (req, res) => {
    Meme.findById(req.params.id).populate("comments").exec((err, foundMeme) => {
        if(err||!foundMeme) {
            req.flash("error", "Meme not found");
            res.redirect("back");
        } else {
            res.render("memes/show", {meme: foundMeme});
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkMemeOwnership, (req, res) => {
    Meme.findById(req.params.id, (err, foundMeme) => {
        if(err) {
            req.flash("error", "Meme not found");
            res.redirect("/memes");
        } else {
            res.render("memes/edit", {meme: foundMeme});
        }
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkMemeOwnership, (req, res) => {
    req.body.meme.edited = true;
    Meme.findByIdAndUpdate(req.params.id, req.body.meme, (err, Meme) => {
        if(err) {
            req.flash("error", "Unable to update meme");
            res.redirect("/memes");
        } else {
            res.redirect(`/memes/${req.params.id}`);
        }
    });
});

// DESTROY ROUTE
router.delete("/:id", middleware.checkMemeOwnership, async(req, res) => {
    try {
        let memeRemoved = await Meme.findByIdAndRemove(req.params.id);
        await Comment.deleteMany( {_id: { $in: memeRemoved.comments }});
        req.flash("success", "Meme successfully deleted");
        res.redirect("/memes");
    } catch (error) {
        req.flash("error", "Memes not found");
        res.redirect("/memes");
    }
});

module.exports = router;