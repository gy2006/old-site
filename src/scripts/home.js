import FormValidate from './validate'
import $ from 'jquery'
import FlowAnimate from './components/flowAnimate'

function bindSubmit (form) {
  function handlerSubmit (e) {
    e.preventDefault()
    const { email } = form.getValues()
    window.location.href = `/signup.html?email=${email}`
  }
  form.$form.submit(handlerSubmit)
}

function initValidate () {
  return new FormValidate('#apply-form', [{
    name: 'email',
    rules: 'email',
    errorElement: '.page-home .text-danger'
  }])
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
  const f = new FlowAnimate(StepArray, $('.flow-steps'), $('.flow-line'), {
    bottom: 50
  })
  f
}

export default function bootstrap () {
  const form = initValidate()
  bindSubmit(form)
  $.fn.insertAt = function (index, $parent) {
    return this.each(function () {
      if (index === 0) {
        $parent.prepend(this)
      } else {
        $($parent.children()).eq(index - 1).after(this)
      }
    })
  }
  flowAnimate()
}
