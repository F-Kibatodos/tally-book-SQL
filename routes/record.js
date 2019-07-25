const express = require('express')
const router = express.Router()
const db = require('../models')
const Record = db.Record
const { authenticated } = require('../config/auth')
const { check, validationResult } = require('express-validator')
const inputvalidate = require('../helper/recordValidator')

router.get('/new', authenticated, (req, res) => {
  res.render('new')
})

router.post('/new', inputvalidate(), authenticated, (req, res) => {
  const errors = validationResult(req)
  let fillErrors = []
  if (!errors.isEmpty()) {
    for (let errormessage of errors.errors) {
      fillErrors.push({ message: errormessage.msg })
    }
  }
  const { name, date, category, amount } = req.body
  if (fillErrors.length > 0) {
    res.render('new', {
      fillErrors
    })
  } else {
    Record.create({
      UserId: req.user.id,
      date,
      name,
      category,
      amount
    })
      .then(record => {
        res.redirect('/')
      })
      .catch(error => {
        return res.status(422).json(error)
      })
  }
})

module.exports = router
