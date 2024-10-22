const express = require('express')
const app = express()
const helmet = require('helmet');
const cors = require('cors')
const bodyParser = require('body-parser');
const routershops = require("./route/shop");
const routeradmins = require("./route/admin"); 
const routeraroute = require("./route/auth");  
require('dotenv').config()
app.set('port', process.env.PORT || 80)
app.use(cors()); // อนุญาตทุก origin

/* middleware */
const corsOptions = {
  origin: ['*'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// app.use(cors({ origin: true }))
// app.post(cors({ origin: true }))
// app.get(cors({ origin: true }))

app.use(express.json({limit: '25mb'}))
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.get('/', (_, res) => res.send('RUN SERVICE API VERSION 1.0.0'))
app.listen(process.env.PORT, function() {
    console.log('⚡️[server]: Server is running at', 'http://localhost:' + process.env.PORT)
})

// Use route
app.use('/api/shops', routershops)
app.use('/api/admins', routeradmins) 
app.use('/api/auth', routeraroute) 
