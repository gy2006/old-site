import $ from 'jquery';

export function randomPosition (range = {}) {
  let x = parseInt(Math.random() * 50);
  let y = parseInt(Math.random() * 50);
  if (Math.random() > 0.5) {
    x = -x;
  }
  if (Math.random() > 0.5) {
    y = -y;
  }

  return {
    x,
    y
  }
}

export default class Step {
  constructor (name, position = randomPosition({ y: 50 })) {
    this.position = position;
    this.element = $(`<span class="step"><i></i> <p>${name}</p> </span>`);
    this.moveTo(this.position);
    this.element.addClass('hide');
  }

  moveTo (position, withClassName) {
    this.element.css({left: position.x, top: position.y});
    withClassName && this.element.addClass(withClassName);
    return this;
  }

  animate (withClassName) {
    this.element.removeClass('hide');
    setTimeout(() => {
      this.moveTo({ x: 0, y: 0}, withClassName);
    }, 1000);
    return this;
  }

  render () {
    return this.element;
  }
}