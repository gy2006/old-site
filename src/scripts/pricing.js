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
  $('.contact_way .btn').on('click', function () {
    const drift = window.drift
    drift && drift.api && drift.api.openChat && drift.api.openChat()
  })
}
export default function () {
  testLogin()
}
