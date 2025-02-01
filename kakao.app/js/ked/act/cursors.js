var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

import util from "../util/util.js"

export default {allCursors:function ()
{
    var cursors

    cursors = this.s.cursors.asMutable()
    return util.normalizePositions(cursors,this.s.lines.length - 1)
},expandCursors:function (dir)
{
    var c, cursors, dy, newCursors

    cursors = this.allCursors()
    dy = (dir === 'up' ? -1 : 1)
    newCursors = []
    var list = _k_.list(cursors)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        c = list[_a_]
        newCursors.push([c[0],c[1] + dy])
    }
    cursors = cursors.concat(newCursors)
    return this.set('cursors',cursors)
},addCursor:function (x, y)
{
    var cursors, pos

    pos = util.pos(x,y)
    cursors = this.allCursors()
    cursors.push(pos)
    return this.set('cursors',cursors,cursors.length - 1)
},moveCursor:function (dir, steps = 1)
{
    var c, cursors

    if (this.s.highlights.length)
    {
        this.deselect()
    }
    cursors = this.allCursors()
    var list = _k_.list(cursors)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        c = list[_b_]
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
    return this.set('cursors',cursors,this.s.main)
},setMainCursor:function (x, y)
{
    var _c_ = util.pos(x,y); x = _c_[0]; y = _c_[1]

    y = _k_.clamp(0,this.s.lines.length - 1,y)
    x = _k_.max(0,x)
    return this.set('cursors',[[x,y]],0)
},moveMainCursor:function (x, y)
{
    var cursors, main, mainCursor

    var _d_ = util.pos(x,y); x = _d_[0]; y = _d_[1]

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
    return this.set('cursors',cursors,main)
},mainCursor:function ()
{
    return this.s.cursors[this.s.main].asMutable()
},singleCursorAtEndOfLine:function ()
{
    var mc, rng

    rng = util.lineRangeAtPos(this.allLines(),this.mainCursor())
    mc = util.rangeEnd(rng)
    this.deselect()
    return this.set('cursors',[mc],0)
},singleCursorAtIndentOrStartOfLine:function ()
{
    var indent, lines, mc, rng

    lines = this.allLines()
    mc = this.mainCursor()
    rng = util.lineRangeAtPos(lines,mc)
    indent = util.lineIndentAtPos(lines,mc)
    if (indent < mc[0])
    {
        mc[0] = indent
    }
    else
    {
        mc = util.rangeStart(rng)
    }
    this.deselect()
    return this.set('cursors',[mc],0)
},moveCursorAndSelect:function (dir)
{
    var mc, selection, selections

    selections = this.s.selections.asMutable()
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
    this.set('selections',selections)
    return this
}}