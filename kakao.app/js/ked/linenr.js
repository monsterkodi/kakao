var _k_ = {lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var linenr


linenr = (function ()
{
    function linenr (cells)
    {
        this.cells = cells
    
        this.draw()
    }

    linenr.prototype["draw"] = function ()
    {
        var c, i, lineno, y

        this.cells.bg_rect(1,1,4,-1,'0a0a0a')
        this.cells.bg_rect(5,1,-1,-1,'0c0c0c')
        for (var _a_ = y = 0, _b_ = this.cells.t.rows(); (_a_ <= _b_ ? y < this.cells.t.rows() : y > this.cells.t.rows()); (_a_ <= _b_ ? ++y : --y))
        {
            lineno = _k_.lpad(3,y)
            var list = _k_.list(lineno)
            for (i = 0; i < list.length; i++)
            {
                c = list[i]
                this.cells.c[y][i].fg = '1a1a1a'
                this.cells.c[y][i].char = c
            }
        }
    }

    return linenr
})()

export default linenr;