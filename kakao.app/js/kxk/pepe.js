var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

var depepe, pepe


pepe = function (str, delimiters = [['"','"'],["'","'"],['(',')'],['[',']'],['{','}']])
{
    var cnt, end, ends, lp, next, op, p, pairs, popped, r, stack, start, starts

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
        for (var _55_18_ = 0; _55_18_ < list.length; _55_18_++)
        {
            start = list[_55_18_]
            if (next.startsWith(start))
            {
                if (start === pairs[_k_.last(stack).start])
                {
                    break
                }
                if (_k_.last(stack).start && pairs[_k_.last(stack).start] === _k_.last(stack).start)
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
        if (p === op)
        {
            var list1 = _k_.list(ends)
            for (var _68_20_ = 0; _68_20_ < list1.length; _68_20_++)
            {
                end = list1[_68_20_]
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
                        if (_k_.last(stack).start && pairs[_k_.last(stack).start] === _k_.last(stack).start)
                        {
                            cnt = _k_.last(stack).content.pop()
                            cnt = (cnt != null ? cnt : '')
                            _k_.last(stack).content.push(cnt + end)
                            p += end.length
                            lp = p
                            break
                        }
                        return {mismatch:stack,tail:str.slice(p, typeof str.length === 'number' ? str.length : -1)}
                    }
                    break
                }
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

depepe = function (pep, cb)
{
    var p, r

    r = ''
    var list = _k_.list(pep)
    for (var _116_10_ = 0; _116_10_ < list.length; _116_10_++)
    {
        p = list[_116_10_]
        if (_k_.isStr(p))
        {
            r += p
        }
        else
        {
            r += p.start
            r += cb(depepe(p.content,cb))
            r += p.end
        }
    }
    return r
}
pepe.depepe = depepe
export default pepe;