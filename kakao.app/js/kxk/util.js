var _k_ = {isArr: function (o) {return Array.isArray(o)}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

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
    arr.splice(arr.indexOf(item),1)
    return arr
},pullIf:function (arr, pred)
{
    var index

    for (var _49_21_ = index = arr.length - 1, _49_35_ = 0; (_49_21_ <= _49_35_ ? index <= 0 : index >= 0); (_49_21_ <= _49_35_ ? ++index : --index))
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

    var list = _k_.list(items)
    for (var _56_17_ = 0; _56_17_ < list.length; _56_17_++)
    {
        item = list[_56_17_]
        for (var _57_25_ = index = arr.length - 1, _57_39_ = 0; (_57_25_ <= _57_39_ ? index <= 0 : index >= 0); (_57_25_ <= _57_39_ ? ++index : --index))
        {
            if (cmp(arr[index],item))
            {
                arr.splice(index,1)
            }
        }
    }
    return arr
},uniq:function (arr)
{
    var item, result

    result = []
    var list = _k_.list(arr)
    for (var _65_17_ = 0; _65_17_ < list.length; _65_17_++)
    {
        item = list[_65_17_]
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
    for (var _73_17_ = 0; _73_17_ < list.length; _73_17_++)
    {
        item = list[_73_17_]
        add = true
        var list1 = _k_.list(result)
        for (var _75_22_ = 0; _75_22_ < list1.length; _75_22_++)
        {
            ritem = list1[_75_22_]
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
    for (var _89_17_ = 0; _89_17_ < list.length; _89_17_++)
    {
        item = list[_89_17_]
        add = true
        var list1 = _k_.list(result)
        for (var _91_22_ = 0; _91_22_ < list1.length; _91_22_++)
        {
            ritem = list1[_91_22_]
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
},defaults:function (obj, def)
{
    var key, val, _107_21_

    for (key in def)
    {
        val = def[key]
        obj[key] = ((_107_21_=obj[key]) != null ? _107_21_ : val)
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