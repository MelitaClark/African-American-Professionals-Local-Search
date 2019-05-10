const express = require('express');

const morgan = require('morgan');
const bodyParser = require('body-parser');

const blogPostsRouter = require("./blogPostsRouter.js");
const {} = require('./models');

const jsonParser = bodyParser.json();
const app = express();


// log the http layer
app.use(morgan('common'));
app.use(express.json());

app.use("/referal-posts", referalPostsRouter);



app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});