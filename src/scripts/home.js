import FormValidate from './validate';
import $ from 'jquery';
import applyCI from './actions/applyForCi';
import analysis from './actions/analysis';
import User from './actions/user';
import FlowAnimate from './components/flowAnimate';

function bindSubmit (form) {
  function handlerSubmit (e) {
    e.preventDefault();
    const fields = form.getValues();
    applyCI(fields, User.getUserToken(), () => {
      $(".page-home .form-container").addClass('success');
      this.reset();
    });
  }
  form.$form.submit(handlerSubmit);
}

function initValidate () {
  return new FormValidate("#apply-form", [{
    name: 'email',
    rules: 'required|email',
    errorElement: ".page-home .text-danger"
  }]);
}

function addStepToFlow() {

}

function flowAnimate () {
  const StepArray = [
    'Push',
    'Clone Code',
    'Code analysis',
    'Testing',
    'Build',
    'Deploy',
    'Slack'
  ]
  const flow = new FlowAnimate(StepArray, $('.flow-steps'), $('.flow-line'), {
    bottom: 200
  });
  flow.render();
}

export default function bootstrap() {
  const form = initValidate();
  bindSubmit(form);

  $.fn.insertAt = function(index, $parent) {
    return this.each(function() {
      if (index === 0) {
        $parent.prepend(this);
      } else {
        $($parent.children()).eq(index - 1).after(this);
      }
    });
  };
  flowAnimate();

}
