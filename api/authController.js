var express = require('express')
var cors = require('cors')
const { secret } = require('../middleware/secret_in_app'); // Importing secret from con.js
const connection = require('../middleware/db_connect');
const jwt = require('jsonwebtoken');
var app = express()
app.use(cors())
app.use(express.json())
const bcrypt = require('bcrypt');
const AuthController = {};

AuthController.login = async (req, res, next) => {
  connection.query(
    'SELECT * FROM `users` WHERE `username` = ? and status = 1',
    [req.body.username],
    function (err, user) {
      if (err) { res.json({ status: 'error', message: 'err' }); return }
      if (user.length === 0) { res.json({ status: 'error', message: 'User not found' }); return }
      bcrypt.compare(req.body.password, user[0].password, function (err, result) {
        if (result) {
          var token = jwt.sign({ email: user[0].email, id: user[0].id, name: user[0].name }, secret, { expiresIn: '8h' });
          res.json({ 
            status: 200, 
            token: token, 
            id: user[0].id, 
            name: user[0].name, 
            shop_id: user[0].shop_id,
            user_type: user[0].user_type 
          });
        } else {
          res.json({ status: 401, message: 'Wrong password' });
        }
      });
    }
  );
};

AuthController.authen = async (req, res, next) => {
  try {
    var token = req.headers.authorization.split(' ')[1];
    res.json(jwt.verify(token, secret));
  } catch (err) {
    res.json({ status: 'error', message: 'Token not found' });
    return;
  }
};

module.exports = AuthController;