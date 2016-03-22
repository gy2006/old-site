const maxLoop = 10;
export default function getSearch () {
  const search = location.search;
  const params = {};
  const reg = /([\w\d]+)\=([^&]*)/g;
  let loop = maxLoop;
  while(reg.test(search) && loop > 0) {
    params[RegExp.$1] = decodeURIComponent(RegExp.$2);
    loop--;
  }
  return params;
}