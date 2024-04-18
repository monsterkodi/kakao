var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var pretty


pretty = (function ()
{
    function pretty ()
    {}

    pretty["age"] = function (dateOrString)
    {
        var date, diff, key, s, time, val

        if (_k_.isStr(dateOrString))
        {
            date = new Date(Date.parse)
        }
        else
        {
            date = new Date(dateOrString)
        }
        diff = new Date(Date.now() - date.valueOf())
        time = {year:diff.getUTCFullYear() - 1970,month:diff.getUTCMonth(),day:diff.getUTCDay(),hour:diff.getUTCHours(),minute:diff.getUTCMinutes(),second:diff.getUTCSeconds()}
        s = []
        for (key in time)
        {
            val = time[key]
            if (val === 0)
            {
                if (s.length)
                {
                    return s[0]
                }
            }
            else if (val === 1)
            {
                s.push(`a ${key}`)
            }
            else
            {
                s.push(`${val} ${key}s`)
            }
            if (s.length === 2)
            {
                return s.join(' ')
            }
        }
        return s.join(' ')
    }

    pretty["bytes"] = function (bytes)
    {
        var exponent, number, numberString, unit, UNITS

        number = parseInt(bytes)
        UNITS = ['B','kB','MB','GB','TB']
        exponent = Math.min(Math.floor(Math.log10(number) / 3),UNITS.length - 1)
        number /= Math.pow(1000,exponent)
        number = number.toPrecision(2)
        numberString = new String(number)
        unit = UNITS[exponent]
        return numberString + ' ' + unit
    }

    return pretty
})()

export default pretty;