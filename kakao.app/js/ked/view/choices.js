var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var choices

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let kseg = kxk.kseg
let slash = kxk.slash
let krzl = kxk.krzl

import editor from "../editor.js"
import theme from "../theme.js"


choices = (function ()
{
    _k_.extend(choices, editor)
    function choices (screen, name, features = [])
    {
        this["onKey"] = this["onKey"].bind(this)
        this["filter"] = this["filter"].bind(this)
        this["weight"] = this["weight"].bind(this)
        this["extract"] = this["extract"].bind(this)
        choices.__super__.constructor.call(this,screen,name,['scrllr'].concat(features))
    }

    choices.prototype["set"] = function (items, key)
    {
        this.items = items
        this.key = key
    
        var lines

        this.fuzzied = this.items
        lines = (this.key ? this.items.map(this.extract) : this.items)
        return this.state.loadLines(lines)
    }

    choices.prototype["numChoices"] = function ()
    {
        var _26_26_, _26_35_

        return ((_26_35_=(this.items != null ? this.items.length : undefined)) != null ? _26_35_ : 0)
    }

    choices.prototype["numFiltered"] = function ()
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

        lf('choices.filter',text,this.items)
        if (_k_.empty(this.items))
        {
            return
        }
        if (_k_.empty(text))
        {
            lf('choices.filter empty',this.items,this.key)
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
        lf('choices.filter lines',lines)
        return this.state.loadLines(lines)
    }

    choices.prototype["onKey"] = function (key, event)
    {
        return choices.__super__.onKey.call(this,key,event)
    }

    return choices
})()

export default choices;