import $ from 'jquery'
import saveAccessToken from './saveAccessToken'
import { SIGNIN_URL } from '../constant'
import redirectToDashboard from './redirectToDashboard'
import analysis from './analysis'
import User from './user'
import Browser from '../util/browser'
import getSearch from '../util/getSearch'

export default function signIn (data) {
  const locale = Browser.locale === 'en' ? 'en' : 'zh-CN'
  const location = window.location
  const params = (getSearch(location))
  const code = params.code || ''
  return $.post({
    url: SIGNIN_URL,
    data: Object.assign(data, { locale }, { code })
  }).done((resp) => {
    const accessToken = resp.access_token
    saveAccessToken(accessToken)
    if (!!params.code && !!params.redirect_uri) {
      window.location.href = `${params.redirect_uri}?code=${params.code}`
    } else {
      User.get(accessToken).done(function (user) {
        analysis.event.signIn(user, function () {
          redirectToDashboard(accessToken)
        })
      })
    }
    // redirect to dashboard;
  })
}
