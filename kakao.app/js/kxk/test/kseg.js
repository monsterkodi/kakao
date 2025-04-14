var toExport = {}
var hello, text

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
        compare(kseg.segls(kseg.segls(hello)),[['h','e','l','l','o'],['w','o','r','l','d']])
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
        compare(kseg.chunks('a'),[{chunk:'a',index:0,segl:['a']}])
        compare(kseg.chunks(' a'),[{chunk:'a',index:1,segl:['a']}])
        compare(kseg.chunks('ab cd'),[{chunk:'ab',index:0,segl:['a','b']},{chunk:'cd',index:3,segl:['c','d']}])
        compare(kseg.chunks('ab\ncd'),[{chunk:'ab',index:0,segl:['a','b']},{chunk:'cd',index:3,segl:['c','d']}])
        compare(kseg.chunks(kseg('a')),[{chunk:'a',index:0,segl:['a']}])
        compare(kseg.chunks(kseg(' a')),[{chunk:'a',index:1,segl:['a']}])
        compare(kseg.chunks(kseg('ab cd')),[{chunk:'ab',index:0,segl:['a','b']},{chunk:'cd',index:3,segl:['c','d']}])
        compare(kseg.chunks(kseg('ab\ncd')),[{chunk:'ab',index:0,segl:['a','b']},{chunk:'cd',index:3,segl:['c','d']}])
        compare(kseg.chunks(kseg.segls('a')),[{chunk:'a',index:0,segl:['a']}])
        compare(kseg.chunks(kseg.segls(' a')),[{chunk:'a',index:1,segl:['a']}])
        compare(kseg.chunks(kseg.segls('ab cd')),[{chunk:'ab',index:0,segl:['a','b']},{chunk:'cd',index:3,segl:['c','d']}])
        compare(kseg.chunks(kseg.segls('ab\ncd')),[{chunk:'ab',index:0,segl:['a','b']},{chunk:'cd',index:3,segl:['c','d']}])
    })
    section("words", function ()
    {
        compare(kseg.words('a'),[{word:'a',index:0,segl:['a']}])
        compare(kseg.words('ab cd'),[{word:'ab',index:0,segl:['a','b']},{word:'cd',index:3,segl:['c','d']}])
        compare(kseg.words('@b.cd'),[{word:'b',index:1,segl:['b']},{word:'cd',index:3,segl:['c','d']}])
    })
    section("startsWith", function ()
    {
        compare(kseg.startsWith(kseg('something'),''),false)
        compare(kseg.startsWith(kseg('something'),' '),false)
        compare(kseg.startsWith(kseg('something'),'Some'),false)
        compare(kseg.startsWith(kseg('something'),'son'),false)
        compare(kseg.startsWith(kseg('something'),'somethinga'),false)
        compare(kseg.startsWith(kseg('something'),'some'),true)
        compare(kseg.startsWith(kseg('something'),'something'),true)
        compare(kseg.startsWith(kseg('something'),kseg('something')),true)
    })
    section("endsWith", function ()
    {
        compare(kseg.endsWith(kseg('something'),''),false)
        compare(kseg.endsWith(kseg('something'),' '),false)
        compare(kseg.endsWith(kseg('something'),'asomething'),false)
        compare(kseg.endsWith(kseg('something'),'Thing'),false)
        compare(kseg.endsWith(kseg('something'),'thing'),true)
        compare(kseg.endsWith(kseg('something'),'something'),true)
        compare(kseg.endsWith(kseg('something'),kseg('something')),true)
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
        compare(kseg.width(null),0)
        compare(kseg.width(undefined),0)
        compare(kseg.width(''),0)
        compare(kseg.width([]),0)
        compare(kseg.width({}),0)
        compare(kseg.width('┏━'),2)
        compare(kseg.width(' '),1)
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
        compare(kseg.width('🌞'),2)
        compare(kseg.width('🌙'),2)
        compare(kseg.width('🌿'),2)
        compare(kseg.width('🐦'),2)
        compare(kseg.width('🌊'),2)
        compare(kseg.width('🏰'),2)
        compare(kseg.width('🔮'),2)
        compare(kseg.width('👾'),2)
        compare(kseg.width('🚀'),2)
        compare(kseg.width('🤖'),2)
        compare(kseg.width('🍳'),2)
        compare(kseg.width('🎲'),2)
        compare(kseg.width('🎯'),2)
        compare(kseg.width('🌌'),2)
        compare(kseg.width('🎩'),2)
        compare(kseg.width('📡'),2)
        compare(kseg.width('👽'),2)
        compare(kseg.width('🔭'),2)
        compare(kseg.width('👋'),2)
        compare(kseg.width(kseg("hello world")),11)
    })
    section("trim", function ()
    {
        compare(kseg.trim(' '),kseg(''))
        compare(kseg.trim(' x '),kseg('x'))
        compare(kseg.trim('🖍'),kseg('🖍'))
        compare(kseg.trim('字的模块'),kseg('字的模块'))
        compare(kseg.trim('🧑‍🌾'),kseg('🧑‍🌾'))
        compare(kseg.trim('  🖍    '),kseg('🖍'))
        compare(kseg.trim('  字的模块    '),kseg('字的模块'))
        compare(kseg.trim('  🧑‍🌾   '),kseg('🧑‍🌾'))
    })
    section("headCount", function ()
    {
        compare(kseg.headCount(' x ',' '),1)
        compare(kseg.headCount('***xx***','*'),3)
        compare(kseg.headCount(kseg('***xx***'),'*'),3)
        compare(kseg.headCountWord(' x '),0)
        compare(kseg.headCountWord('xxx  '),3)
        compare(kseg.headCountWord('🧑‍🌾'),0)
        compare(kseg.headCountWord('xx🧑‍🌾'),2)
    })
    section("tailCount", function ()
    {
        compare(kseg.tailCount(' x ',' '),1)
        compare(kseg.tailCount('***xx***','*'),3)
        compare(kseg.tailCount(kseg('***xx***'),'*'),3)
        compare(kseg.tailCountWord(' x '),0)
        compare(kseg.tailCountWord(' xxx'),3)
        compare(kseg.tailCountWord('🧑‍🌾'),0)
        compare(kseg.tailCountWord('🧑‍🌾xx'),2)
    })
    section("numIndent", function ()
    {
        compare(kseg.numIndent('a'),0)
        compare(kseg.numIndent(kseg('a')),0)
        compare(kseg.numIndent('   b'),3)
        compare(kseg.numIndent(kseg('   ')),3)
    })
    section("indexAtWidth", function ()
    {
        compare(kseg.indexAtWidth(kseg(''),0),0)
        compare(kseg.indexAtWidth(kseg(''),1),0)
        compare(kseg.indexAtWidth(kseg('a'),0),0)
        compare(kseg.indexAtWidth(kseg('a'),1),1)
        compare(kseg.indexAtWidth(kseg('a'),2),1)
        compare(kseg.indexAtWidth(kseg('abc'),2),2)
        compare(kseg.indexAtWidth(kseg('ab3'),3),3)
        compare(kseg.indexAtWidth(kseg('ab3'),4),3)
        compare(kseg.indexAtWidth(kseg('🧑🧑'),0),0)
        compare(kseg.indexAtWidth(kseg('🧑🧑'),1),1)
        compare(kseg.indexAtWidth(kseg('🧑🧑'),2),1)
        compare(kseg.indexAtWidth(kseg('🧑🧑'),3),2)
        compare(kseg.indexAtWidth(kseg('🧑🧑'),4),2)
        compare(kseg.indexAtWidth(kseg('🧑🧑'),5),2)
        compare(kseg.indexAtWidth(kseg('🧑🧑'),6),2)
        compare(kseg.indexAtWidth(kseg('🧑‍🌾🧑‍🌾'),0),0)
        compare(kseg.indexAtWidth(kseg('🧑‍🌾🧑‍🌾'),1),1)
        compare(kseg.indexAtWidth(kseg('🧑‍🌾🧑‍🌾'),2),1)
        compare(kseg.indexAtWidth(kseg('🧑‍🌾🧑‍🌾'),3),2)
    })
    section("segiAtWidth", function ()
    {
        compare(kseg.segiAtWidth(kseg(''),0),0)
        compare(kseg.segiAtWidth(kseg(''),1),0)
        compare(kseg.segiAtWidth(kseg('a'),0),0)
        compare(kseg.segiAtWidth(kseg('a'),1),1)
        compare(kseg.segiAtWidth(kseg('a'),2),1)
        compare(kseg.segiAtWidth(kseg('abc'),2),2)
        compare(kseg.segiAtWidth(kseg('ab3'),3),3)
        compare(kseg.segiAtWidth(kseg('ab3'),4),3)
        compare(kseg.segiAtWidth(kseg('🧑🧑'),0),0)
        compare(kseg.segiAtWidth(kseg('🧑🧑'),1),0)
        compare(kseg.segiAtWidth(kseg('🧑🧑'),2),1)
        compare(kseg.segiAtWidth(kseg('🧑🧑'),3),1)
        compare(kseg.segiAtWidth(kseg('🧑🧑'),4),2)
        compare(kseg.segiAtWidth(kseg('🧑🧑'),5),2)
        compare(kseg.segiAtWidth(kseg('🧑🧑'),6),2)
    })
    section("spanForClosestWordAtColumn", function ()
    {
        compare(kseg.spanForClosestWordAtColumn(kseg('abc def'),0),[0,3])
        compare(kseg.spanForClosestWordAtColumn(kseg('abc def'),1),[0,3])
        compare(kseg.spanForClosestWordAtColumn(kseg('abc def'),2),[0,3])
        compare(kseg.spanForClosestWordAtColumn(kseg('abc def'),3),[0,3])
        compare(kseg.spanForClosestWordAtColumn(kseg('abc def'),4),[4,7])
        compare(kseg.spanForClosestWordAtColumn(kseg('ab  def'),3),[0,2])
        compare(kseg.spanForClosestWordAtColumn(kseg('ab  def'),4),[4,7])
        compare(kseg.spanForClosestWordAtColumn(kseg('     '),0),[0,0])
        compare(kseg.spanForClosestWordAtColumn(kseg('     '),2),[2,2])
        compare(kseg.spanForClosestWordAtColumn(kseg('     '),3),[3,3])
        compare(kseg.spanForClosestWordAtColumn(kseg('   xy'),2),[3,5])
        compare(kseg.spanForClosestWordAtColumn(kseg('xy   '),3),[0,2])
    })
    section("collectGraphemes", function ()
    {
        compare(kseg.collectGraphemes(kseg('hello world')),['h','e','l','o',' ','w','r','d'])
        text = kseg(` 0000000  000       0000000    0000000  00000000   0000000  000000000  000   000   0000000   00000000   0000000    
000       000      000   000  000       000       000          000     000 0 000  000   000  000   000  000   000  
000       000      000   000  0000000   0000000   0000000      000     000000000  000   000  0000000    000   000  
000       000      000   000       000  000            000     000     000   000  000   000  000   000  000   000  
 0000000  0000000   0000000   0000000   00000000  0000000      000     00     00   0000000   000   000  0000000    `)
        compare(kseg.collectGraphemes(text),[' ','0','\n'])
    })
}
toExport["kseg"]._section_ = true
toExport._test_ = true
export default toExport
