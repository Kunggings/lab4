module.exports = function (app, forumData) {
  // Handle our routes
  app.get("/", function (req, res) {
    res.render("index.ejs", forumData);
  });
  app.get("/about", function (req, res) {
    res.render("about.ejs", forumData);
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // });
  app.get("/register", function (req, res) {
    res.render("register.ejs", forumData);
  });
  app.post("/registered", function (req, res) {
    // saving data in database
    res.send(
      " Hello " +
        req.body.first +
        " " +
        req.body.last +
        " you are now registered!  We will send an email to you at " +
        req.body.email
    );
  });
  ////////////////////////////////////////////////////////////////////////////////////

  app.get("/search.ejs", function (req, res) {
    res.render("search.ejs", forumData);
  });
  app.get("/search-result.ejs", function (req, res) {
    //searching in the database

    let keyword = req.query.keyword;

    if (!keyword) {
      res.send("Try again");
      return;
    }

    let sqlquery = "SELECT * FROM post WHERE user_userID LIKE ?";

    let searchKey = "%" + keyword + "%";

    db.query(sqlquery, [searchKey], (eer, result) => {
      if (eer) {
        res.send(eer.message);
        return;
      }

      let searchData = Object.assign({}, forumData, {
        searchResults: result,
        searchKey: keyword,
      });
      res.render("search-result.ejs", searchData);
    });
  });

  ///////////////////////

  app.get("/search-topic.ejs", function (req, res) {
    res.render("search-topic.ejs", forumData);
  });
  app.get("/search-result-topic.ejs", function (req, res) {
    //searching in the database

    let keyword = req.query.keyword;

    if (!keyword) {
      res.send("Try again");
      return;
    }

    let sqlquery = "SELECT * FROM topic WHERE user LIKE ?";

    let searchKey = "%" + keyword + "%";

    db.query(sqlquery, [searchKey], (eer, result) => {
      if (eer) {
        res.send(eer.message);
        return;
      }

      let searchData = Object.assign({}, forumData, {
        searchResults: result,
        searchKey: keyword,
      });
      res.render("search-result-topic.ejs", searchData);
    });
  });

  ///////////////////////////////////////////////////////////////////////////////////
  app.get("/listPost.ejs", function (req, res) {
    let sqlquery = "SELECT * FROM post"; //query dabase to get all user

    //execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      //res.send(result)
      let newData = Object.assign({}, forumData, { availablePosts: result });
      console.log(newData);
      res.render("listPost.ejs", newData);
    });
  });

  app.get("/listTopic.ejs", function (req, res) {
    let sqlquery = "SELECT * FROM topic"; //query dabase to get all topic

    //execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      //res.send(result)
      let newData = Object.assign({}, forumData, { availableTopics: result });
      console.log(newData);
      res.render("listTopic.ejs", newData);
    });
  });

  app.get("/listUser.ejs", function (req, res) {
    let sqlquery = "SELECT * FROM user"; //query dabase to get all user

    //execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      //res.send(result)
      let newData = Object.assign({}, forumData, { availableUsers: result });
      console.log(newData);
      res.render("listUser.ejs", newData);
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////////
  app.get("/addpost.ejs", function (req, res) {
    res.render("addpost.ejs", forumData);
  });

  app.post("/postadded", function (req, res) {
    // saving data in database

    let sqlquery =
      "INSERT INTO post (info,topic_topicID,user_userID) VALUES (?,?,?)";

    // execute sql query

    let newrecord = [
      req.body.info,
      req.body.topic_topicID,
      req.body.user_userID,
    ];

    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else {
        res.send(
          " This post is added to database, info: " +
            req.body.topic_topicID +
            " by " +
            req.body.user_userID
        );
      }
    });
  });
};
