var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

var pepe


pepe = function (str, delimiters = [['"','"'],["'","'"],['(',')'],['[',']'],['{','}']])
{
    var end, ends, lp, next, op, p, pairs, popped, r, stack, start, starts

    if (!(_k_.isStr(str)))
    {
        return []
    }
    if (_k_.empty(str))
    {
        return ['']
    }
    starts = delimiters.map(function (d)
    {
        return d[0]
    })
    ends = delimiters.map(function (d)
    {
        return d[1]
    })
    pairs = {}
    delimiters.map(function (d)
    {
        return pairs[d[0]] = d[1]
    })
    stack = [{content:[]}]
    p = 0
    lp = 0
    while (p < str.length)
    {
        next = str.slice(p)
        op = p
        var list = _k_.list(starts)
        for (var _53_18_ = 0; _53_18_ < list.length; _53_18_++)
        {
            start = list[_53_18_]
            if (next.startsWith(start))
            {
                if (start === pairs[_k_.last(stack).start])
                {
                    break
                }
                if (lp !== p)
                {
                    _k_.last(stack).content.push(str.slice(lp, typeof p === 'number' ? p : -1))
                }
                stack.push({start:start,content:[]})
                p += start.length
                lp = p
                break
            }
        }
        var list1 = _k_.list(ends)
        for (var _68_16_ = 0; _68_16_ < list1.length; _68_16_++)
        {
            end = list1[_68_16_]
            if (next.startsWith(end))
            {
                if (lp !== p)
                {
                    _k_.last(stack).content.push(str.slice(lp, typeof p === 'number' ? p : -1))
                }
                if (end === pairs[_k_.last(stack).start])
                {
                    _k_.last(stack).end = end
                    popped = stack.pop()
                    _k_.last(stack).content.push(popped)
                    p += end.length
                    lp = p
                }
                else
                {
                    r = {mismatch:stack,tail:str.slice(p, typeof str.length === 'number' ? str.length : -1)}
                    return r
                }
                break
            }
        }
        if (p === op)
        {
            p += 1
        }
    }
    if (stack.length > 1)
    {
        r = {unbalanced:stack}
        if (lp !== p)
        {
            r.tail = str.slice(lp, typeof p === 'number' ? p : -1)
        }
        return r
    }
    if (lp !== p)
    {
        _k_.last(stack).content.push(str.slice(lp, typeof p === 'number' ? p : -1))
    }
    return _k_.last(stack).content
}
export default pepe;