const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const { dbPass } = require('./config.json');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = `mongodb+srv://nodeAuth:${dbPass}@cluster1.aypkq0l.mongodb.net/node-auth?retryWrites=true&w=majority`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => {
    app.listen(80);
    console.log('Listening for requests on port', 80);
  })
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));

// cookies
app.get('/set-cookies', (req, res) => {
  // res.setHeader('Set-Cookie', 'newUser=true');

  res.cookie('newUser', false);
  res.cookie('isEmployee', true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  });

  res.send('you got the cookies!');
});

app.get('/read-cookies', (req, res) => {
  const cookies = req.cookies;

  console.log(cookies);
  console.log(cookies.newUser);

  res.json(cookies);
});

// auth routes
app.use(authRoutes);

// page not found
app.use((req, res) => res.status(404).render('404'));