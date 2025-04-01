var toExport = {}
var cb

import pepe from "../pepe.js"

toExport["pepe"] = function ()
{
    section("simple", function ()
    {
        compare(pepe(1),[])
        compare(pepe(null),[])
        compare(pepe(""),[''])
        compare(pepe(" "),[' '])
        compare(pepe("A B C"),['A B C'])
        compare(pepe(" s p a c e "),[" s p a c e "])
    })
    section("brackets", function ()
    {
        compare(pepe("()"),[{start:'(',content:[],end:')'}])
        compare(pepe("(())"),[{start:'(',content:[{start:'(',content:[],end:')'}],end:')'}])
        compare(pepe("A ( B ) C"),['A ',{start:'(',content:[' B '],end:')'},' C'])
        compare(pepe("A ({ B }) C"),['A ',{start:'(',content:[{start:'{',content:[' B '],end:'}'}],end:')'},' C'])
        compare(pepe("A ({[B]}) C"),['A ',{start:'(',content:[{start:'{',content:[{start:'[',content:['B'],end:']'}],end:'}'}],end:')'},' C'])
        compare(pepe("A [[[B]]] C"),['A ',{start:'[',content:[{start:'[',content:[{start:'[',content:['B'],end:']'}],end:']'}],end:']'},' C'])
    })
    section("multiple", function ()
    {
        compare(pepe("()[]"),[{start:'(',content:[],end:')'},{start:'[',content:[],end:']'}])
    })
    section("nested multiple", function ()
    {
        compare(pepe("{()[]}"),[{start:'{',content:[{start:'(',content:[],end:')'},{start:'[',content:[],end:']'}],end:'}'}])
        compare(pepe("{[()()]}"),[{start:'{',content:[{start:'[',content:[{start:'(',content:[],end:')'},{start:'(',content:[],end:')'}],end:']'}],end:'}'}])
    })
    section("unbalanced", function ()
    {
        compare(pepe("("),{unbalanced:[{content:[]},{start:'(',content:[]}]})
        compare(pepe(";(("),{unbalanced:[{content:[';']},{start:'(',content:[]},{start:'(',content:[]}]})
        compare(pepe(";(8("),{unbalanced:[{content:[';']},{start:'(',content:['8']},{start:'(',content:[]}]})
        compare(pepe(";(8)("),{unbalanced:[{content:[';',{start:'(',content:['8'],end:')'}]},{start:'(',content:[]}]})
        compare(pepe(";(8)(xxx"),{unbalanced:[{content:[';',{start:'(',content:['8'],end:')'}]},{start:'(',content:[]}],tail:'xxx'})
    })
    section("mismatch", function ()
    {
        compare(pepe("}"),{mismatch:[{content:[]}],tail:'}'})
        compare(pepe(")"),{mismatch:[{content:[]}],tail:')'})
        compare(pepe("]"),{mismatch:[{content:[]}],tail:']'})
        compare(pepe("(])"),{mismatch:[{content:[]},{start:'(',content:[]}],tail:'])'})
        compare(pepe("(]"),{mismatch:[{content:[]},{start:'(',content:[]}],tail:']'})
        compare(pepe("(]xxx"),{mismatch:[{content:[]},{start:'(',content:[]}],tail:']xxx'})
        compare(pepe("(xxx]"),{mismatch:[{content:[]},{start:'(',content:['xxx']}],tail:']'})
    })
    section("strings", function ()
    {
        compare(pepe("''"),[{start:"'",content:[],end:"'"}])
        compare(pepe("'x'"),[{start:"'",content:['x'],end:"'"}])
        compare(pepe("'"),{unbalanced:[{content:[]},{start:"'",content:[]}]})
        compare(pepe('"'),{unbalanced:[{content:[]},{start:'"',content:[]}]})
        compare(pepe("'()'"),[{start:"'",content:['()'],end:"'"}])
        compare(pepe("'(]}'"),[{start:"'",content:['(]}'],end:"'"}])
        compare(pepe("'\"'"),[{start:"'",content:['"'],end:"'"}])
        compare(pepe("'\"\"\"'"),[{start:"'",content:['"""'],end:"'"}])
        compare(pepe("str: '}])([{'"),['str: ',{start:"'",content:['}])([{'],end:"'"}])
    })
    section("depepe", function ()
    {
        cb = function (s)
        {
            return s.toLowerCase()
        }
        compare(pepe.depepe(pepe("A ( B ) C"),cb),"A ( b ) C")
        compare(pepe.depepe(pepe("A ({ B }) C"),cb),"A ({ b }) C")
    })
    section("pairs", function ()
    {
        compare(pepe.pairs(""),[])
        compare(pepe.pairs("[]"),[{start:'[',rng:[0,1],end:']'}])
        compare(pepe.pairs("[()]"),[{start:'[',rng:[0,3],end:']'},{start:'(',rng:[1,2],end:')'}])
        compare(pepe.pairs("[()]{''}"),[{start:'[',rng:[0,3],end:']'},{start:'(',rng:[1,2],end:')'},{start:'{',rng:[4,7],end:'}'},{start:"'",rng:[5,6],end:"'"}])
        compare(pepe.pairs("([()]{''})"),[{start:'(',rng:[0,9],end:')'},{start:'[',rng:[1,4],end:']'},{start:'(',rng:[2,3],end:')'},{start:'{',rng:[5,8],end:'}'},{start:"'",rng:[6,7],end:"'"}])
        compare(pepe.pairs("some ( nested [ stuff ] )"),[{start:'(',rng:[5,24],end:')'},{start:'[',rng:[14,22],end:']'}])
    })
}
toExport["pepe"]._section_ = true
toExport._test_ = true
export default toExport
