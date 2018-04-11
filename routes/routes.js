const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router()

const saltRounds = 10

router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Register'
    })
})

//create new user
router.post('/register', (req, res, next) => {
    const db = require('../db.js')

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        db.query("INSERT INTO users (name, password) VALUES(?, ?)", [req.body.username, hash], (error, results, fields) => {
            if (error) throw error

            res.render('complete', {
                title: 'Complete'
            })
        })
    })
})

//login user
router.get('/login', (req, res, next) => {
    res.render('login', {
        title: 'Login'
    })
})

//local param used for local development
router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login'
}))

//admin page
router.get('/admin', (req, res, next) => {
		if(req.session.passport.user.user_id){
			const db = require('../db.js')
			db.query('SELECT name FROM users WHERE id= ?', [req.session.passport.user.user_id], (err, response, fields) => {
				console.log(response)
				res.render('admin', {
	        title: `Hello ${response[0].name}`
	    	})
			})
	  }else{
	  	res.render('login', {
	        title: `You must be logged in`
	    })
	  }
})



module.exports = router