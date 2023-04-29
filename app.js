require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (!rows.length) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const user = rows[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      delete user.password;

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);

    if (!rows.length) {
      return done(null, false, { message: 'User not found.' });
    }

    const user = rows[0];

    delete user.password;

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const sessionStore = new MySQLStore({}, pool);

app.use(
  session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());




app.post('/login', passport.authenticate('local'), (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
      message: true
    });
  } catch (err){
    res.json({
      message: false
    });
  }


});

app.post('/register', async (req, res) => {
    // Get the user input from the request body
    const { username, password } = req.body;
  
    try {
      // Check if the email is already in use
      const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (users.length > 0) {
        return res.status(400).json({ message: 'username is already registered.' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the new user into the database
      const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
  
      // Send a success response
      return res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });
  app.get('/logout', function(req, res){
    try{
        req.logout(function(err){
          if(err) return (err);
          res.redirect('/');
        });
      res.status(200).json({ message: 'Logged out successfully.' }); 
    } catch (err) {
      console.log(err)
    }

});

app.get('/', (req, res) => {
  try{
    res.status(200).json(req.user);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

/// routing for crud of the tasks

//fetching all the datas from db

app.get('/api/tasks', (req, res) => {
  pool.query('SELECT * FROM tasks')
    .then(([rows,fields]) => {
      res.send(rows)
    })
    .catch((err) => {
      console.log(err)
    })
})

// end point for creating tasks

app.post('/api/tasks/create', (req, res) => {
  const { tasks, person_name, isdone } = req.body;
  const values = [tasks, person_name,isdone];

  pool.query('INSERT INTO tasks (tasks, person_name, isdone) VALUES (?,?,?)',values)
    .then(() => {
      console.log('Tasks created successfully');
      res.status(200).send('Tasks created successfully');
    })
    .catch((err) => {
      console.log(err)
    })
})

// end point for updating tasks

app.put('/api/tasks/update/:id', (req,res) => {
  const {id} = req.params
  const { isdone } = req.body;
  const values = [isdone,id];
  const query = `UPDATE tasks SET isdone=? WHERE id = ?`

  pool.query(query,values)
    .then(() => {
      console.log('Tasks updated successfully');
      res.status(200).send('Tasks updated successfully');
    })
    .catch((err) => {
      console.log(err)
    })

  })

// endpoint for deleting tasks

app.delete('/api/tasks/delete/:id', (req, res) => {
  const {id} = req.params
  const query = 'DELETE FROM tasks WHERE id = ?'

  pool.query(query,id)
    .then(() => {
      console.log('Tasks deleted successfully');
      res.status(200).send('Tasks deleted successfully');
    })
    .catch((err) => {
      console.log(err)
    })


})

app.listen(3001, () => {
  console.log('app listening on port 3001');
})
