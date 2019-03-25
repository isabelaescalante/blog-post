const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuid = require('uuid');

let posts = [
  {
    id: uuid.v4(),
    title: "My blog post",
    content: "This is the first post made in the blog",
    author: "Isabela",
    publishDate: "March 23, 2019"
  },
  {
    id: uuid.v4(),
    title: "My second post",
    content: "This is the second post made in the blog",
    author: "Paulina",
    publishDate: "March 24, 2019"
  },
  {
    id: uuid.v4(),
    title: "My third post",
    content: "This is the third post made in the blog",
    author: "Isabela",
    publishDate: "March 24, 2019"
  }
];

// GET request of all blog posts
app.get('/blog-posts', (req, res) => {
  res.status(200).json({
    message : "Success: sent the list of posts",
    status : 200,
    post : posts
  });
});

// GET by author requests
app.get('/blog-posts/:author', (req, res) => {
  if(!(req.params.author)) {
    res.status(406).json({
      message: "No author name received",
      status: 406
    });
  }

  let authorName = req.params.author;
  postsAuthor = [];

  posts.forEach(blogPost => {
    if(blogPost.author == authorName) {
      postsAuthor.push(blogPost);
    }
  });

  if(postsAuthor.length > 0) {
    res.status(200).json({
      message : "Success: posts with this author exist",
      status : 200,
      post : postsAuthor
    });
  }
  else {
    res.status(404).json({
      message : "Blog posts not found with this author",
      status : 404
    });
  }
});

app.post('/blog-posts', jsonParser, (req, res) => {
  let requiredFields = ['title', 'content', 'author', 'publishDate'];

  for(let i = 0; i < requiredFields.length; i++) {
    let currentField = requiredFields[i];
    if(!(currentField in req.body)) {
      return res.status(406).json({
        message : `Missing field ${currentField} in body`,
        status : 406
      });
    }
  }

  let objectToAdd = {
    id : uuid.v4(),
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  };
  posts.push(objectToAdd);
  res.status(201).json({
    message : "Success: Added blog post",
    status : 201,
    objectToAdd
  });
});

app.delete('/blog-posts/:id', jsonParser, (req, res) => {
  var deleted = false;
  let postID = req.params.id;
  let postBodyID = req.body.id;

  if(!postID || !postBodyID || blogPost.id != postBodyID) {
    res.status(406).json({
      message: "No ID received",
      status: 406
    });
  }

  posts.forEach(blogPost => {
    if(blogPost.id == postID) {
      deleted = true;
      posts.splice(blogPost, 1);
    }
  });

  if(deleted){
    res.status(204).json({
      message : "post deleted",
      status : 204
    });
  }
  else {
    res.status(404).json({
      message : "ID not found in posts",
      status : 404
    });
  }
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
  let postID = req.params.id;
  var update = false;

  if(!postID) {
    res.status(406).json({
      message: "No ID received",
      status: 406
    });
  }

  let postBody = req.body;
  posts.forEach(blogPost => {
    if(blogPost.id == postID) {
      if(postBody.title) {
        blogPost.title = postBody.title;
        update = true;
      }
      if(postBody.content) {
        blogPost.content = postBody.content;
        update = true;
      }
      if(postBody.author) {
        blogPost.author = postBody.author;
        update = true;
      }
      if(postBody.publishDate) {
        blogPost.publishDate = postBody.publishDate;
        update = true;
      }

      if(update) {
        res.status(200).json({
          message: "Success: Blog post was updated",
          status: 200,
          post: blogPost
        });
      }
    }
  });

  res.status(404).json({
    message: "No fields updated",
    status: 404
  });
});

app.listen(8080, () => {
	console.log('Your app is running in port 8080')
});
