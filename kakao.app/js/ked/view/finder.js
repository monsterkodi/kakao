var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.prototype.hasOwnProperty(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var finder, int

import kxk from "../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let post = kxk.post

import prjcts from "../util/prjcts.js"
import walker from "../util/walker.js"
import util from "../util/util.js"

import cells from "./cells.js"
import inputchoice from "./inputchoice.js"

import rgxs from './quicky.json' with { type : "json" }
int = parseInt

finder = (function ()
{
    _k_.extend(finder, inputchoice)
    function finder (screen)
    {
        this.screen = screen
    
        this["onChoiceAction"] = this["onChoiceAction"].bind(this)
        finder.__super__.constructor.call(this,this.screen,'finder')
        this.choices.state.syntax.setRgxs(rgxs)
    }

    finder.prototype["show"] = function (searchText)
    {
        lf('finder.show',searchText)
        this.input.set(searchText)
        this.input.selectAll()
        this.choices.set([])
        this.layout()
        return this.input.grabFocus()
    }

    finder.prototype["applyChoice"] = function (choice)
    {
        this.hide()
        post.emit('finder.apply',choice)
        return {redraw:true}
    }

    finder.prototype["onChoiceAction"] = function (choice, action)
    {}

    return finder
})()

export default finder;