var _k_ = {isArr: function (o) {return Array.isArray(o)}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var isEqual


isEqual = function (a, b)
{
    var index

    if (_k_.isArr(a) && _k_.isArr(b))
    {
        if (a.length !== b.length)
        {
            return false
        }
        for (var _14_21_ = index = 0, _14_25_ = a.length; (_14_21_ <= _14_25_ ? index < a.length : index > a.length); (_14_21_ <= _14_25_ ? ++index : --index))
        {
            if (!isEqual(a[index],b[index]))
            {
                return false
            }
        }
        return true
    }
    return a === b
}
export default {isEqual:isEqual,zip:function (...args)
{
    var i, maxLen, result

    result = []
    maxLen = _k_.max(args.map(function (a)
    {
        return a.length
    }))
    for (var _33_17_ = i = 0, _33_21_ = maxLen; (_33_17_ <= _33_21_ ? i < maxLen : i > maxLen); (_33_17_ <= _33_21_ ? ++i : --i))
    {
        result.push(args.map(function (a)
        {
            return a[i]
        }))
    }
    return result
},reversed:function (arr)
{
    return arr.slice(0).reverse()
},max:function (arr)
{
    return Math.max.apply(null,arr)
},min:function (arr)
{
    return Math.min.apply(null,arr)
},pull:function (arr, item)
{
    var index

    if (_k_.isArr(arr))
    {
        index = arr.indexOf(item)
        if (index >= 0)
        {
            arr.splice(index,1)
        }
    }
    return arr
},pullIf:function (arr, pred)
{
    var index

    for (var _52_21_ = index = arr.length - 1, _52_35_ = 0; (_52_21_ <= _52_35_ ? index <= 0 : index >= 0); (_52_21_ <= _52_35_ ? ++index : --index))
    {
        if (pred(arr[index]))
        {
            arr.splice(index,1)
        }
    }
    return arr
},pullAllWith:function (arr, items, cmp = isEqual)
{
    var index, item

    if (!_k_.empty(arr) && _k_.isArr(arr))
    {
        var list = _k_.list(items)
        for (var _61_21_ = 0; _61_21_ < list.length; _61_21_++)
        {
            item = list[_61_21_]
            for (var _62_29_ = index = arr.length - 1, _62_43_ = 0; (_62_29_ <= _62_43_ ? index <= 0 : index >= 0); (_62_29_ <= _62_43_ ? ++index : --index))
            {
                if (cmp(arr[index],item))
                {
                    arr.splice(index,1)
                }
            }
        }
    }
    return arr
},uniq:function (arr)
{
    var item, result

    result = []
    var list = _k_.list(arr)
    for (var _70_17_ = 0; _70_17_ < list.length; _70_17_++)
    {
        item = list[_70_17_]
        if (!(_k_.in(item,result)))
        {
            result.push(item)
        }
    }
    return result
},uniqEqual:function (arr)
{
    var add, item, result, ritem

    result = []
    var list = _k_.list(arr)
    for (var _78_17_ = 0; _78_17_ < list.length; _78_17_++)
    {
        item = list[_78_17_]
        add = true
        var list1 = _k_.list(result)
        for (var _80_22_ = 0; _80_22_ < list1.length; _80_22_++)
        {
            ritem = list1[_80_22_]
            if (isEqual(item,ritem))
            {
                add = false
                break
            }
        }
        if (add)
        {
            result.push(item)
        }
    }
    return result
},uniqBy:function (arr, prop)
{
    var add, item, key, result, ritem

    if (_k_.isStr(prop))
    {
        key = prop
        prop = function (o)
        {
            return o[key]
        }
    }
    result = []
    var list = _k_.list(arr)
    for (var _94_17_ = 0; _94_17_ < list.length; _94_17_++)
    {
        item = list[_94_17_]
        add = true
        var list1 = _k_.list(result)
        for (var _96_22_ = 0; _96_22_ < list1.length; _96_22_++)
        {
            ritem = list1[_96_22_]
            if (prop(item) === prop(ritem))
            {
                add = false
                break
            }
        }
        if (add)
        {
            result.push(item)
        }
    }
    return result
},sortBy:function (arr, prop)
{
    var key

    if (_k_.isStr(prop))
    {
        key = prop
        prop = function (o)
        {
            return o[key]
        }
    }
    return arr.sort(function (a, b)
    {
        var pa, pb

        pa = prop(a)
        pb = prop(b)
        if (_k_.isStr(pa) && _k_.isStr(pb))
        {
            return pa.localeCompare(pb,'en',{sensitivity:'variant',caseFirst:'upper',numeric:true})
        }
        else
        {
            return Number(pa) - Number(pb)
        }
    })
},defaults:function (obj, def)
{
    var key, val, _126_21_

    for (key in def)
    {
        val = def[key]
        obj[key] = ((_126_21_=obj[key]) != null ? _126_21_ : val)
    }
    return obj
},pickBy:function (obj, pred)
{
    var key, result, val

    result = {}
    for (key in obj)
    {
        val = obj[key]
        if (pred(key,val))
        {
            result[key] = val
        }
    }
    return result
},toPairs:function (obj)
{
    var key, result, val

    result = []
    for (key in obj)
    {
        val = obj[key]
        result.push([key,val])
    }
    return result
}}