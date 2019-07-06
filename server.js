"use strict";
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan');
const passport = require('passport');
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');


// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;


// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const { PORT, DATABASE_URL } = require("./config");
const { Referrals, USER} = require("./models");

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use(express.json());

app.use(morgan('common'));


app.use(express.static('public'));
//Code for Requests...

//send a GET request for static html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
  
});

//send a GET request to /referrals to READ a list of referrals
app.get("/referrals", (req, res) => {
  Referrals.find()  
    .then(referrals => {
      res.json({
        referrals: referrals.map(referrals => referrals.serialize())
   });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

//send a GET request to /referrals/:id to READ(view) a quote
app.get("/referrals/:id", (req, res) => {
  referrals
    // this is a convenience method Mongoose provides for searching
    // by the object _id property
    .findById(req.params.id)
    .then(referrals => res.json(referrals.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

//send a POST request to /referrals to CREATE a new referral
app.post("/referrals", (req, res) => {
  const requiredFields = ["business_type", "business_name", "location"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  //});


const referrals = new Referrals(req.body);


  Referrals.create({
    //userLogin: req.body.userLogin,
    business_type: req.body.business_type,
    business_name: req.body.business_name,
    phone_number: req.body.phone_number,
    email: req.body.email,
    location: req.body.location,
    reviews: req.body.reviews
  })
   .then(referrals => res.status(201).json(referrals.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
   
  });
//send a PUT request to /referrals/:id to UPDATE (edit) a referral
app.put("/referrals/:id", (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
  const toUpdate = {};
  const updateableFields = ["business_type", "business_name", "phone_number", "email", "location"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Referrals
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(referrals => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

app.delete("/referrals/:id", (req, res) => {
  Referrals.findByIdAndRemove(req.params.id)
  .then(() => {
    res.status(204).json({ message: 'success' });
})
.catch(err => {
  console.error(err);
  res.status(500).json({ error: 'something went terribly wrong' });
});
});

   
 //Code for User route - post a new user
app.post('/newUser', (req, res)=> {
  const requiredFields = ["userFirst_name","userLast_name", "user_email", "userName"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  };

  USER
  .findOne({userName: req.body.userName})
  .then(user =>{
    if(user){
      const message = 'User Login Alread Exists';
      console.error(message);
      return res.status(400).send(message);
    }
    else{
      USER
      .create({
        userFirst_name:req.body.userFirst_name,
        userLast_name:req.body.userLast_name,
        user_email: req.body.user_email,
        userName:req.body.userName
      
      })
      .then(user =>res.status(201).json({
        _id:user.id,
        name: `${user.userFirst_name} ${user.userLast_name}`,
        user_email: user.user_email,
        userName: user. userName
      }))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  }
})
.catch(err => {
  console.error(err);
  res.status(500).json({ error: 'something went horribly awry' });
});
});




passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });
const localAuth = passport.authenticate('local', { session: false });

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);



// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});
// catch-all endpoint if client makes request to non-existent endpoint
app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});


// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}
  
// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}
  
module.exports = { app, runServer, closeServer };
