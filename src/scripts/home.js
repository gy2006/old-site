import FormValidate from './validate';
import $ from 'jquery';
import applyCI from './actions/applyForCi';
import analysis from './actions/analysis';

function bindSubmit (form) {
  function handlerSubmit (e) {
    e.preventDefault();
    const fields = form.getValues();
    const property = Object.assign({}, fields,{
      distinct_id: fields.email,
      refer: document.referrer
    });
    analysis.track('Input Email', property);
    alert('Thank you for applying for Flow.ci early access. \nWe will review your application and send the invitation code to your email.');
    applyCI(fields);
  }
  form.$form.submit(handlerSubmit);
}

function initValidate () {
  return new FormValidate("#apply-form", [{
    name: 'email',
    rules: 'required|email',
    errorElement: "#apply-form .form-control-email .text-danger"
  }, {
    name: 'user_infomation'
  }]);
}

export default function bootstrap() {
  const form = initValidate();
  bindSubmit(form);
}
