var prof

import kxk from "../../kxk.js"
let kstr = kxk.kstr


prof = (function ()
{
    function prof ()
    {}

    prof["time"] = {}
    prof["start"] = function (name)
    {
        return prof.time[name] = process.hrtime()
    }

    prof["end"] = function (name)
    {
        return lf('ins',name,kstr.time(BigInt(process.hrtime(prof.time[name])[1])))
    }

    return prof
})()

export default prof;