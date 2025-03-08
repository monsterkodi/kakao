var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isArr: function (o) {return Array.isArray(o)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../../kxk.js"
let kseg = kxk.kseg

import belt from "../tool/belt.js"

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
    mc = belt.traversePositionsInDirection(newCursors,this.mainCursor(),dir)
    return this.setCursors(newCursors,{main:mc,adjust:'topBotDelta'})
},contractCursors:function (dir)
{
    var add, c, cursors, nbdn, nbup, newCursors, solo

    cursors = this.allCursors()
    newCursors = []
    var list = _k_.list(cursors)
    for (var _b_ = 0; _b_ < list.length; _b_++)
    {
        c = list[_b_]
        nbup = belt.positionsContain(cursors,belt.positionInDirection(c,'down'))
        nbdn = belt.positionsContain(cursors,belt.positionInDirection(c,'up'))
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

    pos = belt.pos(x,y)
    cursors = this.allCursors()
    cursors.push(pos)
    return this.setCursors(cursors,{main:-1})
},addCursors:function (cursors)
{
    return this.setCursors(this.allCursors().concat(cursors))
},delCursorsInRange:function (rng)
{
    var outside

    outside = belt.positionsOutsideRange(this.allCursors(),rng)
    outside.push(belt.endOfRange(rng))
    return this.setCursors(outside,{main:-1})
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
                c[0] += belt.numCharsFromPosToWordOrPunctInDirection(lines,c,dir,opt)
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
                c[0] = belt.numIndent(line)
                break
            case 'ind_eol':
                ind = belt.numIndent(line)
                c[0] = (c[0] < ind ? ind : kseg.width(line))
                break
            case 'ind_bol':
                ind = belt.numIndent(line)
                c[0] = (c[0] > ind ? ind : 0)
                break
        }

    }
    this.setCursors(cursors,{main:this.s.main,adjust:'topBotDelta'})
    return true
},moveCursorsToStartOfSelections:function ()
{
    var rngs, selections

    selections = this.allSelections()
    if (_k_.empty(selections))
    {
        return
    }
    rngs = belt.splitLineRanges(this.allLines(),selections,false)
    this.setCursors(belt.startPositionsOfRanges(rngs))
    return true
},moveCursorsToEndOfSelections:function ()
{
    var rngs, selections

    selections = this.allSelections()
    if (_k_.empty(selections))
    {
        return
    }
    rngs = belt.splitLineRanges(this.allLines(),selections,false)
    this.setCursors(belt.endPositionsOfRanges(rngs))
    return true
},moveCursorsToEndOfLines:function ()
{
    var cur, cursors, lines

    cursors = this.allCursors()
    lines = this.allLines()
    var list = _k_.list(cursors)
    for (var _d_ = 0; _d_ < list.length; _d_++)
    {
        cur = list[_d_]
        cur[0] = belt.lineRangeAtPos(lines,cur)[2]
    }
    this.setCursors(cursors)
    return true
},isAnyCursorInLine:function (y)
{
    var c

    var list = _k_.list(this.allCursors())
    for (var _e_ = 0; _e_ < list.length; _e_++)
    {
        c = list[_e_]
        if (c[1] === y)
        {
            return true
        }
    }
},wordAtCursor:function ()
{
    return belt.wordAtPos(this.s.lines,this.mainCursor())
},chunkBeforeCursor:function ()
{
    return belt.chunkBeforePos(this.s.lines,this.mainCursor())
},chunkAfterCursor:function ()
{
    return belt.chunkAfterPos(this.s.lines,this.mainCursor())
},setMainCursorAndSelect:function (x, y)
{
    this.setSelections(belt.extendLineRangesFromPositionToPosition,this.allLines(),this.allSelections(),this.mainCursor(),[x,y])
    return this.setCursors([[x,y]],{adjust:'topBotDelta'})
},moveCursorsAndSelect:function (dir, opt)
{
    var cursors, selections

    var _f_ = belt.extendLineRangesByMovingPositionsInDirection(this.allLines(),this.allSelections(),this.allCursors(),dir,opt); selections = _f_[0]; cursors = _f_[1]

    this.setSelections(selections)
    return this.setCursors(cursors,{adjust:'topBotDelta'})
}}