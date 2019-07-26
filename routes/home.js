const express = require('express')
const router = express.Router()
const db = require('../models')
const Record = db.Record
const User = db.User
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  const keyword = req.query.keyword
  const month = req.query.month
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('user not found')
      return Record.findAll({ where: { UserId: req.user.id } })
    })
    .then(record => {
      res.render('index', { record, script: 'main.js', month: month, keyword })
    })
    .catch(error => {
      return res.status(422).json(error)
    })
})

module.exports = router
