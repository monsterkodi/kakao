var knob

import post from "../../kxk/post.js"

import theme from "../theme.js"


knob = (function ()
{
    function knob (cells, name)
    {
        this.cells = cells
        this.name = name
    
        this["draw"] = this["draw"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
    }

    knob.prototype["onMouse"] = function (type, sx, sy, event)
    {
        var col, row

        var _a_ = this.cells.posForScreen(sx,sy); col = _a_[0]; row = _a_[1]

        switch (type)
        {
            case 'press':
                if (row === 0)
                {
                    this.doDrag = true
                    return true
                }
                break
            case 'drag':
                if (this.doDrag && row)
                {
                    post.emit('view.size',this.name,this.cells.cols,this.cells.rows - row)
                    return true
                }
                break
            case 'release':
                if (this.doDrag)
                {
                    delete this.doDrag
                    return true
                }
                break
            case 'move':
                return this.hover = row === 0

        }

    }

    knob.prototype["draw"] = function ()
    {
        var fg

        fg = (this.hover ? theme.scroll_knob : theme.konsole)
        return this.cells.set(parseInt(this.cells.cols / 2),0,'●',fg)
    }

    return knob
})()

export default knob;