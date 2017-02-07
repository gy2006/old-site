import $ from 'jquery'
import User from './actions/user'
function testLogin () {
  if (User.getUserToken()) {
    $('.buy').on('click', function () {
      window.location.href = 'dashboard.flow.ci/'
    })
  } else {
    window.location.href = 'signin.html'
  }
}
export default function abc () {
  testLogin()
}
