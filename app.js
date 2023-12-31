//jshint esversion:6
//BLOG WEBSITE 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/blogsDB");

//CREATE SCHEMA FOR BLOG POSTS
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

//CREATE MODEL FOR BLOG POSTS COLLECTION
const Post = mongoose.model(
  "Post",
  postSchema
);

//1. ROUTE GET REQUESTS AT HOME
app.get(
  "/",
  function(request, response){
    Post.find({})
    .then(function(posts){
      console.log(posts);
      //SHOW THE HOME PAGE
      response.render("home", {
        startingContent: homeStartingContent,
        postsArray: posts
      });
    })
    .catch(function(err){
      if(err){
        console.log(err);
      }
    })
});

//2. ROUTE GET REQUESTS AT ABOUT
app.get(
  "/about",
  function(request, response){
    response.render("about", {startingContent: aboutContent})
});

//3. ROUTE GET REQUESRTS AT CONTACT
app.get(
  "/contact",
  function(request, response){
    response.render("contact", {startingContent: contactContent})
  });

//4. ROUTE GET REQUESTS AT COMPOSE
app.get(
  "/compose",
  function(request, response){
    response.render("compose");
});

//ROUTE GET REQUESTS OF A POST
app.get(
  "/posts/:post",
  function(request, response){
    var requestedID = request.params.post;

    console.log("REQUESTED: " + requestedID);
    Post.findOne({_id: requestedID})
    .then(function(foundPost){
      if(foundPost){
        response.render("post", {post: foundPost})
      }
      else{
        console.log("Queried post does not exist");
        response.redirect("/");
      }
    })
    .catch(function(err){
      if(err){
        console.log(err);
      }
    })
});



//ROUTE POST REQUESTS AT COMPOSE
app.post(
  "/compose",
  function(request, response){
    //CREATE NEW BLOG OBJECT
    const post = new Post({
      title: request.body.postTitle,
      content: request.body.postContent
    });

    //SAVE THE BLOG
    post.save();

    console.log("Blog saved successfully" + post);

    //SHOW BLOGS ON HOME PAGE
    response.redirect("/");

});










app.listen(3000, function() {
  console.log("Server started on port 3000");
});
