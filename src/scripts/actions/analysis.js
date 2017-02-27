import mixpanel from 'mixpanel-browser'
import { UTM_LIST } from '../constant'
import cookies from '../util/cookies'
import browser from '../util/browser'
import $ from 'jquery'

function getDomain () {
  const matches = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i)
  const domain = matches ? matches[0] : ''
  const cdomain = ((domain) ? '; domain=.' + domain : '')
  return cdomain
}

const cookieConfig = {
  'domain': getDomain()
}

class MixpanelVariables {
  init (token) {
    this.cookieName = this._getCookieName(token)
    this.cookieConfig = cookieConfig
    this.values = this._getValues()
  }

  _getCookieName (token) {
    return `flow_mp_${token}_variables`
  }

  _getValues () {
    return JSON.parse(cookies.get(this.cookieName) || '{}')
  }

  _saveValues () {
    cookies.save(this.cookieName, JSON.stringify(this.values), this.cookieConfig)
  }

  getValue (key) {
    return key ? this.values[key] : this.values
  }

  setValue (map) {
    this.values = Object.assign(this.values, map)
    this._saveValues()
  }

  clear (key) {
    if (key) {
      delete this.values[key]
    } else {
      this.values = {}
    }
    this._saveValues()
  }
}

const mixpanelVariables = new MixpanelVariables()

function getIncrementName (eventName) {
  return `# of ${eventName}`
}
function getLastName (eventName) {
  return `Last ${eventName}`
}

function getFirstName (eventName) {
  return `First ${eventName}`
}

function increment (property, number = 1) {
  let v = 0
  try {
    v = parseInt(mixpanel.get_property(property)) || 0
  } catch (e) { v = 0 }
  mixpanel.register({ [property]: (v + number) })
  mixpanel.people.increment(property, number)
}

function getPropertys (names) {
  const props = {}
  names && names.forEach(function (name) {
    props[name] = mixpanel.get_property(name)
  })
  return props
}

function track (eventName, props, callback) {
  const now = new Date().toISOString()
  mixpanel.register({
    [getLastName(eventName)]: now
  })
  registerOnce(getFirstName(eventName), now)

  mixpanel.track(eventName, props, callback)
}

function setPeople (eventName, names, callback) {
  names = names || []
  names.push('Previous Event Name')
  names.push('Browser Language')
  names.push(getLastName(eventName))

  const p = getPropertys(names)
  mixpanel.people.set(p)
  mixpanel.people.set_once(getPropertys([getFirstName(eventName)]), callback)
}

function registerOnce (propName, value) {
  if (!mixpanel.get_property(propName)) {
    mixpanel.register({ [propName]: value })
  }
}

function incrementEvent (eventName) {
  increment(getIncrementName(eventName))
}

function trackFullEvent (eventName, props, peoplePropsName, options = {}, callback) {
  incrementEvent(eventName)
  track(eventName, props)
  setPeople(eventName, peoplePropsName, callback)

  !options.noPrevious && mixpanel.register({
    'Previous Event Name': eventName
  })
}

function getIp (callback) {
  $.get(`//${__MIXPANEL_PROXY__}/ip`).done((data) => {
    const ip = data.ip
    callback(ip)
  })
}

const analysis = {
  init: function () {
    const HTTP_PROTOCOL = ((document.location.protocol === 'https:') ? 'https://' : 'http://')
    const MIXPANEL_HOST = `${HTTP_PROTOCOL}${__MIXPANEL_PROXY__}`

    mixpanel.init(__MIXPANEL_TOKEN__, {
      'api_host': MIXPANEL_HOST,
      'decide_host': MIXPANEL_HOST
    })
    mixpanel.set_client_ip(mixpanel.get_property('ip'))
    getIp(function (ip) {
      mixpanel.set_client_ip(ip)
    })
    mixpanelVariables.init(__MIXPANEL_TOKEN__)
    mixpanel.register({ 'Browser Language': browser.locale })
  },
  pageView: function () {
    const eventName = 'Page View'
    const props = { path: location.pathname, protocol: location.protocol }
    trackFullEvent(eventName, props, [], { noPrevious: true })
  },
  trackAlias: function (newId) {
    const oldId = mixpanel.get_distinct_id()
    // old distinct_id event
    // mixpanel.track('Alias To', {
    //   to_distinct_id: newId
    // });
    // new distinct_id event
    mixpanel.identify(newId)
    mixpanel.track('Alias', {
      old_distinct_id: oldId
    })
    mixpanel.people.append({ Alias: oldId })
    // mixpanel.alias(newId, oldId);
  },
  register: function (property) {
    mixpanelVariables.setValue(property)
  },
  common: {
    getCreatePeopleProperty: function (fields) {
      const utm = {}
      UTM_LIST.forEach((key) => {
        const value = mixpanelVariables.getValue(key)
        if (value) {
          utm[key] = value
        }
      })
      const people = {
        '$email': fields.email,
        'name': fields.username,
        'Apply_At': new Date(),
        'Application': 'apply',
        'Company': fields.company_name,
        '职位': fields.job,
        '电话': fields.telephone,
        '开发团队规模': fields.company_scale
      }
      return Object.assign({}, people, utm)
    }
  },
  event: {
    getUserSuccess: function (user) {
      mixpanel.identify(user.email)
    },
    signIn: function (user, callback) {
      analysis.trackAlias(user.email)
      mixpanel.register({ 'email': user.email })
      mixpanel.people.increment('signed_in', 1, callback)
    },
    signUp: function (user, urlParams, userCallback) {
      let callbackCount = 2
      function callback () {
        callbackCount--
        if (callbackCount === 0) {
          userCallback()
        }
      }
      mixpanel.alias(user.email, undefined, callback)
      const people = analysis.common.getCreatePeopleProperty(user)
      mixpanel.people.set_once(people)
      const isInvited = !!urlParams.project_id
      trackFullEvent('Sign up', {
        Invited: isInvited ? 'YES' : 'NO'
      }, [], {}, callback)
    },
    confirmEmail: function (urlParams) {
      mixpanel.identify(urlParams.email)
      if (urlParams.inviter_email) {
        mixpanelVariables.setValue({ Inviter: urlParams.inviter_email })
      }
      mixpanel.track('Confirm Email')
    },
    setLocale: function (locale) {
      mixpanel.track('Switch Language')
      mixpanel.people.set({ 'Language Selected': locale })
    }
  }
}

export default analysis
