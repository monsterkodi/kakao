var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var salterMode

import kseg from "../../../kxk/kseg.js"
import salter from "../../../kxk/salter.js"

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

    salterMode.prototype["isSalterLine"] = function (line)
    {
        var trimmed

        trimmed = kseg.trim(kseg.trim(kseg.trim(line),'#'))
        return kseg.startsWith(trimmed,'0') || kseg.startsWith(trimmed,'█')
    }

    salterMode.prototype["findPositionsForHeaderInsert"] = function (lines, pos)
    {
        var ey, posl, sy, y

        y = pos[1]
        if (!this.isSalterLine(lines[y]))
        {
            return
        }
        sy = y
        while (this.isSalterLine(lines[sy - 1]))
        {
            sy -= 1
            if (y - sy >= 4)
            {
                break
            }
        }
        ey = y
        while (this.isSalterLine(lines[ey + 1]))
        {
            ey += 1
            if (ey - sy >= 4)
            {
                break
            }
        }
        posl = []
        if (ey - sy >= 4)
        {
            for (var _a_ = y = sy, _b_ = sy + 4; (_a_ <= _b_ ? y <= sy + 4 : y >= sy + 4); (_a_ <= _b_ ? ++y : --y))
            {
                posl.push([pos[0],y])
            }
        }
        return posl
    }

    salterMode.prototype["start"] = function ()
    {
        var cursors, i

        cursors = this.findPositionsForHeaderInsert(this.state.s.lines,this.state.mainCursor())
        if (!_k_.empty(cursors))
        {
            return this.state.setCursors(cursors)
        }
        else
        {
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
        }
    }

    salterMode.prototype["stop"] = function ()
    {
        return this.state.setMainCursor(this.state.mainCursor())
    }

    salterMode.prototype["handleKey"] = function (key, event)
    {
        var char

        switch (key)
        {
            case 'esc':
                return mode.stop(this.state,this.name)

            case 'delete':
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
                return

        }

        if (this.state.s.cursors.length !== 5)
        {
            mode.stop(this.state,this.name)
            return 'unhandled'
        }
        char = (!_k_.empty((event.char)) ? event.char : key)
        if (salter.hasChar(char))
        {
            this.state.insert(salter(char,{char:'█',postfix:'  '}))
            return
        }
        else
        {
            console.log(`>${char}<`,event)
        }
        return 'unhandled'
    }

    salterMode.prototype["themeColor"] = function (colorName)
    {
        switch (colorName)
        {
            case 'editor_cursor_multi':
                return theme.syntax['comment triple header']

        }

        return theme[colorName]
    }

    return salterMode
})()

export default salterMode;