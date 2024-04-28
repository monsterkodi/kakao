var _k_

var profile


profile = (function ()
{
    function profile ()
    {}

    profile["hrtime"] = {}
    profile["start"] = async function (id)
    {
        return profile.hrtime[id] = await kakao('now')
    }

    profile["end"] = async function (id, threshold = 0)
    {
        var b, f, t, u, v

        t = await kakao('now')
        b = t - profile.hrtime[id]
        f = 0.001
        var list = ['s','ms','μs']
        for (var _22_14_ = 0; _22_14_ < list.length; _22_14_++)
        {
            u = list[_22_14_]
            if (u === 'μs' || b * f > 1)
            {
                v = b * f
                v < 1 ? f = v.toFixed(2) : f = v.toFixed(0)
                if (b >= threshold)
                {
                    console.log(id + ' ' + f + ' ' + u)
                }
                return b
            }
            f *= 1000
        }
    }

    return profile
})()

export default profile;