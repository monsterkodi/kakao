var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var ext

import kulur from "../kulur.js"

ext = 'kode'
export default {lang:function (l)
{
    return ext = l
},ranges:function (s)
{
    return kulur.ranges(s,ext)
},dissect:function (c)
{
    return kulur.dissect(c.split('\n'),ext)
},inc:function (rgs, start, match)
{
    var r

    var list = _k_.list(rgs)
    for (var _a_ = 0; _a_ < list.length; _a_++)
    {
        r = list[_a_]
        if (r.start === start && r.match === match)
        {
            return r.clss
        }
    }
    console.log('fail',rgs)
}}