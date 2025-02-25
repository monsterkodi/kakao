var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var knob

import kxk from "../../kxk.js"
let post = kxk.post

import theme from "../util/theme.js"


knob = (function ()
{
    function knob (cells, name)
    {
        this.cells = cells
        this.name = name
    
        this["draw"] = this["draw"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
    }

    knob.prototype["onMouse"] = function (event)
    {
        var col, row

        var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

        switch (event.type)
        {
            case 'press':
                if (row === 0)
                {
                    post.emit('pointer','grabbing')
                    this.doDrag = true
                    return true
                }
                break
            case 'drag':
                if (this.doDrag && row)
                {
                    post.emit('pointer','grabbing')
                    post.emit('view.size',this.name,this.cells.cols,_k_.max(0,this.cells.rows - row))
                    return true
                }
                break
            case 'release':
                if (this.doDrag)
                {
                    this.hover = row === 0
                    if (this.hover)
                    {
                        post.emit('pointer','ns-resize')
                    }
                    delete this.doDrag
                    return true
                }
                break
            case 'move':
                this.hover = row === 0
                if (this.hover)
                {
                    post.emit('pointer','ns-resize')
                }
                break
        }

        return false
    }

    knob.prototype["draw"] = function ()
    {
        var fg

        fg = (this.hover ? theme.scroll_knob : theme.editor)
        return this.cells.set(parseInt(this.cells.cols / 2),0,'●',fg)
    }

    return knob
})()

export default knob;