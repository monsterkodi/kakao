var toExport = {}
import utils from "./utils.js"
let kf = utils.kf

toExport["fail"] = function ()
{
    compare(kf("✘"),true)
    compare(kf("r = some.call((some args)"),true)
    compare(kf("r = some.call(some args))"),true)
    compare(kf('log "▪▪#{id"'),true)
    compare(kf(`f = ->
    r = some.call(some args))
    log 'r' r
    r`),true)
}
toExport["fail"]._section_ = true
toExport._test_ = true
export default toExport
