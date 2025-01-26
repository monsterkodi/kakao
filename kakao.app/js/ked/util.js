var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../kxk.js"
let kstr = kxk.kstr

class util
{
    static isPosInsideRange (pos, rng)
    {
        if (util.isPosBeforeRange(pos,rng))
        {
            return false
        }
        if (util.isPosAfterRange(pos,rng))
        {
            return false
        }
        return true
    }

    static isPosBeforeRange (pos, rng)
    {
        return pos[1] < rng[1] || (pos[1] === rng[1] && pos[0] < rng[0])
    }

    static isPosAfterRange (pos, rng)
    {
        return pos[1] > rng[3] || (pos[1] === rng[3] && pos[0] > rng[2])
    }

    static numFullLinesInRange (lines, rng)
    {
        var d, n

        d = rng[3] - rng[1]
        if (d === 0)
        {
            return rng[0] === 0 && (rng[2] === lines[rng[1]].length ? 1 : 0)
        }
        n = 0
        if (rng[0] === 0)
        {
            n += 1
        }
        if (d > 1)
        {
            n += d - 2
        }
        if (rng[2] === lines[rng[3]].length)
        {
            n += 1
        }
        return n
    }

    static normalizeRanges (rngs)
    {
        if (_k_.empty(rngs))
        {
            return []
        }
        rngs = rngs.map(function (a)
        {
            if (a[1] > a[3])
            {
                return [a[2],a[3],a[0],a[1]]
            }
            else
            {
                return a
            }
        })
        rngs = rngs.map(function (a)
        {
            if (a[1] === a[3] && a[0] > a[2])
            {
                return [a[2],a[1],a[0],a[3]]
            }
            else
            {
                return a
            }
        })
        rngs.sort(function (a, b)
        {
            if (a[1] === b[1])
            {
                return a[0] - b[0]
            }
            else
            {
                return a[1] - b[1]
            }
        })
        return rngs = rngs.filter(function (a)
        {
            return a[0] !== a[2] || a[1] !== a[3]
        })
    }

    static mergeRanges (rngs)
    {
        var i, lastmrgd, mrgd, s

        if (_k_.empty(rngs))
        {
            return []
        }
        rngs = util.normalizeRanges(rngs)
        mrgd = []
        var list = _k_.list(rngs)
        for (i = 0; i < list.length; i++)
        {
            s = list[i]
            lastmrgd = (!_k_.empty(mrgd) ? mrgd[mrgd.length - 1] : [])
            if (_k_.empty(mrgd) || s[1] > lastmrgd[3] || s[1] === lastmrgd[3] && s[0] > lastmrgd[2])
            {
                mrgd.push(s)
            }
            else if (s[3] > lastmrgd[3] || s[3] === lastmrgd[3] && s[2] > lastmrgd[2])
            {
                lastmrgd[2] = s[2]
                lastmrgd[3] = s[3]
            }
        }
        return mrgd
    }

    static textForLinesRange (lines, rng)
    {
        var l, y

        if (_k_.empty(lines))
        {
            return ''
        }
        if (_k_.empty(rng))
        {
            return ''
        }
        l = []
        for (var _a_ = y = rng[1], _b_ = rng[3]; (_a_ <= _b_ ? y <= rng[3] : y >= rng[3]); (_a_ <= _b_ ? ++y : --y))
        {
            if ((0 <= y && y < lines.length))
            {
                if (y === rng[1])
                {
                    if (y === rng[3])
                    {
                        l.push(lines[y].slice(rng[0], typeof rng[2] === 'number' ? rng[2] : -1))
                    }
                    else
                    {
                        l.push(lines[y].slice(rng[0]))
                    }
                }
                else if (y === rng[3])
                {
                    l.push(lines[y].slice(0, typeof rng[2] === 'number' ? rng[2] : -1))
                }
                else
                {
                    l.push(lines[y])
                }
            }
        }
        return l.join('\n')
    }

    static textForLinesRanges (lines, rngs)
    {
        var rng, text

        if (_k_.empty(lines))
        {
            return ''
        }
        text = ''
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            text += util.textForLinesRange(lines,rng)
            text += '\n'
        }
        return text.slice(0, -1)
    }

    static deleteLinesRangesAndAdjustCursor (lines, rngs, cursor)
    {
        var partialFirst, sel, si

        for (var _a_ = si = rngs.length - 1, _b_ = 0; (_a_ <= _b_ ? si <= 0 : si >= 0); (_a_ <= _b_ ? ++si : --si))
        {
            sel = rngs[si]
            if (util.isPosInsideRange(cursor,sel))
            {
                cursor = [sel[0],sel[1]]
            }
            else if (util.isPosAfterRange(cursor,sel))
            {
                if (cursor[1] === sel[3])
                {
                    if (sel[1] === sel[3])
                    {
                        cursor[0] = sel[0]
                    }
                    else
                    {
                        cursor[0] = 0
                    }
                }
                else
                {
                    cursor[1] -= util.numFullLinesInRange(lines,sel)
                }
            }
            if (sel[1] === sel[3])
            {
                if (sel[0] === 0 && sel[2] === lines[sel[1]].length)
                {
                    lines.splice(sel[1],1)
                }
                else
                {
                    lines.splice(sel[1],1,kstr.splice(lines[sel[1]],sel[0],sel[2] - sel[0]))
                }
            }
            else
            {
                if (sel[2] === lines[sel[3]].length)
                {
                    lines.splice(sel[3],1)
                }
                else
                {
                    lines.splice(sel[3],1,lines[sel[3]].slice(sel[2]))
                    partialFirst = true
                }
                if (sel[3] - sel[1] > 1)
                {
                    lines.splice(sel[1] + 1,sel[3] - sel[1] - 1)
                }
                if (sel[0] === 0)
                {
                    lines.splice(sel[1],1)
                }
                else
                {
                    lines.splice(sel[1],1,lines[sel[1]].slice(0, typeof sel[0] === 'number' ? sel[0] : -1))
                    if (partialFirst)
                    {
                        lines.splice(sel[1],2,lines[sel[1]] + lines[sel[1] + 1])
                    }
                }
            }
        }
        return [lines,cursor]
    }
}

export default util;