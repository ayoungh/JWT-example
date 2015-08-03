var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var jwtsct = 'tonys0secret';

var user = {
  username: 'username'
  ,password: 'password'
};

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(expressJwt({
            secret: jwtsct
          }).unless({
            path: ['/login']
          })
        );

app.get('/random-user', function (req, res) {

  var user = faker.helpers.userCard();

  user.avatar = faker.image.avatar();
  res.json(user);
});

app.post('/login', authenticate, function (req, res) {

  var payload = {
    username: user.username
  };

  var options = {
    audience: 'web'
    ,issuer: 'localhost'
  };


  //create the signed token
  var token = jwt.sign(payload, jwtsct, options);


  res.send({
    token:token
    ,user:user.username
  });


});

app.get('/me', function (req, res) {
  res.send(req.user.username);
});


app.listen('3000', function () {
  console.info('http://localhost:3000');
});



//UTIL FUNCTIONS
function authenticate(req, res, next) {
  var body = req.body;

  if (!body.username || !body.password) {
    res.status(400).end('Must provide username and password');
  }

  if (body.username !== user.username || body.password !== user.password) {
    res.status(401).end('Username or password incorrect');
  }
  next();

}
