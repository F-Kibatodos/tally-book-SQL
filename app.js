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

app.use('/user', require('./routes/user'))

app.listen(3000)
