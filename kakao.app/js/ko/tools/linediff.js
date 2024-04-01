var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var lineDiff

import kxk from "../../kxk.js"
let isEqual = kxk.isEqual
let kstr = kxk.kstr


lineDiff = function (oldLine, newLine)
{
    var changes, fillet, i, newFillet, newMatches, oldFillet, oldMatch, oldMatches

    changes = []
    if (oldLine !== newLine)
    {
        oldFillet = kstr.fillet(oldLine)
        newFillet = kstr.fillet(newLine)
        while (fillet = newFillet.shift())
        {
            if (oldFillet.length && oldFillet[0].match === fillet.match)
            {
                oldFillet.shift()
            }
            else
            {
                oldMatches = oldFillet.map(function (f)
                {
                    return f.match
                })
                if (_k_.in(fillet.match,oldMatches))
                {
                    while (oldMatch = oldMatches.shift())
                    {
                        oldFillet.shift()
                        if (oldMatch === fillet.match)
                        {
                            break
                        }
                    }
                    continue
                }
                changes.push({index:fillet.index,length:fillet.length})
                newMatches = newFillet.map(function (f)
                {
                    return f.match
                })
                while (oldFillet.length && !(_k_.in(oldFillet[0].match,newMatches)))
                {
                    oldFillet.shift()
                }
            }
        }
        if (changes.length > 1)
        {
            for (var _38_21_ = i = changes.length - 1, _38_39_ = 1; (_38_21_ <= _38_39_ ? i <= 1 : i >= 1); (_38_21_ <= _38_39_ ? ++i : --i))
            {
                if (changes[i - 1].index + changes[i - 1].length === changes[i].index)
                {
                    changes[i - 1].length += changes[i].length
                    changes.pop()
                }
            }
        }
    }
    return changes
}

lineDiff.isBoring = function (oldLine, newLine)
{
    var changes

    changes = lineDiff(oldLine,newLine)
    if (_k_.empty(changes))
    {
        return true
    }
    return false
}
export default lineDiff;