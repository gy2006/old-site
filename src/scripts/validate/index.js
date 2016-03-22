/*
  FormValidate( selector, fields: [
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
import $ from 'jquery';
import Validators from './validate';
import ErrorHandler from './plugin';

const REQUIRED = 'required';
let defaultValidators = Object.assign({}, Validators);

function noop () {};
/*
  rule: {
    name: string,
    params: []
  }
*/
function parseRule (ruleStr) {
  ruleStr = ruleStr.trim();
  const sequence = ruleStr.split(":");
  const name = sequence[0];
  const params = sequence.slice(1);
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
    return [];
  }
  const rules = rulesStr.split('|').map(parseRule);

  // not has required
  let requiredIndex = -1;
  let newRules = rules.reduce((prev, current, index) => {
    if ( current.name !== REQUIRED){
      prev.push(current);
    } else {
      requiredIndex = index;
    }
    return prev;
  }, []);
  return requiredIndex > 0 ? [ rules[requiredIndex], ...newRules ] : rules;
}

function getForm ($formElement) {
  const formElement = $formElement[0];
  let dForm;
  Array.prototype.some.call(document.forms, (form) =>{
    if (form === formElement) {
      dForm = form;
      return true;
    }

  });
  return dForm;
}

export function isEmpty (obj) {
  let result = true;
  for (let key in obj) {
    result = false;
    break;
  }
  return result;
}

export function isObject (value) {
  return value != null && typeof value === 'object';
}

export function isFunction (value) {
  return typeof value === 'function';
}

export default class FormValidate {
  static setDefaultValidators (validators) {
    defaultValidators = Object.assign({}, defaultValidators, validators);
  }

  static getDefaultValidators () {
    return defaultValidators;
  }
  /*
    (selector, fields, callback, options)
    (selector, fields, callback)
    (selector, fields, options)
  */
  constructor (selector, fields, arg3, arg4) {
    let options = {}, callback = noop;
    if(arg3 && isFunction(arg3)) {
      callback = arg3;
      if(arg4 && isObject(arg4)) {
        options = arg4;
      }
    } else if (arg3 && isObject(arg3)) {
      options = arg3;
    }

    $(selector).submit(this.onSubmit.bind(this));
    this.callback = callback || noop;
    this.selector = selector;
    this.$form = $(selector);
    this.form = getForm(this.$form);
    this.validators = Object.assign({}, FormValidate.getDefaultValidators(), options.validators);
    this.fields = fields;
    this.fieldToRules = this._analyticsFields(fields);
    this.errorHandler = new ErrorHandler(this.fields, options);
    return this;
  }

  // protected
  /*
    to map {
      fieldName: rulesArray
    }
  */
  _analyticsFields(fields) {
    const fieldToRules = {};
    fields.reduce((prev, field) => {
      const rulesArray = parseRules(field.rules);

      prev[field.name] = rulesArray;
      return prev;
    }, fieldToRules);
    return fieldToRules;
  }

  /*
    fields Object
  */
  validates () {
    const fieldToRules = this.fieldToRules;
    const errors = {};
    const values = this.getValues();
    let result = true;
    for (let fieldName in fieldToRules) {
      let fieldRules = fieldToRules[fieldName];
      const fieldValue = values[fieldName];

      // 如果为空，则需要判断是否有require 规则
      if (!fieldValue) {
        const firstRule = fieldRules[0];
        if (firstRule && firstRule.name === REQUIRED) {
          this.setError(fieldName, firstRule.name);
        }
        continue;
      }

      const isValid = fieldRules.every((rule) => {
        const r = this.validateByRule(fieldValue, rule, values);
        if (!r) {
          this.setError(fieldName, rule.name, rule);
        }
        return r;
      })
      // set result false
      !isValid && (result = false);
    }
    return result;
  }

  validateByRule (value, rule, values) {
    const validator = this.validators[rule.name]
    const params = [value, ...rule.params];
    return validator && validator.apply(values, params);
  }



  getValues (reflesh) {
    if (!reflesh && this.values) {
      return this.values;
    }
    const values = this.fields.reduce((values, field)=>{
      values[field.name] = this.getValue(field.name);
      return values;
    }, {});
    this.values = values;
    return values;
  }

  getValue (name) {
    return $(this.form[name]).val();
  }

  reset () {
    this.errors = {};
    this.values = null;
    this.errorHandler.clearErrors();
    return true;
  }

  setError (fieldName, ruleName, rule) {
    const error = this.errors[fieldName] || {};
    error[ruleName] = true;
    this.errors[fieldName] = error;
    this.errorHandler.setError(fieldName, ruleName, rule.params);
  }


  onSubmit (event) {
    if (this.reset() && !this.validates()) {
      console.log(this.errors);
      this.callback(this.errors, this.getValues());
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }
}