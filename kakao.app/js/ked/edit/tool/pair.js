var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var pair

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let kutil = kxk.kutil
let kseg = kxk.kseg

import pepe from "../../../kxk/pepe.js"

import belt from "./belt.js"


pair = (function ()
{
    function pair ()
    {}

    pair["isUnbalancedPosition"] = function (lines, pos, char)
    {
        var p, revs, start, _31_28_

        revs = {']':'[','}':'{',')':'(','"':'"',"'":"'"}
        p = pepe(kseg.str(lines[pos[1]]))
        start = (p.unbalanced != null ? p.unbalanced.slice(1).map(function (s)
        {
            return s.start
        }) : undefined)
        return !_k_.empty(start) && _k_.in(revs[char],start)
    }

    pair["isRangeInString"] = function (lines, rng)
    {
        var _40_76_

        return (this.rangeOfStringSurroundingRange(lines,rng) != null)
    }

    pair["rangeOfStringSurroundingRange"] = function (lines, rng)
    {
        var ir

        if (ir = this.rangeOfInnerStringSurroundingRange(lines,rng))
        {
            return this.rangeGrownBy(ir,1)
        }
    }

    pair["rangeOfInnerStringSurroundingRange"] = function (lines, rng)
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

    pair["rangesOfStringsInText"] = function (text, li = 0)
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

    pair["positionsAndRangesOutsideStrings"] = function (lines, rngs, posl)
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

    pair["rangesOfPairsSurroundingPositions"] = function (lines, pairs, posl)
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

    pair["stringDelimiterSpansForPositions"] = function (lines, posl)
    {
        var pos, spans, srng

        spans = []
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
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

    pair["openCloseSpansForPositions"] = function (lines, posl)
    {
        var pos, spans, sps

        spans = []
        var list = _k_.list(posl)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            pos = list[_a_]
            if (sps = this.openCloseSpansForPosition(lines,pos))
            {
                spans = spans.concat(sps)
            }
        }
        return spans
    }

    pair["openCloseSpansForPosition"] = function (lines, pos)
    {
        var ap, bp, clos, closeEncounters, cnt, firstClose, lastOpen, maxLookups, next, open, openEncounters, opns, prev, revs, stack

        open = {'[':']','{':'}','(':')'}
        opns = '[{('
        clos = ']})'
        revs = {']':'[','}':'{',')':'('}
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
        cnt = 0
        while (ap[1] < lines.length)
        {
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

    return pair
})()

export default pair;