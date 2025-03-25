var toExport = {}
import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke

toExport["export"] = function ()
{
    compare(kc(`export
    k: 1
    $: 2`),`export default {
    k:1,
    $:2
}`)
    compare(kc(`export    k: 1    $: 2`),`export default {k:1,$:2};`)
    compare(kc(`export
    elem: elem
    $: (a) -> log a`),`export default {
    elem:elem,
    $:function (a)
    {
        console.log(a)
    }
}`)
    compare(kc('export single'),'export default single;')
    compare(kc('d = { export:1 }'),'d = {export:1}')
    compare(kc('d = export:2'),'d = {export:2}')
}
toExport["export"]._section_ = true
toExport._test_ = true
export default toExport
