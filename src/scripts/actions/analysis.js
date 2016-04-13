import mixpanel from 'mixpanel-browser';

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
    // must only use in sign up
    const nowId = mixpanel.get_distinct_id();
    mixpanel.alias(newId, nowId);
  },
  trackAlias: function (newId) {
    const nowId = mixpanel.get_distinct_id();
    // old distinct_id event
    // mixpanel.track('Alias To', {
    //   to_distinct_id: newId
    // });
    // new distinct_id event
    mixpanel.identify(newId);
    mixpanel.track('Alias', {
      old_distinct_id: nowId
    });
    mixpanel.people.append({ Alias: nowId });
    // mixpanel.alias(newId, nowId);
  },
  event: {
    getUserSuccess: function (user) {
      analysis.identify(user.email);
    },
    applyCi: function (fields, noAlias, callback) {
      const old_distinct_id = mixpanel.get_distinct_id();

      // 如果已经登录不需要alias
      !noAlias && analysis.alias(fields.email);

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
      // 如果已经登录，申请完成后，转回原来的distinct_id
      noAlias && analysis.identify(old_distinct_id);

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
