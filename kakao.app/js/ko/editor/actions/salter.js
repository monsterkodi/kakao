var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import kxk from "../../../kxk.js"
let kstr = kxk.kstr

import util from "../../../kxk/util.js"
let uniq = util.uniq

import salt from "../../tools/salt.js"

export default {actions:{startSalter:{name:'ASCII Header Mode',text:`if cursor is not in ascii-header: 
                insert ascii-header of text in selection or word at cursor.
                switch to ascii-header mode in any case.`,combo:'command+3'}},startSalter:function (opt)
{
    var ci, col, cols, cp, indt, li, newCursors, r, rgs, s, stxt, word, _50_29_

    cp = this.cursorPos()
    if (!(opt != null ? opt.word : undefined) && (rgs = this.salterRangesAtPos(cp)))
    {
        cols = this.columnsInSalt((function () { var r_37_56_ = []; var list = _k_.list(rgs); for (var _37_56_ = 0; _37_56_ < list.length; _37_56_++)  { r = list[_37_56_];r_37_56_.push(this.textInRange(r))  } return r_37_56_ }).bind(this)())
        ci = 0
        while (ci < cols.length && cp[0] > cols[ci])
        {
            ci += 1
        }
        col = cols[ci]
        this.do.start()
        newCursors = (function () { var r_43_44_ = []; var list1 = _k_.list(rgs); for (var _43_44_ = 0; _43_44_ < list1.length; _43_44_++)  { r = list1[_43_44_];r_43_44_.push([col,r[0]])  } return r_43_44_ }).bind(this)()
        this.do.setCursors(newCursors,{main:'last'})
        this.do.select([])
        this.do.end()
    }
    else
    {
        word = ((_50_29_=(opt != null ? opt.word : undefined)) != null ? _50_29_ : this.selectionTextOrWordAtCursor().trim())
        if (this.textInRange(this.rangeForLineAtIndex(cp[1])).trim().length)
        {
            indt = _k_.lpad(this.indentationAtLineIndex(cp[1]))
        }
        else
        {
            indt = this.indentStringForLineAtIndex(cp[1])
        }
        stxt = word.length && salt(word).split('\n') || ['','','','','']
        stxt = (function () { var r_57_58_ = []; var list2 = _k_.list(stxt); for (var _57_58_ = 0; _57_58_ < list2.length; _57_58_++)  { s = list2[_57_58_];r_57_58_.push(`${indt}${this.lineComment} ${s}  `)  } return r_57_58_ }).bind(this)()
        this.do.start()
        newCursors = []
        li = cp[1]
        var list3 = _k_.list(stxt)
        for (var _61_18_ = 0; _61_18_ < list3.length; _61_18_++)
        {
            s = list3[_61_18_]
            this.do.insert(li,s)
            if (s.endsWith(`${this.lineComment}   `))
            {
                newCursors.push([s.length - 2,li])
            }
            else
            {
                newCursors.push([s.length,li])
            }
            li += 1
        }
        this.do.setCursors(newCursors,{main:'last'})
        this.do.select([])
        this.do.end()
    }
    return this.setSalterMode(true)
},endSalter:function ()
{
    return this.setSalterMode(false)
},setSalterMode:function (active = true)
{
    var _76_18_

    this.salterMode = active
    return ((_76_18_=this.layerDict) != null ? _76_18_['cursors'] != null ? _76_18_['cursors'].classList.toggle("salterMode",active) : undefined : undefined)
},insertSalterCharacter:function (ch)
{
    var char, s, salted

    if (ch === ' ')
    {
        char = ['    ','    ','    ','    ','    ']
    }
    else
    {
        char = salt(ch).split('\n')
    }
    if (char.length === 5)
    {
        salted = (function () { var r_92_37_ = []; var list = _k_.list(char); for (var _92_37_ = 0; _92_37_ < list.length; _92_37_++)  { s = list[_92_37_];r_92_37_.push(`${s}  `)  } return r_92_37_ }).bind(this)().join('\n')
        this.pasteText(salted)
    }
    else
    {
        this.setSalterMode(false)
    }
    return true
},deleteSalterCharacter:function ()
{
    var ci, cols, cp, length, r, rgs, slt

    if (!this.salterMode)
    {
        return
    }
    this.do.start()
    cp = this.do.mainCursor()
    if (rgs = this.salterRangesAtPos(cp))
    {
        slt = (function () { var r_112_43_ = []; var list = _k_.list(rgs); for (var _112_43_ = 0; _112_43_ < list.length; _112_43_++)  { r = list[_112_43_];r_112_43_.push(this.do.textInRange(r))  } return r_112_43_ }).bind(this)()
        cols = this.columnsInSalt(slt)
        ci = cols.length - 1
        while (ci > 0 && cols[ci - 1] >= cp[0])
        {
            ci -= 1
        }
        if (ci > 0)
        {
            length = cols[ci] - cols[ci - 1]
            var list1 = _k_.list(rgs)
            for (var _119_22_ = 0; _119_22_ < list1.length; _119_22_++)
            {
                r = list1[_119_22_]
                this.do.change(r[0],kstr.splice(this.do.line(r[0]),cols[ci - 1],length))
            }
            this.do.setCursors((function () { var r_121_57_ = []; var list2 = _k_.list(rgs); for (var _121_57_ = 0; _121_57_ < list2.length; _121_57_++)  { r = list2[_121_57_];r_121_57_.push([cols[ci - 1],r[0]])  } return r_121_57_ }).bind(this)())
        }
    }
    return this.do.end()
},checkSalterMode:function ()
{
    var cols, cs, r, rgs

    if (this.salterMode)
    {
        this.setSalterMode(false)
        if (this.do.numCursors() === 5 && positionsInContinuousLine(this.do.cursors()))
        {
            cs = this.do.cursors()
            rgs = this.salterRangesAtPos(this.do.mainCursor())
            if (!(rgs != null) || rgs[0][0] !== cs[0][1])
            {
                return
            }
            cols = this.columnsInSalt((function () { var r_140_64_ = []; var list = _k_.list(rgs); for (var _140_64_ = 0; _140_64_ < list.length; _140_64_++)  { r = list[_140_64_];r_140_64_.push(this.do.textInRange(r))  } return r_140_64_ }).bind(this)())
            if (cs[0][0] < cols[0])
            {
                return
            }
            return this.setSalterMode(true)
        }
    }
},salterRangesAtPos:function (p)
{
    var li, rgs, state

    rgs = []
    li = p[1]
    state = this.do.isDoing() && this.do.state || this.state
    while (rgs.length < 5 && li < state.numLines() && this.headerRegExp.test(state.line(li)))
    {
        rgs.push([li,[0,state.line(li).length]])
        li += 1
    }
    if (!rgs.length)
    {
        return
    }
    li = p[1] - 1
    while (rgs.length < 5 && li >= 0 && this.headerRegExp.test(state.line(li)))
    {
        rgs.unshift([li,[0,state.line(li).length]])
        li -= 1
    }
    if (rgs.length === 5)
    {
        return rgs
    }
},columnsInSalt:function (slt)
{
    var col, cols, i, maxv, minv, s

    minv = _k_.min((function () { var r_173_39_ = []; var list = _k_.list(slt); for (var _173_39_ = 0; _173_39_ < list.length; _173_39_++)  { s = list[_173_39_];r_173_39_.push(s.search(/0/))  } return r_173_39_ }).bind(this)())
    if (minv < 0)
    {
        minv = _k_.min((function () { var r_175_46_ = []; var list1 = _k_.list(slt); for (var _175_46_ = 0; _175_46_ < list1.length; _175_46_++)  { s = list1[_175_46_];r_175_46_.push(s.search(/#/) + 1)  } return r_175_46_ }).bind(this)())
        return [minv]
    }
    maxv = _k_.max((function () { var r_177_35_ = []; var list2 = _k_.list(slt); for (var _177_35_ = 0; _177_35_ < list2.length; _177_35_++)  { s = list2[_177_35_];r_177_35_.push(s.length)  } return r_177_35_ }).bind(this)())
    cols = [minv,maxv]
    for (var _179_20_ = col = minv, _179_26_ = maxv; (_179_20_ <= _179_26_ ? col <= maxv : col >= maxv); (_179_20_ <= _179_26_ ? ++col : --col))
    {
        s = 0
        for (i = 0; i < 5; i++)
        {
            if (_k_.in(slt[i].substr(col - 2,2),['  ','# ']))
            {
                s += 1
            }
        }
        if (s === 5)
        {
            cols.push(col)
        }
    }
    return uniq(cols).sort()
}}