var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var collect, del, find, get, regexp, set


regexp = function (s)
{
    s = String(s)
    s = s.replace(/([^.]+\|[^.]+)/g,'($1)')
    s = s.replace(/\./g,'\\.')
    s = s.replace(/\^/g,'\\^')
    s = s.replace(/\?/g,'[^.]')
    s = s.replace(/\*\*/g,'####')
    s = s.replace(/\*/g,'[^.]*')
    s = s.replace(/####/g,'.*')
    return new RegExp("^" + s + "$")
}

collect = function (object, filter, map, count = -1, keyPath = [], result = [])
{
    var i, k, v

    filter = (filter != null ? filter : function (p, k, v)
    {
        return true
    })
    map = (map != null ? map : function (p, v)
    {
        return [p,v]
    })
    switch (object.constructor.name)
    {
        case "Array":
            for (var _49_22_ = i = 0, _49_26_ = object.length; (_49_22_ <= _49_26_ ? i < object.length : i > object.length); (_49_22_ <= _49_26_ ? ++i : --i))
            {
                v = object[i]
                keyPath.push(i)
                if (filter(keyPath,i,v))
                {
                    result.push(map([].concat(keyPath),v))
                    if (count > 0 && result.length >= count)
                    {
                        return result
                    }
                }
                if (_k_.in((v != null ? v.constructor.name : undefined),["Array","Object"]))
                {
                    collect(v,filter,map,count,keyPath,result)
                }
                keyPath.pop()
            }
            break
        case "Object":
            for (k in object)
            {
                v = object[k]
                keyPath.push(k)
                if (filter(keyPath,k,v))
                {
                    result.push(map([].concat(keyPath),v))
                    if (count > 0 && result.length >= count)
                    {
                        return result
                    }
                }
                if (_k_.in((v != null ? v.constructor.name : undefined),["Array","Object"]))
                {
                    collect(v,filter,map,count,keyPath,result)
                }
                keyPath.pop()
            }
            break
    }

    return result
}

find = (function ()
{
    function find ()
    {}

    find["key"] = function (object, key)
    {
        var keyReg

        keyReg = this.reg(key)
        return this.traverse(object,(function (p, k, v)
        {
            return this.match(k,keyReg)
        }).bind(this))
    }

    find["path"] = function (object, path)
    {
        var pthReg

        pthReg = this.reg(path)
        return this.traverse(object,(function (p, k, v)
        {
            return this.matchPath(p,pthReg)
        }).bind(this))
    }

    find["value"] = function (object, val)
    {
        var valReg

        valReg = this.reg(val)
        return this.traverse(object,(function (p, k, v)
        {
            return this.match(v,valReg)
        }).bind(this))
    }

    find["keyValue"] = function (object, key, val)
    {
        var keyReg, valReg

        keyReg = this.reg(key)
        valReg = this.reg(val)
        return this.traverse(object,(function (p, k, v)
        {
            return this.match(k,keyReg) && this.match(v,valReg)
        }).bind(this))
    }

    find["pathValue"] = function (object, path, val)
    {
        var pthReg, valReg

        pthReg = this.reg(path)
        valReg = this.reg(val)
        return this.traverse(object,(function (p, k, v)
        {
            return this.matchPath(p,pthReg) && this.match(v,valReg)
        }).bind(this))
    }

    find["traverse"] = function (object, func)
    {
        return collect(object,func,function (p, v)
        {
            return p
        })
    }

    find["matchPath"] = function (a, r)
    {
        return this.match(a.join('.'),r)
    }

    find["match"] = function (a, r)
    {
        var _118_30_

        if (!(a instanceof Array))
        {
            return (String(a).match(r) != null ? String(a).match(r).length : undefined)
        }
        else
        {
            return false
        }
    }

    find["reg"] = function (s)
    {
        return regexp(s)
    }

    return find
})()


get = function (object, keypath, defaultValue)
{
    var kp

    if (!object)
    {
        return defaultValue
    }
    if (!(keypath != null ? keypath.length : undefined))
    {
        return defaultValue
    }
    if (typeof(keypath) === 'string')
    {
        keypath = keypath.split('.')
    }
    kp = [].concat(keypath)
    while (kp.length)
    {
        object = object[kp.shift()]
        if (!(object != null))
        {
            return defaultValue
        }
    }
    return object
}

set = function (object, keypath, value)
{
    var k, kp, o

    if (typeof(keypath) === 'string')
    {
        keypath = keypath.split('.')
    }
    if (!(keypath instanceof Array))
    {
        throw `invalid keypath: ${JSON.stringify(keypath)}`
    }
    kp = [].concat(keypath)
    if (_k_.in('__proto__',keypath))
    {
        throw `__proto__ in keypath: ${JSON.stringify(keypath)}`
    }
    o = object
    while (kp.length > 1)
    {
        k = kp.shift()
        if (!(o[k] != null))
        {
            if (!Number.isNaN(parseInt(k)))
            {
                o = o[k] = []
            }
            else
            {
                o = o[k] = {}
            }
        }
        else
        {
            o = o[k]
        }
    }
    if (kp.length === 1 && (o != null))
    {
        if (value === undefined)
        {
            delete o[kp[0]]
        }
        else
        {
            o[kp[0]] = value
            if (o[kp[0]] !== value)
            {
                throw `couldn't set value ${JSON.stringify(value)} for keypath ${keypath.join('.')} in ${JSON.stringify(object)}`
            }
        }
    }
    return object
}

del = function (object, keypath)
{
    var k, kp, o

    if (typeof(keypath) === 'string')
    {
        keypath = keypath.split('.')
    }
    if (!(keypath instanceof Array))
    {
        throw `invalid keypath: ${JSON.stringify(keypath)}`
    }
    kp = [].concat(keypath)
    o = object
    while (kp.length > 1)
    {
        k = kp.shift()
        o = o[k]
        if (!o)
        {
            break
        }
    }
    if (kp.length === 1 && (o != null))
    {
        if (o instanceof Array)
        {
            o.splice(parseInt(kp[0]))
        }
        else if (o instanceof Object)
        {
            delete o[kp[0]]
        }
    }
    return object
}
export default {find:find,get:get,set:set,del:del}