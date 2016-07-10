import $ from 'jquery'

$(function () {
  const $collpase = $('.navbar-collpase')
  $('.navbar-toggle').click(function () {
    $collpase.toggleClass('collpase')
  })
})
