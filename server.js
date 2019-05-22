const express = require('express');
const morgan = require('morgan');

const app = express();

const searchRouter = require('./searchRouter');
const referalRouter = require('./referralRouter');

const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but it's better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const {PORT, DATABASE_URL} = require('./config');
const {Restaurant} = require('./models');

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

//specify routes to POST new referral
app.post("/postNewReferral", (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});
//specify routes to GET referrals
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

// when requests come into `/searchRouter` or
// `/referralRouter`, we'll route them to the express
// router instances we've imported. Remember,
// these router instances act as modular, mini-express apps.
app.use('/searchRounter', searchRouter);
app.use('/referralRouter', referralRouter);


let server;

function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// `closeServer` function is here in original code

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});