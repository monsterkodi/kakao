var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var knob

import kxk from "../../kxk.js"
let post = kxk.post

import theme from "../util/theme.js"

import view from "./view.js"


knob = (function ()
{
    _k_.extend(knob, view)
    function knob (screen, name)
    {
        this["draw"] = this["draw"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        knob.__super__.constructor.call(this,screen,name)
        this.parentName = this.name.slice(0, -5)
        this.frameSide = 'right'
        this.maxWidth = 68
        this.pointerType = this.resizePointer()
    }

    knob.prototype["resizePointer"] = function ()
    {
        switch (this.frameSide)
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
        knob.__super__.onMouse.call(this,event)
    
        var col, row, size

        switch (event.type)
        {
            case 'press':
                if (this.hover)
                {
                    post.emit('pointer','grabbing')
                    this.doDrag = true
                    return {redraw:true}
                }
                break
            case 'drag':
                if (this.doDrag)
                {
                    this.hover = true
                    var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

                    size = ((function ()
                    {
                        switch (this.frameSide)
                        {
                            case 'top':
                                return row

                            case 'right':
                                return col

                        }

                    }).bind(this))()
                    post.emit('pointer','grabbing')
                    post.emit('view.resize',this.parentName,this.frameSide,size)
                    return {redraw:true}
                }
                this.hover = false
                break
            case 'release':
                if (this.doDrag)
                {
                    if (this.hover)
                    {
                        post.emit('pointer',this.resizePointer())
                    }
                    delete this.doDrag
                    return {redraw:true}
                }
                break
        }

        return this.hover
    }

    knob.prototype["draw"] = function ()
    {
        var fg

        fg = (this.hover ? theme.resize_column : theme.gutter)
        switch (this.frameSide)
        {
            case 'top':
                return this.cells.set(parseInt(this.cells.cols / 2),0,'●',fg)

            case 'right':
                if (!this.hover)
                {
                    return
                }
                return this.cells.fill_col(0,0,this.cells.rows - 1,'|',fg,theme.funcol)

        }

    }

    return knob
})()

export default knob;