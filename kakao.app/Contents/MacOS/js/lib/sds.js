// monsterkodi/kode 0.249.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var collect, find, get, regexp


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
        return
    }
    if (!(keypath != null ? keypath.length : undefined))
    {
        return
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
export default {find:find,get:get};