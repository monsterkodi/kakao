var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

export default {expandCursors:function (dir)
{
    var c, cursors, dy, newCursors

    cursors = this.s.cursors.asMutable()
    if (_k_.empty(cursors))
    {
        cursors = [this.s.cursor.asMutable()]
    }
    lf('expandCursors',dir,cursors)
    dy = (dir === 'up' ? -1 : 1)
    newCursors = []
    var list = _k_.list(cursors)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        c = list[_a_]
        newCursors.push([c[0],c[1] + dy])
    }
    cursors = cursors.concat(newCursors)
    lf('newCursors',cursors)
    return this.set('cursors',cursors)
}}