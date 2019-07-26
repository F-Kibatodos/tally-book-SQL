const express = require('express')
const router = express.Router()
const passport = require('passport')
const { check, validationResult } = require('express-validator')
const registerValidate = require('../helper/register-validator')
const bcrypt = require('bcryptjs')

// 載入 user model
const db = require('../models')
const User = db.User
// 登入頁面
router.get('/login', (req, res) => {
  res.render('login', {
    error: req.flash('error')
  })
})
// 登入檢查
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true,
    successFlash: `歡迎回來，這次又噴多少`
  })(req, res, next)
})
// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})
// 註冊檢查
router.post('/register', registerValidate(), (req, res) => {
  const errors = validationResult(req)
  let loginErrors = []
  const { name, email, password, password2 } = req.body
  if (!errors.isEmpty()) {
    for (let errormessage of errors.errors) {
      loginErrors.push({ message: errormessage.msg })
    }
  }
  if (password !== password2) {
    loginErrors.push({ message: '密碼與驗證密碼不一致' })
  }
  if (loginErrors.length > 0) {
    res.render('register', {
      loginErrors,
      name,
      email,
      password,
      password2
    })
  } else {
    User.findOne({ where: { email: email } }).then(user => {
      if (user) {
        console.log('User already exists')
        res.render('register', {
          name,
          email,
          password,
          password2
        })
      } else {
        const newUser = new User({
          //  如果 email 不存在就直接新增
          name,
          email,
          password
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser
              .save()
              .then(user => {
                res.redirect('/user/login')
              })
              .catch(err => {
                console.log(err)
              })
          })
        })
      }
    })
  }
})
// 登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出')
  res.redirect('/user/login')
})
module.exports = router
