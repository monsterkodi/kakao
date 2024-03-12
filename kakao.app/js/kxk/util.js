// monsterkodi/kakao 0.1.0

var _k_ = {isArr: function (o) {return Array.isArray(o)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

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
export default {isEqual:isEqual,reversed:function (arr)
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

    for (var _41_21_ = index = arr.length - 1, _41_35_ = 0; (_41_21_ <= _41_35_ ? index <= 0 : index >= 0); (_41_21_ <= _41_35_ ? ++index : --index))
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
    for (var _48_17_ = 0; _48_17_ < list.length; _48_17_++)
    {
        item = list[_48_17_]
        for (var _49_25_ = index = arr.length - 1, _49_39_ = 0; (_49_25_ <= _49_39_ ? index <= 0 : index >= 0); (_49_25_ <= _49_39_ ? ++index : --index))
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
    for (var _57_17_ = 0; _57_17_ < list.length; _57_17_++)
    {
        item = list[_57_17_]
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
    for (var _65_17_ = 0; _65_17_ < list.length; _65_17_++)
    {
        item = list[_65_17_]
        add = true
        var list1 = _k_.list(result)
        for (var _67_22_ = 0; _67_22_ < list1.length; _67_22_++)
        {
            ritem = list1[_67_22_]
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
    for (var _81_17_ = 0; _81_17_ < list.length; _81_17_++)
    {
        item = list[_81_17_]
        add = true
        var list1 = _k_.list(result)
        for (var _83_22_ = 0; _83_22_ < list1.length; _83_22_++)
        {
            ritem = list1[_83_22_]
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
    var key, val, _99_21_

    for (key in def)
    {
        val = def[key]
        obj[key] = ((_99_21_=obj[key]) != null ? _99_21_ : val)
    }
    return obj
}}