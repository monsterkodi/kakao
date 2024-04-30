var toExport = {}
var _k_

import utils from "./utils.js"
let kc = utils.kc
let ke = utils.ke
let kd = utils.kd

toExport["args"] = function ()
{
    section("before", function ()
    {
        compare(kc(`function D
    f: (a, b) -> a+b`),`
D = (function ()
{
    function D ()
    {}

    D.prototype["f"] = function (a, b)
    {
        return a + b
    }

    return D
})()
`)
    })
    section("function", function ()
    {
        compare(kc(`function D
    f: a b -> a + b`),`
D = (function ()
{
    function D ()
    {}

    D.prototype["f"] = function (a, b)
    {
        return a + b
    }

    return D
})()
`)
    })
    section("class", function ()
    {
        compare(kc(`class D
    f: a b -> a + b`),`class D
{
    f (a, b)
    {
        return a + b
    }
}
`)
    })
    section("constructor", function ()
    {
        compare(kc(`function D
    @: a b -> a + b`),`
D = (function ()
{
    function D (a, b)
    {
        a + b
    }

    return D
})()
`)
        compare(kc(`class D
    @: a b -> a + b`),`class D
{
    constructor (a, b)
    {
        a + b
    }
}
`)
    })
    section("this", function ()
    {
        compare(kc(`class D
    t: (@a) ->`),`class D
{
    t (a)
    {
        this.a = a
    }
}
`)
        compare(kd(`class D
    t: @a ->`),`class D
{
    t (a)
    {
        this.a = a
    }
}
`)
    })
}
toExport["args"]._section_ = true
toExport._test_ = true
export default toExport
