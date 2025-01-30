var _k_ = {isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

import kxk from "../../kxk.js"
let kstr = kxk.kstr

class util
{
    static cells (rows, cols)
    {
        var c, cells, l, lines

        lines = []
        for (var _a_ = l = 0, _b_ = rows; (_a_ <= _b_ ? l < rows : l > rows); (_a_ <= _b_ ? ++l : --l))
        {
            cells = []
            for (var _c_ = c = 0, _d_ = cols; (_c_ <= _d_ ? c < cols : c > cols); (_c_ <= _d_ ? ++c : --c))
            {
                cells.push({bg:null,fg:null,char:' '})
            }
            lines.push(cells)
        }
        return lines
    }

    static pos (x, y)
    {
        return ((_k_.isArr(x) && _k_.empty(y)) ? x : [x,y])
    }

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
        return pos[1] > rng[3] || (pos[1] === rng[3] && pos[0] >= rng[2])
    }

    static rangeForSpan (span)
    {
        return [span[0],span[1],span[2],span[1]]
    }

    static isPosInsideSpan (pos, span)
    {
        if (util.isPosBeforeSpan(pos,span))
        {
            return false
        }
        if (util.isPosAfterSpan(pos,span))
        {
            return false
        }
        return true
    }

    static isPosBeforeSpan (pos, span)
    {
        return pos[1] < span[1] || (pos[1] === span[1] && pos[0] < span[0])
    }

    static isPosAfterSpan (pos, span)
    {
        return pos[1] > span[1] || (pos[1] === span[1] && pos[0] >= span[2])
    }

    static endOfSpan (s)
    {
        return [s[2],s[1]]
    }

    static nextSpanAfterPos (spans, pos)
    {
        var index, span

        if (_k_.empty(spans))
        {
            return
        }
        if (util.isPosAfterSpan(pos,spans.slice(-1)[0]))
        {
            pos = [0,0]
        }
        if (util.isPosBeforeSpan(pos,spans[0]))
        {
            return spans[0]
        }
        var list = _k_.list(spans)
        for (index = 0; index < list.length; index++)
        {
            span = list[index]
            if (util.isPosAfterSpan(pos,span))
            {
                if (index + 1 < spans.length && (util.isPosBeforeSpan(pos,spans[index + 1]) || util.isPosInsideSpan(pos,spans[index + 1])))
                {
                    return spans[index + 1]
                }
            }
        }
    }

    static normalizeSpans (spans)
    {
        if (_k_.empty(spans))
        {
            return []
        }
        spans = spans.map(function (a)
        {
            if (a[0] > a[2])
            {
                return [a[2],a[1],a[0]]
            }
            else
            {
                return a
            }
        })
        spans.sort(function (a, b)
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
        return spans = spans.filter(function (a)
        {
            return a[0] !== a[2]
        })
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

    static lineIndicesForRange (rng)
    {
        var indices, li

        indices = []
        for (var _a_ = li = rng[1], _b_ = rng[3]; (_a_ <= _b_ ? li <= rng[3] : li >= rng[3]); (_a_ <= _b_ ? ++li : --li))
        {
            indices.push(li)
        }
        return indices
    }

    static lineIndicesForRanges (rngs)
    {
        var indices, rng

        indices = []
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            indices = indices.concat(this.lineIndicesForRange(rng))
        }
        return indices
    }

    static textFromBolToPos (lines, pos)
    {
        return lines[pos[1]].slice(0, typeof pos[0] === 'number' ? pos[0] : -1)
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

    static isFullLineRange (lines, rng)
    {
        if (rng[1] !== rng[3])
        {
            return true
        }
        return rng[1] === rng[3] && (0 <= rng[1] && rng[1] < lines.length) && rng[0] === 0 && rng[2] >= lines[rng[1]].length
    }

    static rangeOfClosestWordToPos (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (util.isInvalidLineIndex(lines,y))
        {
            return
        }
        if (r = kstr.rangeOfClosestWord(lines[y],x))
        {
            if ((0 <= r[0] && r[0] < r[1]))
            {
                return [r[0],y,r[1],y]
            }
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

    static numIndent (str)
    {
        var m

        if (m = str.match(/^\s+/))
        {
            return String(m).length
        }
        return 0
    }

    static lineSpansForText (lines, text)
    {
        var line, spans, x1, x2, y

        spans = []
        var list = _k_.list(lines)
        for (y = 0; y < list.length; y++)
        {
            line = list[y]
            x2 = 0
            while (true)
            {
                x1 = line.indexOf(text,x2)
                if (x1 < 0)
                {
                    break
                }
                x2 = x1 + text.length
                spans.push([x1,y,x2])
            }
        }
        return spans
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
                        cursor[0] = rng[0]
                        cursor[1] = rng[1]
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