var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, isFunc: function (o) {return typeof o === 'function'}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        this.weight = null
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

    Krzl.prototype["calcWeight"] = function (pair)
    {
        var e, info, value, w

        var _47_22_ = pair; value = _47_22_[0]; info = _47_22_[1]

        e = 0.00001
        w = e
        if (_k_.isFunc(this.weight))
        {
            w = this.weight(value,info)
            if (!(_k_.isNum(w)) || w < e)
            {
                w = e
            }
        }
        return (1 / w) * (info.indices[0] + 1 - 1 / info.extract.length)
    }

    Krzl.prototype["sort"] = function (pairs)
    {
        return pairs.sort((function (a, b)
        {
            return this.calcWeight(a) - this.calcWeight(b)
        }).bind(this))
    }

    Krzl.prototype["filter"] = function (abbrv)
    {
        var mi, pairs, value

        pairs = []
        if (_k_.empty(abbrv))
        {
            console.warn('krzl.filter without abbreviation?')
            return pairs
        }
        var list = _k_.list(this.values)
        for (var _67_18_ = 0; _67_18_ < list.length; _67_18_++)
        {
            value = list[_67_18_]
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