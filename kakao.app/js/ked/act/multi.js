var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import kxk from "../../kxk.js"
let kseg = kxk.kseg

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
    return this.setCursors(cursors,-1)
},addCursors:function (cursors)
{
    return this.setCursors(this.allCursors().concat(cursors))
},delCursorsInRange:function (rng)
{
    var outside

    outside = util.positionsOutsideRange(this.allCursors(),rng)
    outside.push(util.endOfRange(rng))
    return this.setCursors(outside,-1)
},moveCursors:function (dir, opt)
{
    var c, cursors, ind, line, lines, _100_22_, _99_18_

    if (_k_.isArr(dir))
    {
        switch (dir[0])
        {
            case 'bos':
                if (this.moveCursorsToStartOfSelections())
                {
                    return
                }
                dir = dir.slice(1)
                break
            case 'eos':
                if (this.moveCursorsToEndOfSelections())
                {
                    return
                }
                dir = dir.slice(1)
                break
        }

        dir = dir[0]
    }
    opt = (opt != null ? opt : {})
    opt.count = ((_99_18_=opt.count) != null ? _99_18_ : 1)
    opt.jumpWords = ((_100_22_=opt.jumpWords) != null ? _100_22_ : false)
    if (this.s.highlights.length)
    {
        this.deselect()
    }
    cursors = this.allCursors()
    lines = this.allLines()
    var list = _k_.list(cursors)
    for (var _c_ = 0; _c_ < list.length; _c_++)
    {
        c = list[_c_]
        line = lines[c[1]]
        switch (dir)
        {
            case 'left':
            case 'right':
                c[0] += util.numCharsFromPosToWordOrPunctInDirection(lines,c,dir,opt)
                break
            case 'up':
                c[1] -= opt.count
                break
            case 'down':
                c[1] += opt.count
                break
            case 'eol':
                c[0] = kseg.width(this.s.lines[c[1]])
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
                c[0] = kseg.width(line)
                break
            case 'ind':
                c[0] = util.numIndent(line)
                break
            case 'ind_eol':
                ind = util.numIndent(line)
                c[0] = (c[0] < ind ? ind : kseg.width(line))
                break
            case 'ind_bol':
                ind = util.numIndent(line)
                c[0] = (c[0] > ind ? ind : 0)
                break
        }

    }
    this.setCursors(cursors,this.s.main)
    return true
},setMainCursor:function (x, y)
{
    var _d_ = util.pos(x,y); x = _d_[0]; y = _d_[1]

    y = _k_.clamp(0,this.s.lines.length - 1,y)
    x = _k_.max(0,x)
    return this.setCursors([[x,y]])
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
    return this.setCursors([mc])
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
    return this.setCursors([mc])
},singleCursorPage:function (dir)
{
    var mc

    mc = this.mainCursor()
    switch (dir)
    {
        case 'up':
            mc[1] -= this.cells.rows
            break
        case 'down':
            mc[1] += this.cells.rows
            break
    }

    this.deselect()
    return this.setCursors([mc])
},moveCursorsToStartOfSelections:function ()
{
    var rngs, selections

    selections = this.allSelections()
    if (_k_.empty(selections))
    {
        return
    }
    rngs = util.splitLineRanges(this.allLines(),selections,false)
    this.setCursors(util.startPositionsOfRanges(rngs))
    return true
},moveCursorsToEndOfSelections:function ()
{
    var rngs, selections

    selections = this.allSelections()
    if (_k_.empty(selections))
    {
        return
    }
    rngs = util.splitLineRanges(this.allLines(),selections,false)
    this.setCursors(util.endPositionsOfRanges(rngs))
    return true
},moveCursorsToEndOfLines:function ()
{
    var cur, cursors, lines

    cursors = this.allCursors()
    lines = this.allLines()
    var list = _k_.list(cursors)
    for (var _f_ = 0; _f_ < list.length; _f_++)
    {
        cur = list[_f_]
        cur[0] = util.lineRangeAtPos(lines,cur)[2]
    }
    this.setCursors(cursors)
    return true
},isAnyCursorInLine:function (y)
{
    var c

    var list = _k_.list(this.allCursors())
    for (var _10_ = 0; _10_ < list.length; _10_++)
    {
        c = list[_10_]
        if (c[1] === y)
        {
            return true
        }
    }
},wordAtCursor:function ()
{
    return util.wordAtPos(this.allLines(),this.mainCursor())
},setMainCursorAndSelect:function (x, y)
{
    this.setSelections(util.extendLineRangesFromPositionToPosition,this.allLines(),this.allSelections(),this.mainCursor(),[x,y])
    return this.setCursors([[x,y]])
},moveCursorsAndSelect:function (dir, opt)
{
    var cursors, selections

    var _11_ = util.extendLineRangesByMovingPositionsInDirection(this.allLines(),this.allSelections(),this.allCursors(),dir,opt); selections = _11_[0]; cursors = _11_[1]

    this.setSelections(selections)
    return this.setCursors(cursors)
}}