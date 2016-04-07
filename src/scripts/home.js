import FormValidate from './validate';
import $ from 'jquery';
import applyCI from './actions/applyForCi';
import analysis from './actions/analysis';

function bindSubmit (form) {
  function handlerSubmit (e) {
    e.preventDefault();
    const fields = form.getValues();
    applyCI(fields, () => {
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

  const flow = $('.flow-steps');
  const steps = [
    [2, 'Code analysis'],
    [5, 'Deploy'],
    [6,'Slack']
  ];

  $('#flow-add-step').click(function () {
    const step = steps.shift();
    $(`<span class='step new-item'><i></i><p>${step[1]}</p></span>`).insertAt(step[0], flow);
    if (!steps.length) {
      $(this).attr('disabled', 'disabled');
    }
  });
}
