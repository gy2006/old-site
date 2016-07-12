import Step from './step'
import $ from 'jquery'

window.$ = $
const body = $('body')

export default class flowAnimate {
  constructor (stepNames = [], flow, line, options = { bottom: 100 }) {
    this.steps = stepNames.map((name) => new Step(name))
    this.flow = flow
    this.line = line
    this.lineHeight = -42
    this.lineWidth = 0
    this.options = options

    this.render()

    this.reflush()

    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)

    this.listen()

    this.onResize()
    this.onScroll()
  }

  reflush () {
    this.animates = this.steps.map((step, i) => {
      const client = step.element[0].getBoundingClientRect()
      return {
        index: i,
        top: step.getOffset().top,
        height: client.height,
        width: client.width,
        element: step
      }
    })
  }

  onResize () {
    const height = $(window).height()
    const width = $(window).width()

    this.screen = {
      height,
      width
    }
  }

  listen () {
    $(window).scroll(this.onScroll)
    $(window).resize(this.onResize)
  }

  unlisten () {
    $(window).off('scroll', this.onScroll)
    $(window).off('resize', this.onResize)
  }

  onScroll () {
    const screen = this.screen
    const bottom = body.scrollTop() + screen.height - this.options.bottom
    let begin = 0
    const determined = []
    this.animates.every((animate, i) => {
      if (animate.top < bottom) {
        determined.push(animate)
        begin++
        return true
      }
      return false
    })
    this.animates = this.animates.slice(begin, this.animates.length)
    this.startAnimate(determined, this.animates)
    this.isEnd = this.animates.length === 0
    if (!this.animates.length) {
      this.unlisten()
    }
  }

  startAnimate (array, otherArray) {
    if (!array.length) {
      return
    } else if (this.onAnimateStep) {
      this.onAnimateStep = this.onAnimateStep.concat(array)
      return
    }
    // let index = 0
    this.onAnimateStep = array

    this.timer = setTimeout(() => {
      this.onAnimateStep.forEach((a) => {
        this.stepAnimate(a)
      })
      this.onAnimateStep = undefined
      if (this.isEnd) {
        this.endAnimate()
      }
    }, 300)
  }

  endAnimate () {
    this.line.addClass('active')
  }

  stepAnimate (animate) {
    this.addLine(animate)
    animate.element.animate()
  }

  addLine (ah) {
    const line = this.line
    if (this.screen.width < 600) {
      this.lineHeight = this.lineHeight + ah.height
      line.height(this.lineHeight)
    }
  }

  render () {
    this.steps.forEach((step) => {
      this.flow.append(step.render())
    })
  }
}
