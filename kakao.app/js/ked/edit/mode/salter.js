var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var salterMode

import kseg from "../../../kxk/kseg.js"
import salter from "../../../kxk/salter.js"

import theme from "../../theme/theme.js"

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
        this.state.setMainCursor(this.state.mainCursor())
        this.state.expandCursors('down')
        this.state.expandCursors('down')
        this.state.expandCursors('down')
        return this.state.expandCursors('down')
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