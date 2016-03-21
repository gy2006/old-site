import form from './form';
import $ from 'jquery';
import mixpanel from 'mixpanel-browser';

mixpanel.init(__MIXPANEL_TOKEN__);

function handlerSubmit (e) {
  e.preventDefault();
  const $form = form($("#apply-form")[0]);
  if (!$form.isValid()) {
    const error = $form.getError();
    console.error(error);
    return;
  }
  const field = $form.getField();
  field['user_infomation'] = $('#user_infomation').val();
  mixpanel.track('apply for ci', field);
  alert('Success to apply ci');
  $form[0] && $form[0].reset();
}

$(function () {
  if (/^\//.test(location.pathname)) {
    $("#apply-form").submit(handlerSubmit)
  }
});
export default {};
