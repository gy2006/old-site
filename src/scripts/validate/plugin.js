import FormValidator, { isFunction } from './index';
import $ from 'jquery';

/*
  fields: [
    {
      name string
      errorElement element

    }
  ]
*/
let defaultRulesMapping = {
  email: 'Invalid Email',
  reuired: 'Required',
  maxlength: function (fieldName, ruleParams) {
    return `Must not exceed ${ruleParams[0]} characters in length`;
  },
  minlength: function (fieldName, ruleParams) {
    return `Must at least ${ruleParams[0]} characters in length`;
  },
}

export default class ErrorHandler {
  static setRulesMap (map) {
    defaultRulesMapping = Object.assign({}, defaultRulesMapping, map);
  }

  static getRulesMap () {
    return defaultRulesMapping;
  }
  constructor (fields = [], options = {}) {
    this.rulesMap = Object.assign({}, ErrorHandler.getRulesMap(), options.rulesMap);

    this.fields = fields.reduce((prev, field)=> {
      prev[field.name] = field;
      const element = $(field.errorElement);
      element.hide();
      prev[field.name].errorElement = element;
      return prev;
    }, {})
  }
  /*
  {
    fieldName: error message
  }
  */
  setErrors (errors) {
    for (let fieldName in errors) {
      this.setError(fieldName, errors[fieldName])
    }
  }

  setError (fieldName, ruleName, ruleParams) {
    const field = this.fields[fieldName];
    const map = this.rulesMap[ruleName];
    let message = map;
    if (isFunction(map)) {
      message = map(fieldName, ruleParams);
    }
    if (field && field.errorElement) {
      field.errorElement.text(message).show();
    }
  }

  clearErrors () {
    const fields = this.fields;
    for (let fieldName in fields) {
      this.clearError(fieldName);
    }
  }

  clearError (fieldName) {
    const field = this.fields[fieldName];
    if (field && field.errorElement) {
      field.errorElement.text('').hide();
    }
  }
}