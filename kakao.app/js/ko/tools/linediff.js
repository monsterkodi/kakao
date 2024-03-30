var _k_ = {last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var lineDiff, simplify


simplify = function (oldLine, newLine, changes)
{
    var c0, c1, ci

    if (changes.length < 2)
    {
        return
    }
    for (var _15_14_ = ci = 0, _15_18_ = changes.length - 1; (_15_14_ <= _15_18_ ? ci < changes.length - 1 : ci > changes.length - 1); (_15_14_ <= _15_18_ ? ++ci : --ci))
    {
        c0 = changes[ci]
        c1 = changes[ci + 1]
        if (c0.change === 'change' && c1.change === 'delete')
        {
            changes.splice(ci,1)
            c1.change = 'change'
            c1.length += c0.length
            c1.old = c0.old
            c1.new = c0.new
            return simplify(oldLine,newLine,changes)
        }
        if (c0.change === 'insert' && c1.change === 'delete' && (c1.old < c0.length + c0.old))
        {
            changes.splice(ci,1)
            c1.change = 'change'
            c1.length -= c0.length + (c1.old - c0.old) + (c1.new - (c0.new + c0.length))
            c1.old = c0.old
            c1.new = c0.new
            return simplify(oldLine,newLine,changes)
        }
        if (c0.change === 'delete' && c1.change === 'insert' && (c0.new + c0.length === c1.new))
        {
            changes.splice(ci,1)
            c1.old = c0.old
            c1.new = c0.new
            c1.length -= c0.length
            return simplify(oldLine,newLine,changes)
        }
        if (c0.change === 'insert' && c1.change === 'insert' && (c0.length > 1 || c1.length > 1))
        {
            changes.splice(ci,1)
            c1.change = 'change'
            c1.length = Math.max(c1.length + c0.length,c1.new - c0.new)
            c1.old = c0.old
            c1.new = c0.new
            return simplify(oldLine,newLine,changes)
        }
    }
}

lineDiff = function (oldLine, newLine)
{
    var changes, deletes, inserts, lst, nc, ni, oc, oi

    changes = []
    oi = 0
    ni = 0
    if (oldLine !== newLine)
    {
        oc = oldLine[oi]
        nc = newLine[ni]
        while (oi < oldLine.length)
        {
            if (!(nc != null))
            {
                changes.push({change:'delete',old:oi,new:ni,length:oldLine.length - oi})
                break
            }
            else if (oc === nc)
            {
                oi += 1
                oc = oldLine[oi]
                ni += 1
                nc = newLine[ni]
            }
            else
            {
                inserts = newLine.slice(ni).indexOf(oc)
                deletes = oldLine.slice(oi).indexOf(nc)
                if (inserts > 0 && (deletes <= 0 || inserts < deletes))
                {
                    lst = _k_.last(changes)
                    if ((lst != null ? lst.change : undefined) === 'change' && lst.old + lst.length === oi)
                    {
                        lst.change = 'insert'
                    }
                    else
                    {
                        changes.push({change:'insert',old:oi,new:ni,length:inserts})
                    }
                    ni += inserts
                    nc = newLine[ni]
                }
                else if (deletes > 0 && (inserts <= 0 || deletes < inserts))
                {
                    changes.push({change:'delete',old:oi,new:ni,length:deletes})
                    oi += deletes
                    oc = oldLine[oi]
                }
                else
                {
                    lst = _k_.last(changes)
                    if ((lst != null ? lst.change : undefined) === 'change' && lst.old + lst.length === oi)
                    {
                        lst.length += 1
                    }
                    else
                    {
                        changes.push({change:'change',old:oi,new:ni,length:1})
                    }
                    oi += 1
                    oc = oldLine[oi]
                    ni += 1
                    nc = newLine[ni]
                }
            }
        }
        if (ni < newLine.length)
        {
            changes.push({change:'insert',old:oi,new:ni,length:newLine.length - ni})
        }
    }
    simplify(oldLine,newLine,changes)
    return changes
}

lineDiff.isBoring = function (oldLine, newLine)
{
    var c, changes, deletes, inserts

    changes = lineDiff(oldLine,newLine)
    if (_k_.empty(changes))
    {
        return true
    }
    inserts = ''
    deletes = ''
    var list = _k_.list(changes)
    for (var _138_10_ = 0; _138_10_ < list.length; _138_10_++)
    {
        c = list[_138_10_]
        switch (c.change)
        {
            case 'change':
                return false

            case 'delete':
                deletes += oldLine.substr(c.old,c.length).trim()
                break
            case 'insert':
                inserts += newLine.substr(c.new,c.length).trim()
                break
        }

    }
    return inserts === deletes
}
export default lineDiff;