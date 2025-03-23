var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isArr: function (o) {return Array.isArray(o)}, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var ext, full_vibrant, k, key, setVibrant, v, val, value

import kxk from "../../kxk.js"
let post = kxk.post

import color from "./color.js"

import theme from './theme.json' with { type : "json" }
for (key in theme)
{
    val = theme[key]
    if (_k_.isStr(val))
    {
        theme[key] = color.values(val)
    }
    else
    {
        for (k in val)
        {
            v = val[k]
            val[k] = color.values(v)
        }
    }
}
for (key in theme.syntax)
{
    value = theme.syntax[key]
    if (key.startsWith('file_'))
    {
        ext = key.slice(5)
        theme.syntax['file_ext_' + ext] = color.darken(value,0.4)
        theme.syntax['file_icon_' + ext] = color.darken(value,0.6)
        theme.syntax['file_punct_' + ext] = color.darken(value,0.3)
    }
}
full_vibrant = _k_.clone(theme)

setVibrant = function (vf)
{
    vf = _k_.clamp(0,1,vf)
    for (key in full_vibrant)
    {
        val = full_vibrant[key]
        if (_k_.isArr(val))
        {
            theme[key] = color.vibrant(val,vf)
        }
        else
        {
            for (k in val)
            {
                v = val[k]
                theme[key][k] = color.vibrant(v,vf)
            }
        }
    }
}
post.on('theme.vibrant',setVibrant)
export default theme;