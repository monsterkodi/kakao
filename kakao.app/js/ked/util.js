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

        if (_k_.empty(lines) || _k_.empty(rng))
        {
            return ''
        }
        l = []
        for (var _a_ = y = rng[1], _b_ = rng[3]; (_a_ <= _b_ ? y <= rng[3] : y >= rng[3]); (_a_ <= _b_ ? ++y : --y))
        {
            if (util.isInvalidLineIndex(lines,y))
            {
                continue
            }
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

    static textFromBolToPos (lines, pos)
    {
        return lines[pos[1]].slice(0, typeof pos === 'number' ? pos+1 : Infinity)
    }

    static isLinesPosInside (lines, pos)
    {
        return pos[1] < lines.length && (0 <= pos[0] && pos[0] <= lines[pos[1]].length)
    }

    static isLinesPosOutside (lines, pos)
    {
        return !util.isLinesPosInside(lines,pos)
    }

    static isValidLineIndex (lines, li)
    {
        return (0 <= li && li < lines.length)
    }

    static isInvalidLineIndex (lines, li)
    {
        return !util.isValidLineIndex(lines,li)
    }

    static rangeOfClosestWordToPos (lines, pos)
    {
        var re, rs, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (util.isInvalidLineIndex(lines,y))
        {
            return
        }
        var _b_ = kstr.rangeOfClosestWord(lines[y],x); rs = _b_[0]; re = _b_[1]

        if ((0 <= rs && rs < re))
        {
            return [rs,y,re,y]
        }
    }

    static rangeOfWordOrWhitespaceLeftToPos (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (x <= 0 || util.isInvalidLineIndex(lines,y))
        {
            return
        }
        if (r = kstr.rangeOfClosestWord(lines[y].slice(0, typeof x === 'number' ? x : -1),x))
        {
            if (r[1] < x)
            {
                return [r[1],y,x,y]
            }
            if ((0 <= r[0] && r[0] < r[1]))
            {
                return [r[0],y,r[1],y]
            }
        }
        return [0,y,x,y]
    }

    static deleteLinesRangesAndAdjustCursor (lines, rngs, cursor)
    {
        var partialFirst, ri, rng

        for (var _a_ = ri = rngs.length - 1, _b_ = 0; (_a_ <= _b_ ? ri <= 0 : ri >= 0); (_a_ <= _b_ ? ++ri : --ri))
        {
            rng = rngs[ri]
            if (util.isPosInsideRange(cursor,rng))
            {
                cursor = [rng[0],rng[1]]
            }
            else if (util.isPosAfterRange(cursor,rng))
            {
                if (cursor[1] === rng[3])
                {
                    if (rng[1] === rng[3])
                    {
                        cursor[0] = rng[0]
                    }
                    else
                    {
                        cursor[0] = 0
                    }
                }
                else
                {
                    cursor[1] -= util.numFullLinesInRange(lines,rng)
                }
            }
            if (rng[1] === rng[3])
            {
                if (rng[0] === 0 && rng[2] === lines[rng[1]].length)
                {
                    lines.splice(rng[1],1)
                }
                else
                {
                    lines.splice(rng[1],1,kstr.splice(lines[rng[1]],rng[0],rng[2] - rng[0]))
                }
            }
            else
            {
                if (rng[2] === lines[rng[3]].length)
                {
                    lines.splice(rng[3],1)
                }
                else
                {
                    lines.splice(rng[3],1,lines[rng[3]].slice(rng[2]))
                    partialFirst = true
                }
                if (rng[3] - rng[1] > 1)
                {
                    lines.splice(rng[1] + 1,rng[3] - rng[1] - 1)
                }
                if (rng[0] === 0)
                {
                    lines.splice(rng[1],1)
                }
                else
                {
                    lines.splice(rng[1],1,lines[rng[1]].slice(0, typeof rng[0] === 'number' ? rng[0] : -1))
                    if (partialFirst)
                    {
                        lines.splice(rng[1],2,lines[rng[1]] + lines[rng[1] + 1])
                    }
                }
            }
        }
        return [lines,cursor]
    }

    static isOnlyWhitespace (text)
    {
        return /^\s+$/.test(text)
    }
}

export default util;