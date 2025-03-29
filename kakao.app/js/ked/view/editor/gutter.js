var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var gutter

import kxk from "../../../kxk.js"
let post = kxk.post
let kseg = kxk.kseg

import kulur from "../../../kolor/kulur.js"

import prof from "../../util/prof.js"
import syntax from "../../util/syntax.js"
import squares from "../../util/squares.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"


gutter = (function ()
{
    _k_.extend(gutter, view)
    function gutter (editor)
    {
        this.editor = editor
    
        this["clearChanges"] = this["clearChanges"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this.state = this.editor.state
        gutter.__super__.constructor.call(this,this.editor.screen,this.state.owner() + '.gutter')
        this.setColor('fg',theme.gutter.fg)
        this.setColor('bg',theme.gutter.bg)
        this.setColor('bg_selected',theme.gutter.bg_selected)
        this.setColor('bg_fully_selected',theme.gutter.bg_fully_selected)
        this.setColor('bg_git_mod',theme.gutter.bg_git_mod)
        this.setColor('bg_git_add',theme.gutter.bg_git_add)
        this.setColor('bg_git_del',theme.gutter.bg_git_del)
        this.setColor('cursor_main',theme.cursor.main)
        this.setColor('cursor_multi',theme.cursor.multi)
        this.setColor('selection',theme.selection.span)
        this.setColor('selection_line',theme.selection.line)
        this.setColor('highlight',theme.highlight.bg)
        this.gitChanges = {}
    }

    gutter.prototype["onMouse"] = function (event)
    {
        var idx, pos

        if (this.cells.isOutsideEvent(event))
        {
            if (!_k_.empty(this.preview))
            {
                this.preview = []
                post.emit('redraw')
            }
            return
        }
        if (!_k_.empty(this.gitChanges) && (event.cmd || event.ctrl || event.alt))
        {
            pos = this.eventPos(event)
            idx = pos[1] + this.state.s.view[1]
            if (this.gitChanges[idx])
            {
                if (event.type === 'press')
                {
                    console.log('todo: press on git change!',this.gitChanges[idx])
                }
                else if (event.type === 'move')
                {
                    if (this.gitChanges[idx].old)
                    {
                        this.preview = [idx]
                        return {redraw:true}
                    }
                }
            }
        }
        if (!_k_.empty(this.preview))
        {
            this.preview = []
            return post.emit('redraw')
        }
    }

    gutter.prototype["drawPreviews"] = function ()
    {
        var idx, oldDiss, segl, syntax, _76_45_

        if (_k_.empty(this.preview) || _k_.empty(this.gitChanges))
        {
            return
        }
        var list = _k_.list(this.preview)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            idx = list[_a_]
            segl = kseg(((_76_45_=this.gitChanges[idx].old) != null ? _76_45_ : ''))
            syntax = this.editor.state.syntax
            oldDiss = syntax.diss[idx]
            syntax.diss[idx] = kulur.dissect([segl],syntax.ext)
            this.editor.drawLine(segl,idx)
            syntax.diss[idx] = oldDiss
        }
    }

    gutter.prototype["lineno"] = function (y)
    {
        var lineno

        lineno = _k_.lpad(this.cells.cols - 1,y + 1)
        lineno += ' '
        return lineno
    }

    gutter.prototype["fgcolor"] = function (x, y)
    {}

    gutter.prototype["clearChanges"] = function ()
    {
        this.gitChanges = {}
        return this.gitBlocks = []
    }

    gutter.prototype["onGitDiff"] = function (diff)
    {
        var add, change, del, firstLine, mod, modi, mods, numLines, off, _111_29_, _112_29_, _113_29_, _120_36_

        this.clearChanges()
        var list = _k_.list(diff.changes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            change = list[_a_]
            firstLine = change.line
            mod = ((_111_29_=change.mod) != null ? _111_29_ : [])
            add = ((_112_29_=change.add) != null ? _112_29_ : [])
            del = ((_113_29_=change.del) != null ? _113_29_ : [])
            mods = mod.concat(add)
            numLines = mods.length
            mods = mods.concat(del)
            for (var _b_ = modi = 0, _c_ = numLines; (_b_ <= _c_ ? modi < numLines : modi > numLines); (_b_ <= _c_ ? ++modi : --modi))
            {
                off = ((mods[modi].new != null) ? -1 : 0)
                this.gitChanges[firstLine + modi + off] = mods[modi]
            }
            this.gitBlocks.push([change.line - 1,numLines,mod.length])
        }
        if (!_k_.empty(this.gitChanges))
        {
            return post.emit('redraw')
        }
    }

    gutter.prototype["drawGitScroll"] = function ()
    {
        var ah, csz, fg, gb, mh, oy, pixelsPerRow, sh, sw, sx, sy

        if (_k_.empty(this.gitBlocks))
        {
            return
        }
        csz = this.screen.t.cellsz
        if (_k_.empty(csz))
        {
            return
        }
        sw = parseInt(csz[0] / 2)
        sx = (this.cells.x - 1) * csz[0]
        oy = this.cells.y * csz[1]
        pixelsPerRow = _k_.clamp(0,csz[1],csz[1] * this.cells.rows / this.state.s.lines.length)
        var list = _k_.list(this.gitBlocks)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            gb = list[_a_]
            sy = parseInt(gb[0] * pixelsPerRow + oy)
            if (gb[1] <= 0)
            {
                fg = this.color.bg_git_del
                sh = parseInt(pixelsPerRow)
            }
            else
            {
                fg = (gb[2] ? this.color.bg_git_mod : this.color.bg_git_add)
                sh = parseInt(gb[1] * pixelsPerRow)
            }
            if (gb[2] && gb[2] < gb[1])
            {
                mh = parseInt(gb[2] * pixelsPerRow)
                squares.place(sx,sy,sw,mh,this.color.bg_git_mod)
                sy += mh
                ah = sh - mh
                squares.place(sx,sy,sw,ah,this.color.bg_git_add)
            }
            else
            {
                squares.place(sx,sy,sw,sh,fg)
            }
        }
    }

    gutter.prototype["draw"] = function ()
    {
        var bg, c, col, fg, hasCursor, highlighted, i, lineno, mainCursor, row, sc, selected, spansel, y, _195_99_

        mainCursor = this.state.mainCursor()
        for (var _a_ = row = 0, _b_ = this.cells.rows; (_a_ <= _b_ ? row < this.cells.rows : row > this.cells.rows); (_a_ <= _b_ ? ++row : --row))
        {
            y = this.state.s.view[1] + row
            lineno = this.lineno(y)
            hasCursor = this.state.isAnyCursorInLine(y)
            selected = this.state.isSelectedLine(y)
            highlighted = this.state.isHighlightedLine(y)
            spansel = this.state.isSpanSelectedLine(y)
            var list = _k_.list(lineno)
            for (i = 0; i < list.length; i++)
            {
                c = list[i]
                col = i
                if (col < this.cells.rows)
                {
                    if (sc = this.fgcolor(i,y,c))
                    {
                        fg = sc
                    }
                    else
                    {
                        fg = y === mainCursor[1] ? color.darken(this.color.cursor_main,(this.state.hasFocus != null),{1:0.5}) : hasCursor ? this.color.cursor_multi : spansel ? this.color.selection : selected ? this.color.selection_line : highlighted ? this.color.highlight : this.color.fg
                        if ((selected || hasCursor || highlighted) && !this.cells.screen.t.hasFocus)
                        {
                            fg = color.darken(fg)
                        }
                    }
                    bg = (this.gitChanges[y] != null ? this.gitChanges[y].old : undefined) && this.gitChanges[y].new ? this.color.bg_git_mod : (this.gitChanges[y] != null ? this.gitChanges[y].old : undefined) ? this.color.bg_git_del : (this.gitChanges[y] != null) ? this.color.bg_git_add : spansel ? this.color.bg_selected : selected ? this.color.bg_fully_selected : this.color.bg
                    if (selected && !this.cells.screen.t.hasFocus)
                    {
                        bg = color.darken(bg)
                    }
                    this.cells.set(col,row,((y < this.state.s.lines.length) ? c : ' '),fg,bg)
                }
            }
        }
        this.drawPreviews()
        return this.drawGitScroll()
    }

    return gutter
})()

export default gutter;