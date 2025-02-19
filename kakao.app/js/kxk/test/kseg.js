var toExport = {}
var hello

import kstr from "../kstr.js"
import kseg from "../kseg.js"

toExport["kseg"] = function ()
{
    hello = `hello
world`
    section("kseg", function ()
    {
        compare(kseg(hello),['h','e','l','l','o','\n','w','o','r','l','d'])
    })
    section("segls", function ()
    {
        compare(kseg.segls(hello),[['h','e','l','l','o'],['w','o','r','l','d']])
    })
    section("join", function ()
    {
        compare(kseg.join(kseg('hello')),'hello')
        compare(kseg.join(kseg('hello\world')),'hello\world')
    })
    section("lines", function ()
    {
        compare(kseg.lines(''),{lines:[''],segls:[[]]})
        compare(kseg.lines(' '),{lines:[' '],segls:[[' ']]})
        compare(kseg.lines('a'),{lines:['a'],segls:[['a']]})
        compare(kseg.lines(hello),{lines:kstr.lines(hello),segls:[kseg('hello'),kseg('world')]})
    })
    section("detab", function ()
    {
        compare(kseg.detab(kseg("ta\tb\tb\ty")),kseg("ta  b   b   y"))
    })
    section("chunks", function ()
    {
        compare(kseg.chunks('a'),[{index:0,segl:['a']}])
        compare(kseg.chunks('ab\ncd'),[{index:0,segl:['a','b']},{index:3,segl:['c','d']}])
    })
}
toExport["kseg"]._section_ = true
toExport._test_ = true
export default toExport
