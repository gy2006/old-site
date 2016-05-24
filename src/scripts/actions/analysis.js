import mixpanel from 'mixpanel-browser';
import { EMAIL_REG, UTM_LIST } from '../constant';
import cookies from '../util/cookies';
import browser from './analysis';

function getDomain () {
  const matches = document.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i);
  const domain = matches ? matches[0] : '';
  const cdomain = ((domain) ? '; domain=.' + domain : '');
  return cdomain;
}

const cookieConfig = {
  'domain': getDomain()
};

class MixpanelVariables {
  init (token) {
    this.cookieName = this._getCookieName(token);
    this.cookieConfig = cookieConfig;
    this.values = this._getValues();
  }

  _getCookieName (token) {
    return `flow_mp_${token}_variables`;
  }

  _getValues () {
    return JSON.parse(cookies.get(this.cookieName) || '{}');
  }

  _saveValues () {
    cookies.save(this.cookieName, JSON.stringify(this.values), this.cookieConfig);
  }

  getValue (key) {
    return key ? this.values[key] : this.values;
  }

  setValue (map) {
    this.values = Object.assign(this.values, map);
    this._saveValues();
  }

  clear (key) {
    if (key) {
      delete this.values[key];
    } else {
      this.values = {};
    }
    this._saveValues();
  }
}

const mixpanelVariables = new MixpanelVariables();

function getIncrementName (eventName) {
  return `# of ${eventName}`;
}
function getLastName (eventName) {
  return `Last ${eventName}`;
}

function getFirstName (eventName) {
  return `First ${eventName}`;
}

function increment (property, number = 1) {
  let v = 0;
  try {
    v = parseInt(mixpanel.get_property(property)) || 0;
  } catch (e) { v = 0; }
  mixpanel.register({ [property]: (v + number) });
  mixpanel.people.increment(property, number);
}

function getPropertys (names) {
  const props = {};
  names && names.forEach(function (name) {
    props[name] = mixpanel.get_property(name);
  });
  return props;
}

function track (eventName, props, callback) {
  const now = new Date().toISOString();
  mixpanel.register({
    [getLastName(eventName)]: now
  });
  registerOnce(getFirstName(eventName), now);

  mixpanel.track(eventName, props, callback);
}

function setPeople (eventName, names, callback) {
  names = names || [];
  names.push('Previous Event Name');
  names.push('Browser Language');
  names.push(getLastName(eventName));

  const p = getPropertys(names);
  mixpanel.people.set(p);
  mixpanel.people.set_once(getPropertys([getFirstName(eventName)]), callback);
}

function registerOnce (propName, value) {
  if (!mixpanel.get_property(propName)) {
    mixpanel.register({ [propName]: value });
  }
}

function incrementEvent (eventName) {
  increment(getIncrementName(eventName));
}

function trackFullEvent (eventName, props, peoplePropsName, options = {}, callback) {
  incrementEvent(eventName);
  track(eventName, props);
  setPeople(eventName, peoplePropsName, callback);

  !options.noPrevious && mixpanel.register({
    'Previous Event Name': eventName
  });
}

const analysis = {
  init: function () {
    mixpanel.init(__MIXPANEL_TOKEN__);
    mixpanelVariables.init(__MIXPANEL_TOKEN__);
    mixpanel.register({ 'Browser Language': browser.locale });
  },
  identify: function (id) {
    if (id !== mixpanel.get_distinct_id()) {
      mixpanelVariables.clear();
    }
    return mixpanel.identify(id);
  },
  pageView: function () {
    const eventName = 'Page View';
    const props = { path: location.pathname, protocol: location.protocol };
    trackFullEvent(eventName, props, [], { noPrevious: true });
  },
  alias: function (newId) {
    // must only use create mixpanel people
    const oldId = mixpanel.get_distinct_id();
    /**
      1. 对于同一个 distinct_id, alias 只能在第一次生效
      2. 当前逻辑是只有当 distinct_id 为 mixpanel 自动生成的 id 才使用 alias。
      3. 如果在同一个浏览器多次申请，在第二次及之后申请的时候在 alias 会使 distinct_id 设置失效，所以判断是否已经alias。 在第三次时，此时 alias 已经为空，但是 distinct_id 为邮箱，所以在加判断 distinct_id 是否为邮箱
    **/
    // 如果是uuid 则为mixpanel自动生成，则alias， 否则用 identify
    try {
      const hasAlias = mixpanel.persistence.props.__alias;
      if (hasAlias) {
        mixpanel.identify(newId);
        return;
      }
    } catch (e) {}
    if (EMAIL_REG.test(oldId)) {
      mixpanel.identify(newId);
    } else {
      mixpanel.alias(newId, oldId);
    }
  },
  trackAlias: function (newId) {
    const oldId = mixpanel.get_distinct_id();
    // old distinct_id event
    // mixpanel.track('Alias To', {
    //   to_distinct_id: newId
    // });
    // new distinct_id event
    mixpanel.identify(newId);
    mixpanel.track('Alias', {
      old_distinct_id: oldId
    });
    mixpanel.people.append({ Alias: oldId });
    // mixpanel.alias(newId, oldId);
  },
  register: function (property) {
    mixpanelVariables.setValue(property);
  },
  common: {
    runWithDistinctId: function (id, callFn) {
      const nowDistinctId = mixpanel.get_distinct_id();
      analysis.identify(id);
      callFn && callFn();
      analysis.identify(nowDistinctId);
    },
    getCreatePeopleProperty: function (fields) {
      const utm = {};
      UTM_LIST.forEach((key) => {
        const value = mixpanelVariables.getValue(key);
        if (value) {
          utm[key] = value;
        }
      });
      const people = {
        '$email': fields.email,
        'Apply_At': new Date(),
        'Application': 'apply'
      };
      return Object.assign({}, people, utm);
    }
  },
  event: {
    getUserSuccess: function (user) {
      analysis.identify(user.email);
    },
    applyCi: function (fields, callback) {
      const people = analysis.common.getCreatePeopleProperty(fields);
      analysis.alias(fields.email);
      analysis.event.getUserSuccess(fields);
      mixpanel.people.set_once(people);
      trackFullEvent('Input Email', fields, [], {}, callback);
    },
    applyCiWithIsLoggedIn: function (fields, callback) {
      const people = analysis.common.getCreatePeopleProperty(fields);
      analysis.common.runWithDistinctId(fields.email, function () {
        mixpanel.people.set_once(people);
        mixpanel.track('Input Email', fields, callback);
      });
    },
    signIn: function (user, callback) {
      analysis.trackAlias(user.email);
      mixpanel.register({ 'email': user.email });
      mixpanel.people.increment('signed_in', 1, callback);
    },
    signUp: function (user, urlParams, callback) {
      analysis.event.getUserSuccess(user);
      const isInvited = !!urlParams.project_id;
      trackFullEvent('Sign up', {
        Invited: isInvited ? 'YES' : 'NO'
      }, [], {}, callback);
    },
    confirmEmail: function (urlParams) {
      analysis.identify(urlParams.email);
      if (urlParams.inviter_email) {
        mixpanelVariables.setValue({ Inviter: urlParams.inviter_email });
      }
      mixpanel.track('Confirm Email');
    }
  }
};

export default analysis;
