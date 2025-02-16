var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var choices

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let krzl = kxk.krzl

import editor from "../editor.js"
import theme from "../theme.js"


choices = (function ()
{
    _k_.extend(choices, editor)
    function choices (screen, name)
    {
        this["filter"] = this["filter"].bind(this)
        this["weight"] = this["weight"].bind(this)
        this["extract"] = this["extract"].bind(this)
        choices.__super__.constructor.call(this,screen,name,['scrllr','mapview'])
    }

    choices.prototype["set"] = function (items, key)
    {
        var lines

        this.items = items
        this.key = key
    
        this.fuzzied = this.items
        lines = (this.key ? this.items.map(this.extract) : this.items)
        return this.state.loadLines(lines)
    }

    choices.prototype["num"] = function ()
    {
        return this.fuzzied.length
    }

    choices.prototype["current"] = function ()
    {
        return this.fuzzied[this.state.mainCursor()[1]]
    }

    choices.prototype["selectNext"] = function ()
    {
        this.state.selectNextLine()
        return this.frontCursor()
    }

    choices.prototype["selectPrev"] = function ()
    {
        this.state.selectPrevLine()
        return this.frontCursor()
    }

    choices.prototype["frontCursor"] = function ()
    {
        return this.state.setMainCursor(0,this.state.mainCursor()[1])
    }

    choices.prototype["extract"] = function (item)
    {
        return (this.key && _k_.isObj(item) ? item[this.key] : item)
    }

    choices.prototype["weight"] = function (item, text)
    {
        var idx, p, w

        item = this.extract(item)
        p = slash.parse(item)
        idx = item.indexOf(text)
        if (idx < 0)
        {
            idx = item.length * 2
        }
        w = 0
        w += idx
        w += kstr.levensthein(p.name,text)
        w += kstr.levensthein(p.dir,text)
        w += kstr.levensthein(p.ext,text)
        return w
    }

    choices.prototype["filter"] = function (text)
    {
        var fuzz, lines

        if (_k_.empty(this.items))
        {
            return
        }
        if (_k_.empty(text))
        {
            return this.set(this.items,this.key)
        }
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

    return choices
})()

export default choices;