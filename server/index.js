require('dotenv').config()

const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const userRoutes = require('./routes/user.js')
const itemRoutes = require('./routes/items.js')
const emailRoutes = require('./routes/email.js')

const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.json());


const allowedOrigins = ['http://localhost:3000', ''];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin))) {
      callback(null, true);
    } else {
      callback(new Error('The CORS policy for this site does not allow access from the specified origin.'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));


app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/user', userRoutes)
app.use('/api/item', itemRoutes)
app.use('/api/email', emailRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 

app.get('/', (req, res) => {
  res.send("API for DCMH Inventory Tracker.")
})

module.exports = app