const { check, validationResult } = require('express-validator')

module.exports = () => {
  return [
    check('name')
      .exists()
      .custom(value => /.*\S.*/.test(value))
      .withMessage('名稱格式錯誤'),
    check('date')
      .exists()
      .custom(value =>
        /^[0-9]{4}([\-.](0[13578]|1[02])[\-.](0[1-9]|[12][0-9]|3[01]))|([0-9]{4}[\-.](0[469]|11)[\-.](0[1-9]|[12][0-9]|30))|([0-9]{4}[\-.](02)[\-.](0[1-9]|1[0-9]|2[0-8]))|((((18|19|20)(04|08|[2468][048]|[13579][26]))|2000)[\-.](02)[\-.]29)$/.test(
          value
        )
      )
      .withMessage('日期格式錯誤'),
    check('amount')
      .exists()
      .custom(value => /^[1-9]\d*$/.test(value))
      .withMessage('金額只能填寫大於0的數字'),
    check('category')
      .exists()
      .custom(value =>
        /^家居物業$|^交通出行$|^休閒娛樂$|^餐飲食品$|^其他$/.test(value)
      )
      .withMessage('請勿填寫選項以外文字')
  ]
}
