var _k_ = {file: function () { return import.meta.url.substring(7); }, dir: function () { let url = import.meta.url.substring(7); let si = url.lastIndexOf('/'); return url.substring(0, si); }}

import test from "./test.js"

console.log('file',_k_.file())
console.log('dir',_k_.dir())
console.log('test:',test)