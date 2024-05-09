var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}}

var build, deg, pow, scooter

import pepe from "./pepe.js"

import kode from "../kode/kode.js"


pow = function (str)
{
    var splt

    splt = str.split('^')
    if (splt.length > 1)
    {
        str = `pow(${splt[0]}, ${pow(splt.slice(1).join('^'))})`
    }
    return str
}

deg = function (str)
{
    var i, pre, splt, val

    splt = str.split('°')
    if (splt.length > 1)
    {
        val = splt[0]
        if (val[0] === '(' && val.slice(-1)[0] === ')')
        {
            str = `rad${val}` + deg(splt.slice(1).join('°'))
        }
        else
        {
            for (var _29_21_ = i = val.length - 1, _29_35_ = 0; (_29_21_ <= _29_35_ ? i <= 0 : i >= 0); (_29_21_ <= _29_35_ ? ++i : --i))
            {
                if (!(_k_.in(val[i],'0.123456789')))
                {
                    pre = val.slice(0, typeof i === 'number' ? i+1 : Infinity)
                    val = val.slice(i + 1)
                    break
                }
            }
            pre = (pre != null ? pre : '')
            str = pre + `rad(${val})` + deg(splt.slice(1).join('°'))
        }
    }
    return str
}

build = function (str)
{
    var dep, pep

    pep = pepe(str)
    if (pep.length > 1 || !(_k_.isStr(pep[0])))
    {
        dep = pepe.depepe(pep,build)
        str = dep
    }
    str = pow(str)
    str = deg(str)
    return str
}

scooter = function (str)
{
    var b, k, ost, r

    ost = str
    str = str.replace(/log\(/g,'Math.log(')
    str = str.replace(/∡/,'deg')
    str = str.replace(/√/g,'sqrt')
    str = str.replace(/π/g,'PI')
    str = str.replace(/ϕ/g,'PHI')
    str = str.replace(/𝒆/g,'E')
    str = str.replace(/∞/g,'Infinity')
    b = `{PI, E, sqrt, pow, cos, sin, tan, acos, asin, atan} = Math
rad = d -> PI*d/180.0
deg = r -> r*180.0/PI
PHI = (1+sqrt(5))/2
`
    b += '(' + build(str) + ')'
    k = new kode
    r = k.eval(b)
    return r
}
export default scooter;