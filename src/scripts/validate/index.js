/*
  FormValidator( selector, fields: [
    {
      name: string
      rule: string spilt by |, 'require| pattern: /^xxxx$/'
      errorElement: element , when has error which element append text
      invalidClass
    }
  ], options: {
    validators: [{ // 额外的规则 Object.assign(defaultRule, rule);
      rule name: function (value, otherParams in use) {}
    }]
  })
*/
import $ from 'jquery'
import Validators from './validate'
import AliasPlugin from './plugin'
import browser from '../util/browser'

const REQUIRED = 'Required'

let defaultValidators = Object.assign({}, Validators)
let defaultRulesMapping = Translation()

function Translation () {
  if (browser.locale !== 'zh') {
    return {
      email: 'Invalid Email',
      required: 'Required',
      maxlength: function ({ params: ruleParams }, field) {
        return `Must not exceed ${ruleParams[0]} characters in length`
      },
      minlength: function ({ params: ruleParams }, field) {
        return `Must at least ${ruleParams[0]} characters in length`
      },
      'default': 'Invalid'
    }
  } else {
    return {
      email: '电子邮件无效',
      required: '不能为空',
      maxlength: function ({ params: ruleParams }, field) {
        return `不得超过 ${ruleParams[0]} 个字符`
      },
      minlength: function ({ params: ruleParams }, field) {
        return `不得少于 ${ruleParams[0]} 个字符`
      },
      'default': '无效的'
    }
  }
}

function getRuleMessage (rule, field) {
  const map = defaultRulesMapping[rule.name] || defaultRulesMapping['default']
  let message = map
  if (isFunction(map)) {
    message = map(rule, field)
  }
  return message
}

function noop () {};
/*
  rule: {
    name: string,
    params: []
  }
*/
function parseRule (ruleStr) {
  ruleStr = ruleStr.trim()
  const sequence = ruleStr.split(':')
  const name = sequence[0]
  const params = sequence.slice(1)
  return {
    name,
    params
  }
}

/*
  required rule 一直是第一个.
*/
function parseRules (rulesStr) {
  if (!rulesStr) {
    return []
  }
  const rules = rulesStr.split('|').map(parseRule)

  // not has required
  let requiredIndex = -1
  let newRules = rules.reduce((prev, current, index) => {
    if (current.name !== REQUIRED) {
      prev.push(current)
    } else {
      requiredIndex = index
    }
    return prev
  }, [])
  return requiredIndex > 0 ? [ rules[requiredIndex], ...newRules ] : rules
}

function getForm ($formElement) {
  const formElement = $formElement[0]
  let dForm
  Array.prototype.some.call(document.forms, (form) => {
    if (form === formElement) {
      dForm = form
      return true
    }
  })
  return dForm
}

export function isEmpty (obj) {
  let result = true
  for (let key in obj) {
    !!key // do nothing.
    result = false
    break
  }
  return result
}

export function isObject (value) {
  return value != null && typeof value === 'object'
}

export function isFunction (value) {
  return typeof value === 'function'
}

export default class FormValidator {
  static setDefaultValidators (validators) {
    defaultValidators = Object.assign({}, defaultValidators, validators)
  }

  static getDefaultValidators () {
    return defaultValidators
  }

  static setDefaultRulesMap (map) {
    defaultRulesMapping = Object.assign({}, defaultRulesMapping, map)
  }

  static getDefaultRulesMap () {
    return defaultRulesMapping
  }
  /*
    (selector, fields, options)
    options: {
      validators: {},
      onerror: function,
      // before: function, before submit
      // after: function, after submit
    }
  */
  constructor (selector, fields, options = {}) {
    $(selector).submit(this.onSubmit.bind(this))

    this.selector = selector
    this.$form = $(selector)
    this.form = getForm(this.$form)

    this.options = options
    this.onerror = options.onerror || noop

    this.fields = fields
    this.validators = Object.assign({}, FormValidator.getDefaultValidators(),
      options.validators)
    this.fieldToRules = this._analyticsFields(fields)
    const aliases = [...fields]
    options.errorElement && aliases.push({ name: '$form', errorElement: options.errorElement })
    this.aliasPlugin = new AliasPlugin(aliases)

    return this
  }

  // protected
  /*
    to map {
      fieldName: rulesArray
    }
  */
  _analyticsFields (fields) {
    const fieldToRules = {}
    fields.reduce((prev, field) => {
      const rulesArray = parseRules(field.rules)

      prev[field.name] = rulesArray
      return prev
    }, fieldToRules)
    return fieldToRules
  }

  /*
    fields Object
  */
  validates () {
    const fieldToRules = this.fieldToRules
    const errors = {}
    const values = this.getValues()
    let result = true

    function setError (field, rule) {
      result = false
      errors[field.name] = getRuleMessage(rule, field)
    }

    for (let fieldName in fieldToRules) {
      let fieldRules = fieldToRules[fieldName]
      const field = {
        name: fieldName,
        value: values[fieldName]
      }
      // 如果为空，则需要判断是否有require 规则
      if (!field.value) {
        const firstRule = fieldRules[0]
        if (firstRule && firstRule.name === REQUIRED) {
          setError(field, firstRule)
        }
      } else {
        fieldRules.every((rule) => {
          const r = this.validateByRule(field.value, rule, values)
          !r && setError(field, rule)
          return r
        })
      }
    }
    this.errors = errors
    return result
  }

  validateByRule (value, rule, values) {
    const validator = this.validators[rule.name]
    const params = [value, ...rule.params]
    return validator && validator.apply(values, params)
  }

  getValues (reflesh) {
    if (!reflesh && this.values) {
      return this.values
    }
    const values = this.fields.reduce((values, field) => {
      values[field.name] = this.getValue(field.name)
      return values
    }, {})
    this.values = values
    return values
  }

  getValue (name) {
    return $(this.form[name]).val()
  }

  reset () {
    this.errors = {}
    this.values = null
    this.aliasPlugin.clear()
    return true
  }

  onSubmit (event) {
    event.preventDefault()
    if (this.reset() && !this.validates()) {
      // console.log(this.errors);

      this.aliasPlugin.setTexts(this.errors)

      this.onerror(this.errors, this.getValues())
      event.stopImmediatePropagation()
    }
  }

  setError (fieldName, message) {
    this.errors[fieldName] = message
    this.aliasPlugin.setText(fieldName, message)
  }
}
