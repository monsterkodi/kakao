var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Buffer, cs

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let matchr = kxk.matchr
let events = kxk.events
let uniq = kxk.uniq

import Do from "./Do.js"


Buffer = (function ()
{
    _k_.extend(Buffer, events)
    function Buffer ()
    {
        this["startOfWordAtPos"] = this["startOfWordAtPos"].bind(this)
        this["endOfWordAtPos"] = this["endOfWordAtPos"].bind(this)
        this["lines"] = this["lines"].bind(this)
        this["line"] = this["line"].bind(this)
        this["onDoChanges"] = this["onDoChanges"].bind(this)
        Buffer.__super__.constructor.call(this)
        this.newlineCharacters = '\n'
        this.wordRegExp = new RegExp("(\\s+|\\w+|[^\\s])",'g')
        this.realWordRegExp = new RegExp("(\\w+)",'g')
        this.do = new Do()
        this.do.on('changes',this.onDoChanges)
    }

    Buffer.prototype["onDoChanges"] = function (changes)
    {
        var _27_16_

        return (typeof this.changed === "function" ? this.changed(changes) : undefined)
    }

    Buffer.prototype["setLines"] = function (lines)
    {
        this.emit('numLines',0)
        this.do.setLines(lines)
        if (this.name === 'editor')
        {
            return this.emit('numLines',this.numLines())
        }
    }

    Buffer.prototype["mainCursor"] = function ()
    {
        return this.do.mainCursor()
    }

    Buffer.prototype["hasMainCursor"] = function ()
    {
        var c

        c = this.mainCursor()
        if (c[0] || c[1])
        {
            return c
        }
    }

    Buffer.prototype["line"] = function (i)
    {
        return this.do.line(i)
    }

    Buffer.prototype["tabline"] = function (i)
    {
        return this.do.tabline(i)
    }

    Buffer.prototype["cursor"] = function (i)
    {
        return this.do.cursor(i)
    }

    Buffer.prototype["highlight"] = function (i)
    {
        return this.do.highlight(i)
    }

    Buffer.prototype["selection"] = function (i)
    {
        return this.do.selection(i)
    }

    Buffer.prototype["lines"] = function ()
    {
        return this.do.lines()
    }

    Buffer.prototype["cursors"] = function ()
    {
        return this.do.cursors()
    }

    Buffer.prototype["highlights"] = function ()
    {
        return this.do.highlights()
    }

    Buffer.prototype["selections"] = function ()
    {
        return this.do.selections()
    }

    Buffer.prototype["numLines"] = function ()
    {
        return this.do.numLines()
    }

    Buffer.prototype["numCursors"] = function ()
    {
        return this.do.numCursors()
    }

    Buffer.prototype["numSelections"] = function ()
    {
        return this.do.numSelections()
    }

    Buffer.prototype["numHighlights"] = function ()
    {
        return this.do.numHighlights()
    }

    Buffer.prototype["setCursors"] = function (c)
    {
        return this.do.setCursors(c)
    }

    Buffer.prototype["setSelections"] = function (s)
    {
        return this.do.setSelections(s)
    }

    Buffer.prototype["setHighlights"] = function (h)
    {
        return this.do.setHighlights(h)
    }

    Buffer.prototype["setMain"] = function (m)
    {
        return this.do.setMain(m)
    }

    Buffer.prototype["addHighlight"] = function (h)
    {
        return this.do.addHighlight(h)
    }

    Buffer.prototype["select"] = function (s)
    {
        this.do.start()
        this.do.select(s)
        return this.do.end()
    }

    Buffer.prototype["isCursorVirtual"] = function (c = this.mainCursor())
    {
        return this.numLines() && c[1] < this.numLines() && c[0] > this.line(c[1]).length
    }

    Buffer.prototype["isCursorAtEndOfLine"] = function (c = this.mainCursor())
    {
        return this.numLines() && c[1] < this.numLines() && c[0] >= this.line(c[1]).length
    }

    Buffer.prototype["isCursorAtStartOfLine"] = function (c = this.mainCursor())
    {
        return c[0] === 0
    }

    Buffer.prototype["isCursorInIndent"] = function (c = this.mainCursor())
    {
        return this.numLines() && this.line(c[1]).slice(0,c[0]).trim().length === 0 && this.line(c[1]).slice(c[0]).trim().length
    }

    Buffer.prototype["isCursorInLastLine"] = function (c = this.mainCursor())
    {
        return c[1] === this.numLines() - 1
    }

    Buffer.prototype["isCursorInFirstLine"] = function (c = this.mainCursor())
    {
        return c[1] === 0
    }

    Buffer.prototype["isCursorInRange"] = function (r, c = this.mainCursor())
    {
        return isPosInRange(c,r)
    }

    Buffer.prototype["wordAtCursor"] = function ()
    {
        return this.wordAtPos(this.mainCursor())
    }

    Buffer.prototype["wordAtPos"] = function (c)
    {
        return this.textInRange(this.rangeForRealWordAtPos(c))
    }



    Buffer.prototype["selectionTextOrWordAtCursor"] = function ()
    {
        if (this.numSelections() === 1)
        {
            return this.textInRange(this.selection(0))
        }
        else
        {
            return this.wordAtCursor()
        }
    }

    Buffer.prototype["rangeForWordAtPos"] = function (pos, opt)
    {
        var p, r, wr

        p = this.clampPos(pos)
        wr = this.wordRangesInLineAtIndex(p[1],opt)
        r = rangeAtPosInRanges(p,wr)
        return r
    }

    Buffer.prototype["rangeForRealWordAtPos"] = function (pos, opt)
    {
        var p, r, wr

        p = this.clampPos(pos)
        wr = this.realWordRangesInLineAtIndex(p[1],opt)
        r = rangeAtPosInRanges(p,wr)
        if (!(r != null) || _k_.empty(this.textInRange(r).trim()))
        {
            r = rangeBeforePosInRanges(p,wr)
        }
        if (!(r != null) || _k_.empty(this.textInRange(r).trim()))
        {
            r = rangeAfterPosInRanges(p,wr)
        }
        r = (r != null ? r : rangeForPos(p))
        return r
    }

    Buffer.prototype["endOfWordAtPos"] = function (c)
    {
        var r

        r = this.rangeForWordAtPos(c)
        if (this.isCursorAtEndOfLine(c))
        {
            if (this.isCursorInLastLine(c))
            {
                return c
            }
            r = this.rangeForWordAtPos([0,c[1] + 1])
        }
        return [r[1][1],r[0]]
    }

    Buffer.prototype["startOfWordAtPos"] = function (c)
    {
        var r

        if (this.isCursorAtStartOfLine(c))
        {
            if (this.isCursorInFirstLine(c))
            {
                return c
            }
            r = this.rangeForWordAtPos([this.line(c[1] - 1).length,c[1] - 1])
        }
        else
        {
            r = this.rangeForWordAtPos(c)
            if (r[1][0] === c[0])
            {
                r = this.rangeForWordAtPos([c[0] - 1,c[1]])
            }
        }
        return [r[1][0],r[0]]
    }

    Buffer.prototype["wordRangesInLineAtIndex"] = function (li, opt = {})
    {
        var mtch, r, _144_19_, _145_89_

        opt.regExp = ((_144_19_=opt.regExp) != null ? _144_19_ : this.wordRegExp)
        if ((opt != null ? (_145_89_=opt.include) != null ? _145_89_.length : undefined : undefined))
        {
            opt.regExp = new RegExp(`(\\s+|[\\w${opt.include}]+|[^\\s])`,'g')
        }
        r = []
        while ((mtch = opt.regExp.exec(this.line(li))) !== null)
        {
            r.push([li,[mtch.index,opt.regExp.lastIndex]])
        }
        return r.length && r || [[li,[0,0]]]
    }

    Buffer.prototype["realWordRangesInLineAtIndex"] = function (li, opt = {})
    {
        var mtch, r

        r = []
        while ((mtch = this.realWordRegExp.exec(this.line(li))) !== null)
        {
            r.push([li,[mtch.index,this.realWordRegExp.lastIndex]])
        }
        return r.length && r || [[li,[0,0]]]
    }

    Buffer.prototype["highlightsInLineIndexRangeRelativeToLineIndex"] = function (lineIndexRange, relIndex)
    {
        var hl, s

        hl = this.highlightsInLineIndexRange(lineIndexRange)
        if (hl)
        {
            return (function () { var r_a_ = []; var list = _k_.list(hl); for (var _b_ = 0; _b_ < list.length; _b_++)  { s = list[_b_];r_a_.push([s[0] - relIndex,[s[1][0],s[1][1]],s[2]])  } return r_a_ }).bind(this)()
        }
    }

    Buffer.prototype["highlightsInLineIndexRange"] = function (lineIndexRange)
    {
        return this.highlights().filter(function (s)
        {
            return s[0] >= lineIndexRange[0] && s[0] <= lineIndexRange[1]
        })
    }

    Buffer.prototype["selectionsInLineIndexRangeRelativeToLineIndex"] = function (lineIndexRange, relIndex)
    {
        var s, sl

        sl = this.selectionsInLineIndexRange(lineIndexRange)
        if (sl)
        {
            return (function () { var r_a_ = []; var list = _k_.list(sl); for (var _b_ = 0; _b_ < list.length; _b_++)  { s = list[_b_];r_a_.push([s[0] - relIndex,[s[1][0],s[1][1]]])  } return r_a_ }).bind(this)()
        }
    }

    Buffer.prototype["selectionsInLineIndexRange"] = function (lineIndexRange)
    {
        return this.selections().filter(function (s)
        {
            return s[0] >= lineIndexRange[0] && s[0] <= lineIndexRange[1]
        })
    }

    Buffer.prototype["selectedLineIndices"] = function ()
    {
        var s

        return uniq((function () { var r_a_ = []; var list = _k_.list(this.selections()); for (var _b_ = 0; _b_ < list.length; _b_++)  { s = list[_b_];r_a_.push(s[0])  } return r_a_ }).bind(this)())
    }

    Buffer.prototype["cursorLineIndices"] = function ()
    {
        var c

        return uniq((function () { var r_a_ = []; var list = _k_.list(this.cursors()); for (var _b_ = 0; _b_ < list.length; _b_++)  { c = list[_b_];r_a_.push(c[1])  } return r_a_ }).bind(this)())
    }

    Buffer.prototype["selectedAndCursorLineIndices"] = function ()
    {
        return uniq(this.selectedLineIndices().concat(this.cursorLineIndices()))
    }

    Buffer.prototype["continuousCursorAndSelectedLineIndexRanges"] = function ()
    {
        var csr, il, li

        il = this.selectedAndCursorLineIndices()
        csr = []
        if (il.length)
        {
            var list = _k_.list(il)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                li = list[_a_]
                if (csr.length && _k_.last(csr)[1] === li - 1)
                {
                    _k_.last(csr)[1] = li
                }
                else
                {
                    csr.push([li,li])
                }
            }
        }
        return csr
    }

    Buffer.prototype["isSelectedLineAtIndex"] = function (li)
    {
        var il, s

        il = this.selectedLineIndices()
        if (_k_.in(li,il))
        {
            s = this.selection(il.indexOf(li))
            if (s[1][0] === 0 && s[1][1] === this.line(li).length)
            {
                return true
            }
        }
        return false
    }

    Buffer.prototype["text"] = function ()
    {
        return this.do.text(this.newlineCharacters)
    }

    Buffer.prototype["textInRange"] = function (rg)
    {
        var _225_58_

        return (!_k_.empty((rg)) ? (typeof this.line(rg[0]).slice === "function" ? this.line(rg[0]).slice(rg[1][0],rg[1][1]) : undefined) : '')
    }

    Buffer.prototype["textsInRanges"] = function (rgs)
    {
        var r

        return (function () { var r_a_ = []; var list = _k_.list(rgs); for (var _b_ = 0; _b_ < list.length; _b_++)  { r = list[_b_];r_a_.push(this.textInRange(r))  } return r_a_ }).bind(this)()
    }

    Buffer.prototype["textInRanges"] = function (rgs)
    {
        return this.textsInRanges(rgs).join('\n')
    }

    Buffer.prototype["textOfSelection"] = function ()
    {
        return this.textInRanges(this.selections())
    }

    Buffer.prototype["textOfHighlight"] = function ()
    {
        return this.numHighlights() && this.textInRange(this.highlight(0)) || ''
    }

    Buffer.prototype["indentationAtLineIndex"] = function (li)
    {
        var line

        if (li >= this.numLines())
        {
            return 0
        }
        line = this.line(li)
        while (_k_.empty((line.trim())) && li > 0)
        {
            li--
            line = this.line(li)
        }
        return indentationInLine(line)
    }

    Buffer.prototype["lastPos"] = function ()
    {
        var lli

        lli = this.numLines() - 1
        return [this.line(lli).length,lli]
    }

    Buffer.prototype["cursorPos"] = function ()
    {
        return this.clampPos(this.mainCursor())
    }

    Buffer.prototype["clampPos"] = function (p)
    {
        var c, l

        if (!this.numLines())
        {
            return [0,-1]
        }
        l = _k_.clamp(0,this.numLines() - 1,p[1])
        c = _k_.clamp(0,this.line(l).length,p[0])
        return [c,l]
    }

    Buffer.prototype["wordStartPosAfterPos"] = function (p = this.cursorPos())
    {
        if (p[0] < this.line(p[1]).length && this.line(p[1])[p[0]] !== ' ')
        {
            return p
        }
        while (p[0] < this.line(p[1]).length - 1)
        {
            if (this.line(p[1])[p[0] + 1] !== ' ')
            {
                return [p[0] + 1,p[1]]
            }
            p[0] += 1
        }
        if (p[1] < this.numLines() - 1)
        {
            return this.wordStartPosAfterPos([0,p[1] + 1])
        }
        else
        {
            return null
        }
    }

    Buffer.prototype["rangeForLineAtIndex"] = function (i)
    {
        if (i >= this.numLines())
        {
            return console.error(`Buffer.rangeForLineAtIndex -- index ${i} >= ${this.numLines()}`)
        }
        return [i,[0,this.line(i).length]]
    }

    Buffer.prototype["isRangeInString"] = function (r)
    {
        var _290_59_

        return (this.rangeOfStringSurroundingRange(r) != null)
    }

    Buffer.prototype["rangeOfInnerStringSurroundingRange"] = function (r)
    {
        var rgs

        rgs = this.rangesOfStringsInLineAtIndex(r[0])
        rgs = rangesShrunkenBy(rgs,1)
        return rangeContainingRangeInRanges(r,rgs)
    }

    Buffer.prototype["rangeOfStringSurroundingRange"] = function (r)
    {
        var ir

        if (ir = this.rangeOfInnerStringSurroundingRange(r))
        {
            return rangeGrownBy(ir,1)
        }
    }

    Buffer.prototype["distanceOfWord"] = function (w, pos)
    {
        var d, la, lb

        pos = (pos != null ? pos : this.cursorPos())
        if (this.line(pos[1]).indexOf(w) >= 0)
        {
            return 0
        }
        d = 1
        lb = pos[1] - d
        la = pos[1] + d
        while (lb >= 0 || la < this.numLines())
        {
            if (lb >= 0)
            {
                if (this.line(lb).indexOf(w) >= 0)
                {
                    return d
                }
            }
            if (la < this.numLines())
            {
                if (this.line(la).indexOf(w) >= 0)
                {
                    return d
                }
            }
            d++
            lb = pos[1] - d
            la = pos[1] + d
        }
        return Number.MAX_SAFE_INTEGER
    }

    Buffer.prototype["rangesForCursorLines"] = function (cs = this.cursors())
    {
        var c

        return (function () { var r_a_ = []; var list = _k_.list(cs); for (var _b_ = 0; _b_ < list.length; _b_++)  { c = list[_b_];r_a_.push(this.rangeForLineAtIndex(c[1]))  } return r_a_ }).bind(this)()
    }

    Buffer.prototype["rangesForAllLines"] = function ()
    {
        return this.rangesForLinesFromTopToBot(0,this.numLines())
    }

    Buffer.prototype["rangesForLinesBetweenPositions"] = function (a, b, extend = false)
    {
        var i, r

        r = []
        var _a_ = sortPositions([a,b]); a = _a_[0]; b = _a_[1]

        if (a[1] === b[1])
        {
            r.push([a[1],[a[0],b[0]]])
        }
        else
        {
            r.push([a[1],[a[0],this.line(a[1]).length]])
            if (b[1] - a[1] > 1)
            {
                for (var _b_ = i = a[1] + 1, _c_ = b[1]; (_b_ <= _c_ ? i < b[1] : i > b[1]); (_b_ <= _c_ ? ++i : --i))
                {
                    r.push([i,[0,this.line(i).length]])
                }
            }
            r.push([b[1],[0,extend && b[0] === 0 && this.line(b[1]).length || b[0]]])
        }
        return r
    }

    Buffer.prototype["rangesForLinesFromTopToBot"] = function (top, bot)
    {
        var endOf, ir, li, r

        r = []
        ir = [top,bot]
        endOf = function (r)
        {
            return r[0] + Math.max(1,r[1] - r[0])
        }
        for (var _a_ = li = ir[0], _b_ = endOf(ir); (_a_ <= _b_ ? li < endOf(ir) : li > endOf(ir)); (_a_ <= _b_ ? ++li : --li))
        {
            if ((0 <= li && li < this.numLines()))
            {
                r.push(this.rangeForLineAtIndex(li))
            }
        }
        return r
    }

    Buffer.prototype["rangesForText"] = function (t, opt)
    {
        var li, r, _366_43_

        t = t.split('\n')[0]
        r = []
        for (var _a_ = li = 0, _b_ = this.numLines(); (_a_ <= _b_ ? li < this.numLines() : li > this.numLines()); (_a_ <= _b_ ? ++li : --li))
        {
            r = r.concat(this.rangesForTextInLineAtIndex(t,li,opt))
            if (r.length >= (((_366_43_=(opt != null ? opt.max : undefined)) != null ? _366_43_ : 999)))
            {
                break
            }
        }
        return r
    }

    Buffer.prototype["rangesForTextInLineAtIndex"] = function (t, i, opt)
    {
        var r, rng, rngs, type, _372_25_

        r = []
        type = ((_372_25_=(opt != null ? opt.type : undefined)) != null ? _372_25_ : 'str')
        if (_k_.in(type,['str','Str']))
        {
            t = kstr.escapeRegExp(t)
        }
        rngs = matchr.ranges(t,this.line(i),_k_.in(type,['str','reg']) && 'i' || '')
        var list = _k_.list(rngs)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            rng = list[_a_]
            r.push([i,[rng.start,rng.start + rng.match.length]])
        }
        return r
    }

    Buffer.prototype["rangesOfStringsInLineAtIndex"] = function (li)
    {
        var c, cc, i, r, ss, t

        t = this.line(li)
        r = []
        ss = -1
        cc = null
        for (var _a_ = i = 0, _b_ = t.length; (_a_ <= _b_ ? i < t.length : i > t.length); (_a_ <= _b_ ? ++i : --i))
        {
            c = t[i]
            if (!cc && _k_.in(c,"'\""))
            {
                cc = c
                ss = i
            }
            else if (c === cc)
            {
                if ((t[i - 1] !== '\\') || (i > 2 && t[i - 2] === '\\'))
                {
                    r.push([li,[ss,i + 1]])
                    cc = null
                    ss = -1
                }
            }
        }
        return r
    }

    return Buffer
})()

export default Buffer;