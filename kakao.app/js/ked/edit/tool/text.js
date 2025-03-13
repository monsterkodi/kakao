var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var text

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let kutil = kxk.kutil
let kseg = kxk.kseg

import salter from "../../../kxk/salter.js"

import belt from "./belt.js"


text = (function ()
{
    function text ()
    {}

    text["linesForText"] = function (text)
    {
        return kstr.lines(text.replace(/\x1b/g,'�'))
    }

    text["joinLines"] = function (lines, join = '\n')
    {
        if (_k_.isStr(lines))
        {
            lines = kstr.lines(lines)
        }
        return lines.join(join)
    }

    text["seglsForText"] = function (text)
    {
        return kseg.segls(text.replace(/\x1b/g,'�'))
    }

    text["seglsForLineRange"] = function (lines, rng)
    {
        var l, y

        if (_k_.empty(lines) || _k_.empty(rng))
        {
            return ''
        }
        l = []
        for (var _a_ = y = rng[1], _b_ = rng[3]; (_a_ <= _b_ ? y <= rng[3] : y >= rng[3]); (_a_ <= _b_ ? ++y : --y))
        {
            if (this.isInvalidLineIndex(lines,y))
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
            if (y < rng[3])
            {
                l.push('\n')
            }
        }
        return l
    }

    text["segsForLineSpan"] = function (lines, span)
    {
        var l, y

        l = []
        if (_k_.empty(lines) || _k_.empty(span))
        {
            return l
        }
        y = span[1]
        if (this.isInvalidLineIndex(lines,y))
        {
            return l
        }
        return lines[y].slice(span[0], typeof span[2] === 'number' ? span[2] : -1)
    }

    text["segsForPositions"] = function (lines, posl)
    {
        var l, pos, segi

        l = []
        if (_k_.empty(lines) || _k_.empty(posl))
        {
            return l
        }
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            if (this.isInvalidLineIndex(lines,pos[1]))
            {
                return l
            }
            segi = kseg.segiAtWidth(lines[pos[1]],pos[0])
            l.push(lines[pos[1]][segi])
        }
        return l
    }

    text["textForLineRange"] = function (lines, rng)
    {
        var l, s, y

        if (_k_.empty(lines) || _k_.empty(rng))
        {
            return ''
        }
        l = []
        for (var _a_ = y = rng[1], _b_ = rng[3]; (_a_ <= _b_ ? y <= rng[3] : y >= rng[3]); (_a_ <= _b_ ? ++y : --y))
        {
            if (this.isInvalidLineIndex(lines,y))
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
        s = kseg.str(l)
        return s
    }

    text["textForLineRanges"] = function (lines, rngs)
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
            text += this.textForLineRange(lines,rng)
            text += '\n'
        }
        return text.slice(0, -1)
    }

    text["lineSpansForText"] = function (lines, text)
    {
        var line, spans, x1, x2, y

        spans = []
        var list = _k_.list(lines)
        for (y = 0; y < list.length; y++)
        {
            line = list[y]
            line = kseg.str(line)
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

    text["textFromBolToPos"] = function (lines, pos)
    {
        return lines[pos[1]].slice(0, typeof pos[0] === 'number' ? pos[0] : -1)
    }

    text["textFromPosToEol"] = function (lines, pos)
    {
        return lines[pos[1]].slice(pos[0])
    }

    text["isOnlyWhitespace"] = function (text)
    {
        return /^\s+$/.test(kseg.str(text))
    }

    text["numIndent"] = function (segs)
    {
        return kseg.numIndent(segs)
    }

    text["splitLineIndent"] = function (str)
    {
        return kseg.splitAtIndent(str)
    }

    text["numIndentOfLines"] = function (lines)
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
            return this.numIndent(line)
        }
        return 0
    }

    text["lineIndentAtPos"] = function (lines, pos)
    {
        return this.numIndent(lines[pos[1]])
    }

    text["indentLines"] = function (lines, num = 4)
    {
        return lines.map(function (l)
        {
            return _k_.lpad(num).split('').concat(l)
        })
    }

    text["seglRangeAtPos"] = function (segls, pos)
    {
        return [0,pos[1],segls[pos[1]].length,pos[1]]
    }

    text["lineRangeAtPos"] = function (lines, pos)
    {
        return [0,pos[1],kseg.width(lines[pos[1]]),pos[1]]
    }

    text["lineRangesForPositions"] = function (lines, posl, append)
    {
        var rngs

        rngs = this.lineIndicesForPositions(posl).map(function (y)
        {
            return (lines[y].length ? [0,y,lines[y].length,y] : [0,y,0,y + 1])
        })
        if (!_k_.empty(rngs) && append)
        {
            rngs.slice(-1)[0][2] = 0
            rngs.slice(-1)[0][3] += 1
        }
        return rngs
    }

    text["numFullLinesInRange"] = function (lines, rng)
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

    text["numLinesInRange"] = function (rng)
    {
        return rng[3] - rng[1] + 1
    }

    text["isEmptyLineAtPos"] = function (lines, pos)
    {
        return lines[pos[1]].length <= 0
    }

    text["lineRangesInRange"] = function (lines, rng)
    {
        var ln, rngs

        rngs = []
        for (var _a_ = ln = 0, _b_ = this.numLinesInRange(rng); (_a_ <= _b_ ? ln < this.numLinesInRange(rng) : ln > this.numLinesInRange(rng)); (_a_ <= _b_ ? ++ln : --ln))
        {
            rngs.push(this.lineRangeAtPos(lines,[0,rng[1] + ln]))
        }
        return rngs
    }

    text["seglsForRange"] = function (lines, rng)
    {
        var bos, eos, firstLineIndex, lastLineIndex, lns, nl, segi

        nl = this.numLinesInRange(rng)
        if (nl === 1)
        {
            bos = kseg.segiAtWidth(lines[rng[1]],rng[0])
            eos = kseg.segiAtWidth(lines[rng[1]],rng[2])
            return [lines[rng[1]].slice(bos, typeof eos === 'number' ? eos : -1)]
        }
        firstLineIndex = _k_.min(rng[1],lines.length - 1)
        lastLineIndex = _k_.min(rng[3],lines.length - 1)
        segi = kseg.segiAtWidth(lines[firstLineIndex],rng[0])
        lns = [lines[firstLineIndex].slice(segi)]
        if (nl > 2)
        {
            lns = lns.concat(lines.slice(firstLineIndex + 1, typeof lastLineIndex === 'number' ? lastLineIndex : -1))
        }
        segi = kseg.indexAtWidth(lines[lastLineIndex],rng[2])
        return lns = lns.concat([lines[lastLineIndex].slice(0, typeof segi === 'number' ? segi : -1)])
    }

    text["indexOfLongestLine"] = function (lines)
    {
        var index, line, maxIndex, maxLength

        maxIndex = 0
        maxLength = 0
        var list = _k_.list(lines)
        for (index = 0; index < list.length; index++)
        {
            line = list[index]
            if (line.length > maxLength)
            {
                maxLength = kseg.width(line)
                maxIndex = index
            }
        }
        return maxIndex
    }

    text["widthOfLines"] = function (lines)
    {
        return kseg.width(lines[this.indexOfLongestLine(lines)])
    }

    text["beforeAndAfterForPos"] = function (lines, pos)
    {
        var after, before, line

        line = lines[pos[1]]
        before = line.slice(0, typeof pos[0] === 'number' ? pos[0] : -1)
        after = line.slice(pos[0])
        return [before,after]
    }

    text["joinLineColumns"] = function (lineCols)
    {
        var cidx, i, lidx, line, lines, numCols, numLines

        for (var _a_ = i = 0, _b_ = lineCols.length - 1; (_a_ <= _b_ ? i < lineCols.length - 1 : i > lineCols.length - 1); (_a_ <= _b_ ? ++i : --i))
        {
            _k_.assert("kode/ked/edit/tool/text.kode", 233, 8, "assert failed!" + " lineCols[i].length === lineCols[i + 1].length", lineCols[i].length === lineCols[i + 1].length)
        }
        numLines = lineCols[0].length
        numCols = lineCols.length
        lines = []
        for (var _c_ = lidx = 0, _d_ = numLines; (_c_ <= _d_ ? lidx < numLines : lidx > numLines); (_c_ <= _d_ ? ++lidx : --lidx))
        {
            line = ''
            for (var _e_ = cidx = 0, _f_ = numCols; (_e_ <= _f_ ? cidx < numCols : cidx > numCols); (_e_ <= _f_ ? ++cidx : --cidx))
            {
                line += lineCols[cidx][lidx]
            }
            lines.push(line)
        }
        return lines
    }

    text["splitTextAtCols"] = function (text, cols)
    {
        var col, idx, prv, spans

        spans = []
        var list = _k_.list(cols)
        for (idx = 0; idx < list.length; idx++)
        {
            col = list[idx]
            prv = (idx > 0 ? cols[idx - 1] : 0)
            spans.push(text.slice(prv, typeof col === 'number' ? col : -1))
        }
        spans.push(text.slice(col))
        return spans
    }

    text["splitLinesAtCols"] = function (lines, cols)
    {
        var cls, i, idx, line, span, spans

        cls = []
        for (var _a_ = i = 0, _b_ = cols.length; (_a_ <= _b_ ? i <= cols.length : i >= cols.length); (_a_ <= _b_ ? ++i : --i))
        {
            cls.push([])
        }
        var list = _k_.list(lines)
        for (var _c_ = 0; _c_ < list.length; _c_++)
        {
            line = list[_c_]
            spans = this.splitTextAtCols(line,cols)
            var list1 = _k_.list(spans)
            for (idx = 0; idx < list1.length; idx++)
            {
                span = list1[idx]
                cls[idx].push(span)
            }
        }
        return cls
    }

    text["splitLineRange"] = function (lines, rng, includeEmpty = true)
    {
        var i, nl, split

        nl = this.numLinesInRange(rng)
        if (nl === 1)
        {
            return [rng]
        }
        split = []
        split.push([rng[0],rng[1],kseg.width(lines[rng[1]]),rng[1]])
        if (nl > 2)
        {
            for (var _a_ = i = 1, _b_ = nl - 2; (_a_ <= _b_ ? i <= nl - 2 : i >= nl - 2); (_a_ <= _b_ ? ++i : --i))
            {
                split.push([0,rng[1] + i,kseg.width(lines[rng[1] + i]),rng[1] + i])
            }
        }
        if (includeEmpty || rng[2] > 0)
        {
            split.push([0,rng[3],rng[2],rng[3]])
        }
        return split
    }

    text["splitLineRanges"] = function (lines, rngs, includeEmpty = true)
    {
        var rng, split

        split = []
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            split = split.concat(this.splitLineRange(lines,rng,includeEmpty))
        }
        return split
    }

    text["isLinesPosInside"] = function (lines, pos)
    {
        return pos[1] < lines.length && (0 <= pos[0] && pos[0] <= kseg.width(lines[pos[1]]))
    }

    text["isLinesPosOutside"] = function (lines, pos)
    {
        return !this.isLinesPosInside(lines,pos)
    }

    text["isValidLineIndex"] = function (lines, li)
    {
        return (0 <= li && li < lines.length)
    }

    text["isInvalidLineIndex"] = function (lines, li)
    {
        return !this.isValidLineIndex(lines,li)
    }

    text["isMultiLineRange"] = function (lines, rng)
    {
        return rng[1] !== rng[3]
    }

    text["isFullLineRange"] = function (lines, rng)
    {
        return ((0 <= rng[1] && (rng[1] <= rng[3] && rng[3] < lines.length))) && (rng[0] === 0) && (rng[2] >= lines[rng[3]].length || rng[2] === 0 && rng[1] < rng[3])
    }

    text["isSpanLineRange"] = function (lines, rng)
    {
        return ((0 <= rng[1] && (rng[1] === rng[3] && rng[3] < lines.length))) && (rng[0] > 0 || rng[2] < lines[rng[1]].length)
    }

    text["rangeOfLine"] = function (lines, y)
    {
        return [0,y,kseg.width(lines[y]),y]
    }

    text["rangeOfClosestChunkToPos"] = function (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (this.isInvalidLineIndex(lines,y))
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

    text["rangeOfClosestChunkLeftToPos"] = function (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (this.isInvalidLineIndex(lines,y))
        {
            return
        }
        if (r = kstr.rangeOfClosestChunk(lines[y].slice(0, typeof x === 'number' ? x : -1),x))
        {
            if ((0 <= r[0] && r[0] < r[1]))
            {
                return [r[0],y,r[1],y]
            }
        }
    }

    text["rangeOfClosestChunkRightToPos"] = function (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (this.isInvalidLineIndex(lines,y))
        {
            return
        }
        if (r = kstr.rangeOfClosestChunk(lines[y].slice(x),x))
        {
            if ((0 <= r[0] && r[0] < r[1]))
            {
                return [r[0],y,r[1],y]
            }
        }
    }

    text["wordAtPos"] = function (lines, pos)
    {
        var rng

        if (rng = this.rangeOfClosestWordToPos(lines,pos))
        {
            return kseg.str(this.segsForLineSpan(lines,rng))
        }
        return ''
    }

    text["chunkBeforePos"] = function (lines, pos)
    {
        var before, tcc

        before = lines[pos[1]].slice(0, typeof pos[0] === 'number' ? pos[0] : -1)
        if (tcc = kseg.tailCountChunk(before))
        {
            return kseg.str(before.slice(before.length - tcc))
        }
        return ''
    }

    text["chunkAfterPos"] = function (lines, pos)
    {
        var after, hcc

        after = lines[pos[1]].slice(pos[0])
        if (hcc = kseg.headCountChunk(after))
        {
            return kseg.str(after.slice(0, typeof hcc === 'number' ? hcc : -1))
        }
        return ''
    }

    text["rangeOfClosestWordToPos"] = function (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (this.isInvalidLineIndex(lines,y))
        {
            return
        }
        if (r = kseg.spanForClosestWordAtColumn(lines[y],x))
        {
            if ((0 <= r[0] && r[0] < r[1]))
            {
                return [r[0],y,r[1],y]
            }
        }
    }

    text["rangeOfWhitespaceLeftToPos"] = function (lines, pos)
    {
        var left, segi, tc, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        y = _k_.clamp(0,lines.length - 1,y)
        x = _k_.clamp(0,lines[y].length,x)
        if (x <= 0)
        {
            return [x,y,x,y]
        }
        segi = kseg.indexAtWidth(lines[y],x)
        left = lines[y].slice(0, typeof segi === 'number' ? segi : -1)
        if (tc = kseg.tailCount(left,' '))
        {
            return [segi - tc,y,segi,y]
        }
        return [x,y,x,y]
    }

    text["rangeOfWordOrWhitespaceLeftToPos"] = function (lines, pos)
    {
        var left, segi, tc, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (x <= 0 || this.isInvalidLineIndex(lines,y))
        {
            return
        }
        segi = kseg.indexAtWidth(lines[y],x)
        left = lines[y].slice(0, typeof segi === 'number' ? segi : -1)
        if (tc = kseg.tailCount(left,' '))
        {
            return [segi - tc,y,segi,y]
        }
        if (tc = kseg.tailCountWord(left))
        {
            return [segi - tc,y,segi,y]
        }
        return [segi - 1,y,segi,y]
    }

    text["rangeOfWordOrWhitespaceRightToPos"] = function (lines, pos)
    {
        var r, x, y

        var _a_ = pos; x = _a_[0]; y = _a_[1]

        if (x < 0 || this.isInvalidLineIndex(lines,y))
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

    text["lineChar"] = function (line, x)
    {
        if ((0 <= x && x < line.length))
        {
            return line[x]
        }
    }

    text["categoryForChar"] = function (char)
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

    text["jumpDelta"] = function (line, px, dx, jump)
    {
        var cat, ci, nc

        if (dx > 0)
        {
            ci = px
            if (nc = cat = this.categoryForChar(this.lineChar(line,ci)))
            {
                if (!(_k_.in(cat,jump)))
                {
                    return dx
                }
                while (true)
                {
                    ci += dx
                    nc = this.categoryForChar(this.lineChar(line,ci))
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
            cat = this.categoryForChar(this.lineChar(line,ci))
            if (!(_k_.in(cat,jump)))
            {
                return dx
            }
            while ((0 <= ci && ci < line.length) && this.categoryForChar(this.lineChar(line,ci)) === cat)
            {
                ci += dx
            }
            return _k_.min(dx,ci - px + 1)
        }
    }

    text["numCharsFromPosToWordOrPunctInDirection"] = function (lines, pos, dir, opt)
    {
        var dx

        dx = (dir === 'left' ? -1 : 1)
        if ((opt != null ? opt.jump : undefined))
        {
            return this.jumpDelta(lines[pos[1]],pos[0],dx,opt.jump)
        }
        if (pos[0] + dx < 0)
        {
            return 0
        }
        return dx
    }

    text["isRangeInString"] = function (lines, rng)
    {
        var _471_76_

        return (this.rangeOfStringSurroundingRange(lines,rng) != null)
    }

    text["rangeOfStringSurroundingRange"] = function (lines, rng)
    {
        var ir

        if (ir = this.rangeOfInnerStringSurroundingRange(lines,rng))
        {
            return this.rangeGrownBy(ir,1)
        }
    }

    text["rangeOfInnerStringSurroundingRange"] = function (lines, rng)
    {
        var r, rgs

        if (this.isInvalidLineIndex(lines,rng[1]))
        {
            return
        }
        rgs = this.rangesOfStringsInText(lines[rng[1]],rng[1])
        rgs = this.rangesShrunkenBy(rgs,1)
        var list = _k_.list(rgs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            r = list[_a_]
            if (this.rangeContainsRange(r,rng))
            {
                return r
            }
        }
    }

    text["rangesOfStringsInText"] = function (text, li = 0)
    {
        var c, cc, i, rngs, ss

        rngs = []
        ss = -1
        cc = null
        for (var _a_ = i = 0, _b_ = text.length; (_a_ <= _b_ ? i < text.length : i > text.length); (_a_ <= _b_ ? ++i : --i))
        {
            c = text[i]
            if (!cc && _k_.in(c,"'\""))
            {
                cc = c
                ss = i
            }
            else if (c === cc)
            {
                if ((text[i - 1] !== '\\') || (i > 2 && text[i - 2] === '\\'))
                {
                    rngs.push([ss,li,i + 1,li])
                    cc = null
                    ss = -1
                }
            }
        }
        return rngs
    }

    text["positionsAndRangesOutsideStrings"] = function (lines, rngs, posl)
    {
        var found, pos, rng

        found = []
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            if (!belt.isRangeInString(lines,rng))
            {
                found.push(rng)
            }
        }
        var list1 = _k_.list(posl)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            pos = list1[_b_]
            if (!belt.isRangeInString(lines,belt.rangeForPos(pos)))
            {
                found.push(pos)
            }
        }
        return found
    }

    text["rangesOfPairsSurroundingPositions"] = function (lines, pairs, posl)
    {
        var pair, pos, rngs

        rngs = []
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            var list1 = _k_.list(pairs)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                pair = list1[_b_]
                if (this.chunkBeforePos(lines,pos).endsWith(pair[0]) && this.chunkAfterPos(lines,pos).startsWith(pair[1]))
                {
                    rngs.push([pos[0] - pair[0].length,pos[1],pos[0] + pair[1].length,pos[1]])
                }
            }
        }
        return rngs
    }

    text["openCloseSpansForPositions"] = function (lines, posl)
    {
        var pos, spans, sps, srng

        spans = []
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            if (sps = this.openCloseSpansForPosition(lines,pos))
            {
                spans = spans.concat(sps)
            }
            if (srng = this.rangeOfStringSurroundingRange(lines,[pos[0],pos[1],pos[0],pos[1]]))
            {
                spans.push([srng[0],srng[1],srng[0] + 1])
                spans.push([srng[2] - 1,srng[3],srng[2]])
            }
            else if (_k_.in(lines[pos[1]][pos[0]],"\"'"))
            {
                if (srng = this.rangeOfStringSurroundingRange(lines,[pos[0] + 1,pos[1],pos[0] + 1,pos[1]]))
                {
                    spans.push([srng[0],srng[1],srng[0] + 1])
                    spans.push([srng[2] - 1,srng[3],srng[2]])
                }
            }
        }
        return spans
    }

    text["openCloseSpansForPosition"] = function (lines, pos)
    {
        var ap, bp, clos, closeEncounters, cnt, firstClose, lastOpen, maxLookups, next, open, openEncounters, opns, prev, revs, stack

        open = {'[':']','{':'}','(':')'}
        opns = Object.keys(open).join('')
        clos = Object.values(open).join('')
        revs = kutil.fromPairs(kutil.zip(clos,opns))
        maxLookups = 1000
        bp = [pos[0],pos[1]]
        if (!(_k_.in(lines[bp[1]][bp[0]],opns)))
        {
            closeEncounters = ''
            openEncounters = ''
            stack = []
            cnt = 0
            while (true)
            {
                bp[0] -= 1
                if (bp[0] >= 0)
                {
                    prev = lines[bp[1]][bp[0]]
                    if (_k_.in(prev,opns))
                    {
                        if (stack.length)
                        {
                            if (open[prev] === _k_.last(stack))
                            {
                                openEncounters += prev
                                stack.pop()
                                continue
                            }
                            else
                            {
                                return
                            }
                        }
                        lastOpen = prev
                        break
                    }
                    else if (_k_.in(prev,clos))
                    {
                        stack.push(prev)
                        closeEncounters += prev
                    }
                }
                else
                {
                    bp[1] -= 1
                    if (bp[1] < 0)
                    {
                        break
                    }
                    bp[0] = lines[bp[1]].length
                }
                if ((lastOpen != null))
                {
                    break
                }
                if (bp[1] < 0)
                {
                    break
                }
                if (cnt++ > maxLookups)
                {
                    break
                }
            }
        }
        else
        {
            lastOpen = lines[bp[1]][bp[0]]
        }
        stack = []
        ap = [_k_.max(bp[0] + 1,pos[0]),pos[1]]
        while (ap[1] < lines.length)
        {
            cnt = 0
            next = lines[ap[1]][ap[0]]
            if (_k_.in(next,clos))
            {
                if (stack.length)
                {
                    if (open[_k_.last(stack)] === next)
                    {
                        stack.pop()
                    }
                    else
                    {
                        return
                    }
                }
                else
                {
                    firstClose = next
                    break
                }
            }
            else if (_k_.in(next,opns))
            {
                stack.push(next)
            }
            ap[0] += 1
            if (ap[0] >= lines[ap[1]].length)
            {
                ap[0] = 0
                ap[1] += 1
            }
            if (cnt++ > maxLookups)
            {
                break
            }
        }
        if (!(lastOpen != null) || !(firstClose != null))
        {
            if (_k_.in(lines[pos[1]][pos[0] - 1],clos) && _k_.in(revs[lines[pos[1]][pos[0] - 1]],openEncounters))
            {
                return this.openCloseSpansForPosition(lines,[pos[0] - 1,pos[1]])
            }
            return
        }
        if (open[lastOpen] === firstClose)
        {
            return [[bp[0],bp[1],bp[0] + 1],[ap[0],ap[1],ap[0] + 1]]
        }
    }

    text["isCommentLine"] = function (line)
    {
        var trimmed

        trimmed = kseg.trim(line)
        return trimmed[0] === "#"
    }

    text["prepareWordsForCompletion"] = function (turd, words)
    {
        var end, push, segl, segls, strs, tc

        words = words.filter(function (w)
        {
            return w.startsWith(turd) && w !== turd
        })
        words = kutil.uniq(words)
        if (_k_.empty(words))
        {
            return []
        }
        segls = []
        push = function (s)
        {
            var ws

            if (kseg.str(s) === turd)
            {
                return
            }
            ws = kseg.words(s)
            ws = ws.filter(function (w)
            {
                return w.index + w.segl.length > turd.length
            })
            if (!_k_.empty(ws[0]))
            {
                if (ws[0].index === 0 && (turd !== ws[0].word && ws[0].word !== s) && ws[0].word.startsWith(turd))
                {
                    segls.push(ws[0].segl)
                }
                else
                {
                    if (ws[0].index - turd.length <= 0)
                    {
                        segls.push(s.slice(0, ws[0].index + ws[0].segl.length))
                    }
                    else if (ws[0].index - turd.length > 0)
                    {
                        segls.push(s.slice(0, turd.length + 1))
                    }
                }
            }
            return segls.push(s)
        }
        var list = _k_.list(kseg.segls(words))
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            segl = list[_a_]
            tc = kseg.tailCountTurd(segl)
            if (tc === 0 || tc === 1 && segl[0] === segl.slice(-1)[0])
            {
                push(segl)
            }
            else
            {
                end = kseg.str(segl.slice(segl.length - tc))
                if (_k_.in(end,'])}"\'') || _k_.in(end.slice(-1)[0],')]}') && !(_k_.in(end.slice(-2,-1)[0],',')))
                {
                    push(segl)
                }
                else
                {
                    push(segl.slice(0, segl.length - tc))
                }
            }
        }
        strs = segls.map(kseg.str)
        strs.sort()
        return kutil.uniq(strs)
    }

    text["insertAsciiHeaderForPositionsAndRanges"] = function (lines, posl, ranges)
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

    return text
})()

export default text;