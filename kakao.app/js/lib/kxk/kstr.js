// monsterkodi/kode 0.252.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var ESCAPEREGEXP, str, STRIPANSI


str = function (o)
{
    var noon, _13_17_

    if (!(o != null))
    {
        return 'null'
    }
    if (typeof(o) === 'object')
    {
        if ((o._str != null))
        {
            return o._str()
        }
        else
        {
            noon = require('noon')
            return "\n" + noon.stringify(o,{circular:true})
        }
    }
    else
    {
        return String(o)
    }
}

str.encode = function (s, spaces = true)
{
    var encode, r

    if (s)
    {
        encode = require('html-entities').encode

        r = encode(s)
        if (spaces)
        {
            r = r.replace(/\s/g,'&nbsp;')
        }
        return r
    }
    else
    {
        return ''
    }
}
ESCAPEREGEXP = /[\-\\\^\$\*\+\?\.\(\)\|\[\]\{\}\/]/g

str.escapeRegexp = function (s)
{
    return s.replace(ESCAPEREGEXP,'\\$&')
}

str.rstrip = function (s, cs = ' ')
{
    s = (s != null ? s : '')
    while (_k_.in(s.slice(-1)[0],cs))
    {
        s = s.slice(0, s.length - 1)
    }
    return s
}

str.lstrip = function (s, cs = ' ')
{
    s = (s != null ? s : '')
    while (_k_.in(s[0],cs))
    {
        s = s.slice(1)
    }
    return s
}

str.strip = function (s, cs = ' ')
{
    return str.rstrip(str.lstrip(s,cs),cs)
}
str.trim = str.strip
str.ltrim = str.lstrip
str.rtrim = str.rstrip

str.lcnt = function (s, c)
{
    var i

    s = (s != null ? s : '')
    if (typeof(s) === 'number' && Number.isFinite(s))
    {
        s = String(s)
    }
    if (typeof(s) !== 'string')
    {
        return 0
    }
    c = (c != null ? c : '')
    i = -1
    while (_k_.in(s[++i],c))
    {
    }
    return i
}

str.rcnt = function (s, c)
{
    var i

    s = (s != null ? s : '')
    if (typeof(s) === 'number' && Number.isFinite(s))
    {
        s = String(s)
    }
    if (typeof(s) !== 'string')
    {
        return 0
    }
    c = (c != null ? c : '')
    i = -1
    while (_k_.in(s[s.length - (++i) - 1],c))
    {
    }
    return i
}

str.cnt = function (s, c)
{
    var m

    m = s.match(new RegExp(c,'g'))
    return ((m != null) ? m.length : 0)
}

str.lpad = function (s, l, c = ' ')
{
    s = String(s)
    while (s.length < l)
    {
        s = c + s
    }
    return s
}

str.rpad = function (s, l, c = ' ')
{
    s = String(s)
    while (s.length < l)
    {
        s += c
    }
    return s
}
str.pad = str.rpad

str.detab = function (s)
{
    var i

    s = String(s)
    i = 0
    while (i < s.length)
    {
        if (s[i] === '\t')
        {
            s = s.slice(0, typeof i === 'number' ? i : -1) + (str.lpad('',4 - (i % 4))) + s.slice(i + 1)
        }
        i += 1
    }
    return s
}

str.time = function (t)
{
    var f, k, num, o, thsnd

    switch (typeof(t))
    {
        case 'number':
            f = 1
            o = {ms:1000,second:60,minute:60,hour:24,day:30,month:12,year:0}
            var list = _k_.list(Object.keys(o))
            for (var _147_18_ = 0; _147_18_ < list.length; _147_18_++)
            {
                k = list[_147_18_]
                num = parseInt(t / f)
                f *= o[k]
                if (k === 'year' || t < f)
                {
                    if (k !== 'ms' && num !== 1)
                    {
                        k += 's'
                    }
                    return '' + num + ' ' + k
                }
            }
            break
        case 'bigint':
            thsnd = BigInt(1000)
            f = thsnd
            var list1 = ['ns','μs','ms','second']
            for (var _156_18_ = 0; _156_18_ < list1.length; _156_18_++)
            {
                k = list1[_156_18_]
                if (k === 'seconds' || t < f)
                {
                    num = parseInt(thsnd * t / f)
                    if (k === 'second' && num !== 1)
                    {
                        k += 's'
                    }
                    return '' + num + ' ' + k
                }
                f *= thsnd
            }
            break
        default:
            return String(t)
    }

}

str.now = function ()
{
    var now

    now = new Date(Date.now())
    return `${str.lpad(now.getHours(),2,'0')}:${str.lpad(now.getMinutes(),2,'0')}:${str.lpad(now.getSeconds(),2,'0')}.${str.lpad(now.getMilliseconds(),3,'0')}`
}
STRIPANSI = /\x1B[[(?);]{0,2}(;?\d)*./g

str.stripAnsi = function (s)
{
    var _184_13_

    return (typeof s.replace === "function" ? s.replace(STRIPANSI,'') : undefined)
}

str.ansi2html = function (s)
{
    var Ansi

    Ansi = require('./ansi')
    return Ansi.html(s)
}
str.ansi = require('./ansi')
export default str;