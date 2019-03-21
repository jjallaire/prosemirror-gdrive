

export function jsonStringifyEscaped(obj) {
  let json = JSON.stringify(obj)
  json = json.replace(/[\u007F-\uFFFF]/g, function(chr) {
    return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
  });
  return json;
} 