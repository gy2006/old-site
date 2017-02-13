import $ from 'jquery'
import saveAccessToken from './saveAccessToken'
import { SIGNIN_URL } from '../constant'
import redirectToDashboard from './redirectToDashboard'
import analysis from './analysis'
import User from './user'
import Browser from '../util/browser'

export default function signIn (data) {
  const locale = Browser.locale === 'en' ? 'en' : 'zh-CN'
  return $.post({
    url: SIGNIN_URL,
    data: Object.assign(data, { locale })
  }).done((resp) => {
    const accessToken = resp.access_token
    saveAccessToken(accessToken)

    User.get(accessToken).done(function (user) {
      analysis.event.signIn(user, function () {
        redirectToDashboard(accessToken)
      })
    })

    // redirect to dashboard;
  })
}
