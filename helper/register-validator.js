const { check, validationResult } = require('express-validator')
module.exports = () => {
  return [
    check('name')
      .exists()
      .custom(value => /^\S+(?: \S+)*$/.test(value))
      .withMessage('名稱格式錯誤'),
    check('email')
      .exists()
      .custom(value =>
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
      )
      .withMessage('無法辨識信箱格式'),
    check('password')
      .exists()
      .custom(value => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(value))
      .withMessage('密碼格式錯誤')
  ]
}
