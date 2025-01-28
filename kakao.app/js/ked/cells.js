var cells

import color from "./color.js"
import util from "./util.js"


cells = (function ()
{
    function cells (screen)
    {
        this.screen = screen
    
        this["set"] = this["set"].bind(this)
        this["init"] = this["init"].bind(this)
        this.init()
    }

    cells.prototype["init"] = function (r)
    {
        this.r = r
    
        this.rows = this.r.rows
        this.cols = this.r.cols
        return this.c = util.cells(this.rows,this.cols)
    }

    cells.prototype["set"] = function (x, y, char, fg, bg)
    {
        return this.screen.set(this.r.x + x,this.r.y + y,char,fg,bg)
    }

    return cells
})()

export default cells;