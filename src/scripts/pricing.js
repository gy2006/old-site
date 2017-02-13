import $ from 'jquery'
import User from './actions/user'
import redirectToPay from './actions/redirectToPay'

function testLogin () {
  $('.buy').on('click', function () {
    if (User.getUserToken()) {
      redirectToPay()
    } else {
      window.location.href = '/signin.html'
    }
  })
}
export default function () {
  testLogin()
}
