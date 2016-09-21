import cookies from './cookies'
import setLocale from '../actions/setLocale'

function getUA () {
  return navigator.userAgent
}
function isIE () {
  return /MSIE/i.test(getUA())
}

function getSearch () {
  const maxLoop = 20
  const search = location.search
  const params = {}
  const reg = /([\w\d]+)=([^&]*)/g
  let loop = maxLoop
  while (reg.test(search) && loop > 0) {
    params[RegExp.$1] = decodeURIComponent(RegExp.$2)
    loop--
  }
  return params
}

const supportLanguages = ['zh', 'en']
function getLocale () {
  const cookieLocale = cookies.get('locale')
  const pl = getSearch()['locale']
  let languages = (navigator.languages || [navigator.language])
  if (pl) {
    languages = [pl]
  } else if (cookieLocale) {
    languages = [cookieLocale]
  }
  let language
  // /^(zh|en)/
  const regexp = new RegExp(`^(${supportLanguages.join('|')})`, 'i')
  languages.some((l) => {
    if (regexp.test(l)) {
      language = RegExp.$1
      return true
    }
    return false
  })
  const locale = language || 'en'

  if (cookieLocale !== locale) {
    setLocale(locale)
  }
  return locale
}

export default {
  isIE: isIE(),
  locale: getLocale()
}
