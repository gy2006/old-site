import Step from './step';
import $ from 'jquery';

const body = $('body');

export default class flowAnimate {
  constructor (stepNames = [], flow, flowLine, options = {}) {
    this.steps = stepNames.map((name) => new Step(name));
    this.flow = flow;
    this.flowLine = flowLine;
    this.beginLine = this.flow.offset().top - $(window).height() + options.bottom;
    this.beginListener();
    this.onScroll();
  }

  onScroll () {
    if (this.isAnimate) {
      return;
    }
    const t = body.scrollTop();
    if (t > this.beginLine) {
      this.animate();
    }
  }

  beginListener () {
    $(window).scroll(this.onScroll.bind(this));
  }
  animate () {
    this.isAnimate = true;
    setTimeout(() => {
      this.steps.forEach((step) => {
        step.animate()
      });
    }, 10);
    this.flowLine.addClass('active');
    $(window).off('scroll');
  }

  render () {
    this.steps.forEach((step) => {
      this.flow.append(step.render());
    });
  }
}