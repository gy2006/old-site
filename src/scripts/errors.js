const CODE_MAPPING = {
  100001: 'Invite code required',
  100002: 'Username/Email required',
  100003: 'Password required',
  100005: 'User is locked',
  100007: 'Invite code invalid',
  100008: 'Email/Username/Password not correct',
  100009: 'Email occupied',
  100010: 'User not found'
}

const FIELD_CODE_MAPPING = {
  '00': 'unknown',
  '01': 'invalid',
  '10': 'present',
  '20': 'accepted',
  '30': 'confirmation',
  '40': 'exclusion',
  '50': 'with',
  '51': 'without',
  '60': 'inclusion',
  '70': 'wrong_length',
  '71': 'too_short',
  '72': 'too_long',
  '80': 'not_a_number',
  '81': 'not_an_integer',
  '82': 'greater_than',
  '83': 'greater_than_or_equal_to',
  '84': 'equal_to',
  '85': 'less_than',
  '86': 'less_than_or_equal_to',
  '87': 'odd',
  '88': 'even',
  '89': 'other_than',
  '90': 'blank'
}

function isObject (value) {
  return value != null && typeof value === 'object';
}
function getFieldErrorMessage (errors) {
  const errorMessage = [];
  for (let field in errors) {
    const codes = errors[field];
    const ms = codes.map((code)=>{
      return FIELD_CODE_MAPPING[code];
    }).filter((m)=> m);
    const message = field + ': ' + ms.join(', ');
    errorMessage.push(message);
  }
  return errorMessage.join('\n');
}

export default function getErrorMessage (resp) {
  const data = resp.responseJSON;
  if (!data) {
    return `HTTP STATUS: ${resp.status}`
  }

  if (data.code) {
    return CODE_MAPPING[data.code];
  }
  const errors = data.errors;
  if (isObject(errors)) {
    return getFieldErrorMessage(errors);
  } else {
    return 'System is busy';
  }
}
