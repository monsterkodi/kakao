var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, last: function (o) {return o != null ? o.length ? o[o.length-1] : undefined : o}}

var lineDiff

import kstr from "../../kxk/kstr.js"

import util from "../../kxk/util.js"
let isEqual = util.isEqual


lineDiff = function (oldLine, newLine)
{
    var changes, deletes, fillet, inserts, lst, newFillet, ni, oi, oldFillet, r

    changes = []
    if (oldLine !== newLine)
    {
        oldFillet = kstr.fillet(oldLine)
        newFillet = kstr.fillet(newLine)
        console.log('oldFillet',oldLine,oldFillet)
        console.log('newFillet',newLine,newFillet)
        while (newFillet.length)
        {
            if (oldFillet.length && newFillet.length && oldFillet[0].match === newFillet[0].match)
            {
                oldFillet.shift()
                newFillet.shift()
            }
            else
            {
                fillet = newFillet.shift()
                changes.push({index:fillet.index,length:fillet.length})
            }
        }
        return changes
        ni = 0
        oi = 0
        console.log('old',oldLine)
        var list = _k_.list(oldFillet)
        for (var _42_14_ = 0; _42_14_ < list.length; _42_14_++)
        {
            r = list[_42_14_]
            console.log(r)
        }
        console.log('new',newLine)
        var list1 = _k_.list(newFillet)
        for (var _46_14_ = 0; _46_14_ < list1.length; _46_14_++)
        {
            r = list1[_46_14_]
            console.log(r)
        }
        while (ni < newLine.length)
        {
            if (oldLine[oi] === newLine[ni])
            {
                oi += 1
                ni += 1
                continue
            }
            inserts = newLine.slice(ni).indexOf(oldLine[oi])
            if (inserts < 0)
            {
                deletes = oldLine.slice(oi).indexOf(newLine[ni])
                if (deletes < 0)
                {
                    lst = _k_.last(changes)
                    if ((lst != null) && lst.index + lst.length === ni)
                    {
                        lst.length += 1
                    }
                    else
                    {
                        changes.push({index:ni,length:1})
                    }
                    oi += 1
                    ni += 1
                }
                else
                {
                    oi += deletes
                }
            }
            else
            {
                changes.push({index:ni,length:inserts})
                ni += inserts
            }
        }
        if (ni < newLine.length)
        {
            console.log('rest',newLine.length - ni)
            changes.push({index:ni,length:newLine.length - ni})
        }
    }
    return changes
}

lineDiff.isBoring = function (oldLine, newLine)
{
    return false
}
export default lineDiff;