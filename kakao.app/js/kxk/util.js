var _k_ = {isArr: function (o) {return Array.isArray(o)}, isObj: function (o) {return !(o == null || typeof o != 'object' || o.constructor.name !== 'Object')}, max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var isEqual, util


isEqual = function (a, b)
{
    var index

    if (_k_.isArr(a) && _k_.isArr(b))
    {
        if (a.length !== b.length)
        {
            return false
        }
        for (var _15_21_ = index = 0, _15_25_ = a.length; (_15_21_ <= _15_25_ ? index < a.length : index > a.length); (_15_21_ <= _15_25_ ? ++index : --index))
        {
            if (!isEqual(a[index],b[index]))
            {
                return false
            }
        }
        return true
    }
    if (_k_.isObj(a) && _k_.isObj(b))
    {
        return isEqual(Object.keys(a),Object.keys(b)) && isEqual(Object.values(a),Object.values(b))
    }
    return a === b
}
util = {isEqual:isEqual,zip:function (...args)
{
    var i, maxLen, result

    result = []
    maxLen = _k_.max(args.map(function (a)
    {
        return a.length
    }))
    for (var _40_17_ = i = 0, _40_21_ = maxLen; (_40_17_ <= _40_21_ ? i < maxLen : i > maxLen); (_40_17_ <= _40_21_ ? ++i : --i))
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

    for (var _59_21_ = index = arr.length - 1, _59_35_ = 0; (_59_21_ <= _59_35_ ? index <= 0 : index >= 0); (_59_21_ <= _59_35_ ? ++index : --index))
    {
        if (pred(arr[index]))
        {
            arr.splice(index,1)
        }
    }
    return arr
},keepIf:function (arr, pred)
{
    return util.pullIf(arr,function (m)
    {
        return !pred(m)
    })
},pullAll:function (arr, items, cmp = isEqual)
{
    var index, item

    if (!_k_.empty(arr) && _k_.isArr(arr))
    {
        var list = _k_.list(items)
        for (var _70_21_ = 0; _70_21_ < list.length; _70_21_++)
        {
            item = list[_70_21_]
            for (var _71_29_ = index = arr.length - 1, _71_43_ = 0; (_71_29_ <= _71_43_ ? index <= 0 : index >= 0); (_71_29_ <= _71_43_ ? ++index : --index))
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
    for (var _79_17_ = 0; _79_17_ < list.length; _79_17_++)
    {
        item = list[_79_17_]
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
    for (var _87_17_ = 0; _87_17_ < list.length; _87_17_++)
    {
        item = list[_87_17_]
        add = true
        var list1 = _k_.list(result)
        for (var _89_22_ = 0; _89_22_ < list1.length; _89_22_++)
        {
            ritem = list1[_89_22_]
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
    for (var _103_17_ = 0; _103_17_ < list.length; _103_17_++)
    {
        item = list[_103_17_]
        add = true
        var list1 = _k_.list(result)
        for (var _105_22_ = 0; _105_22_ < list1.length; _105_22_++)
        {
            ritem = list1[_105_22_]
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
    var key, val, _135_21_

    for (key in def)
    {
        val = def[key]
        obj[key] = ((_135_21_=obj[key]) != null ? _135_21_ : val)
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
},deleteBy:function (obj, pred)
{
    var key, val

    for (key in obj)
    {
        val = obj[key]
        if (pred(key,val))
        {
            delete obj[key]
        }
    }
    return obj
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
},sleep:async function (ms)
{
    await new Promise((function (r)
    {
        return setTimeout(r,ms)
    }).bind(this))
    return true
}}
export default util;