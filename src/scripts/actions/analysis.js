import mixpanel from 'mixpanel-browser';

export default {
  init: function () {
    return mixpanel.init.apply(mixpanel, arguments);
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
  time_event: function (timeName) {
    return mixpanel.time_event.apply(mixpanel, arguments);
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
    const nowId = mixpanel.get_distinct_id();
    mixpanel.alias(newId, nowId);
  },
  track_alias: function (newId) {
    const nowId = mixpanel.get_distinct_id();
    // old distinct_id event
    mixpanel.track('Alias To', {
      to_distinct_id: newId
    });
    // new distinct_id event
    mixpanel.identify(newId);
    mixpanel.track('Alias', {
      old_distinct_id: nowId
    });
    mixpanel.people.append({ Alias: nowId });
    // mixpanel.alias(newId, nowId);
  }
}