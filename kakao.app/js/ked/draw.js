var _k_ = {noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.prototype.hasOwnProperty(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

import color from "./color.js"

class draw
{
    constructor (cells)
    {
        this.cells = cells
    
        this.state = this.state.bind(this)
    }

    state (state)
    {
        var gutter, li, line, linel, lines, row, s, selection, syntax, view, x, xe, xs, y

        s = state.s
        syntax = state.syntax
        view = s.view.asMutable()
        lines = s.lines.asMutable()
        gutter = s.gutter
        for (var _a_ = row = 0, _b_ = this.cells.rows - 1; (_a_ <= _b_ ? row < this.cells.rows - 1 : row > this.cells.rows - 1); (_a_ <= _b_ ? ++row : --row))
        {
            y = row + view[1]
            if (y >= lines.length)
            {
                break
            }
            line = lines[y]
            if (!(line != null))
            {
                lf('empty line?',_k_.noon((lines)),y,row,view[1])
                lf('empty line?',lines.length,y)
                lf('???')
            }
            for (var _c_ = x = 0, _d_ = this.cells.cols - gutter; (_c_ <= _d_ ? x < this.cells.cols - gutter : x > this.cells.cols - gutter); (_c_ <= _d_ ? ++x : --x))
            {
                if (x + gutter < this.cells.cols && x + view[0] < line.length)
                {
                    this.cells.c[row][x + gutter].fg = syntax.getColor(x + view[0],y)
                    this.cells.c[row][x + gutter].char = syntax.getChar(x + view[0],y,line[x + view[0]])
                }
            }
            if (y < lines.length)
            {
                linel = line.length - view[0]
                if (y === s.cursor[1])
                {
                    if (linel > 0)
                    {
                        this.cells.bg_rect(gutter,row,gutter + linel,row,color.cursor_main)
                    }
                    this.cells.bg_rect(_k_.max(gutter,gutter + linel),row,-1,row,color.cursor_empty)
                }
                else
                {
                    if (linel > 0)
                    {
                        this.cells.bg_rect(gutter,row,gutter + linel,row,color.editor)
                    }
                    this.cells.bg_rect(_k_.max(gutter,gutter + linel),row,-1,row,color.editor_empty)
                }
            }
        }
        var list = _k_.list(s.selections)
        for (var _e_ = 0; _e_ < list.length; _e_++)
        {
            selection = list[_e_]
            for (var _f_ = li = selection[1], _10_ = selection[3]; (_f_ <= _10_ ? li <= selection[3] : li >= selection[3]); (_f_ <= _10_ ? ++li : --li))
            {
                y = li - view[1]
                if ((view[1] <= li && li < view[1] + this.cells.rows - 1))
                {
                    if (li === selection[1])
                    {
                        xs = selection[0]
                    }
                    else
                    {
                        xs = 0
                    }
                    if (li === selection[3])
                    {
                        xe = selection[2]
                    }
                    else
                    {
                        xe = lines[li].length
                    }
                    for (var _11_ = x = xs, _12_ = xe; (_11_ <= _12_ ? x < xe : x > xe); (_11_ <= _12_ ? ++x : --x))
                    {
                        if ((gutter <= x - view[0] + gutter && x - view[0] + gutter < this.cells.cols))
                        {
                            this.cells.c[y][x - view[0] + gutter].bg = color.selection
                        }
                    }
                }
            }
        }
    }
}

export default draw;