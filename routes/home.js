const express = require('express')
const router = express.Router()
const db = require('../models')
const Record = db.Record
const User = db.User
const displayMonthMenu = require('../helper/display-month')
const displaySortMenu = require('../helper/sort')
const { authenticated } = require('../config/auth')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.get('/', authenticated, (req, res) => {
  let sortKey = req.query.sortKey || 'date'
  let sortValue = req.query.sortValue || 'DESC'
  let displaySort
  let newDisplaySort = displaySortMenu(sortKey, sortValue, displaySort)
  const keyword = req.query.keyword || ''
  const month = req.query.month || ''
  let displayMonth = displayMonthMenu(month)
  // 依照情況查詢
  let query = {}
  if (keyword && month) {
    query = {
      UserId: req.user.id,
      category: keyword,
      date: { [Op.like]: `%${month}%` }
    }
  } else if (keyword === '' && month) {
    query = {
      UserId: req.user.id,
      date: { [Op.like]: `%${month}%` }
    }
  } else if (keyword && month === '') {
    query = {
      UserId: req.user.id,
      category: keyword
    }
  } else if (keyword === '' && month === '') {
    query = {
      UserId: req.user.id
    }
  }
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('user not found')
      return Record.findAll({
        where: query,
        order: [[sortKey, sortValue]]
      })
    })
    .then(record => {
      res.render('index', {
        record,
        script: 'main.js',
        month,
        keyword,
        displayMonth: displayMonth || '月份(全部)',
        displayKeyword: keyword || '分類(全部)',
        newDisplaySort: newDisplaySort
      })
    })
    .catch(error => {
      return res.status(422).json(error)
    })
})

module.exports = router
