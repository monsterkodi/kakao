var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var finder

import kxk from "../../../kxk.js"
let post = kxk.post

import inputchoice from "./inputchoice.js"

import rgxs from './quicky.json' with { type : "json" }

finder = (function ()
{
    _k_.extend(finder, inputchoice)
    function finder (screen)
    {
        this.screen = screen
    
        finder.__super__.constructor.call(this,this.screen,'finder')
    
        this.choices.state.syntax.setRgxs(rgxs)
    }

    finder.prototype["show"] = function (searchText)
    {
        this.input.set(searchText)
        this.input.selectAll()
        this.choices.set([])
        this.layout()
        return this.input.grabFocus()
    }

    finder.prototype["apply"] = function (text)
    {
        this.hide()
        post.emit('finder.apply',text)
        return {redraw:true}
    }

    finder.prototype["applyChoice"] = function (choice)
    {
        return this.apply(choice)
    }

    finder.prototype["onInputAction"] = function (action, text)
    {
        switch (action)
        {
            case 'submit':
                return this.apply(text)

        }

    }

    return finder
})()

export default finder;