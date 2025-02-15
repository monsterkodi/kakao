var _k_ = {isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var key, mod, util, val

import kxk from "../../kxk.js"
let kstr = kxk.kstr

import text from "./text.js"
import edit from "./edit.js"


util = (function ()
{
    function util ()
    {}

    util["pos"] = function (x, y)
    {
        return ((_k_.isArr(x) && _k_.empty(y)) ? x : [x,y])
    }

    util["samePos"] = function (a, b)
    {
        return a[0] === b[0] && a[1] === b[1]
    }

    util["normalizePositions"] = function (posl, maxY)
    {
        if (_k_.empty(posl))
        {
            return []
        }
        posl = posl.map(function (a)
        {
            return [_k_.max(0,a[0]),_k_.clamp(0,maxY,a[1])]
        })
        posl = this.sortPositions(posl)
        return posl = this.removeDuplicatePositions(posl)
    }

    util["sortPositions"] = function (posl)
    {
        return posl.sort(function (a, b)
        {
            return (a[1] === b[1] ? a[0] - b[0] : a[1] - b[1])
        })
    }

    util["removeDuplicatePositions"] = function (posl)
    {
        var i

        if (posl.length <= 1)
        {
            return posl
        }
        for (var _a_ = i = posl.length - 1, _b_ = 1; (_a_ <= _b_ ? i <= 1 : i >= 1); (_a_ <= _b_ ? ++i : --i))
        {
            if (this.samePos(posl[i],posl[i - 1]))
            {
                posl.splice(i,1)
            }
        }
        return posl
    }

    util["indexOfPosInPositions"] = function (pos, posl)
    {
        if (_k_.empty(posl))
        {
            return -1
        }
        return posl.findIndex(function (p)
        {
            return _k_.eql(pos, p)
        })
    }

    util["lineIndicesForPositions"] = function (posl)
    {
        var pos, set

        set = new Set()
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            set.add(pos[1])
        }
        return Array.from(set)
    }

    util["positionInDirection"] = function (pos, dir)
    {
        var x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        switch (dir)
        {
            case 'up':
                return [x,y - 1]

            case 'down':
                return [x,y + 1]

            case 'left':
                return [x - 1,y]

            case 'right':
                return [x + 1,y]

        }

    }

    util["traversePositionsInDirection"] = function (posl, pos, dir)
    {
        var next

        while (next = this.neighborPositionInDirection(posl,pos,dir))
        {
            pos = next
        }
        return pos
    }

    util["neighborPositionInDirection"] = function (posl, pos, dir)
    {
        var nbp

        nbp = this.positionInDirection(pos,dir)
        if (this.positionsContain(posl,nbp))
        {
            return posl[this.indexOfPosInPositions(nbp,posl)]
        }
    }

    util["positionsContain"] = function (posl, pos)
    {
        var p

        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            p = list[_a_]
            if (_k_.eql(p, pos))
            {
                return true
            }
        }
        return false
    }

    util["positionsOutsideRange"] = function (posl, rng)
    {
        return posl.filter(function (p)
        {
            return this.isPosOutsideRange(p,rng)
        })
    }

    util["isPosInsideRange"] = function (pos, rng)
    {
        if (this.isPosBeforeRange(pos,rng))
        {
            return false
        }
        if (this.isPosAfterRange(pos,rng))
        {
            return false
        }
        return true
    }

    util["isPosOutsideRange"] = function (pos, rng)
    {
        return !this.isPosInsideRange(pos,rng)
    }

    util["isPosBeforeRange"] = function (pos, rng)
    {
        return pos[1] < rng[1] || (pos[1] === rng[1] && pos[0] < rng[0])
    }

    util["isPosAfterRange"] = function (pos, rng)
    {
        return pos[1] > rng[3] || (pos[1] === rng[3] && pos[0] >= rng[2])
    }

    util["isPosTouchingRange"] = function (pos, rng)
    {
        if (this.isPosInsideRange(pos,rng))
        {
            return true
        }
        if (_k_.eql(pos, this.endOfRange(rng)))
        {
            return true
        }
        if (_k_.eql(pos, this.startOfRange(rng)))
        {
            return true
        }
        return false
    }

    util["rangeContainsPos"] = function (rng, pos)
    {
        return this.isPosInsideRange(pos,rng)
    }

    util["rangeTouchesPos"] = function (rng, pos)
    {
        return this.isPosTouchingRange(pos,rng)
    }

    util["rangeForSpan"] = function (span)
    {
        return [span[0],span[1],span[2],span[1]]
    }

    util["rangeFromStartToEnd"] = function (start, end)
    {
        return [start[0],start[1],end[0],end[1]]
    }

    util["isEmptyRange"] = function (rng)
    {
        return rng[0] === rng[2] && rng[1] === rng[3]
    }

    util["isRangeEmpty"] = function (rng)
    {
        return rng[0] === rng[2] && rng[1] === rng[3]
    }

    util["startOfRange"] = function (rng)
    {
        return [rng[0],rng[1]]
    }

    util["endOfRange"] = function (rng)
    {
        return [rng[2],rng[3]]
    }

    util["isSameSpan"] = function (a, b)
    {
        return _k_.eql(a, b)
    }

    util["isSameRange"] = function (a, b)
    {
        return _k_.eql(a, b)
    }

    util["isPosInsideSpan"] = function (pos, span)
    {
        if (this.isPosBeforeSpan(pos,span))
        {
            return false
        }
        if (this.isPosAfterSpan(pos,span))
        {
            return false
        }
        return true
    }

    util["isPosBeforeSpan"] = function (pos, span)
    {
        return pos[1] < span[1] || (pos[1] === span[1] && pos[0] < span[0])
    }

    util["isPosAfterSpan"] = function (pos, span)
    {
        return pos[1] > span[1] || (pos[1] === span[1] && pos[0] >= span[2])
    }

    util["isPosBeforeOrInsideSpan"] = function (pos, span)
    {
        return this.isPosBeforeSpan(pos,span) || this.isPosInsideSpan(pos,span)
    }

    util["startOfSpan"] = function (s)
    {
        return [s[0],s[1]]
    }

    util["endOfSpan"] = function (s)
    {
        return [s[2],s[1]]
    }

    util["nextSpanAfterPos"] = function (spans, pos)
    {
        var index, span

        if (_k_.empty(spans))
        {
            return
        }
        if (this.isPosAfterSpan(pos,spans.slice(-1)[0]))
        {
            pos = [0,0]
        }
        if (this.isPosBeforeSpan(pos,spans[0]))
        {
            return spans[0]
        }
        var list = _k_.list(spans)
        for (index = 0; index < list.length; index++)
        {
            span = list[index]
            if (this.isPosAfterSpan(pos,span))
            {
                if (index + 1 < spans.length && this.isPosBeforeOrInsideSpan(pos,spans[index + 1]))
                {
                    return spans[index + 1]
                }
            }
        }
    }

    util["prevSpanBeforePos"] = function (spans, pos)
    {
        var index, span

        if (_k_.empty(spans))
        {
            return
        }
        if (this.isPosBeforeSpan(pos,spans[0]))
        {
            return spans.slice(-1)[0]
        }
        if (this.isPosInsideSpan(pos,spans[0]))
        {
            return spans.slice(-1)[0]
        }
        for (var _a_ = index = spans.length - 1, _b_ = 0; (_a_ <= _b_ ? index <= 0 : index >= 0); (_a_ <= _b_ ? ++index : --index))
        {
            span = spans[index]
            if (this.isPosAfterSpan(pos,span))
            {
                return span
            }
        }
    }

    util["normalizeSpans"] = function (spans)
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

    util["rangesContainLine"] = function (rngs, lineIndex)
    {
        var rng

        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if ((rng[1] <= lineIndex && lineIndex <= rng[3]))
            {
                return true
            }
        }
        return false
    }

    util["rangesContainSpan"] = function (rngs, span)
    {
        return this.rangesContainRange(rngs,this.rangeForSpan(span))
    }

    util["rangesContainRange"] = function (rngs, range)
    {
        var rng

        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (_k_.eql(rng, range))
            {
                return true
            }
        }
        return false
    }

    util["normalizeRanges"] = function (rngs)
    {
        if (_k_.empty(rngs) || !(_k_.isArr(rngs)))
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
        return rngs.filter(function (a)
        {
            return a[1] !== a[3] || a[0] !== a[2]
        })
    }

    util["startPositionsOfRanges"] = function (rngs)
    {
        return rngs.map(function (r)
        {
            return this.startOfRange(r)
        })
    }

    util["endPositionsOfRanges"] = function (rngs)
    {
        return rngs.map(function (r)
        {
            return this.endOfRange(r)
        })
    }

    util["removeTrailingEmptyRange"] = function (rngs)
    {
        if (this.isEmptyRange(rngs.slice(-1)[0]))
        {
            return rngs.slice(0, -1)
        }
        else
        {
            return rngs
        }
    }

    util["rangesForLinePositions"] = function (lines, posl)
    {
        var idx, pos, rngs

        if (_k_.empty(posl))
        {
            return []
        }
        rngs = [[0,0,posl[0][0],posl[0][1]]]
        var list = _k_.list(posl)
        for (idx = 0; idx < list.length; idx++)
        {
            pos = list[idx]
            if (idx > 0)
            {
                rngs.push([posl[idx - 1][0],posl[idx - 1][1],pos[0],pos[1]])
            }
        }
        rngs.push([posl.slice(-1)[0][0],posl.slice(-1)[0][1],lines.slice(-1)[0].length,lines.length - 1])
        return rngs
    }

    util["rangeInRangesContainingPos"] = function (rngs, pos)
    {
        var rng

        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (this.rangeContainsPos(rng,pos))
            {
                return rng
            }
        }
    }

    util["rangeInRangesTouchingPos"] = function (rngs, pos)
    {
        var rng

        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (this.rangeTouchesPos(rng,pos))
            {
                return rng
            }
        }
    }

    util["lineIndicesForRangesOrPositions"] = function (rngs, posl)
    {
        var indices

        indices = this.lineIndicesForRanges(rngs)
        if (_k_.empty(indices))
        {
            indices = this.lineIndicesForPositions(posl)
        }
        return indices
    }

    util["lineIndicesForRange"] = function (rng)
    {
        var indices, li

        indices = []
        for (var _a_ = li = rng[1], _b_ = rng[3]; (_a_ <= _b_ ? li <= rng[3] : li >= rng[3]); (_a_ <= _b_ ? ++li : --li))
        {
            if (li !== rng[3] || rng[2] > 0)
            {
                indices.push(li)
            }
        }
        return indices
    }

    util["lineIndicesForRanges"] = function (rngs)
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

    util["mergeLineRanges"] = function (lines, rngs)
    {
        var i, mrgd, s, tail

        if (_k_.empty(rngs) || !(_k_.isArr(rngs)))
        {
            return []
        }
        rngs = this.normalizeRanges(rngs)
        mrgd = []
        var list = _k_.list(rngs)
        for (i = 0; i < list.length; i++)
        {
            s = list[i]
            if (_k_.empty(mrgd) || s[1] > tail[3] + 1 || s[1] === tail[3] && s[0] > tail[2] || s[1] === tail[3] + 1 && (s[0] > 0 || tail[2] < lines[tail[3]].length))
            {
                mrgd.push(s)
                tail = s
            }
            else if (s[3] > tail[3] || s[3] === tail[3] && s[2] > tail[2])
            {
                tail[2] = s[2]
                tail[3] = s[3]
            }
        }
        return mrgd
    }

    return util
})()

var list = [text,edit]
for (var _a_ = 0; _a_ < list.length; _a_++)
{
    mod = list[_a_]
    for (key in mod)
    {
        val = mod[key]
        util[key] = val
    }
}
export default util;