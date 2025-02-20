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
        compare(kseg.segls(`aaa

bbb`),[['a','a','a'],[],['b','b','b']])
    })
    section("str", function ()
    {
        compare(kseg.str(kseg('hello')),'hello')
        compare(kseg.str(kseg('hello\world')),'hello\world')
        compare(kseg.str(kseg.segls(hello)),hello)
    })
    section("join", function ()
    {
        compare(kseg.join('hello','!','?'),kseg('hello!?'))
        compare(kseg.join(kseg('hello'),'!'),kseg('hello!'))
        compare(kseg.join('hello',kseg('!')),kseg('hello!'))
        compare(kseg.join(kseg.segls('hello'),kseg.segls('world')),kseg.segls("hello\nworld"))
        compare(kseg.join(kseg.segls('hello'),kseg('world')),kseg.segls('hello').concat(kseg('world')))
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
    section("startsWith", function ()
    {
        compare(kseg.startsWith(kseg('something'),'some'),true)
        compare(kseg.startsWith(kseg('something'),'Some'),false)
        compare(kseg.startsWith(kseg('something'),'son'),false)
    })
    section("splitAtIndent", function ()
    {
        compare(kseg.splitAtIndent(kseg('something')),[kseg(''),kseg('something')])
        compare(kseg.splitAtIndent(kseg('  some')),[kseg('  '),kseg('some')])
        compare(kseg.splitAtIndent(kseg('    more')),[kseg('    '),kseg('more')])
    })
    section("repeat", function ()
    {
        compare(kseg.repeat(4),kseg("    "))
        compare(kseg.repeat(4,'*'),kseg("****"))
        compare(kseg.repeat(2,'◂▸'),kseg("◂▸◂▸"))
    })
    section("width", function ()
    {
        compare(kseg.width('a'),1)
        compare(kseg.width('💀'),2)
        compare(kseg.width('🔥'),2)
        compare(kseg.width('💩'),2)
        compare(kseg.width('🔨'),2)
        compare(kseg.width('🔧'),2)
        compare(kseg.width('🔨🔧'),4)
        compare(kseg.width('字'),2)
        compare(kseg.width('的'),2)
        compare(kseg.width('块'),2)
        compare(kseg.width('模'),2)
        compare(kseg.width('字的模块'),8)
        compare(kseg.width('🌾'),2)
        compare(kseg.width('👁'),1)
        compare(kseg.width('🖌'),1)
        compare(kseg.width('🖍'),1)
        compare(kseg.width('🛠'),1)
        compare(kseg.width('🧑‍🌾'),2)
        compare(kseg.width('🧑'),2)
    })
}
toExport["kseg"]._section_ = true
toExport._test_ = true
export default toExport
