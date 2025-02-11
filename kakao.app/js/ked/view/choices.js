var choices

import cells from "./cells.js"


choices = (function ()
{
    function choices (screen, name)
    {
        this.name = name
    
        this.cells = new cells(screen)
    }

    choices.prototype["init"] = function (x, y, w, h)
    {
        return this.cells.init(x,y,w,h)
    }

    choices.prototype["set"] = function (items)
    {
        this.items = items
    }

    choices.prototype["num"] = function ()
    {
        return this.items.length
    }

    choices.prototype["draw"] = function ()
    {}

    return choices
})()

export default choices;