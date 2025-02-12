var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

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
        choices.__super__.constructor.call(this,screen,name,['scrllr'])
    }

    choices.prototype["set"] = function (items)
    {
        this.items = items
    
        return this.state.loadLines(this.items)
    }

    choices.prototype["num"] = function ()
    {
        return this.items.length
    }

    choices.prototype["weight"] = function (item, text)
    {
        var idx, p, w

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
        var fuzz, fuzzied

        if (_k_.empty(this.items))
        {
            return
        }
        if (_k_.empty(text))
        {
            this.state.loadLines(this.items)
            return
        }
        fuzz = new krzl(this.items)
        fuzzied = fuzz.filter(text)
        lf('fuzzied',fuzzied)
        fuzzied.sort((function (a, b)
        {
            return this.weight(a,text) - this.weight(b,text)
        }).bind(this))
        return this.state.loadLines(fuzzied)
    }

    return choices
})()

export default choices;