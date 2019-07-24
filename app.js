const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: 'how much do you left',
    resave: 'false',
    saveUninitialized: 'false'
  })
)
// 使用 Passport - 要在「使用路由器」前面
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

// 載入 model
const db = require('./models')
const Record = db.Record
const User = db.User

app.get('/', (req, res) => {
  res.render('index')
})

app.use('/user', require('./routes/user'))

app.listen(3000)
