import { EMAIL_REG, USERNAME_REG } from './constant';

export function isEmail (value) {
  return EMAIL_REG.test(value);
}

export function isNormalText (value) {
  return USERNAME_REG.test(value);
}
export function maxLength (value, max) {
  return value.length <= max;
}
export function minLength (value, min) {
  return value.length >= min;
}
export default function validate (type, value, require, element) {
  let error;
  if (!value) {
    return require ? 'Require' : '';
  }
  if (element) {
    const $element = $(element);
    const max = $element.attr('maxlength');
    const min = $element.attr('minlength');
    if (max && !maxLength(value, max)){
      error[name] = `Invalid, length max lt ${max}`;
    }
    if (min && !minLength(value, min)) {
      error[name] = `Invalid, length max lg ${min}`;
    }
  }
  if (error)
    return error;

  switch(type) {
    case 'email':
      !isEmail(value) && (error = 'Invalid');
      break;
    case 'text':
      !isNormalText(value) && (error = 'Invalid');
      break;
    default:
      console.warn('empty validate:', type);
      break;
  }

  return error;
}