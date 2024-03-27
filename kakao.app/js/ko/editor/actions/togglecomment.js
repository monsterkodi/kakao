var _k_ = {min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, first: function (o) {return o != null ? o.length ? o[0] : undefined : o}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

import kstr from "../../../kxk/kstr.js"

export default {actions:{menu:'Line',toggleComment:{name:'Toggle Comment',combo:'command+/'},toggleHeader:{name:'Toggle Header',combo:'command+alt+/'}},toggleHeader:function ()
{
    var il, indent, r, rgs

    if (!this.lineComment)
    {
        return
    }
    rgs = this.salterRangesAtPos(this.cursorPos())
    if (!rgs)
    {
        return
    }
    il = _k_.min((function () { var r_35_57_ = []; var list = _k_.list(rgs); for (var _35_57_ = 0; _35_57_ < list.length; _35_57_++)  { r = list[_35_57_];r_35_57_.push(this.indentationAtLineIndex(r[0]))  } return r_35_57_ }).bind(this)())
    indent = _k_.lpad(il)
    this.do.start()
    if (!this.do.line(rgs[0][0]).slice(il).startsWith(this.lineComment))
    {
        var list1 = _k_.list(rgs)
        for (var _40_18_ = 0; _40_18_ < list1.length; _40_18_++)
        {
            r = list1[_40_18_]
            this.do.change(r[0],kstr.splice(this.do.line(r[0]),il,0,this.lineComment + ' '))
        }
        this.do.delete(_k_.first(rgs)[0] - 1)
        this.do.delete(_k_.last(rgs)[0])
        this.moveCursorsUp()
        this.moveCursorsRight(false,this.lineComment.length + 1)
    }
    else if (this.multiComment)
    {
        var list2 = _k_.list(rgs)
        for (var _48_18_ = 0; _48_18_ < list2.length; _48_18_++)
        {
            r = list2[_48_18_]
            this.do.change(r[0],kstr.splice(this.do.line(r[0]),il,this.lineComment.length + 1))
        }
        this.do.insert(_k_.last(rgs)[0] + 1,indent + this.multiComment.close)
        this.do.insert(_k_.first(rgs)[0],indent + this.multiComment.open)
        this.moveCursorsDown()
        this.moveCursorsLeft(false,this.lineComment.length + 1)
    }
    return this.do.end()
},toggleComment:function ()
{
    var cs, i, l, mainCursorLine, moveInLine, newCursors, newSelections, si, uncomment

    if (!this.lineComment)
    {
        return
    }
    this.do.start()
    newCursors = this.do.cursors()
    newSelections = this.do.selections()
    moveInLine = function (i, d)
    {
        var c, s

        var list = _k_.list(rangesAtLineIndexInRanges(i,newSelections))
        for (var _71_18_ = 0; _71_18_ < list.length; _71_18_++)
        {
            s = list[_71_18_]
            s[1][0] += d
            s[1][1] += d
        }
        var list1 = _k_.list(positionsAtLineIndexInPositions(i,newCursors))
        for (var _74_18_ = 0; _74_18_ < list1.length; _74_18_++)
        {
            c = list1[_74_18_]
            cursorDelta(c,d)
        }
    }
    mainCursorLine = this.do.line(this.mainCursor()[1])
    cs = mainCursorLine.indexOf(this.lineComment)
    uncomment = cs >= 0 && mainCursorLine.substr(0,cs).trim().length === 0
    var list = _k_.list(this.selectedAndCursorLineIndices())
    for (var _81_14_ = 0; _81_14_ < list.length; _81_14_++)
    {
        i = list[_81_14_]
        cs = this.do.line(i).indexOf(this.lineComment)
        if (uncomment)
        {
            if (cs >= 0 && this.do.line(i).substr(0,cs).trim().length === 0)
            {
                this.do.change(i,kstr.splice(this.do.line(i),cs,this.lineComment.length))
                moveInLine(i,-this.lineComment.length)
                si = indentationInLine(this.do.line(i))
                if (si % this.indentString.length === 1)
                {
                    this.do.change(i,kstr.splice(this.do.line(i),si - 1,1))
                    moveInLine(i,-1)
                }
            }
        }
        else
        {
            si = indentationInLine(this.do.line(i))
            if (this.do.line(i).length > si)
            {
                l = (this.lineComment + " ").length
                this.do.change(i,kstr.splice(this.do.line(i),si,0,this.lineComment + " "))
                moveInLine(i,l)
            }
        }
    }
    this.do.select(newSelections)
    this.do.setCursors(newCursors)
    return this.do.end()
}}