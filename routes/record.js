const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.User
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

router.get('/:id/edit', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('user not found')
      return Record.findOne({
        where: {
          Id: req.params.id,
          UserId: req.user.id
        }
      })
    })
    .then(record => {
      return res.render('edit', { record })
    })
})

router.put('/:id', inputvalidate(), authenticated, (req, res) => {
  const errors = validationResult(req)
  let fillErrors = []
  if (!errors.isEmpty()) {
    for (let errormessage of errors.errors) {
      fillErrors.push({ message: errormessage.msg })
    }
  }
  const { name, date, category, amount } = req.body
  if (fillErrors.length > 0) {
    res.render('edit', {
      fillErrors,
      name,
      date,
      category,
      amount
    })
  } else {
    Record.findOne({ where: { Id: req.params.id, UserId: req.user.id } })
      .then(record => {
        record.name = name
        record.date = date
        record.category = category
        record.amount = amount
        return record.save()
      })
      .then(record => {
        return res.redirect('/')
      })
      .catch(error => {
        res.status(422).json(error)
      })
  }
})

router.delete('/:id', authenticated, (req, res) => {
  User.findByPk(req.user.id).then(user => {
    if (!user) throw new Error('user not found')
    return Record.destroy({
      where: { Id: req.params.id, UserId: req.params.id }
    })
      .then(record => {
        return res.redirect('/')
      })
      .catch(error => {
        res.status(422).json(error)
      })
  })
})

module.exports = router
