import $ from 'jquery'

export function randomPosition (range = {}) {
  let x = parseInt(Math.random() * 50)
  let y = parseInt(Math.random() * 50)
  if (Math.random() > 0.5) {
    x = -x
  }
  if (Math.random() > 0.5) {
    y = -y
  }

  return {
    x,
    y
  }
}

export default class Step {
  constructor (name) {
    this.element = $(`<div class="step"><div class="step_wrap"><span class="step_info"><i></i> <p>${name}</p></span></div></div>`)
    // const position = randomPosition()
    // this.step = this.element.find('.step_info')
    // console.log(`position: ${position.x}`)
    // this.step.css('transform', `translateX(${position.x}px)`)
  }

  getOffset () {
    return this.element.offset()
  }

  moveTo (position, withClassName) {
    this.element.css({ left: position.x, top: position.y })
    withClassName && this.element.addClass(withClassName)
    return this
  }

  animate (withClassName) {
    // this.element.removeClass('hide')
    // setTimeout(() => {
    this.element.addClass('animate')
    // this.step.css('transform', '')
    // }, 1000)
    return this
  }

  render () {
    return this.element
  }
}
