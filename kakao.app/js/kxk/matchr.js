var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var config, dissect, merge, ranges, sortRanges


config = function (patterns, flags)
{
    var a, p

    return (function () { var r_21_66_ = []; for (var p in patterns)  { var a = patterns[p];r_21_66_.push([new RegExp(p,flags),a])  } return r_21_66_ }).bind(this)()
}

sortRanges = function (rgs)
{
    return rgs.sort(function (a, b)
    {
        if (a.start === b.start)
        {
            return a.index - b.index
        }
        else
        {
            return a.start - b.start
        }
    })
}

ranges = function (regexes, text, flags)
{
    var arg, gi, gs, i, j, match, r, reg, rgs, s, value, _69_35_

    if (!(regexes instanceof Array))
    {
        if (_k_.isStr(regexes))
        {
            regexes = [[new RegExp(regexes,flags),'found']]
        }
        else
        {
            regexes = [[regexes,'found']]
        }
    }
    else if (!_k_.empty((regexes)) && !(regexes[0] instanceof Array))
    {
        regexes = [regexes]
    }
    rgs = []
    if (!(text != null) || _k_.empty(regexes))
    {
        return rgs
    }
    for (var _65_14_ = r = 0, _65_18_ = regexes.length; (_65_14_ <= _65_18_ ? r < regexes.length : r > regexes.length); (_65_14_ <= _65_18_ ? ++r : --r))
    {
        reg = regexes[r][0]
        if (!(reg != null) || !(reg.exec != null))
        {
            console.error('no reg?',regexes,text,flags)
            return rgs
        }
        arg = regexes[r][1]
        i = 0
        s = text
        while (s.length)
        {
            match = reg.exec(s)
            if (!(match != null))
            {
                break
            }
            if (match.length === 1)
            {
                if (match[0].length > 0)
                {
                    rgs.push({start:match.index + i,match:match[0],clss:arg,index:r})
                }
                i += match.index + Math.max(1,match[0].length)
                s = text.slice(i)
            }
            else
            {
                gs = 0
                for (var _99_26_ = j = 0, _99_29_ = match.length - 2; (_99_26_ <= _99_29_ ? j <= match.length - 2 : j >= match.length - 2); (_99_26_ <= _99_29_ ? ++j : --j))
                {
                    value = arg
                    if (value instanceof Array && j < value.length)
                    {
                        value = value[j]
                    }
                    else if (_k_.isObj(value) && j < Object.keys(value).length)
                    {
                        value = [Object.keys(value)[j],value[Object.keys(value)[j]]]
                    }
                    if (!(match[j + 1] != null))
                    {
                        break
                    }
                    gi = match[0].slice(gs).indexOf(match[j + 1])
                    rgs.push({start:match.index + i + gs + gi,match:match[j + 1],clss:value,index:r})
                    gs += match[j + 1].length
                }
                i += match.index + match[0].length
                s = text.slice(i)
            }
        }
    }
    return sortRanges(rgs)
}

