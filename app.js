const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const database = require('./models');

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false}));
app.use('/static', express.static('public'));
const routes = require('./routes');

app.use(routes);


app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  console.log('Error Status: ' + err.status);
  console.log('Error Message: ' + err.message);
  res.render('page-not-found');
});


app.listen(3000, ()=>{
  console.log('Go to "localhost:3000" in your browser to view the site!');
});
