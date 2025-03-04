var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        this.framePos = 'right'
        this.maxWidth = 68
    }

    knob.prototype["resizePointer"] = function ()
    {
        switch (this.framePos)
        {
            case 'right':
            case 'left':
                return 'ew-resize'

            case 'top':
            case 'bottom':
                return 'ns-resize'

        }

    }

    knob.prototype["onMouse"] = function (event)
    {
        var changed, col, row, size

        var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

        changed = this.hover
        this.hover = ((function ()
        {
            switch (this.framePos)
            {
                case 'top':
                    return row === 0

                case 'right':
                    return col === this.cells.cols - 1

            }

        }).bind(this))()
        changed = changed !== this.hover
        switch (event.type)
        {
            case 'press':
                if (this.hover)
                {
                    post.emit('pointer','grabbing')
                    this.doDrag = true
                    return true
                }
                break
            case 'drag':
                if (this.doDrag)
                {
                    this.hover = true
                    size = ((function ()
                    {
                        switch (this.framePos)
                        {
                            case 'top':
                                return [this.cells.cols,_k_.max(0,this.cells.rows - row)]

                            case 'right':
                                return [_k_.clamp(0,this.maxWidth,col),this.cells.rows]

                        }

                    }).bind(this))()
                    post.emit('pointer','grabbing')
                    post.emit('view.size',this.name,size)
                    return true
                }
                break
            case 'release':
                if (this.doDrag)
                {
                    this.hover = row === 0
                    if (this.hover)
                    {
                        post.emit('pointer',this.resizePointer())
                    }
                    delete this.doDrag
                    return true
                }
                break
            case 'move':
                if (this.hover)
                {
                    post.emit('pointer',this.resizePointer())
                }
                break
        }

        return changed
    }

    knob.prototype["draw"] = function ()
    {
        var fg

        fg = (this.hover ? theme.resize_column : theme.gutter)
        switch (this.framePos)
        {
            case 'top':
                return this.cells.set(parseInt(this.cells.cols / 2),0,'●',fg)

            case 'right':
                if (!this.hover)
                {
                    return
                }
                return this.cells.fill_col(this.cells.cols - 1,0,this.cells.rows - 1,'|',fg,theme.funcol)

        }

    }

    return knob
})()

export default knob;