var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import util from "../../../kxk/util.js"
let isEqual = util.isEqual
let uniqEqual = util.uniqEqual
let reversed = util.reversed

import kxk from "../../../kxk.js"
let kstr = kxk.kstr

export default {initSurround:function ()
{
    this.surroundStack = []
    this.surroundPairs = {'#':['#{','}'],'{':['{','}'],'}':['{','}'],'[':['[',']'],']':['[',']'],'(':['(',')'],')':['(',')'],'<':['<','>'],'>':['<','>'],"'":["'","'"],'"':['"','"'],'*':['*','*']}
    this.surroundCharacters = "{}[]()\"'".split('')
    switch (this.fileType)
    {
        case 'html':
            return this.surroundCharacters = this.surroundCharacters.concat(['<','>'])

        case 'coffee':
        case 'kode':
            return this.surroundCharacters.push('#')

        case 'md':
            this.surroundCharacters = this.surroundCharacters.concat(['*','<','`'])
            this.surroundPairs['<'] = ['<!--','-->']
            return this.surroundPairs['`'] = ['`','`']

    }

},isUnbalancedSurroundCharacter:function (ch)
{
    var c, cl, count, cr, cursor

    if (_k_.in(ch,["#"]))
    {
        return false
    }
    var _44_16_ = this.surroundPairs[ch]; cl = _44_16_[0]; cr = _44_16_[1]

    if (cl.length > 1)
    {
        return false
    }
    var list = _k_.list(this.cursors())
    for (var _46_19_ = 0; _46_19_ < list.length; _46_19_++)
    {
        cursor = list[_46_19_]
        count = 0
        var list1 = _k_.list(this.line(cursor[1]))
        for (var _48_18_ = 0; _48_18_ < list1.length; _48_18_++)
        {
            c = list1[_48_18_]
            if (c === cl)
            {
                count += 1
            }
            else if (c === cr)
            {
                count -= 1
            }
        }
        if (((cl === cr) && (count % 2)) || ((cl !== cr) && count))
        {
            return true
        }
    }
    return false
},selectionContainsOnlyQuotes:function ()
{
    var c

    var list = _k_.list(this.textOfSelection())
    for (var _59_14_ = 0; _59_14_ < list.length; _59_14_++)
    {
        c = list[_59_14_]
        if (c === '\n')
        {
            continue
        }
        if (!(_k_.in(c,['"',"'"])))
        {
            return false
        }
    }
    return true
},insertTripleQuotes:function ()
{
    var after, before, p

    if (this.numCursors() > 1)
    {
        return false
    }
    if (this.numSelections())
    {
        return false
    }
    p = this.cursorPos()
    var _70_24_ = this.splitStateLineAtPos(this.state,p); before = _70_24_[0]; after = _70_24_[1]

    if (!before.endsWith('""'))
    {
        return false
    }
    if (before.length > 2 && before[before.length - 3] === '"')
    {
        return false
    }
    if (after.startsWith('"'))
    {
        return false
    }
    this.do.start()
    this.do.change(p[1],before + '""""' + after)
    this.do.setCursors([[p[0] + 1,p[1]]])
    this.do.end()
    return true
},insertSurroundCharacter:function (ch)
{
    var after, afterGood, before, beforeGood, c, cl, cr, found, newCursors, newSelections, ns, os, s, spaces, sr, trimmed

    if (ch === '"' && _k_.in(this.fileType,['coffee','kode']) && this.insertTripleQuotes())
    {
        return true
    }
    if (this.isUnbalancedSurroundCharacter(ch))
    {
        return false
    }
    if (this.numSelections() && _k_.in(ch,['"',"'"]) && this.selectionContainsOnlyQuotes())
    {
        return false
    }
    newCursors = this.do.cursors()
    if (this.surroundStack.length)
    {
        if (_k_.last(this.surroundStack)[1] === ch)
        {
            var list = _k_.list(newCursors)
            for (var _101_22_ = 0; _101_22_ < list.length; _101_22_++)
            {
                c = list[_101_22_]
                if (this.do.line(c[1])[c[0]] !== ch)
                {
                    this.surroundStack = []
                    break
                }
            }
            if (this.surroundStack.length && _k_.last(this.surroundStack)[1] === ch)
            {
                this.do.start()
                this.selectNone()
                this.deleteForward()
                this.do.end()
                this.surroundStack.pop()
                return false
            }
        }
    }
    if (ch === '#' && _k_.in(this.fileType,['coffee','kode']))
    {
        found = false
        var list1 = _k_.list(this.do.selections())
        for (var _115_18_ = 0; _115_18_ < list1.length; _115_18_++)
        {
            s = list1[_115_18_]
            if (this.isRangeInString(s))
            {
                found = true
                break
            }
        }
        if (!found)
        {
            var list2 = _k_.list(newCursors)
            for (var _121_22_ = 0; _121_22_ < list2.length; _121_22_++)
            {
                c = list2[_121_22_]
                if (this.isRangeInString(rangeForPos(c)))
                {
                    found = true
                    break
                }
            }
        }
        if (!found)
        {
            return false
        }
    }
    if (ch === "'" && !this.numSelections())
    {
        var list3 = _k_.list(newCursors)
        for (var _128_18_ = 0; _128_18_ < list3.length; _128_18_++)
        {
            c = list3[_128_18_]
            if (c[0] > 0 && /[A-Za-z]/.test(this.do.line(c[1])[c[0] - 1]))
            {
                return false
            }
        }
    }
    this.do.start()
    if (this.do.numSelections() === 0)
    {
        newSelections = rangesFromPositions(newCursors)
    }
    else
    {
        newSelections = this.do.selections()
    }
    var _138_16_ = this.surroundPairs[ch]; cl = _138_16_[0]; cr = _138_16_[1]

    this.surroundStack.push([cl,cr])
    var list4 = _k_.list(reversed(newSelections))
    for (var _142_15_ = 0; _142_15_ < list4.length; _142_15_++)
    {
        ns = list4[_142_15_]
        if (cl === '#{')
        {
            if (sr = this.rangeOfStringSurroundingRange(ns))
            {
                if (this.do.line(sr[0])[sr[1][0]] === "'")
                {
                    this.do.change(ns[0],kstr.splice(this.do.line(ns[0]),sr[1][0],1,'"'))
                }
                if (this.do.line(sr[0])[sr[1][1] - 1] === "'")
                {
                    this.do.change(ns[0],kstr.splice(this.do.line(ns[0]),sr[1][1] - 1,1,'"'))
                }
            }
        }
        else if (_k_.in(this.fileType,['coffee','kode']) && cl === '(' && lengthOfRange(ns) > 0)
        {
            var _152_32_ = this.splitStateLineAtPos(this.do,rangeStartPos(ns)); before = _152_32_[0]; after = _152_32_[1]

            trimmed = before.trimRight()
            beforeGood = /\w$/.test(trimmed) && !/(if|when|in|and|or|is|not|else|return)$/.test(trimmed)
            afterGood = after.trim().length && !after.startsWith(' ')
            if (beforeGood && afterGood)
            {
                spaces = before.length - trimmed.length
                this.do.change(ns[0],kstr.splice(this.do.line(ns[0]),trimmed.length,spaces))
                var list5 = _k_.list(positionsAfterLineColInPositions(ns[0],ns[1][0] - 1,newCursors))
                for (var _160_26_ = 0; _160_26_ < list5.length; _160_26_++)
                {
                    c = list5[_160_26_]
                    c[0] -= spaces
                }
                ns[1][0] -= spaces
                ns[1][1] -= spaces
            }
        }
        this.do.change(ns[0],kstr.splice(this.do.line(ns[0]),ns[1][1],0,cr))
        this.do.change(ns[0],kstr.splice(this.do.line(ns[0]),ns[1][0],0,cl))
        var list6 = _k_.list(positionsAfterLineColInPositions(ns[0],ns[1][0] - 1,newCursors))
        for (var _168_18_ = 0; _168_18_ < list6.length; _168_18_++)
        {
            c = list6[_168_18_]
            c[0] += cl.length
        }
        var list7 = _k_.list(rangesAfterLineColInRanges(ns[0],ns[1][1] - 1,newSelections))
        for (var _171_19_ = 0; _171_19_ < list7.length; _171_19_++)
        {
            os = list7[_171_19_]
            os[1][0] += cr.length
            os[1][1] += cr.length
        }
        var list8 = _k_.list(rangesAfterLineColInRanges(ns[0],ns[1][0] - 1,newSelections))
        for (var _175_19_ = 0; _175_19_ < list8.length; _175_19_++)
        {
            os = list8[_175_19_]
            os[1][0] += cl.length
            os[1][1] += cl.length
        }
        var list9 = _k_.list(positionsAfterLineColInPositions(ns[0],ns[1][1],newCursors))
        for (var _179_18_ = 0; _179_18_ < list9.length; _179_18_++)
        {
            c = list9[_179_18_]
            c[0] += cr.length
        }
    }
    this.do.select(rangesNotEmptyInRanges(newSelections))
    this.do.setCursors(newCursors)
    this.do.end()
    return true
},deleteEmptySurrounds:function ()
{
    var after, before, c, cs, nc, numPairs, openClosePairs, pairs, sc, so, uniquePairs

    if (_k_.empty(this.surroundPairs))
    {
        return
    }
    cs = this.do.cursors()
    pairs = uniqEqual(Object.values(this.surroundPairs))
    openClosePairs = []
    var list = _k_.list(cs)
    for (var _203_14_ = 0; _203_14_ < list.length; _203_14_++)
    {
        c = list[_203_14_]
        numPairs = openClosePairs.length
        var list1 = _k_.list(pairs)
        for (var _206_25_ = 0; _206_25_ < list1.length; _206_25_++)
        {
            so = list1[_206_25_][0]
            sc = list1[_206_25_][1]
            before = this.do.line(c[1]).slice(c[0] - so.length,c[0])
            after = this.do.line(c[1]).slice(c[0],c[0] + sc.length)
            if (so === before && sc === after)
            {
                openClosePairs.push([so,sc])
                break
            }
        }
        if (numPairs === openClosePairs.length)
        {
            return false
        }
    }
    if (cs.length !== openClosePairs.length)
    {
        return false
    }
    uniquePairs = uniqEqual(openClosePairs)
    var list2 = _k_.list(cs)
    for (var _221_14_ = 0; _221_14_ < list2.length; _221_14_++)
    {
        c = list2[_221_14_]
        var _222_20_ = openClosePairs.shift(); so = _222_20_[0]; sc = _222_20_[1]

        this.do.change(c[1],kstr.splice(this.do.line(c[1]),c[0] - so.length,so.length + sc.length))
        var list3 = _k_.list(positionsAfterLineColInPositions(c[1],c[0],cs))
        for (var _225_19_ = 0; _225_19_ < list3.length; _225_19_++)
        {
            nc = list3[_225_19_]
            nc[0] -= sc.length + so.length
        }
        c[0] -= so.length
    }
    if (this.surroundStack.length)
    {
        if (uniquePairs.length === 1 && isEqual(uniquePairs[0],_k_.last(this.surroundStack)))
        {
            this.surroundStack.pop()
        }
        else
        {
            this.surroundStack = []
        }
    }
    this.do.setCursors(cs)
    return true
},highlightsSurroundingCursor:function ()
{
    var hs

    if (this.numHighlights() % 2 === 0)
    {
        hs = this.highlights()
        sortRanges(hs)
        if (this.numHighlights() === 2)
        {
            return hs
        }
        else if (this.numHighlights() === 4)
        {
            if (areSameRanges([hs[1],hs[2]],this.selections()))
            {
                return [hs[0],hs[3]]
            }
            else
            {
                return [hs[1],hs[2]]
            }
        }
    }
}}