dissect = function (ranges, opt = {join:false})
{
    var c, d, di, dps, i, p, pn, r, rg, ri, si, _169_22_, _170_36_, _172_48_

    if (!ranges.length)
    {
        return []
    }
    di = []
    var list = _k_.list(ranges)
    for (var _142_11_ = 0; _142_11_ < list.length; _142_11_++)
    {
        rg = list[_142_11_]
        di.push([rg.start,rg.index])
        di.push([rg.start + rg.match.length,rg.index])
    }
    di.sort(function (a, b)
    {
        if (a[0] === b[0])
        {
            return a[1] - b[1]
        }
        else
        {
            return a[0] - b[0]
        }
    })
    d = []
    si = -1
    var list1 = _k_.list(di)
    for (var _155_12_ = 0; _155_12_ < list1.length; _155_12_++)
    {
        dps = list1[_155_12_]
        if (dps[0] > si)
        {
            si = dps[0]
            d.push({start:si,cls:[]})
        }
    }
    p = 0
    for (var _163_15_ = ri = 0, _163_19_ = ranges.length; (_163_15_ <= _163_19_ ? ri < ranges.length : ri > ranges.length); (_163_15_ <= _163_19_ ? ++ri : --ri))
    {
        rg = ranges[ri]
        while (d[p].start < rg.start)
        {
            p += 1
        }
        pn = p
        while (d[pn].start < rg.start + rg.match.length)
        {
            if ((rg.clss != null))
            {
                if (!(rg.clss.split != null))
                {
                    var list2 = _k_.list(rg.clss)
                    for (var _171_26_ = 0; _171_26_ < list2.length; _171_26_++)
                    {
                        r = list2[_171_26_]
                        if (!((r != null ? r.split : undefined) != null))
                        {
                            continue
                        }
                        var list3 = _k_.list(r.split('.'))
                        for (var _173_30_ = 0; _173_30_ < list3.length; _173_30_++)
                        {
                            c = list3[_173_30_]
                            if (d[pn].cls.indexOf(c) < 0)
                            {
                                d[pn].cls.push(c)
                            }
                        }
                    }
                }
                else
                {
                    var list4 = _k_.list(rg.clss.split('.'))
                    for (var _176_26_ = 0; _176_26_ < list4.length; _176_26_++)
                    {
                        c = list4[_176_26_]
                        if (d[pn].cls.indexOf(c) < 0)
                        {
                            d[pn].cls.push(c)
                        }
                    }
                }
            }
            if (pn + 1 < d.length)
            {
                if (!d[pn].match)
                {
                    d[pn].match = rg.match.substr(d[pn].start - rg.start,d[pn + 1].start - d[pn].start)
                }
                pn += 1
            }
            else
            {
                if (!d[pn].match)
                {
                    d[pn].match = rg.match.substr(d[pn].start - rg.start)
                }
                break
            }
        }
    }
    d = d.filter(function (i)
    {
        var _187_31_

        return (i.match != null ? i.match.trim().length : undefined)
    })
    var list5 = _k_.list(d)
    for (var _189_10_ = 0; _189_10_ < list5.length; _189_10_++)
    {
        i = list5[_189_10_]
        i.clss = i.cls.join(' ')
        delete i.cls
    }
    if (d.length > 1)
    {
        for (var _194_18_ = i = d.length - 2, _194_30_ = 0; (_194_18_ <= _194_30_ ? i <= 0 : i >= 0); (_194_18_ <= _194_30_ ? ++i : --i))
        {
            if (d[i].start + d[i].match.length === d[i + 1].start)
            {
                if (d[i].clss === d[i + 1].clss)
                {
                    d[i].match += d[i + 1].match
                    d.splice(i + 1,1)
                }
            }
        }
    }
    return d
}

merge = function (dssA, dssB)
{
    var A, B, d, result

    result = []
    A = dssA.shift()
    B = dssB.shift()
    while (A && B)
    {
        if (A.start + A.match.length < B.start)
        {
            result.push(A)
            A = dssA.shift()
            continue
        }
        if (B.start + B.match.length < A.start)
        {
            result.push(B)
            B = dssB.shift()
            continue
        }
        if (A.start < B.start)
        {
            d = B.start - A.start
            result.push({start:A.start,clss:A.clss,match:A.match.slice(0,d)})
            A.start += d
            A.match = A.match.slice(d)
            continue
        }
        if (B.start < A.start)
        {
            d = A.start - B.start
            result.push({start:B.start,clss:B.clss,match:B.match.slice(0,d)})
            B.start += d
            B.match = B.match.slice(d)
            continue
        }
        if (A.start === B.start)
        {
            d = A.match.length - B.match.length
            result.push({start:A.start,clss:A.clss + " " + B.clss,match:d >= 0 && B.match || A.match})
            if (d > 0)
            {
                A.match = A.match.slice(B.match.length)
                A.start += B.match.length
                B = dssB.shift()
            }
            else if (d < 0)
            {
                B.match = B.match.slice(A.match.length)
                B.start += A.match.length
                A = dssA.shift()
            }
            else
            {
                A = dssA.shift()
                B = dssB.shift()
            }
        }
    }
    if (B && !A)
    {
        result = result.concat([B],dssB)
    }
    if (A && !B)
    {
        result = result.concat([A],dssA)
    }
    return result
}
export default {config:config,ranges:ranges,dissect:dissect,sortRanges:sortRanges,merge:merge}