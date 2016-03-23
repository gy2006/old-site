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
  unknown:                  '00',
  invalid:                  '01',
  present:                  '10',
  accepted:                 '20',
  confirmation:             '30',
  exclusion:                '40',
  with:                     '50',
  without:                  '51',
  inclusion:                '60',
  wrong_length:             '70',
  too_short:                '71',
  too_long:                 '72',
  not_a_number:             '80',
  not_an_integer:           '81',
  greater_than:             '82',
  greater_than_or_equal_to: '83',
  equal_to:                 '84',
  less_than:                '85',
  less_than_or_equal_to:    '86',
  odd:                      '87',
  even:                     '88',
  other_than:               '89',
  blank:                    '90'
}

function isObject (value) {
  return value != null && typeof value === 'object';
}
function getFieldErrorMessage (errors) {
  const errorMessage = [];
  for (let field in errors) {
    const codes = errors[field];
    const ms = codes.map((code)=>{
      FIELD_CODE_MAPPING[code];
    }).filter((m)=> m);
    const message = field + ': ' + ms.join(',');
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
