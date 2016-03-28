import OjectAssign from 'object-assign';

var DEFINE_PROPERTY = "defineProperty";

function define (key, value) {
  Object.prototype[key] || Object[DEFINE_PROPERTY](Object.prototype, key, {
    writable: true,
    configurable: true,
    value: value
  });
}
define('assign', OjectAssign);