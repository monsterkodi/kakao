var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var Krzl


Krzl = (function ()
{
    function Krzl (values)
    {
        this.values = values
    
        this.extract = function (i)
        {
            return i
        }
        this.weight = this.defaultWeight
    }

    Krzl.prototype["match"] = function (abbrv, exstr)
    {
        var ac, ai, ec, ei, indices

        if (_k_.isStr(abbrv) && _k_.isStr(exstr))
        {
            ai = 0
            ei = 0
            indices = []
            while (ai < abbrv.length && ei < exstr.length)
            {
                ac = abbrv[ai]
                ec = exstr[ei]
                if (ac === ec)
                {
                    indices.push(ei)
                    ai++
                    ei++
                    continue
                }
                ei++
            }
            if (ai === abbrv.length)
            {
                return {extract:exstr,indices:indices}
            }
        }
        return null
    }

    Krzl.prototype["defaultWeight"] = function (pair)
    {
        var info, value

        var _47_22_ = pair; value = _47_22_[0]; info = _47_22_[1]

        return info.indices[0] + 1 - 1 / info.extract.length
    }

    Krzl.prototype["sort"] = function (pairs)
    {
        return pairs.sort((function (a, b)
        {
            return this.weight(a) - this.weight(b)
        }).bind(this))
    }

    Krzl.prototype["filter"] = function (abbrv)
    {
        var mi, pairs, value

        pairs = []
        var list = _k_.list(this.values)
        for (var _61_18_ = 0; _61_18_ < list.length; _61_18_++)
        {
            value = list[_61_18_]
            if (mi = this.match(abbrv,this.extract(value)))
            {
                pairs.push([value,mi])
            }
        }
        this.sort(pairs)
        return pairs.map(function (p)
        {
            return p[0]
        })
    }

    return Krzl
})()

export default Krzl;