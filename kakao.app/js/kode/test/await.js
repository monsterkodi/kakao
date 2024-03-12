var toExport = {}
var _k_

import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["await"] = function ()
{
    compare(kc('await someFunctionCall()'),'await someFunctionCall()')
    compare(kc('await call(); await again()'),'await call()\nawait again()')
    compare(kc('await call 1; await again 2'),'await call(1)\nawait again(2)')
    compare(kc('d = { await:1 }'),'d = {await:1}')
}
toExport["await"]._section_ = true
toExport._test_ = true
export default toExport
