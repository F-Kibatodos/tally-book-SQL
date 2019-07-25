const express = require('express')
const router = express.Router()
const db = require('../models')
const Record = db.Record
const User = db.User
const { authenticated } = require('../config/auth')

router.get('/', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('user not found')
      return Record.findAll({ where: { UserId: req.user.id } })
    })
    .then(record => {
      res.render('index', { record })
    })
    .catch(error => {
      return res.status(422).json(error)
    })
})

module.exports = router
