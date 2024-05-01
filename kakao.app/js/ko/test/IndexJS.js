var toExport = {}
var _k_

var idx

import IndexJS from "../tools/IndexJS.js"

toExport["IndexJS"] = function ()
{
    section("class", function ()
    {
        idx = new IndexJS
        compare(idx.parse(""),{classes:[],funcs:[],lines:1})
        compare(idx.parse("class Hello"),{classes:[{name:'Hello',line:0}],funcs:[],lines:1})
        compare(idx.parse(`class World
    constructor ()`),{classes:[{name:'World',line:0}],funcs:[{method:'constructor',line:1,class:'World'}],lines:2})
        compare(idx.parse(`class World
    constructor (a,b)`),{classes:[{name:'World',line:0}],funcs:[{method:'constructor',line:1,class:'World'}],lines:2})
        compare(idx.parse(`class World
    fun (a, b)
    {
        if (a)
        {
            for (var i = 0; i < 10; i++)
            {
                b += a
            }
        }
    }`),{classes:[{name:'World',line:0}],funcs:[{method:'fun',line:1,class:'World'}],lines:11})
    })
}
toExport["IndexJS"]._section_ = true
toExport._test_ = true
export default toExport
