import validate from './validate';
import $ from 'jquery';

function getInputField (formElement) {
  const field = {};
  const error = {};
  function getFiledValue(index, element) {
    const $element = $(element);
    const type = $element.attr('type'); // 也许加一个校验的属性字段
    if (type === 'button' || type === 'submit') {
      return;
    }
    const value = $element.val();
    const name = $element.attr('name') || $element.attr('id') || `field${index}`;
    const isRequired = !!$element.attr('required');
    const errorMessage = validate(type, value, isRequired, $element);
    errorMessage ? (error[name] = errorMessage) : (field[name] = value);
  }
  formElement.each(getFiledValue);
  return {
    field,
    error
  }
}

export function isEmptyObject (obj) {
  let isEmpty = true;
  for (let v in obj) {
    isEmpty = false;
    break;
  }
  return isEmpty;
}

export default function form (myform) {
  const $form = $(myform);
  const $input = $form.find('input');
  // const $textarea = $form.find('textarea');
  // const formElement = [...$input, ...$textarea];
  const formValid = getInputField($input);
  $form.getField = function () { return formValid.field; };
  $form.getError = function () { return formValid.error; };
  $form.isValid = function () { return isEmptyObject(formValid.error); };
  return $form;
}