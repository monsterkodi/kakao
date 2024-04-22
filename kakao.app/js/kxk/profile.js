var _k_

var profile


profile = (function ()
{
    function profile ()
    {}

    profile["hrtime"] = {}
    profile["start"] = function (id)
    {
        return this.hrtime[id] = performance.now()
    }

    profile["end"] = function (id, threshold)
    {
        var b, f, u

        b = performance.now() - this.hrtime[id]
        f = 0.001
        var list = ['s','ms','μs','ns']
        for (var _17_18_ = 0; _17_18_ < list.length; _17_18_++)
        {
            u = list[_17_18_]
            if (u === 'ns' || b * f > 1)
            {
                if (b > threshold)
                {
                    console.log(id + ' ' + Number.parseFloat(b * f).toFixed(1) + ' ' + u)
                }
                return b
            }
            f *= 1000
        }
    }

    return profile
})()

export default profile;