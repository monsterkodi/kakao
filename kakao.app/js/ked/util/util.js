var _k_ = {isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../kxk.js"
let kstr = kxk.kstr

import prof from "./prof.js"

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

    static samePos (a, b)
    {
        return a[0] === b[0] && a[1] === b[1]
    }

    static normalizePositions (posl, maxY)
    {
        if (_k_.empty(posl))
        {
            return []
        }
        posl = posl.map(function (a)
        {
            return [_k_.max(0,a[0]),_k_.clamp(0,maxY,a[1])]
        })
        posl = util.sortPositions(posl)
        return posl = util.removeDuplicatePositions(posl)
    }

    static sortPositions (posl)
    {
        return posl.sort(function (a, b)
        {
            return (a[1] === b[1] ? a[0] - b[0] : a[1] - b[1])
        })
    }

    static removeDuplicatePositions (posl)
    {
        var i

        if (posl.length <= 1)
        {
            return posl
        }
        for (var _a_ = i = posl.length - 1, _b_ = 1; (_a_ <= _b_ ? i <= 1 : i >= 1); (_a_ <= _b_ ? ++i : --i))
        {
            if (util.samePos(posl[i],posl[i - 1]))
            {
                posl.splice(i,1)
            }
        }
        return posl
    }

    static indexOfPosInPositions (pos, posl)
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

    static lineIndicesForPositions (posl)
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

    static positionInDirection (pos, dir)
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

    static traversePositionsInDirection (posl, pos, dir)
    {
        var next

        while (next = util.neighborPositionInDirection(posl,pos,dir))
        {
            pos = next
        }
        return pos
    }

    static neighborPositionInDirection (posl, pos, dir)
    {
        var nbp

        nbp = util.positionInDirection(pos,dir)
        if (util.positionsContain(posl,nbp))
        {
            return posl[util.indexOfPosInPositions(nbp,posl)]
        }
    }

    static positionsContain (posl, pos)
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

    static positionsOutsideRange (posl, rng)
    {
        return posl.filter(function (p)
        {
            return util.isPosOutsideRange(p,rng)
        })
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

    static isPosOutsideRange (pos, rng)
    {
        return !util.isPosInsideRange(pos,rng)
    }

    static isPosBeforeRange (pos, rng)
    {
        return pos[1] < rng[1] || (pos[1] === rng[1] && pos[0] < rng[0])
    }

    static isPosAfterRange (pos, rng)
    {
        return pos[1] > rng[3] || (pos[1] === rng[3] && pos[0] >= rng[2])
    }

    static isPosTouchingRange (pos, rng)
    {
        if (util.isPosInsideRange(pos,rng))
        {
            return true
        }
        if (_k_.eql(pos, util.endOfRange(rng)))
        {
            return true
        }
        if (_k_.eql(pos, util.startOfRange(rng)))
        {
            return true
        }
        return false
    }

    static rangeContainsPos (rng, pos)
    {
        return util.isPosInsideRange(pos,rng)
    }

    static rangeTouchesPos (rng, pos)
    {
        return util.isPosTouchingRange(pos,rng)
    }

    static rangeForSpan (span)
    {
        return [span[0],span[1],span[2],span[1]]
    }

    static rangeFromStartToEnd (start, end)
    {
        return [start[0],start[1],end[0],end[1]]
    }

    static isEmptyRange (rng)
    {
        return rng[0] === rng[2] && rng[1] === rng[3]
    }

    static isRangeEmpty (rng)
    {
        return rng[0] === rng[2] && rng[1] === rng[3]
    }

    static startOfRange (rng)
    {
        return [rng[0],rng[1]]
    }

    static endOfRange (rng)
    {
        return [rng[2],rng[3]]
    }

    static isSameSpan (a, b)
    {
        return _k_.eql(a, b)
    }

    static isSameRange (a, b)
    {
        return _k_.eql(a, b)
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

    static isPosBeforeOrInsideSpan (pos, span)
    {
        return util.isPosBeforeSpan(pos,span) || util.isPosInsideSpan(pos,span)
    }

    static startOfSpan (s)
    {
        return [s[0],s[1]]
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
                if (index + 1 < spans.length && util.isPosBeforeOrInsideSpan(pos,spans[index + 1]))
                {
                    return spans[index + 1]
                }
            }
        }
    }

    static prevSpanBeforePos (spans, pos)
    {
        var index, span

        if (_k_.empty(spans))
        {
            return
        }
        if (util.isPosBeforeSpan(pos,spans[0]))
        {
            return spans.slice(-1)[0]
        }
        if (util.isPosInsideSpan(pos,spans[0]))
        {
            return spans.slice(-1)[0]
        }
        for (var _a_ = index = spans.length - 1, _b_ = 0; (_a_ <= _b_ ? index <= 0 : index >= 0); (_a_ <= _b_ ? ++index : --index))
        {
            span = spans[index]
            if (util.isPosAfterSpan(pos,span))
            {
                return span
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

    static rangesContainLine (rngs, lineIndex)
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

    static rangesContainSpan (rngs, span)
    {
        return this.rangesContainRange(rngs,util.rangeForSpan(span))
    }

    static rangesContainRange (rngs, range)
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

    static normalizeRanges (rngs)
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

    static startPositionsOfRanges (rngs)
    {
        return rngs.map(function (r)
        {
            return util.startOfRange(r)
        })
    }

    static endPositionsOfRanges (rngs)
    {
        return rngs.map(function (r)
        {
            return util.endOfRange(r)
        })
    }

    static removeTrailingEmptyRange (rngs)
    {
        if (util.isEmptyRange(rngs.slice(-1)[0]))
        {
            return rngs.slice(0, -1)
        }
        else
        {
            return rngs
        }
    }

    static rangesForLinePositions (lines, posl)
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

    static rangeInRangesContainingPos (rngs, pos)
    {
        var rng

        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (util.rangeContainsPos(rng,pos))
            {
                return rng
            }
        }
    }

    static rangeInRangesTouchingPos (rngs, pos)
    {
        var rng

        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (util.rangeTouchesPos(rng,pos))
            {
                return rng
            }
        }
    }

    static lineIndicesForRangesOrPositions (rngs, posl)
    {
        var indices

        indices = util.lineIndicesForRanges(rngs)
        if (_k_.empty(indices))
        {
            indices = util.lineIndicesForPositions(posl)
        }
        return indices
    }

    static mergeLineRanges (lines, rngs)
    {
        var i, mrgd, s, tail

        if (_k_.empty(rngs) || !(_k_.isArr(rngs)))
        {
            return []
        }
        rngs = util.normalizeRanges(rngs)
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

    static linesForText (text)
    {
        text = text.replace(/\x1b/g,'�')
        return text.split(/\r?\n/)
    }

    static textForLineRange (lines, rng)
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

    static textForLineRanges (lines, rngs)
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
            text += util.textForLineRange(lines,rng)
            text += '\n'
        }
        return text.slice(0, -1)
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

    static textFromBolToPos (lines, pos)
    {
        return lines[pos[1]].slice(0, typeof pos[0] === 'number' ? pos[0] : -1)
    }

    static isOnlyWhitespace (text)
    {
        return /^\s+$/.test(text)
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

    static splitLineIndent (str)
    {
        var i

        i = util.numIndent(str)
        return [str.slice(0, typeof i === 'number' ? i : -1),str.slice(i)]
    }

    static lineRangeAtPos (lines, pos)
    {
        return [0,pos[1],lines[pos[1]].length,pos[1]]
    }

    static lineRangesForPositions (lines, posl, append = false)
    {
        var rngs

        rngs = util.lineIndicesForPositions(posl).map(function (y)
        {
            return [0,y,lines[y].length,y]
        })
        if (!_k_.empty(rngs) && append)
        {
            rngs.slice(-1)[0][2] = 0
            rngs.slice(-1)[0][3] += 1
        }
        return rngs
    }

    static lineIndentAtPos (lines, pos)
    {
        var x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        return util.numIndent(lines[y])
    }

    static lineIndicesForRange (rng)
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

    static numLinesInRange (rng)
    {
        return rng[3] - rng[1] + 1
    }

    static isEmptyLineAtPos (lines, pos)
    {
        return lines[pos[1]].length <= 0
    }

    static lineRangesInRange (lines, rng)
    {
        var ln, rngs

        rngs = []
        for (var _a_ = ln = 0, _b_ = util.numLinesInRange(rng); (_a_ <= _b_ ? ln < util.numLinesInRange(rng) : ln > util.numLinesInRange(rng)); (_a_ <= _b_ ? ++ln : --ln))
        {
            rngs.push(util.lineRangeAtPos(lines,[0,rng[1] + ln]))
        }
        return rngs
    }

    static linesForRange (lines, rng)
    {
        var lns, nl

        nl = util.numLinesInRange(rng)
        if (nl === 1)
        {
            return [lines[rng[1]].slice(rng[0], typeof rng[2] === 'number' ? rng[2] : -1)]
        }
        lns = [lines[rng[1]].slice(rng[0])]
        if (nl > 2)
        {
            lns = lns.concat(lines.slice(rng[1] + 1, typeof rng[3] === 'number' ? rng[3] : -1))
        }
        return lns = lns.concat(lines[rng[3]].slice(0, typeof rng[2] === 'number' ? rng[2] : -1))
    }

    static splitLineRange (lines, rng, includeEmpty = true)
    {
        var i, nl, split

        nl = util.numLinesInRange(rng)
        if (nl === 1)
        {
            return [rng]
        }
        split = []
        split.push([rng[0],rng[1],lines[rng[1]].length,rng[1]])
        if (nl > 2)
        {
            for (var _a_ = i = 1, _b_ = nl - 2; (_a_ <= _b_ ? i <= nl - 2 : i >= nl - 2); (_a_ <= _b_ ? ++i : --i))
            {
                split.push([0,rng[1] + i,lines[rng[1] + i].length,rng[1] + i])
            }
        }
        if (includeEmpty || rng[2] > 0)
        {
            split.push([0,rng[3],rng[2],rng[3]])
        }
        return split
    }

    static splitLineRanges (lines, rngs, includeEmpty = true)
    {
        var rng, split

        split = []
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            split = split.concat(util.splitLineRange(lines,rng,includeEmpty))
        }
        return split
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

    static isMultiLineRange (lines, rng)
    {
        return rng[1] !== rng[3]
    }

    static isFullLineRange (lines, rng)
    {
        return ((0 <= rng[1] && (rng[1] <= rng[3] && rng[3] < lines.length))) && (rng[0] === 0) && (rng[2] >= lines[rng[3]].length || rng[2] === 0 && rng[1] < rng[3])
    }

    static isSpanLineRange (lines, rng)
    {
        return ((0 <= rng[1] && (rng[1] === rng[3] && rng[3] < lines.length))) && (rng[0] > 0 || rng[2] < lines[rng[1]].length)
    }

    static rangeOfLine (lines, y)
    {
        return [0,y,lines[y].length,y]
    }

    static numIndentOfLines (lines)
    {
        var line

        var list = _k_.list(lines)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            line = list[_a_]
            if (_k_.empty(_k_.trim(line)))
            {
                continue
            }
            return util.numIndent(line)
        }
        return 0
    }

    static rangeOfClosestChunkToPos (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (util.isInvalidLineIndex(lines,y))
        {
            return
        }
        if (r = kstr.rangeOfClosestChunk(lines[y],x))
        {
            if ((0 <= r[0] && r[0] < r[1]))
            {
                return [r[0],y,r[1],y]
            }
        }
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

    static rangeOfWordOrWhitespaceRightToPos (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (x < 0 || util.isInvalidLineIndex(lines,y))
        {
            return
        }
        if (r = kstr.rangeOfClosestWord(lines[y].slice(x),0))
        {
            if ((0 === r[0] && r[0] < r[1]))
            {
                return [x,y,r[1] + x,y]
            }
            if (r[0] > 0)
            {
                return [x,y,r[0] + x,y]
            }
        }
        return [x,y,lines[y].length,y]
    }

    static lineChar (line, x)
    {
        if ((0 <= x && x < line.length))
        {
            return line[x]
        }
    }

    static categoryForChar (char)
    {
        if (_k_.empty(char))
        {
            return 'empty'
        }
        else if (/\s+/.test(char))
        {
            return 'ws'
        }
        else if (/\w+/.test(char))
        {
            return 'word'
        }
        return 'punct'
    }

    static jumpDelta (line, px, dx, jump)
    {
        var cat, ci, nc

        if (dx > 0)
        {
            ci = px
            if (nc = cat = util.categoryForChar(util.lineChar(line,ci)))
            {
                if (!(_k_.in(cat,jump)))
                {
                    return dx
                }
                while (true)
                {
                    ci += dx
                    nc = util.categoryForChar(util.lineChar(line,ci))
                    if (nc !== cat)
                    {
                        break
                    }
                    if (ci <= 0)
                    {
                        break
                    }
                    if (nc === 'empty')
                    {
                        return 1
                    }
                }
            }
            return ci - px
        }
        else
        {
            ci = px - 1
            if (ci < 0)
            {
                return 0
            }
            if (ci >= line.length && _k_.in('empty',jump))
            {
                return line.length - ci - 1
            }
            cat = util.categoryForChar(util.lineChar(line,ci))
            if (!(_k_.in(cat,jump)))
            {
                return dx
            }
            while ((0 <= ci && ci < line.length) && util.categoryForChar(util.lineChar(line,ci)) === cat)
            {
                ci += dx
            }
            return _k_.min(dx,ci - px + 1)
        }
    }

    static numCharsFromPosToWordOrPunctInDirection (lines, pos, dir, opt)
    {
        var dx

        dx = (dir === 'left' ? -1 : 1)
        if ((opt != null ? opt.jump : undefined))
        {
            return util.jumpDelta(lines[pos[1]],pos[0],dx,opt.jump)
        }
        if (pos[0] + dx < 0)
        {
            return 0
        }
        return dx
    }

    static deleteLineRangesAndAdjustPositions (lines, rngs, posl)
    {
        var partialLast, ri, rng

        lines = _k_.copy(lines)
        posl = _k_.clone(posl)
        for (var _a_ = ri = rngs.length - 1, _b_ = 0; (_a_ <= _b_ ? ri <= 0 : ri >= 0); (_a_ <= _b_ ? ++ri : --ri))
        {
            rng = rngs[ri]
            posl = util.adjustPositionsForDeletedLineRange(posl,lines,rng)
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
                    partialLast = true
                }
                if (rng[3] - rng[1] >= 2)
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
                    if (partialLast)
                    {
                        lines.splice(rng[1],2,lines[rng[1]] + lines[rng[1] + 1])
                    }
                }
            }
        }
        return [lines,posl]
    }

    static adjustPositionsForDeletedLineRange (posl, lines, rng)
    {
        var pi, pos

        for (var _a_ = pi = posl.length - 1, _b_ = 0; (_a_ <= _b_ ? pi <= 0 : pi >= 0); (_a_ <= _b_ ? ++pi : --pi))
        {
            pos = posl[pi]
            if (util.isPosTouchingRange(pos,rng))
            {
                pos[0] = rng[0]
                pos[1] = rng[1]
            }
            else if (util.isPosAfterRange(pos,rng))
            {
                if (pos[1] === rng[3])
                {
                    pos[0] -= rng[2] - rng[0]
                    if (rng[1] < rng[3])
                    {
                        pos[1] -= rng[3] - rng[1]
                    }
                }
                else
                {
                    pos[1] -= util.numFullLinesInRange(lines,rng)
                }
            }
            else
            {
                break
            }
        }
        return util.removeDuplicatePositions(posl)
    }

    static moveCursorsInSameLineBy (cursors, cursor, delta)
    {
        var ci

        ci = cursors.indexOf(cursor)
        while (true)
        {
            cursors[ci][0] += delta
            ci++
            if (ci >= cursors.length)
            {
                return
            }
            if (cursors[ci][1] > cursor[1])
            {
                return
            }
        }
    }

    static addLinesBelowPositionsToRanges (lines, posl, rngs)
    {
        var addLineAtIndex, c, newp, newr

        newp = []
        newr = _k_.copy(rngs)
        addLineAtIndex = function (c, i)
        {
            var range

            range = util.rangeOfLine(lines,i)
            if (util.isEmptyRange(range))
            {
                range[1] += 1
            }
            newr.push(range)
            return newp.push(util.endOfRange(range))
        }
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            if (!util.rangesContainLine(rngs,c[1]))
            {
                addLineAtIndex(c,c[1])
            }
            else
            {
                if (c[1] < lines.length - 1)
                {
                    addLineAtIndex(c,c[1] + 1)
                }
            }
        }
        return [newp,newr]
    }

    static removeLinesAtPositionsFromRanges (lines, posl, rngs)
    {
        var idx, newp, newr, pos, rng

        newp = []
        newr = util.splitLineRanges(lines,rngs)
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            if (rng = util.rangeInRangesTouchingPos(newr,pos))
            {
                idx = newr.indexOf(rng)
                if (idx > 0)
                {
                    newp.push(util.endOfRange(newr[idx - 1]))
                }
                else
                {
                    newp.push(util.endOfRange(newr[idx]))
                }
                newr.splice(idx,1)
            }
            else
            {
                newp.push(pos)
            }
        }
        return [newp,newr]
    }

    static insertTextAtPositions (lines, text, posl)
    {
        var after, before, idx, indent, indentstr, insertLineIndex, lidx, line, newls, newpl, pos, posLineIndent, rng, rngs, txtindent, txtls, x, y

        if (text === '\t')
        {
            pos = posl[0]
            text = _k_.lpad(4 - pos[0] % 4,' ')
        }
        text = kstr.detab(text)
        txtls = util.linesForText(text)
        newls = []
        newpl = []
        rngs = util.rangesForLinePositions(lines,posl)
        var list = _k_.list(rngs)
        for (idx = 0; idx < list.length; idx++)
        {
            rng = list[idx]
            after = util.linesForRange(lines,rng)
            if (idx > 0)
            {
                var _b_ = posl[idx - 1]; x = _b_[0]; y = _b_[1]

                if (!_k_.empty(before))
                {
                    line = before.pop()
                }
                else
                {
                    line = newls.pop()
                }
                if (x > line.length)
                {
                    line += _k_.lpad(x - line.length)
                }
                if (txtls.length > 1)
                {
                    posLineIndent = util.numIndent(line)
                    indent = 0
                    if (newls.length)
                    {
                        indent = util.numIndent(_k_.last(newls))
                    }
                    if (after.length > 1 && posl[idx - 1][0] > indent)
                    {
                        indent = _k_.max(indent,util.numIndentOfLines(after.slice(1)))
                    }
                    txtindent = util.numIndentOfLines(txtls)
                    indent -= txtindent
                    indent = _k_.max(0,indent)
                    indentstr = _k_.lpad(indent)
                    lf(`▪${line}▪${txtls[0]}▪`)
                    if (posl.length > 1 && text !== '\n')
                    {
                        insertLineIndex = (idx - 1) % txtls.length
                        before.push(line + txtls[insertLineIndex])
                        newpl.push([_k_.last(before).length,newls.length + before.length - 1])
                        before.push(before.pop() + after.shift())
                    }
                    else
                    {
                        before.push(line + txtls[0])
                        var list1 = _k_.list(txtls.slice(1))
                        for (lidx = 0; lidx < list1.length; lidx++)
                        {
                            line = list1[lidx]
                            before.push(indentstr + line)
                        }
                        if (x > posLineIndent)
                        {
                            newpl.push([_k_.last(before).length,newls.length + before.length - 1])
                            before.push(before.pop() + after.shift())
                        }
                        else
                        {
                            if (text === '\n')
                            {
                                before.pop()
                            }
                            newpl.push([indent,newls.length + before.length])
                        }
                    }
                    newls = newls.concat(before)
                }
                else
                {
                    newpl.push([line.length + txtls[0].length,newls.length + before.length])
                    line += txtls[0] + after.shift()
                    newls = newls.concat(before,line)
                }
            }
            before = after
        }
        newls = newls.concat(before)
        return [newls,newpl]
    }

    static rangeForJoiningLine (lines, idx)
    {
        return [lines[idx].length,idx,0,idx + 1]
    }

    static rangesForJoiningLines (lines, idxs)
    {
        return idxs.map(function (idx)
        {
            return util.rangeForJoiningLine(lines,idx)
        })
    }

    static moveLineRangesAndPositionsAtIndicesInDirection (lines, rngs, posl, indices, dir)
    {
        var d, ii, index, newLines, newPosl, newRngs, pos, re, rng, rs

        if (_k_.empty(indices) || dir === 'down' && indices.slice(-1)[0] >= lines.length - 1 || dir === 'up' && indices[0] <= 0)
        {
            return [lines,rngs,posl]
        }
        newLines = _k_.copy(lines)
        newRngs = _k_.copy(rngs)
        newPosl = _k_.copy(posl)
        var _a_ = ((function ()
        {
            switch (dir)
            {
                case 'down':
                    return [indices.length - 1,0]

                case 'up':
                    return [0,indices.length - 1]

            }

        }).bind(this))(); rs = _a_[0]; re = _a_[1]

        for (var _b_ = ii = rs, _c_ = re; (_b_ <= _c_ ? ii <= re : ii >= re); (_b_ <= _c_ ? ++ii : --ii))
        {
            index = indices[ii]
            switch (dir)
            {
                case 'down':
                    newLines.splice(index,2,newLines[index + 1],newLines[index])
                    break
                case 'up':
                    newLines.splice(index - 1,2,newLines[index],newLines[index - 1])
                    break
            }

            var list = _k_.list(newPosl)
            for (var _d_ = 0; _d_ < list.length; _d_++)
            {
                pos = list[_d_]
                if (pos[1] === index)
                {
                    pos[1] += ((function ()
                    {
                        switch (dir)
                        {
                            case 'down':
                                return 1

                            case 'up':
                                return -1

                        }

                    }).bind(this))()
                }
            }
            var list1 = _k_.list(newRngs)
            for (var _e_ = 0; _e_ < list1.length; _e_++)
            {
                rng = list1[_e_]
                if (rng[1] === index)
                {
                    d = ((function ()
                    {
                        switch (dir)
                        {
                            case 'down':
                                return 1

                            case 'up':
                                return -1

                        }

                    }).bind(this))()
                    rng[1] += d
                    rng[3] += d
                }
            }
        }
        return [newLines,newRngs,newPosl]
    }

    static toggleCommentsInLineRangesAtIndices (lines, rngs, posl, indices)
    {
        var comIndent, comment, comStart, d, indent, index, line, minIndent, newLine, newLines, newPosl, newRngs

        if (_k_.empty(indices))
        {
            return [lines,rngs,posl]
        }
        newLines = _k_.copy(lines)
        newRngs = _k_.copy(rngs)
        newPosl = _k_.copy(posl)
        comStart = '#'
        minIndent = Infinity
        var list = _k_.list(indices)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            var _b_ = util.splitLineIndent(newLines[index]); indent = _b_[0]; line = _b_[1]

            if (!line.startsWith(comStart))
            {
                comment = comStart
                minIndent = _k_.min(indent.length,minIndent)
            }
        }
        if (comment)
        {
            comIndent = _k_.lpad(minIndent)
        }
        var list1 = _k_.list(indices)
        for (var _c_ = 0; _c_ < list1.length; _c_++)
        {
            index = list1[_c_]
            var _d_ = util.splitLineIndent(newLines[index]); indent = _d_[0]; line = _d_[1]

            if (comment)
            {
                indent = (indent.length > minIndent ? _k_.lpad(indent.length - minIndent) : '')
                newLine = comIndent + comment + indent + ' ' + line
            }
            else
            {
                d = (line[comStart.length] === ' ' ? 1 : 0)
                newLine = indent + line.slice(comStart.length + d)
            }
            newLines.splice(index,1,newLine)
        }
        return [newLines,newRngs,newPosl]
    }

    static deindentLineRangesAndPositionsAtIndices (lines, rngs, posl, indices)
    {
        var indent, index, line, newLines, newPosl, newRngs, pos, rng, sc

        if (_k_.empty(indices))
        {
            return [lines,rngs,posl]
        }
        newLines = _k_.copy(lines)
        newRngs = _k_.copy(rngs)
        newPosl = _k_.copy(posl)
        var list = _k_.list(indices)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            var _b_ = util.splitLineIndent(newLines[index]); indent = _b_[0]; line = _b_[1]

            if (indent.length)
            {
                sc = _k_.min(4,indent.length)
                newLines.splice(index,1,indent.slice(sc) + line)
                var list1 = _k_.list(newPosl)
                for (var _c_ = 0; _c_ < list1.length; _c_++)
                {
                    pos = list1[_c_]
                    if (pos[1] === index)
                    {
                        pos[0] = _k_.max(0,pos[0] - sc)
                    }
                }
                var list2 = _k_.list(newRngs)
                for (var _d_ = 0; _d_ < list2.length; _d_++)
                {
                    rng = list2[_d_]
                    if (rng[1] === index)
                    {
                        rng[0] = _k_.max(0,rng[0] - sc)
                        rng[2] = _k_.max(0,rng[2] - sc)
                    }
                }
            }
        }
        return [newLines,newRngs,newPosl]
    }

    static indentLineRangesAndPositionsAtIndices (lines, rngs, posl, indices)
    {
        var indent, index, line, newLines, newPosl, newRngs, pos, rng

        if (_k_.empty(indices))
        {
            return [lines,rngs,posl]
        }
        newLines = _k_.copy(lines)
        newRngs = _k_.copy(rngs)
        newPosl = _k_.copy(posl)
        var list = _k_.list(indices)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            index = list[_a_]
            var _b_ = util.splitLineIndent(newLines[index]); indent = _b_[0]; line = _b_[1]

            newLines[index] = _k_.lpad(4,' ') + newLines[index]
            var list1 = _k_.list(newPosl)
            for (var _c_ = 0; _c_ < list1.length; _c_++)
            {
                pos = list1[_c_]
                if (pos[1] === index)
                {
                    pos[0] += 4
                }
            }
            var list2 = _k_.list(newRngs)
            for (var _d_ = 0; _d_ < list2.length; _d_++)
            {
                rng = list2[_d_]
                if (rng[1] === index)
                {
                    rng[0] += 4
                    rng[2] += 4
                }
            }
        }
        return [newLines,newRngs,newPosl]
    }

    static extendLineRangesFromPositionToPosition (lines, rngs, start, pos)
    {
        var newRngs, rng

        if (_k_.empty(rngs))
        {
            return [util.rangeFromStartToEnd(start,pos)]
        }
        newRngs = _k_.copy(rngs)
        if (rng = util.rangeInRangesTouchingPos(newRngs,start))
        {
            if (util.isPosAfterRange(pos,rng))
            {
                rng[2] = pos[0]
                rng[3] = pos[1]
            }
            else if (util.isPosBeforeRange(pos,rng))
            {
                rng[0] = pos[0]
                rng[1] = pos[1]
            }
        }
        else
        {
            newRngs.push(util.rangeFromStartToEnd(start,pos))
        }
        return newRngs
    }

    static extendLineRangesByMovingPositionsInDirection (lines, rngs, posl, dir)
    {
        var ind, line, newPosl, newRngs, pos, rng

        newRngs = _k_.copy(rngs)
        newPosl = _k_.copy(posl)
        var list = _k_.list(newPosl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            line = lines[pos[1]]
            rng = [pos[0],pos[1],pos[0],pos[1]]
            newRngs.push(rng)
            switch (dir)
            {
                case 'left':
                case 'right':
                    pos[0] += util.numCharsFromPosToWordOrPunctInDirection(lines,pos,dir)
                    break
                case 'up':
                    pos[1] -= 1
                    break
                case 'down':
                    pos[1] += 1
                    break
                case 'eol':
                    pos[0] = line.length
                    break
                case 'bol':
                    pos[0] = 0
                    break
                case 'bof':
                    pos[0] = 0
                    pos[1] = 0
                    break
                case 'eof':
                    pos[1] = lines.length - 1
                    pos[0] = lines[lines.length - 1].length
                    break
                case 'ind_bol':
                    ind = util.numIndent(line)
                    pos[0] = (pos[0] > ind ? ind : 0)
                    break
                case 'ind_eol':
                    ind = util.numIndent(line)
                    pos[0] = (pos[0] < ind ? ind : line.length)
                    break
            }

            switch (dir)
            {
                case 'left':
                    rng[0] = rng[0] - 1
                    break
                case 'right':
                    rng[2] = rng[2] + 1
                    break
                case 'up':
                    rng[1] = _k_.max(0,rng[1] - 1)
                    break
                case 'down':
                    rng[3] = _k_.min(lines.length - 1,rng[3] + 1)
                    break
                case 'eol':
                    rng[2] = Infinity
                    break
                case 'bol':
                    rng[0] = 0
                    break
                case 'bof':
                    rng[1] = rng[0] = 0
                    break
                case 'eof':
                    rng[3] = lines.length - 1
                    rng[2] = lines[lines.length - 1].length
                    break
                case 'ind_bol':
                    ind = util.numIndent(line)
                    rng[0] = (rng[0] > ind ? ind : 0)
                    break
                case 'ind_eol':
                    ind = util.numIndent(line)
                    rng[2] = (rng[2] < ind ? ind : line.length)
                    break
            }

            if (rng[1] < lines.length)
            {
                rng[0] = _k_.clamp(0,lines[rng[1]].length,rng[0])
            }
            if (rng[3] < lines.length)
            {
                rng[2] = _k_.clamp(0,lines[rng[3]].length,rng[2])
            }
        }
        return [newRngs,newPosl]
    }
}

export default util;