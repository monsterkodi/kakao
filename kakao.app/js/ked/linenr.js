var _k_ = {lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var linenr


linenr = (function ()
{
    function linenr (cells, state)
    {
        this.cells = cells
        this.state = state
    
        this.draw()
    }

    linenr.prototype["draw"] = function ()
    {
        var c, i, lineno, y

        this.cells.bg_rect(0,0,this.state.s.gutter - 1,-1,'0a0a0a')
        this.cells.bg_rect(this.state.s.gutter,0,-1,-1,'080808')
        for (var _a_ = y = 0, _b_ = this.cells.t.rows(); (_a_ <= _b_ ? y < this.cells.t.rows() : y > this.cells.t.rows()); (_a_ <= _b_ ? ++y : --y))
        {
            lineno = _k_.lpad(this.state.s.gutter - 2,this.state.s.view[1] + y + 1)
            var list = _k_.list(lineno)
            for (i = 0; i < list.length; i++)
            {
                c = list[i]
                if (i + 1 < this.cells.t.cols())
                {
                    this.cells.c[y][i + 1].fg = '1a1a1a'
                    this.cells.c[y][i + 1].char = c
                }
            }
        }
    }

    return linenr
})()

export default linenr;