function createValidator (regexp) {
  return function (value) {
    return regexp.test(value);
  }
}

const EMAIL_REG = /^[a-zA-Z0-9_+.-]+\@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,6}/i;
const NUMBER_REG =  /^[0-9]+$/i;
const URL_REG = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

const defaultRules = {
  email: createValidator(EMAIL_REG),
  number: createValidator(NUMBER_REG),
  url: createValidator(URL_REG),
  required: function (value) {
    return !!value;
  },
  maxlength: function (value, max) {
    return value.length <= max;
  },
  minlength: function (value, min) {
    return value.length >= min;
  }
}



export default defaultRules