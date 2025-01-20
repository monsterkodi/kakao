var cells, lineCells


lineCells = function (rows, cols)
{
    var c, cells, l, lines

    lines = []
    for (var _a_ = l = 0, _b_ = rows; (_a_ <= _b_ ? l < rows : l > rows); (_a_ <= _b_ ? ++l : --l))
    {
        cells = []
        for (var _c_ = c = 0, _d_ = cols; (_c_ <= _d_ ? c < cols : c > cols); (_c_ <= _d_ ? ++c : --c))
        {
            cells.push([])
        }
        lines.push(cells)
    }
    return lines
}

cells = (function ()
{
    function cells (t)
    {
        this.t = t
    }

    cells.prototype["init"] = function ()
    {
        return this.cells = lineCells(this.t.rows(),this.t.cols())
    }

    return cells
})()

export default cells;