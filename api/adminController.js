var express = require('express')
var cors = require('cors')
const connection = require('../middleware/db_connect');
var app = express()
app.use(cors())
app.use(express.json())

const AdminController = {};
AdminController.getusers = async (req, res, next) => {
  connection.query(
    'SELECT * FROM `users`',
    function (err, results, fields) {
      console.log(results);
      //console.log(fields); 
      res.json(results)
    }
  );
};

AdminController.getUsersInfo = async (req, res, next) => {
  const id = req.params.id;
  connection.query(
    'SELECT * FROM `users` WHERE `id` = ?',
    [id],
    function (err, results) {
      console.log(results);
      res.send(results);
    }
  );
};




module.exports = AdminController;