const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 載入 model
const db = require('./models')
const Record = db.Record
const User = db.User

app.get('/', (req, res) => {
  res.render('index')
})

// 認證系統的路由
// 登入頁面
app.get('/user/login', (req, res) => {
  res.render('login')
})
// 登入檢查
app.post('/user/login', (req, res) => {
  res.send('login')
})
// 註冊頁面
app.get('/user/register', (req, res) => {
  res.render('register')
})
// 註冊檢查
app.post('/user/register', (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }).then(user => res.redirect('/'))
})
// 登出
app.get('/user/logout', (req, res) => {
  res.send('logout')
})

app.listen(3000)
