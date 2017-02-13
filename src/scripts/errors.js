// import browser from './util/browser'

// const CODE_MAPPING = errorText()

// const FIELD_CODE_MAPPING = {
//   '00': 'unknown',
//   '01': 'invalid',
//   '02': 'already exists',  // 重复
//   '10': 'not exists',  // 不存在
//   '20': 'not accepted', // 不接受
//   '30': 'confirmation',   // 没确认
//   '40': 'is not legal eg : ${example}',  // exclusion
//   '50': 'is not legal eg : ${example}', // with
//   '51': 'is not legal eg : ${example}',  // without
//   '60': 'is not legal eg : ${example}', // inclusion
//   '70': 'is not legal eg : ${example}', // wrong length
//   '71': 'too short, must greater than ${min} length',
//   '72': 'too long, must less than ${max} length',
//   '80': 'not a number,',
//   '81': 'not an integer',
//   '82': 'greater than ${max}',
//   '83': 'greater than or equal to ${max}',
//   '84': 'equal to ${size}',
//   '85': 'less than ${min}',
//   '86': 'less than or equal to ${min}',
//   '87': 'odd',
//   '88': 'even',
//   '89': 'other than ${param}',
//   '90': 'is empty'
// }

// const FIELD_CODE_PARAM_MAPPING = {
//   username: {
//     min: 3,
//     max: 15,
//     example: 'flowci',
//     'default': 'must greater than 3 and less than 15'
//   },
//   password: {
//     'min': 6,
//     'default': 'must greater than 6'
//   }
// }
//
// const FIELD_MAPPING = {
//   username: 'Username',
//   password: 'Password',
//   sign: 'Invite Code',
//   login: 'Email or Username'
// }

// function errorText () {
//   if (browser.locale !== 'zh') {
//     return {
//       100001: 'Invite code required',
//       100002: 'Username/Email required',
//       100003: 'Password required',
//       100005: 'User is locked',
//       100007: 'Invite code invalid',
//       100008: 'Email/Username/Password not correct',
//       100009: 'Email occupied',
//       100010: 'User not found',
//       100013: 'Reset password token not found'
//     }
//   } else {
//     return {
//       100001: '需要邀请码',
//       100002: '需要用户名/电子邮件',
//       100003: '需要密码',
//       100005: '用户锁定',
//       100007: '邀请码无效',
//       100008: '电子邮件/用户名/密码不正确',
//       100009: '电子邮件占用',
//       100010: '未找到用户',
//       100013: '未找到复位密码令牌'
//     }
//   }
// }
//
// function isObject (value) {
//   return value != null && typeof value === 'object'
// }
//
// function getFieldName (field) {
//   return FIELD_MAPPING[field] || field
// }

// function getExtendParam (field, name) {
//   const mapping = FIELD_CODE_PARAM_MAPPING[field]
//   if (!mapping) {
//     return ''
//   }
//   const param = mapping[name] || mapping['default'] || ''
//   return param
// }

// function getFieldMessage (field, code) {
//   let message = FIELD_CODE_MAPPING[code]
//   // const reg = /\$\{\s*param\s*\}/;
//   // if (!reg.test(message)){
//   //   return message;
//   // }
//   // return message.replace(reg, getExtendParam(field, code));
//   // get ${something};
//   const paramReg = /\$\{\s*\w+\s*\}/g
//   const wordReg = /\w+/
//   let matches = message.match(paramReg)
//   matches && matches.forEach((match) => {
//     const paramName = match.match(wordReg)[0]
//     message = message.replace(match, getExtendParam(field, paramName))
//   })
//   return message
// }

// function getFieldErrorMessage (errors) {
//   const errorMessage = []
//   for (let field in errors) {
//     const codes = errors[field]
//     const ms = codes.map((code) => {
//       return getFieldMessage(field, code)
//     }).filter((m) => m)
//     const message = getFieldName(field) + ': ' + ms.join(', ')
//     errorMessage.push(message)
//   }
//   return errorMessage
// }

export default function getErrorMessage (resp) {
  const text = resp.responseText
  let data = resp.responseJSON
  if (!data && text) {
    try {
      data = JSON.parse(text)
    } catch (e) {}
  }
  if (!data) {
    return `HTTP STATUS: ${resp.status}`
  }

  if (data.message) {
    return data.message
  } else {
    return 'System is busy'
  }
}
