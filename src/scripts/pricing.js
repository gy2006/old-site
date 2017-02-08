import $ from 'jquery'
import User from './actions/user'
import redirectToDashboard from './actions/redirectToDashboard'

function testLogin () {
  $('.buy').on('click', function () {
    if (User.getUserToken()) {
      redirectToDashboard()
    } else {
      window.location.href = '/signin.html'
    }
  })
}
export default function () {
  testLogin()
}
