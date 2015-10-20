var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//get configs from a file
var config = require('./config');

//change this to a db
var user = {
  username: 'user'
  ,password: 'p'
};

//set app
var app = express();

//use middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(expressJwt({
            secret: config.jwtSecret
          }).unless({
            path: ['/login']
          })
        );


//ROUTES

app.get('/', function (req, res) {
  res.send({'root':true});
});

app.get('/random-user', function (req, res) {

  var user = faker.helpers.userCard();

  user.avatar = faker.image.avatar();
  res.json(user);
});

app.post('/login', authenticate, function (req, res) {

  //JWT details
  var payload = {
    username: user.username
  };

  var options = {
    audience: 'web'
    ,issuer: 'localhost'
  };


  //create the signed token
  var token = jwt.sign(payload, config.jwtSecret, options);


  res.send({
    token:token
    ,user:user.username
  });


});

app.get('/me', function (req, res) {
  res.send(req.user.username);
});


//set the port to use from config file
app.set('port', config.port);


app.listen(app.get('port'), function () {
  console.info('http://localhost:'+config.port);
});



//UTIL FUNCTIONS
function authenticate(req, res, next) {
  var body = req.body;

  console.log('auth func...')

  if (!body.username || !body.password) {
    res.status(400).end('Must provide username and password');
  }

  if (body.username !== user.username || body.password !== user.password) {
    res.status(401).end('Username or password incorrect');
  }
  next();

};
