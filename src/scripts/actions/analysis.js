import mixpanel from 'mixpanel-browser';
import { EMAIL_REG } from '../constant';

const analysis = {
  init: function () {
    mixpanel.init(__MIXPANEL_TOKEN__);
  },
  identify: function () {
    return mixpanel.identify.apply(mixpanel, arguments);
  },
  track: function () {
    return mixpanel.track.apply(mixpanel, arguments);
  },
  pageView: function (property) {
    return mixpanel.track('Page View', Object.assign({} ,{ path: location.pathname, protocol: location.protocol }, property));
  },
  people:{
    set: function () {
      return mixpanel.people.set.apply(mixpanel.people, arguments);
    },
    set_once: function () {
      return mixpanel.people.set_once.apply(mixpanel.people, arguments);
    },
    increment: function () {
      return mixpanel.people.increment.apply(mixpanel.people, arguments);
    }
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
  event: {
    getUserSuccess: function (user) {
      analysis.identify(user.email);
    },
    applyCi: function (fields, callback) {
      const old_distinct_id = mixpanel.get_distinct_id();
      analysis.alias(fields.email);
      analysis.event.getUserSuccess(fields);
      analysis.people.set_once({
        '$email': fields.email,
        'Apply_At': new Date(),
        'Application': 'apply'
      });
      analysis.people.set({
        'User_Infomation': fields.user_infomation
      });
      analysis.track('Input Email', fields, callback);
    },
    signIn: function (user, callback) {
      analysis.trackAlias(user.email);
      analysis.people.increment('signed_in', 1, callback);
    },
    signUp: function (user, urlParams, callback) {
      analysis.event.getUserSuccess(user);
      const isInvited = !!urlParams.project_id;
      const people = {
        '$first_name': user.username,
        '$created': new Date(),
        '$email': user.email,
        'buildtimes': 0,
        'Application': 'Passed'
      };

      analysis.people.set(people);
      analysis.track('Sign up', {
        distinct_id: user.email,
        Invited: isInvited ? 'YES' : 'NO'
      }, callback);
    },
    confirmEmail: function (urlParams) {
      analysis.identify(urlParams.email);
      analysis.track('Confirm Email');
    }
  }
}
export default analysis;
