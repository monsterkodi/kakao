var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isStr: function (o) {return typeof o === 'string' || o instanceof String}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var choices

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg
let slash = kxk.slash
let krzl = kxk.krzl
let post = kxk.post

import color from "../util/color.js"
import theme from "../util/theme.js"
import util from "../util/util.js"

import editor from "../edit/editor.js"


choices = (function ()
{
    _k_.extend(choices, editor)
    function choices (screen, name, features = [])
    {
        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["doubleClickChoiceAtIndex"] = this["doubleClickChoiceAtIndex"].bind(this)
        this["clickChoiceAtIndex"] = this["clickChoiceAtIndex"].bind(this)
        this["unhover"] = this["unhover"].bind(this)
        this["hoverChoiceAtIndex"] = this["hoverChoiceAtIndex"].bind(this)
        this["filter"] = this["filter"].bind(this)
        this["weight"] = this["weight"].bind(this)
        this["extract"] = this["extract"].bind(this)
        choices.__super__.constructor.call(this,screen,name,features)
        this.color.bg = theme.choices_bg
        this.color.current = theme.choices_current
        this.pointerType = 'pointer'
        this.focusable = true
        this.roundedSelections = true
        this.frontRoundOffset = 0
        this.hoverIndex = -1
        this.hoverForSubmenu = false
        this.items = []
        this.fuzzied = this.items
        this.filterText = ''
    }

    choices.prototype["clear"] = function ()
    {
        return this.set([])
    }

    choices.prototype["set"] = function (items, key)
    {
        this.items = items
        this.key = key
    
        var lines, _37_15_

        this.items = ((_37_15_=this.items) != null ? _37_15_ : [])
        this.fuzzied = this.items
        this.filterText = ''
        lines = (this.key ? this.items.map(this.extract) : this.items)
        return this.state.loadLines(lines)
    }

    choices.prototype["drawCursors"] = function ()
    {}

    choices.prototype["drawSelections"] = function ()
    {
        var fg, li, sel, x, xs, y

        if (_k_.empty(this.state.s.selections))
        {
            return
        }
        if (!this.roundedSelections)
        {
            return choices.__super__.drawSelections.call(this)
        }
        fg = this.color.current
        if (!this.cells.screen.t.hasFocus)
        {
            fg = color.darken(fg)
        }
        sel = this.state.s.selections[0]
        li = sel[1]
        y = li - this.state.s.view[1]
        if (y >= this.cells.rows)
        {
            return
        }
        xs = _k_.max(sel[0],kseg.headCount(this.state.s.lines[li],' '))
        if (xs === 0)
        {
            xs += this.frontRoundOffset
        }
        this.cells.set_ch_fg(xs - 1 - this.state.s.view[0],y,'',fg)
        for (var _a_ = x = xs, _b_ = sel[2]; (_a_ <= _b_ ? x < sel[2] : x > sel[2]); (_a_ <= _b_ ? ++x : --x))
        {
            this.cells.set_bg(x - this.state.s.view[0],y,fg)
            this.cells.adjustContrastForHighlight(x - this.state.s.view[0],y,fg)
        }
        return this.cells.set_ch_fg(x - this.state.s.view[0],y,'',fg)
    }

    choices.prototype["numChoices"] = function ()
    {
        return this.items.length
    }

    choices.prototype["numFiltered"] = function ()
    {
        return this.fuzzied.length
    }

    choices.prototype["currentIndex"] = function ()
    {
        return this.state.mainCursor()[1]
    }

    choices.prototype["current"] = function (opt)
    {
        var cc

        cc = this.fuzzied[this.currentIndex()]
        if (_k_.isStr(cc))
        {
            if ((opt != null ? opt.trim : undefined) === 'front')
            {
                cc = _k_.ltrim(cc)
            }
            else if ((opt != null ? opt.trim : undefined) !== false)
            {
                cc = _k_.trim(cc)
            }
        }
        return cc
    }

    choices.prototype["choiceAtRow"] = function (row)
    {
        return this.fuzzied[row]
    }

    choices.prototype["hasNext"] = function ()
    {
        return this.state.mainCursor()[1] < this.numFiltered() - 1
    }

    choices.prototype["hasPrev"] = function ()
    {
        return this.state.mainCursor()[1] > 0
    }

    choices.prototype["select"] = function (row)
    {
        if (row < 0 || row >= this.state.s.lines.length)
        {
            return
        }
        this.state.setSelections([util.rangeOfLine(this.state.s.lines,row)])
        return this.emit('select',this.choiceAtRow(row))
    }

    choices.prototype["selectFirst"] = function ()
    {
        return this.select(0)
    }

    choices.prototype["moveSelection"] = function (dir)
    {
        switch (dir)
        {
            case 'down':
                return this.selectNext()

            case 'up':
                return this.selectPrev()

        }

    }

    choices.prototype["selectNext"] = function ()
    {
        if (this.hasNext())
        {
            this.state.selectNextLine()
            return this.emitSelectionChange()
        }
    }

    choices.prototype["selectPrev"] = function ()
    {
        if (this.hasPrev())
        {
            this.state.selectPrevLine()
            return this.emitSelectionChange()
        }
    }

    choices.prototype["emitSelectionChange"] = function ()
    {
        if (_k_.empty(this.state.s.selections))
        {
            return
        }
        if (this.focusable)
        {
            this.grabFocus()
        }
        this.frontCursor()
        return this.emit('select',this.choiceAtRow(this.state.s.selections[0][1]))
    }

    choices.prototype["frontCursor"] = function ()
    {
        if (_k_.empty(this.state.s.selections))
        {
            console.log('empty selections?',this.state.s.selections)
            return this.state.setMainCursor(0,0)
        }
        else
        {
            return this.state.setMainCursor(0,this.state.s.selections[0][1])
        }
    }

    choices.prototype["extract"] = function (item)
    {
        return (this.key && _k_.isObj(item) ? item[this.key] : kseg.str(item))
    }

    choices.prototype["weight"] = function (item, text)
    {
        var itemText, matchOrLevenshtein, p, w

        itemText = this.extract(item)
        p = slash.parse(itemText)
        matchOrLevenshtein = function (t)
        {
            var idx

            idx = t.indexOf(text)
            if (idx < 0)
            {
                idx = t.length + kstr.levensthein(t,text)
            }
            return idx
        }
        w = this.items.indexOf(item)
        w += 10 * matchOrLevenshtein(p.name)
        w += 5 * matchOrLevenshtein(p.dir)
        w += (!_k_.empty(p.ext) ? (0.1 * matchOrLevenshtein(p.ext)) : 4)
        return w
    }

    choices.prototype["filter"] = function (text)
    {
        var fuzz, lines

        if (_k_.empty(this.items))
        {
            return
        }
        if (text === this.filterText)
        {
            return
        }
        if (_k_.empty(text))
        {
            return this.set(this.items,this.key)
        }
        this.filterText = text
        fuzz = new krzl({values:this.items,extract:this.extract})
        this.fuzzied = fuzz.filter(text)
        this.fuzzied.sort((function (a, b)
        {
            return this.weight(a,text) - this.weight(b,text)
        }).bind(this))
        lines = this.fuzzied.map(this.extract)
        if (_k_.empty(lines))
        {
            lines = ['']
        }
        return this.state.loadLines(lines)
    }

    choices.prototype["hoverChoiceAtIndex"] = function (index, event)
    {
        if (this.hoverIndex === index)
        {
            return true
        }
        this.hoverIndex = index
        this.select(this.hoverIndex)
        this.frontCursor()
        post.emit('pointer','pointer')
        this.emitAction('hover',this.current(),event)
        return {redraw:true}
    }

    choices.prototype["unhover"] = function ()
    {
        this.hoverIndex = -1
        this.state.deselect()
        post.emit('pointer','default')
        return {redraw:true}
    }

    choices.prototype["clickChoiceAtIndex"] = function (index, event)
    {
        this.hoverIndex = -1
        this.emitAction('click',this.fuzzied[index],event)
        return {redraw:true}
    }

    choices.prototype["doubleClickChoiceAtIndex"] = function (index, event)
    {
        this.hoverIndex = -1
        this.emitAction('doubleclick',this.fuzzied[index],event)
        return {redraw:true}
    }

    choices.prototype["onMouse"] = function (event)
    {
        var col, dx, dy, ret, row, _244_21_

        ret = choices.__super__.onMouse.call(this,event)
        if ((ret != null ? ret.redraw : undefined))
        {
            return ret
        }
        ret = (this.mapscr != null ? this.mapscr.onMouse(event) : undefined)
        if (ret)
        {
            return ret
        }
        if (this.hover)
        {
            var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

            if (this.state.isValidLineIndex(row))
            {
                if (this.hoverForSubmenu && event.type === 'move' && col > kseg.width(this.state.s.lines[row]))
                {
                    dx = Math.abs(event.delta[0])
                    dy = Math.abs(event.delta[1])
                    if (dx * 2 >= dy)
                    {
                        return
                    }
                }
                switch (event.type)
                {
                    case 'move':
                        return this.hoverChoiceAtIndex(row + this.state.s.view[1],event)

                    case 'press':
                        if (event.count === 2)
                        {
                            return this.doubleClickChoiceAtIndex(row + this.state.s.view[1],event)
                        }
                        else
                        {
                            return this.clickChoiceAtIndex(row + this.state.s.view[1],event)
                        }
                        break
                }

            }
        }
        return this.hover
    }

    choices.prototype["emitAction"] = function (action, arg, event)
    {
        return this.emit('action',action,arg,event)
    }

    choices.prototype["onKey"] = function (key, event)
    {
        if (!this.hasFocus())
        {
            return
        }
        switch (event.combo)
        {
            case 'esc':
            case 'left':
            case 'right':
            case 'space':
            case 'delete':
            case 'return':
                this.emitAction(event.combo,this.current(),event)
                break
            case 'up':
            case 'down':
                this.moveSelection(event.combo)
                break
        }

        return true
    }

    return choices
})()

global.choices_class = choices
export default choices;