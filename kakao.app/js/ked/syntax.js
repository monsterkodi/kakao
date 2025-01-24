var _k_ = {noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.prototype.hasOwnProperty(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var syntax

import kstr from "../kxk/kstr.js"

import kolor from "../kolor/kolor.js"

import color from "./color.js"


syntax = (function ()
{
    function syntax ()
    {
        this["getChar"] = this["getChar"].bind(this)
        this["getColor"] = this["getColor"].bind(this)
        this["getClass"] = this["getClass"].bind(this)
        this["setLines"] = this["setLines"].bind(this)
    }

    syntax.prototype["setLines"] = function (lines, ext = 'txt')
    {
        var dissTime, start

        start = process.hrtime()
        this.diss = kolor.dissect(lines,ext)
        lf.write(ext + ' ' + _k_.noon((this.diss)))
        dissTime = kstr.time(BigInt(process.hrtime(start)[1]))
        return lf.write('syntax: ' + dissTime)
    }

    syntax.prototype["getClass"] = function (x, y)
    {
        var dss

        var list = _k_.list(this.diss[y])
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dss = list[_a_]
            if ((dss.start <= x && x < dss.start + dss.length))
            {
                return dss.clss
            }
        }
        return 'text'
    }

    syntax.prototype["getColor"] = function (x, y)
    {
        var _37_36_

        return ((_37_36_=color.syntax[this.getClass(x,y)]) != null ? _37_36_ : '#ff0000')
    }

    syntax.prototype["getChar"] = function (x, y, char)
    {
        var clss

        clss = this.getClass(x,y)
        if (0 <= clss.indexOf('header'))
        {
            return '█'
        }
        return char
    }

    return syntax
})()

export default syntax;