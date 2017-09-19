# CoderBunker FreeCodeCamp Leaderboard

Allows you to see the progress of each CoderBunker member.

## Demo Website

[Click here to go to the page](http://fcc.coderbunker.com/)

### Installing

Clone the repo

```
$ git clone https://github.com/coderbunker/fcc-leaderboard.git
```

Install Dependencies

```
$ npm install
```

Install MongoDB

[MongoDB](http://mongodb.com/)

Add you google api key in config/keys.js file


Run

```
$ npm start
```

## Update users

To manually update user info go to [/new](http://fcc.coderbunker.com/new)


## Built With

* [Express](https://www.npmjs.com/package/express/) - Server framework
* [Axios](https://www.npmjs.com/package/axios/) - Make requests to FreeCodeCamp
* [Google APIs](https://www.npmjs.com/package/googleapis/) - Used to get access to the spreadsheet
* [MongoDB](http://mongodb.com/) - Database to store users
