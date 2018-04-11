const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const mysql = require('mysql')
const MySQLStore = require('express-mysql-session')(session)
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

//routes
const routes = require('./routes/routes')

const app = express()
app.use(passport.initialize())
app.use(passport.session())

//sets evironment variables from .env file
require('dotenv').config()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

let options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: '/tmp/mysql.sock'
}

let sessionStore = new MySQLStore(options)

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    store: sessionStore,
    saveUninitialized: true,
    //cookie: { secure: true }
}))

app.use('/', routes)

//create database tables
const db = require('./db')

passport.use(new LocalStrategy(
    function(username, password, done) {

        db.query('SELECT name, id, password FROM users WHERE name= ?', [username], (err, res, fields) => {
            if (err) done(err)
            if (res.length != 0) {

                const hash = res[0].password.toString()
                bcrypt.compare(password, hash, (error, response) => {
                    if (response) {
                        return done(null, {
                            user_id: res[0].id
                        })
                    } else {
                        return done(null, false)
                    }
                })
            } else {
                done(null, false)
            }

        })
    }
))

passport.serializeUser((user, done) => {
    done(null, user)
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use((err, req, res, next) => {
    console.log(err)
        // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app