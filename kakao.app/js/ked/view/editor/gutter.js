var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var gutter

import kxk from "../../../kxk.js"
let post = kxk.post

import prof from "../../util/prof.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import view from "../base/view.js"


gutter = (function ()
{
    _k_.extend(gutter, view)
    function gutter (screen, state)
    {
        this.state = state
    
        gutter.__super__.constructor.call(this,screen,this.state.owner() + '.gutter')
    
        this.setColor('fg',theme.gutter.fg)
        this.setColor('bg',theme.gutter.bg)
        this.setColor('bg_selected',theme.gutter.bg_selected)
        this.setColor('bg_fully_selected',theme.gutter.bg_fully_selected)
        this.setColor('bg_git_mod',theme.gutter.bg_git_mod)
        this.setColor('bg_git_del',theme.gutter.bg_git_del)
        this.setColor('cursor_main',theme.cursor.main)
        this.setColor('cursor_multi',theme.cursor.multi)
        this.setColor('selection',theme.selection.span)
        this.setColor('selection_line',theme.selection.line)
        this.setColor('highlight',theme.highlight.bg)
        this.gitChanges = {}
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

    gutter.prototype["onGitDiff"] = function (diff)
    {
        var change, firstLine, modi, mods, numLines, off, _58_35_, _58_48_, _61_36_

        this.gitChanges = {}
        var list = _k_.list(diff.changes)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            change = list[_a_]
            firstLine = change.line
            mods = ((_58_35_=change.add) != null ? _58_35_ : ((_58_48_=change.mod) != null ? _58_48_ : change.del))
            numLines = mods.length
            for (var _b_ = modi = 0, _c_ = numLines; (_b_ <= _c_ ? modi < numLines : modi > numLines); (_b_ <= _c_ ? ++modi : --modi))
            {
                off = ((mods[modi].new != null) ? -1 : 0)
                this.gitChanges[firstLine + modi + off] = mods[modi]
            }
        }
        if (!_k_.empty(this.gitChanges))
        {
            return post.emit('redraw')
        }
    }

    gutter.prototype["draw"] = function ()
    {
        var bg, c, col, fg, hasCursor, highlighted, i, lineno, mainCursor, row, sc, selected, spansel, y, _98_99_

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
                    bg = (this.gitChanges[y] != null ? this.gitChanges[y].old : undefined) && !this.gitChanges[y].new ? this.color.bg_git_del : (this.gitChanges[y] != null) ? this.color.bg_git_mod : spansel ? this.color.bg_selected : selected ? this.color.bg_fully_selected : this.color.bg
                    if (selected && !this.cells.screen.t.hasFocus)
                    {
                        bg = color.darken(bg)
                    }
                    this.cells.set(col,row,((y < this.state.s.lines.length) ? c : ' '),fg,bg)
                }
            }
        }
    }

    return gutter
})()

export default gutter;