import $ from 'jquery';

const TIME_INTERVAL = 800;

function fill (chart, length) {
  let i = 0;
  let str = '';
  while (i < length) {
    str += chart;
    i++;
  }
  return str;
}

export default class Button {
  constructor (element) {
    this.$element = $(element);
    this.value = this.$element.val();
  }

  setDisabled (isDisabled) {
    return this.$element.attr('disabled', isDisabled ? 'disabled' : null);
  }

  startLoading () {
    let loop = 0;
    this.timer = setInterval(() => {
      loop++;
      const length = loop % 4;
      this.$element.val(this.value + fill(' .', length));
    }, TIME_INTERVAL)
  }

  endLoading () {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.$element.val(this.value);
    }
  }


}