var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }}

var choices

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
        var w

        w = 0
        if (_k_.in(text,item))
        {
            w += text.length
        }
        return w
    }

    choices.prototype["filter"] = function (text)
    {
        var filtered

        if (_k_.empty(this.items))
        {
            return
        }
        lf('filter',text)
        filtered = _k_.copy(this.items)
        filtered.sort((function (a, b)
        {
            return this.weight(b,text) - this.weight(a,text)
        }).bind(this))
        return this.state.loadLines(filtered)
    }

    return choices
})()

export default choices;