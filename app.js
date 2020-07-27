//Importing libraries
const express               = require("express"),
      app                   = express(),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
      methodOverride        = require("method-override"),
      flash                 = require("connect-flash");

//Importing Models and Schematics
const User      = require("./models/user");

//Requiring routes
const commentRoutes     = require("./routes/comments"),
      memeRoutes  = require("./routes/memes"),
      indexRoutes       = require("./routes/index");
      
const url = process.env.DATABASEURL || "mongodb://localhost:27017/unmoderated_memes";
mongoose.connect(url, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

// PASSPORT CONFIGERATION
app.use(require("express-session")({
    secret: "This is a super secret code, please do not reveal this to anyone else!!! Like EVER",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res , next) => {
    res.locals.currentUser = req.user;
    res.locals.error =req.flash("error");
    res.locals.success =req.flash("success");
	next();
});

// seedDB(); //Seed the dadabase
app.use("/", indexRoutes);
app.use("/memes", memeRoutes);
app.use("/memes/:id/comments", commentRoutes);

//Catch all route
app.get("*", (req, res) => {
    req.flash("error", "Page not found");
    res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("The Un-Moderated Memes Server Has Started!");
});