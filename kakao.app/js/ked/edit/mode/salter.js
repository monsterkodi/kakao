var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, eql: function (a,b,s) { var i, k, v; s = (s != null ? s : []); if (Object.is(a,b)) { return true }; if (typeof(a) !== typeof(b)) { return false }; if (!(Array.isArray(a)) && !(typeof(a) === 'object')) { return false }; if (Array.isArray(a)) { if (a.length !== b.length) { return false }; var list = _k_.list(a); for (i = 0; i < list.length; i++) { v = list[i]; s.push(i); if (!_k_.eql(v,b[i],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } } else if (_k_.isStr(a)) { return a === b } else { if (!_k_.eql(Object.keys(a),Object.keys(b))) { return false }; for (k in a) { v = a[k]; s.push(k); if (!_k_.eql(v,b[k],s)) { s.splice(0,s.length); return false }; if (_k_.empty(s)) { return false }; s.pop() } }; return true }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var salterMode

import kseg from "../../../kxk/kseg.js"
import salter from "../../../kxk/salter.js"

import color from "../../theme/color.js"
import theme from "../../theme/theme.js"

import belt from "../tool/belt.js"

import mode from "../mode.js"


salterMode = (function ()
{
    salterMode["syms"] = []
    function salterMode (state)
    {
        this.state = state
    
        this.name = 'salter'
        if (_k_.empty(salterMode.syms))
        {
            salterMode.syms = Object.keys(salter.font)
        }
        this.start()
    }

    salterMode.prototype["start"] = function ()
    {
        var cursors, i

        cursors = this.findCursors()
        if (!_k_.empty(cursors))
        {
            this.state.setCursors(cursors)
        }
        if (this.state.s.cursors.length === 5 && belt.positionColumns(this.state.s.cursors).length === 1)
        {
            return true
        }
        else
        {
            this.state.begin()
            this.state.moveCursors('eol')
            this.state.singleCursorAtIndentOrStartOfLine()
            for (i = 0; i < 5; i++)
            {
                this.state.insert('# \n')
            }
            this.state.moveCursors('right')
            this.state.moveCursors('right')
            this.state.moveCursors('up')
            for (i = 0; i < 4; i++)
            {
                this.state.expandCursors('up')
            }
            return this.state.end()
        }
    }

    salterMode.prototype["stop"] = function ()
    {}

    salterMode["checkCursorsSet"] = function (state)
    {
        var cursors

        if (!state.allowedModes.salter)
        {
            return
        }
        cursors = belt.findPositionsForSaltInsert(state.s.lines,state.mainCursor())
        if (!_k_.empty(cursors) && state.s.cursors.length === 1)
        {
            return mode.start(state,'salter')
        }
    }

    salterMode.prototype["findCursors"] = function ()
    {
        return belt.findPositionsForSaltInsert(this.state.s.lines,this.state.mainCursor())
    }

    salterMode.prototype["isSaltedLine"] = function (y)
    {
        return belt.isSaltedLine(this.state.s.lines[y])
    }

    salterMode.prototype["cursorsSet"] = function ()
    {
        var cursors

        cursors = this.findCursors()
        if (!_k_.empty(cursors))
        {
            if (_k_.eql(this.state.s.cursors, cursors))
            {
                return true
            }
            else
            {
                return this.state.setCursors(cursors)
            }
        }
        else
        {
            return mode.stop(this.state,'salter')
        }
    }

    salterMode.prototype["postDraw"] = function ()
    {
        var c

        var list = _k_.list(this.state.s.cursors)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            this.state.cells.set_char(c[0] - this.state.s.view[0],c[1] - this.state.s.view[1],' ')
        }
    }

    salterMode.prototype["deleteSelection"] = function ()
    {
        var cursors, idx, lineids

        cursors = this.state.allCursors()
        lineids = belt.lineIndicesForPositions(cursors)
        var list = _k_.list(lineids)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            idx = list[_a_]
            if (!this.state.isFullySelectedLine(idx))
            {
                return
            }
        }
        this.state.moveCursors('bol')
        this.state.delete('eol')
        this.state.setCursors(lineids.map(function (idx)
        {
            return [0,idx]
        }))
        this.state.deselect()
        mode.start(this.state,'salter')
        return true
    }

    salterMode.prototype["handleKey"] = function (key, event)
    {
        var char

        switch (key)
        {
            case 'delete':
                this.state.begin()
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.delete('back')
                this.state.end()
                return

            case 'up':
                if (!this.isSaltedLine(this.state.mainCursor()[1] - 1))
                {
                    this.state.setCursors([[this.state.mainCursor()[0],this.state.mainCursor()[1] - 1]])
                    return
                }
                if (this.state.s.main > 0)
                {
                    this.state.setMain(this.state.s.main - 1)
                    return
                }
                break
            case 'down':
                if (!this.isSaltedLine(this.state.mainCursor()[1] + 1))
                {
                    this.state.setCursors([[this.state.mainCursor()[0],this.state.mainCursor()[1] + 1]])
                    return
                }
                if (this.state.s.main < 4)
                {
                    this.state.setMain(this.state.s.main + 1)
                    return
                }
                break
        }

        char = (!_k_.empty((event.char)) ? event.char : key)
        if (salter.hasChar(char))
        {
            this.state.insert(salter(char,{char:'█',postfix:'  '}))
            return
        }
        return 'unhandled'
    }

    salterMode.prototype["themeColor"] = function (colorName)
    {
        switch (colorName)
        {
            case 'editor_cursor_multi':
                return color.brighten(theme.syntax['comment triple header'],0.2)

            case 'editor_cursor_main':
                return color.brighten(theme.syntax['comment triple header'],0.6)

        }

        return theme[colorName]
    }

    return salterMode
})()

export default salterMode;