const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!

  console.log("connected");

});

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
const _ = require("lodash");

//new schema - specifies JS object
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

//new mongoose Model
//"Article" - singular, name of the collection which uses the Schema
//articlesSchema - the structure we need to follow
const Article = mongoose.model("Article", articleSchema);

//chain together all requests for given route "/articles"
//**************Requests handling ALL articles *********//
app.route("/articles")
  .get(function(req, res) {
    //query database to find  all articles (leave condition blank)
    Article.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
        // console.log(foundArticles);
      } else {
        res.send(err);
      }
    })
  })
  .post(function(req, res) {
    //It Worked,so save to database instead of loging info
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added the new articles");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    const result = Article.deleteMany(function(err) {
      if (!err) {
        res.send("Deleted " + result.deletedCount + " documents");
      } else {
        res.send(err);
      }

    });
  });

//**************Handle specific route requests*****************//

app.route("/articles/:articleTitle")
  .get(function(req, res) {
    let newTitle = _.capitalize(req.params.articleTitle);
    Article.find({
      title: newTitle
    }, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
        // console.log(foundArticles);
      } else {
        res.send("No articles found matching your request: " + newTitle);
      }
    })
  })

  .put(function(req, res) {
    let newTitle = _.capitalize(req.params.articleTitle);
    // condition: title of article matches route requested
    //PUT - updates all fields
    Article.update({title: newTitle}, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err, results) {
        if (!err) {
          res.send("Successfully replaced the article");
        } else {
          res.send(err);
        }
      })
  })

  .patch(function(req, res) {
    let newTitle = _.capitalize(req.params.articleTitle);
    // condition: title of article matches route requested
    //PATCH - only updates specific fields
    Article.update({title: newTitle},
      {$set: req.body},
      function(err, results) {
        if (!err) {
          res.send("Successfully replaced the article");
        } else {
          res.send(err);
        }
      })
  })
  .delete(function(req, res) {
      let newTitle = _.capitalize(req.params.articleTitle);
    const result = Article.deleteOne({title: newTitle}, function(err) {
      if (!err) {
        res.send("Deleted one document");
      } else {
        res.send(err);
      }

    });
  });



// app.get("/articles", function(req, res) {
//   //query database to find  all articles (leave condition blank)
//   Article.find({}, function(err, foundArticles) {
//     if (!err) {
//       res.send(foundArticles);
//       // console.log(foundArticles);
//     } else {
//       res.send(err);
//     }
//   })
// });

// app.post("/articles", function(req, res) {
//   //It Worked,so save to database instead of looging info
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content
//   })
//   newArticle.save(function(err) {
//     if (!err) {
//       res.send("Successfully added the new articles");
//     } else {
//       res.send(err);
//     }
//   });
// });

// app.delete("/articles", function(req, res) {
//   const result = Article.deleteMany(function(err) {
//     if (!err) {
//       res.send("Deleted " + result.deletedCount + " documents");
//     } else {
//       res.send(err);
//     }
//
//   });
// });
//TODO
app.listen(3000, function() {
  console.log("Server started on port 3000 ");
});
