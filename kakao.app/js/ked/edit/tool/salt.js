var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

var salt

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import salter from "../../../kxk/salter.js"


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

    salt["insertAsciiHeaderForPositionsAndRanges"] = function (lines, posl, ranges)
    {
        var indt, salt, text

        if (_k_.empty(ranges))
        {
            ranges = posl.map((function (p)
            {
                return this.rangeOfClosestWordToPos(lines,p)
            }).bind(this))
        }
        text = this.joinLines(this.textForLineRanges(lines,ranges),' ')
        indt = _k_.lpad(this.lineIndentAtPos(lines,posl[0]))
        salt = salter(text,{prepend:indt + '# '}) + '\n'
        var _a_ = this.insertTextAtPositions(lines,salt,[[0,posl[0][1]]]); lines = _a_[0]; posl = _a_[1]

        return [lines,posl,[]]
    }

    return salt
})()

export default salt;