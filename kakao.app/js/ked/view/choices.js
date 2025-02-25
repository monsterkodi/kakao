var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var choices

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg
let slash = kxk.slash
let krzl = kxk.krzl
let post = kxk.post

import util from "../util/util.js"

import editor from "../editor.js"
import theme from "../theme.js"


choices = (function ()
{
    _k_.extend(choices, editor)
    function choices (screen, name, features = [])
    {
        this["onKey"] = this["onKey"].bind(this)
        this["onMouse"] = this["onMouse"].bind(this)
        this["clickChoiceAtRow"] = this["clickChoiceAtRow"].bind(this)
        this["unhover"] = this["unhover"].bind(this)
        this["hoverChoiceAtRow"] = this["hoverChoiceAtRow"].bind(this)
        this["filter"] = this["filter"].bind(this)
        this["weight"] = this["weight"].bind(this)
        this["extract"] = this["extract"].bind(this)
        choices.__super__.constructor.call(this,screen,name,['scrllr'].concat(features))
        this.items = []
        this.hoverIndex = -1
        this.fuzzied = this.items
        this.filterText = ''
    }

    choices.prototype["set"] = function (items, key)
    {
        this.items = items
        this.key = key
    
        var lines, _26_15_

        this.items = ((_26_15_=this.items) != null ? _26_15_ : [])
        this.fuzzied = this.items
        this.filterText = ''
        lines = (this.key ? this.items.map(this.extract) : this.items)
        return this.state.loadLines(lines)
    }

    choices.prototype["numChoices"] = function ()
    {
        return this.items.length
    }

    choices.prototype["numFiltered"] = function ()
    {
        return this.fuzzied.length
    }

    choices.prototype["current"] = function ()
    {
        return this.fuzzied[this.state.mainCursor()[1]]
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
        this.state.setSelections([util.rangeOfLine(this.state.allLines(),row)])
        return this.emit('select',this.choiceAtRow(row))
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
        this.grabFocus()
        this.frontCursor()
        return this.emit('select',this.choiceAtRow(this.state.allSelections()[0][1]))
    }

    choices.prototype["frontCursor"] = function ()
    {
        return this.state.setMainCursor(0,this.state.mainCursor()[1])
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

    choices.prototype["hoverChoiceAtRow"] = function (row)
    {
        if (this.hoverIndex === row)
        {
            return
        }
        this.hoverIndex = row
        this.select(this.hoverIndex)
        return post.emit('pointer','pointer')
    }

    choices.prototype["unhover"] = function ()
    {
        this.hoverIndex = -1
        this.state.clearHighlights()
        return post.emit('pointer','default')
    }

    choices.prototype["clickChoiceAtRow"] = function (row)
    {
        this.hoverIndex = -1
        return this.emit('action','click',this.choiceAtRow(row))
    }

    choices.prototype["onMouse"] = function (event)
    {
        var col, row

        var _a_ = this.cells.posForEvent(event); col = _a_[0]; row = _a_[1]

        if (this.cells.isInsideEvent(event))
        {
            switch (event.type)
            {
                case 'press':
                    return this.clickChoiceAtRow(row)

                case 'move':
                    return this.hoverChoiceAtRow(row)

                case 'release':
                    return this.hoverChoiceAtRow(row)

            }

            lf(`mouse ${this.name} ${col} ${row} ${event.type}`)
            return true
        }
        else
        {
            this.unhover()
        }
        return choices.__super__.onMouse.call(this,event)
    }

    choices.prototype["onKey"] = function (key, event)
    {
        if (!this.hasFocus())
        {
            return
        }
        switch (event.combo)
        {
            case 'right':
            case 'left':
            case 'delete':
            case 'space':
            case 'return':
                this.emit('action',event.combo,this.current())
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

export default choices;