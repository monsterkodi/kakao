var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var input

import editor from "../editor.js"
import theme from "../theme.js"


input = (function ()
{
    _k_.extend(input, editor)
    function input (screen, name, features)
    {
        this["onChange"] = this["onChange"].bind(this)
        input.__super__.constructor.call(this,screen,name,[])
        this.state.onLinesChanged = this.onChange
    }

    input.prototype["onChange"] = function ()
    {
        var newText

        newText = _k_.trim(this.state.s.lines[0])
        if (this.text.localeCompare(newText))
        {
            this.text = newText
            return this.emit('changed',this.text)
        }
    }

    input.prototype["init"] = function (x, y, w, h)
    {
        return this.cells.init(x,y,w,h)
    }

    input.prototype["set"] = function (text)
    {
        this.text = _k_.trim(text)
        return this.state.loadLines([this.text])
    }

    input.prototype["selectAll"] = function ()
    {
        return this.state.selectLine(0)
    }

    input.prototype["draw"] = function ()
    {
        this.cells.fill_rect(0,0,-1,-1,' ',null,theme.quicky_frame_bg)
        return input.__super__.draw.call(this)
    }

    return input
})()

export default input;