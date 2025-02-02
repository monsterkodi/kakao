var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import util from "../util/util.js"

export default {allCursors:function ()
{
    return this.s.cursors.asMutable()
},expandCursors:function (dir)
{
    var c, cursors, dy, mc, newCursors

    cursors = this.allCursors()
    dy = (dir === 'up' ? -1 : 1)
    newCursors = []
    var list = _k_.list(cursors)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        c = list[_a_]
        newCursors.push(c)
        newCursors.push([c[0],c[1] + dy])
    }
    mc = util.traversePositionsInDirection(newCursors,this.mainCursor(),dir)
    return this.setCursors(newCursors,mc)
},contractCursors:function (dir)
{
    var add, c, cursors, nbdn, nbup, newCursors, solo

    cursors = this.allCursors()
    newCursors = []
    var list = _k_.list(cursors)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        c = list[_b_]
        nbup = util.positionsContain(cursors,util.positionInDirection(c,'down'))
        nbdn = util.positionsContain(cursors,util.positionInDirection(c,'up'))
        solo = !(nbup || nbdn)
        add = ((function ()
        {
            switch (dir)
            {
                case 'up':
                    return nbup || solo

                case 'down':
                    return nbdn || solo

            }

        }).bind(this))()
        if (add)
        {
            newCursors.push(c)
        }
    }
    return this.setCursors(newCursors)
},addCursor:function (x, y)
{
    var cursors, pos

    pos = util.pos(x,y)
    cursors = this.allCursors()
    cursors.push(pos)
    return this.setCursors(cursors,cursors.length - 1)
},addCursors:function (cursors)
{
    return this.setCursors(this.allCursors().concat(cursors))
},moveCursor:function (dir, steps = 1)
{
    var c, cursors

    if (this.s.highlights.length)
    {
        this.deselect()
    }
    cursors = this.allCursors()
    var list = _k_.list(cursors)
    for (var _c_ = 0; _c_ < list.length; _c_++)
    {
        c = list[_c_]
        switch (dir)
        {
            case 'left':
                c[0] -= 1
                break
            case 'right':
                c[0] += 1
                break
            case 'up':
                c[1] -= steps
                break
            case 'down':
                c[1] += steps
                break
            case 'eol':
                c[0] = this.s.lines[c[1]].length
                break
            case 'bol':
                c[0] = 0
                break
            case 'bof':
                c[0] = 0
                c[1] = 0
                break
            case 'eof':
                c[1] = this.s.lines.length - 1
                c[0] = this.s.lines[c[1]].length
                break
        }

    }
    return this.setCursors(cursors,this.s.main)
},setMainCursor:function (x, y)
{
    var _d_ = util.pos(x,y); x = _d_[0]; y = _d_[1]

    y = _k_.clamp(0,this.s.lines.length - 1,y)
    x = _k_.max(0,x)
    return this.setCursors([[x,y]],0)
},moveMainCursorInDirection:function (dir, opt = {})
{
    var mc

    mc = util.positionInDirection(this.mainCursor(),dir)
    if (opt.keep)
    {
        return this.addCursor(mc)
    }
    else
    {
        return this.moveMainCursor(mc)
    }
},moveMainCursor:function (x, y)
{
    var cursors, main, mainCursor

    var _e_ = util.pos(x,y); x = _e_[0]; y = _e_[1]

    y = _k_.clamp(0,this.s.lines.length - 1,y)
    x = _k_.max(0,x)
    mainCursor = this.mainCursor()
    if (_k_.eql(mainCursor, [x,y]))
    {
        return
    }
    cursors = this.allCursors()
    cursors.splice(util.indexOfPosInPositions(mainCursor,cursors),1)
    main = util.indexOfPosInPositions([x,y],cursors)
    if (main < 0)
    {
        cursors.push([x,y])
        main = cursors.length - 1
    }
    return this.setCursors(cursors,main)
},mainCursor:function ()
{
    return this.s.cursors[this.s.main].asMutable()
},singleCursorAtEndOfLine:function ()
{
    var mc, rng

    rng = util.lineRangeAtPos(this.allLines(),this.mainCursor())
    mc = util.endOfRange(rng)
    this.deselect()
    return this.setCursors([mc],0)
},singleCursorAtIndentOrStartOfLine:function ()
{
    var ind, lines, mc, rng

    lines = this.allLines()
    mc = this.mainCursor()
    rng = util.lineRangeAtPos(lines,mc)
    ind = util.lineIndentAtPos(lines,mc)
    if (ind < mc[0])
    {
        mc[0] = ind
    }
    else
    {
        mc = util.startOfRange(rng)
    }
    this.deselect()
    return this.setCursors([mc],0)
},moveCursorsToIndentOrStartOfLines:function ()
{
    var cur, cursors, ind, lines

    cursors = this.allCursors()
    lines = this.allLines()
    var list = _k_.list(cursors)
    for (var _f_ = 0; _f_ < list.length; _f_++)
    {
        cur = list[_f_]
        ind = util.lineIndentAtPos(lines,cur)
        if (ind < cur[0])
        {
            cur[0] = ind
        }
        else
        {
            cur[0] = 0
        }
    }
    return this.setCursors(cursors)
},moveCursorsToEndOfSelectionsOrLines:function ()
{
    var cursors, lines, rngs, selections

    selections = this.allSelections()
    if (_k_.empty(selections))
    {
        return this.moveCursorsToEndOfLines()
    }
    lines = this.allLines()
    rngs = util.splitLineRanges(lines,selections)
    cursors = util.endPositionsOfRanges(rngs)
    return this.setCursors(cursors)
},moveCursorsToEndOfLines:function ()
{
    var cur, cursors, lines

    cursors = this.allCursors()
    lines = this.allLines()
    var list = _k_.list(cursors)
    for (var _10_ = 0; _10_ < list.length; _10_++)
    {
        cur = list[_10_]
        cur[0] = util.lineRangeAtPos(lines,cur)[2]
    }
    return this.setCursors(cursors)
},isAnyCursorInLine:function (y)
{
    var c

    var list = _k_.list(this.allCursors())
    for (var _11_ = 0; _11_ < list.length; _11_++)
    {
        c = list[_11_]
        if (c[1] === y)
        {
            return true
        }
    }
},moveCursorAndSelect:function (dir)
{
    var mc, selection, selections

    selections = this.allSelections()
    mc = this.mainCursor()
    selection = [mc[0],mc[1],mc[0],mc[1]]
    selections.push(selection)
    this.moveCursor(dir,1)
    switch (dir)
    {
        case 'left':
            selection[0] = selection[0] - 1
            break
        case 'right':
            selection[2] = selection[2] + 1
            break
        case 'up':
            selection[1] = _k_.max(0,selection[1] - 1)
            break
        case 'down':
            selection[3] = _k_.min(this.s.lines.length - 1,selection[3] + 1)
            break
        case 'eol':
            selection[2] = Infinity
            break
        case 'bol':
            selection[0] = 0
            break
        case 'bof':
            selection[1] = 0
            selection[0] = 0
            break
        case 'eof':
            selection[3] = this.s.lines.length - 1
            selection[2] = this.s.lines[this.s.lines.length - 1].length
            break
    }

    selection[0] = _k_.clamp(0,this.s.lines[selection[1]].length,selection[0])
    selection[2] = _k_.clamp(0,this.s.lines[selection[3]].length,selection[2])
    this.setSelections(selections)
    return this
}}