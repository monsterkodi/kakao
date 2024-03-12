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
},pullAllWith:function (arr, items, cmp = isEqual)
{
    var index, item

    var list = _k_.list(items)
    for (var _41_17_ = 0; _41_17_ < list.length; _41_17_++)
    {
        item = list[_41_17_]
        for (var _42_25_ = index = arr.length - 1, _42_39_ = 0; (_42_25_ <= _42_39_ ? index <= 0 : index >= 0); (_42_25_ <= _42_39_ ? ++index : --index))
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
    for (var _50_17_ = 0; _50_17_ < list.length; _50_17_++)
    {
        item = list[_50_17_]
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
    for (var _58_17_ = 0; _58_17_ < list.length; _58_17_++)
    {
        item = list[_58_17_]
        add = true
        var list1 = _k_.list(result)
        for (var _60_22_ = 0; _60_22_ < list1.length; _60_22_++)
        {
            ritem = list1[_60_22_]
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
    for (var _74_17_ = 0; _74_17_ < list.length; _74_17_++)
    {
        item = list[_74_17_]
        add = true
        var list1 = _k_.list(result)
        for (var _76_22_ = 0; _76_22_ < list1.length; _76_22_++)
        {
            ritem = list1[_76_22_]
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
    var key, val, _92_21_

    for (key in def)
    {
        val = def[key]
        obj[key] = ((_92_21_=obj[key]) != null ? _92_21_ : val)
    }
    return obj
}}