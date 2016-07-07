import analysis from './analysis'
import User from './user'

function noop () {}

export default function (fields, callback = noop) {
  if (User.getUserToken()) {
    analysis.event.applyCiWithIsLoggedIn(fields, callback)
  } else {
    analysis.event.applyCi(fields, callback)
  }
}
