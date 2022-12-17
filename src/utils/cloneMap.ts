export function cloneMap(map: Map<any, any>) {
  let obj = Object.create(null);
  for (let [k, v] of map) {
    obj[k] = v;
  }
  obj = JSON.stringify(obj);
  obj = JSON.parse(obj);
  let tmpMap = new Map();
  for (let k of Object.keys(obj)) {
    tmpMap.set(k, obj[k]);
  }
  return tmpMap;
}
