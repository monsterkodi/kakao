var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var salt

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg


salt = (function ()
{
    function salt ()
    {}

    salt["isSaltedLine"] = function (line)
    {
        var trimmed

        trimmed = kseg.trim(kseg.trim(kseg.trim(line),'#'))
        if (_k_.in(trimmed[0],'█0'))
        {
            return kseg.collectGraphemes(trimmed).length <= 3
        }
    }

    salt["findPositionsForSaltInsert"] = function (lines, pos)
    {
        var ey, posl, sy, y

        y = pos[1]
        if (!this.isSaltedLine(lines[y]))
        {
            return
        }
        sy = y
        while (this.isSaltedLine(lines[sy - 1]))
        {
            sy -= 1
            if (y - sy >= 4)
            {
                break
            }
        }
        ey = y
        while (this.isSaltedLine(lines[ey + 1]))
        {
            ey += 1
            if (ey - sy >= 4)
            {
                break
            }
        }
        posl = []
        if (ey - sy >= 4)
        {
            for (var _a_ = y = sy, _b_ = sy + 4; (_a_ <= _b_ ? y <= sy + 4 : y >= sy + 4); (_a_ <= _b_ ? ++y : --y))
            {
                posl.push([pos[0],y])
            }
        }
        return posl
    }

    return salt
})()

export default salt;