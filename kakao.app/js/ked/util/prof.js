var _k_ = {lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

var prof

import kxk from "../../kxk.js"
let kstr = kxk.kstr


prof = (function ()
{
    function prof ()
    {}

    prof["tils"] = {}
    prof["til"] = function (args)
    {
        var key

        key = ''
        while (args.length)
        {
            key += args.shift()
            if (prof.tils[key])
            {
                return [key,prof.tils[key],args.join(' ')]
            }
            key += ' '
        }
    }

    prof["tstr"] = function (til, idx)
    {
        return _k_.lpad(6,kstr.time(BigInt(process.hrtime(til[(idx < 0 ? til.length + idx : idx)])[1])))
    }

    prof["start"] = function (...args)
    {
        return prof.tils[args.join(' ')] = [process.hrtime()]
    }

    prof["time"] = function (...args)
    {
        var key, rst, til

        var _a_ = prof.til(args); key = _a_[0]; til = _a_[1]; rst = _a_[2]

        til.push(process.hrtime())
        return lf(key,_k_.lpad(5,rst),prof.tstr(til,-2))
    }

    prof["end"] = function (...args)
    {
        var key, rst, til

        var _a_ = prof.til(args); key = _a_[0]; til = _a_[1]; rst = _a_[2]

        if (til.length > 1)
        {
            prof.time.apply(prof,[key,rst])
        }
        return lf(key,_k_.lpad(5),prof.tstr(til,0))
    }

    return prof
})()

export default prof;