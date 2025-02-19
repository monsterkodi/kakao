var toExport = {}
import util from "../util/util.js"

import kxk from "../../kxk.js"
let kseg = kxk.kseg


global.lf = function (...args)
{
    console.log(args.map(function (a)
    {
        return `${a}`
    }).join(' '))
}
toExport["edit"] = function ()
{
}
toExport["edit"]._section_ = true
toExport._test_ = true
export default toExport
