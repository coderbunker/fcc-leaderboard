const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const google = require('googleapis');
const moment = require('moment');

const keys = require('./config/keys');
const User = require("./models/user");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fcc");

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));


app.get('/new', (req, res) => {

  // GOOGLE SHEETS!!!
  let result = [];

  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: keys.apiKey,
    spreadsheetId: '1qNfCUG64eFAitoprpC0Uy8yUr5byLSkFIiYQQ9L4vMg',
    range: 'user database!A:Z'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
    // console.log(rows);
    rows.forEach((data) => {
      let name = data[0];
      let username = data[2];
      let country = data[3];
      if (username.length > 1 && name !== 'who') {
        let user = {
          name,
          username,
          country
        };
        scrape(`http://www.freecodecamp.com/${user.username}`, name, country);
      }

    })
  })
    res.redirect('/');
});

app.get('/remove', (req, res) => {
  User.remove({}, (err) => {
    if (!err) {
      res.redirect('/');
    }
  });

});

app.get("/", function(req, res) {
  User.find({}).sort({streak: -1, score: -1}).exec((err, allUsers) => {
    if (err) {
      console.log(err);
    } else {
      var users = [];
      allUsers.forEach((item) => {
          users.push(item);
      });
      res.render("index", {
        users: users,
        date: moment().format('LL')
      });
    }
  });
});


setInterval(() => {
  User.find({}).sort({updated: 1}).exec((err, data) => {
    data.forEach((doc) => {
      if (doc) {
        console.log(doc.username + ' ' + doc.updated);
      }
    });
    if (data.length > 0) {
      scrape(`http://www.freecodecamp.com/${data[0].username}`, data[0].name, data[0].country);
    }
  });
}, 1000 * 60);

const scrape = (url, name, country) => axios.get(url).then(response => Promise.resolve(response.data)).then(html => {
  var $ = cheerio.load(html);

  var score,
      username,
      streak,
      image,
      certificate;

  score = $('h1.flat-top.text-primary').text().substr(2).slice(0, -2);
  username = $('h1.text-center').first().text();
  streak = $('h4.col-sm-6.text-left').text();
  image = $('img.img-center.img-responsive.public-profile-img').attr('src');
  certificate = $('.col-xs-12.col-sm-10.col-sm-offset-1.col-md-8.col-md-offset-2 > a').text();

  // userList.forEach((doc) => {
  //   if (doc.username.toLowerCase() === username.toLowerCase()) {
  //     country = doc.country.substr(0, 2);
  //     name = doc.name;
  //   }
  // });

  User.findOneAndUpdate({
    username
  }, {
    $set: {
      name,
      score,
      image,
      streak,
      country,
      updated: new Date()
    }
  }, {
    new: true
  }, function(err, doc) {
    if (err) {
      console.log("Something wrong when updating data!");
    }

    if (!doc) {
      User.create({
        name,
        score,
        username,
        streak,
        image,
        certificate,
        country,
        updated: new Date()
      }, function(err, newlyCreated) {
        if (err) {
          console.log(err);
        } else {
          console.log(newlyCreated[2]);
          console.log(newlyCreated);
          return;
        }
      })
    }


  });

}).catch(err => console.error(err.message));

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Server is running on " + port);
});
