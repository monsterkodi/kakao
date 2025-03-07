var toExport = {}
var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g5=_k_.k.F256(_k_.k.g(5))

var a2h, blockFillets, lineFillets, lines, n, r, s, text

import kstr from "../kstr.js"

toExport["kstr"] = function ()
{
    section("str", function ()
    {
        compare(kstr({a:1,b:2}),`a   1\nb   2`)
        compare(kstr([1,2,3]),`1\n2\n3`)
    })
    section("encode", function ()
    {
        compare(kstr.encode(" hello / world !?"),'%20hello%20/%20world%20!?')
        compare(kstr.encode("</>"),'%3C/%3E')
    })
    section("escapeRegexp", function ()
    {
        compare(kstr.escapeRegexp('a/b.txt'),'a\\/b\\.txt')
    })
    section("lstrip", function ()
    {
        compare(kstr.lstrip(),'')
        compare(kstr.lstrip(''),'')
        compare(kstr.lstrip('   y'),'y')
        compare(kstr.lstrip(' '),'')
        compare(kstr.lstrip('x ','x'),' ')
        compare(kstr.lstrip(' yxy ',' y'),'xy ')
    })
    section("rstrip", function ()
    {
        compare(kstr.rstrip(),'')
        compare(kstr.rstrip(''),'')
        compare(kstr.rstrip('   y','y'),'   ')
        compare(kstr.rstrip(' '),'')
        compare(kstr.rstrip(' x','x'),' ')
        compare(kstr.rstrip(' yxy ',' y'),' yx')
    })
    section("strip", function ()
    {
        compare(kstr.strip(),'')
        compare(kstr.strip(''),'')
        compare(kstr.strip('abc'),'abc')
        compare(kstr.strip('123   y  123','123'),'   y  ')
        compare(kstr.strip(' x y z ','xyz '),'')
        compare(kstr.strip('x x','x'),' ')
        compare(kstr.strip(' yxy ',' y'),'x')
    })
    section("trim", function ()
    {
        compare(kstr.trim('123   y  123','123'),'   y  ')
        compare(kstr.ltrim(' yxy ',' y'),'xy ')
        compare(kstr.rtrim('   y','y'),'   ')
    })
    section("splice", function ()
    {
        compare(kstr.splice('hello',0,1),'ello')
        compare(kstr.splice('hello',0,3),'lo')
        compare(kstr.splice('hello',0,3,'o'),'olo')
        compare(kstr.splice('',0,0,'new'),'new')
        compare(kstr.splice('abc',3,0,'d'),'abcd')
        compare(kstr.splice('abc',2,0,'d'),'abdc')
        compare(kstr.splice('abc',-1,0,'d'),'abdc')
        compare(kstr.splice('abc',-2,0,'d'),'adbc')
        compare(kstr.splice('abc',1,-2,'23'),'a23')
    })
    section("lcnt", function ()
    {
        s = 'abc'
        n = 123
        compare(kstr.lcnt(),0)
        compare(kstr.lcnt(null,'n'),0)
        compare(kstr.lcnt(undefined,'u'),0)
        compare(kstr.lcnt(Infinity,'Inf'),0)
        compare(kstr.lcnt({},'{'),0)
        compare(kstr.lcnt([],'['),0)
        compare(kstr.lcnt('',1),0)
        compare(kstr.lcnt('ax',''),0)
        compare(kstr.lcnt('','xy'),0)
        compare(kstr.lcnt('abc',Infinity),0)
        compare(kstr.lcnt('abc',null),0)
        compare(kstr.lcnt('abc',undefined),0)
        compare(kstr.lcnt('abc',{}),0)
        compare(kstr.lcnt('abc',['ab','b']),0)
        compare(kstr.lcnt('abc',['a','b']),2)
        compare(kstr.lcnt(s,'ac'),1)
        compare(kstr.lcnt(n,'13'),1)
        compare(kstr.lcnt(11202,'12'),3)
        compare(kstr.lcnt('   xx',' '),3)
        compare(kstr.lcnt('12345 blub','1234'),4)
    })
    section("rcnt", function ()
    {
        s = 'abc'
        n = 123
        compare(kstr.rcnt(),0)
        compare(kstr.rcnt(null,'n'),0)
        compare(kstr.rcnt(undefined,'u'),0)
        compare(kstr.rcnt(Infinity,'Inf'),0)
        compare(kstr.rcnt({},'{'),0)
        compare(kstr.rcnt([],'['),0)
        compare(kstr.rcnt('',1),0)
        compare(kstr.rcnt('ax',''),0)
        compare(kstr.rcnt('','xy'),0)
        compare(kstr.rcnt('abc',Infinity),0)
        compare(kstr.rcnt('abc',null),0)
        compare(kstr.rcnt('abc',undefined),0)
        compare(kstr.rcnt('abc',{}),0)
        compare(kstr.rcnt('abc',['ab','b']),0)
        compare(kstr.rcnt('abc',['c','b']),2)
        compare(kstr.rcnt(s,'ac'),1)
        compare(kstr.rcnt(n,'23'),2)
        compare(kstr.rcnt(11202,'02'),3)
        compare(kstr.rcnt('xx   ',' '),3)
        compare(kstr.rcnt('12345 blub','blub'),4)
        compare(kstr.rcnt('A4──A5  ',' '),2)
    })
    section("lpad", function ()
    {
        compare(kstr.lpad('',4),'    ')
        compare(kstr.lpad('x',4),'   x')
        compare(kstr.lpad(' xxx ',2),' xxx ')
    })
    section("rpad", function ()
    {
        compare(kstr.rpad('',4),'    ')
        compare(kstr.rpad('x',4),'x   ')
        compare(kstr.rpad(' xxx ',2),' xxx ')
    })
    section("ansi2html", function ()
    {
        a2h = function (s, r)
        {
            return compare(kstr.ansi2html(s),r)
        }
        a2h('hello','hello')
        a2h(_k_.r5('red'),'<span style="color:#ff0000;">red</span>')
        a2h(`${_k_.r5('red')}
${_k_.g5('green')}`,`<span style="color:#ff0000;">red</span>
<span style="color:#00ff00;">green</span>`)
        a2h(`${_k_.r5('red')}${_k_.g5('green')}`,'<span style="color:#ff0000;">red</span><span style="color:#00ff00;">green</span>')
    })
    section("stripAnsi", function ()
    {
        compare(kstr.stripAnsi(_k_.g5('green')),'green')
    })
    section("detab", function ()
    {
        compare(kstr.detab('\t\t'),'        ')
        compare(kstr.detab('aa\tbb'),'aa  bb')
    })
    section("time number", function ()
    {
        compare(kstr.time(1),'1 ms')
        compare(kstr.time(1000),'1 second')
        compare(kstr.time(1001),'1 second')
        compare(kstr.time(1999),'1 second')
        compare(kstr.time(2000),'2 seconds')
        compare(kstr.time(2001),'2 seconds')
        compare(kstr.time(59999),'59 seconds')
        compare(kstr.time(60000),'1 minute')
        compare(kstr.time(120001),'2 minutes')
        compare(kstr.time(1000 * 60 * 60),'1 hour')
        compare(kstr.time(1000 * 60 * 60 * 24),'1 day')
        compare(kstr.time(1000 * 60 * 60 * 48),'2 days')
        compare(kstr.time(1000 * 60 * 60 * 24 * 30),'1 month')
        compare(kstr.time(1000 * 60 * 60 * 24 * 60),'2 months')
        compare(kstr.time(1000 * 60 * 60 * 24 * 30 * 12),'1 year')
        compare(kstr.time(1000 * 60 * 60 * 24 * 30 * 24),'2 years')
    })
    section("time bigint", function ()
    {
        compare(kstr.time(BigInt(1)),'1 ns')
        compare(kstr.time(BigInt(1000)),'1 μs')
        compare(kstr.time(BigInt(1001)),'1 μs')
        compare(kstr.time(BigInt(6001)),'6 μs')
        compare(kstr.time(BigInt(1000000)),'1 ms')
        compare(kstr.time(BigInt(1000000000)),'1 second')
        compare(kstr.time(BigInt(2000000000)),'2 seconds')
    })
    section("fillet", function ()
    {
        compare(kstr.fillet(),[])
        compare(kstr.fillet(''),[])
        compare(kstr.fillet(' '),[])
        compare(kstr.fillet('\t'),[])
        compare(kstr.fillet('\n'),[])
        compare(kstr.fillet('\r'),[])
        compare(kstr.fillet('   '),[])
        compare(kstr.fillet(' \n \t \r'),[])
        compare(kstr.fillet('abc'),[{match:'abc',index:0,length:3,word:true}])
        compare(kstr.fillet('a b c'),[{match:'a',index:0,length:1,word:true},{match:'b',index:2,length:1,word:true},{match:'c',index:4,length:1,word:true}])
        compare(kstr.fillet(' abc.def '),[{match:'abc',index:1,length:3,word:true},{match:'.',index:4,length:1,word:false},{match:'def',index:5,length:3,word:true}])
        compare(kstr.fillet(' a_c.,:__def '),[{match:'a_c',index:1,length:3,word:true},{match:'.,:',index:4,length:3,word:false},{match:'__def',index:7,length:5,word:true}])
        compare(kstr.fillet('1-2'),[{match:'1',index:0,length:1,word:true},{match:'-',index:1,length:1,word:false},{match:'2',index:2,length:1,word:true}])
    })
    section("unfillet", function ()
    {
        compare(kstr.unfillet(kstr.fillet(' a_c.,:__def ')),'a_c.,:__def')
    })
    section("blockFillets", function ()
    {
        text = `hello
    world`
        lines = text.split('\n')
        lineFillets = lines.map(function (line)
        {
            return kstr.fillet(line)
        })
        blockFillets = kstr.blockFillets(lineFillets)
        compare(blockFillets,[{line:0,indent:0,fillet:[{match:'hello',index:0,length:5,word:true}],blocks:[{line:1,indent:4,fillet:[{match:'world',index:4,length:5,word:true}],blocks:[]}]}])
        section("unfilletBlocks", function ()
        {
            r = kstr.unfilletBlocks(blockFillets)
            compare(r,text + '\n')
        })
    })
    section("levensthein", function ()
    {
        compare(kstr.levensthein('a','b'),1)
        compare(kstr.levensthein('a','zZ'),2)
        compare(kstr.levensthein('a','zZZ'),3)
        compare(kstr.levensthein('a','worl'),4)
        compare(kstr.levensthein('a','world'),5)
        compare(kstr.levensthein('hello','world'),4)
        compare(kstr.levensthein('ko.ko','ko'),3)
        compare(kstr.levensthein('ke.ko','ko'),3)
        compare(kstr.levensthein('xx.ko','ko'),3)
        compare(kstr.levensthein('wool','bool'),1)
        compare(kstr.levensthein('oxol','bool'),2)
    })
    section("weight", function ()
    {
        compare(kstr.weight(''),0)
        compare(kstr.weight(null),0)
        compare(kstr.weight(' '),0)
        compare(kstr.weight('  '),0)
        compare(kstr.weight('a') > kstr.weight(''),true)
        compare(kstr.weight('b') > kstr.weight('a'),true)
        compare(kstr.weight('b') > kstr.weight('ab'),true)
        compare(kstr.weight('b') > kstr.weight('abZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ'),true)
        compare(kstr.weight('b') > kstr.weight('B'),true)
    })
    section("indexOfClosestNonWS", function ()
    {
        compare(kstr.indexOfClosestNonWhitespace('',0),-1)
        compare(kstr.indexOfClosestNonWhitespace('     ',2),-1)
        compare(kstr.indexOfClosestNonWhitespace(null,2),-1)
        compare(kstr.indexOfClosestNonWhitespace(undefined,2),-1)
        compare(kstr.indexOfClosestNonWhitespace('hello  ',0),0)
        compare(kstr.indexOfClosestNonWhitespace('  llo  ',0),2)
        compare(kstr.indexOfClosestNonWhitespace('  llo  ',2),2)
        compare(kstr.indexOfClosestNonWhitespace('  llo  ',3),3)
        compare(kstr.indexOfClosestNonWhitespace('  llo  ',4),4)
        compare(kstr.indexOfClosestNonWhitespace('  llo  ',5),4)
        compare(kstr.indexOfClosestNonWhitespace('  llo  ',6),4)
        compare(kstr.indexOfClosestNonWhitespace('  l  ',0),2)
        compare(kstr.indexOfClosestNonWhitespace('  l  ',-1),2)
        compare(kstr.indexOfClosestNonWhitespace('  l  ',2),2)
        compare(kstr.indexOfClosestNonWhitespace('  l  ',100),2)
        compare(kstr.indexOfClosestNonWhitespace(' 1    6   a  ',0),1)
        compare(kstr.indexOfClosestNonWhitespace(' 1    6   a  ',1),1)
        compare(kstr.indexOfClosestNonWhitespace(' 1    6   a  ',2),1)
        compare(kstr.indexOfClosestNonWhitespace(' 1    6   a  ',3),1)
        compare(kstr.indexOfClosestNonWhitespace(' 1    6   a  ',4),6)
        compare(kstr.indexOfClosestNonWhitespace(' 1    6   a  ',5),6)
        compare(kstr.indexOfClosestNonWhitespace(' 1    6   a  ',6),6)
        compare(kstr.indexOfClosestNonWhitespace(' 1    6   a  ',7),6)
        compare(kstr.indexOfClosestNonWhitespace(' 1    6   a  ',8),10)
        compare(kstr.indexOfClosestNonWhitespace(' 1    6   a  ',9),10)
        compare(kstr.indexOfClosestNonWhitespace(' 1    6   a  ',10),10)
    })
    section("rangeOfClosestChunk", function ()
    {
        compare(kstr.rangeOfClosestChunk('',0),undefined)
        compare(kstr.rangeOfClosestChunk('     ',2),undefined)
        compare(kstr.rangeOfClosestChunk(null,2),undefined)
        compare(kstr.rangeOfClosestChunk(undefined,2),undefined)
        compare(kstr.rangeOfClosestChunk('  word ',-2),[2,6])
        compare(kstr.rangeOfClosestChunk('  word ',0),[2,6])
        compare(kstr.rangeOfClosestChunk('  word ',1),[2,6])
        compare(kstr.rangeOfClosestChunk('  word ',2),[2,6])
        compare(kstr.rangeOfClosestChunk('  word ',5),[2,6])
        compare(kstr.rangeOfClosestChunk('  word ',7),[2,6])
        compare(kstr.rangeOfClosestChunk('  word ',100),[2,6])
        compare(kstr.rangeOfClosestChunk('  hello   word !',0),[2,7])
        compare(kstr.rangeOfClosestChunk('  hello   word !',2),[2,7])
        compare(kstr.rangeOfClosestChunk('  hello   word !',7),[2,7])
        compare(kstr.rangeOfClosestChunk('  hello   word !',8),[10,14])
        compare(kstr.rangeOfClosestChunk('  hello   word !',9),[10,14])
        compare(kstr.rangeOfClosestChunk('  hello   word !',14),[15,16])
        compare(kstr.rangeOfClosestChunk('  hello   word !',15),[15,16])
        compare(kstr.rangeOfClosestChunk('  hello   word !',100),[15,16])
    })
    section("isAlphaNumeric", function ()
    {
        compare(kstr.isAlphaNumeric('A'),true)
        compare(kstr.isAlphaNumeric('a'),true)
        compare(kstr.isAlphaNumeric('1'),true)
        compare(kstr.isAlphaNumeric('0'),true)
        compare(kstr.isAlphaNumeric('_'),true)
        compare(kstr.isAlphaNumeric(' '),false)
        compare(kstr.isAlphaNumeric('@'),false)
        compare(kstr.isAlphaNumeric("#"),false)
        compare(kstr.isAlphaNumeric("{"),false)
        compare(kstr.isAlphaNumeric("+"),false)
        compare(kstr.isAlphaNumeric("-"),false)
        compare(kstr.isAlphaNumeric("="),false)
        compare(kstr.isAlphaNumeric('.'),false)
        compare(kstr.isAlphaNumeric('a_1'),true)
        compare(kstr.isAlphaNumeric('981'),true)
        compare(kstr.isAlphaNumeric('9.1'),false)
        compare(kstr.isAlphaNumeric('a.1'),false)
        compare(kstr.isAlphaNumeric(' a_1 '),false)
    })
    section("rangeOfClosestWord", function ()
    {
        compare(kstr.rangeOfClosestWord('',0),undefined)
        compare(kstr.rangeOfClosestWord('     ',2),undefined)
        compare(kstr.rangeOfClosestWord(null,2),undefined)
        compare(kstr.rangeOfClosestWord(undefined,2),undefined)
        compare(kstr.rangeOfClosestWord('  word ',-2),[2,6])
        compare(kstr.rangeOfClosestWord('  word ',0),[2,6])
        compare(kstr.rangeOfClosestWord('  word ',1),[2,6])
        compare(kstr.rangeOfClosestWord('  word ',2),[2,6])
        compare(kstr.rangeOfClosestWord('  word ',5),[2,6])
        compare(kstr.rangeOfClosestWord('  word ',7),[2,6])
        compare(kstr.rangeOfClosestWord('  word ',100),[2,6])
        compare(kstr.rangeOfClosestWord('  hello   word !',0),[2,7])
        compare(kstr.rangeOfClosestWord('  hello   word !',2),[2,7])
        compare(kstr.rangeOfClosestWord('  hello   word !',7),[2,7])
        compare(kstr.rangeOfClosestWord('  hello   word !',8),[10,14])
        compare(kstr.rangeOfClosestWord('  hello   word !',9),[10,14])
        compare(kstr.rangeOfClosestWord('  hello   word !',14),[10,14])
        compare(kstr.rangeOfClosestWord('  hello   word !',15),[10,14])
    })
    section("indexOfClosestAlphaNumeric", function ()
    {
        compare(kstr.indexOfClosestAlphaNumeric('  hello   word !',8),10)
        compare(kstr.indexOfClosestAlphaNumeric('  hello   word !',15),13)
    })
    section("hexColor", function ()
    {
        compare(kstr.hexColor(null),undefined)
        compare(kstr.hexColor('dead'),undefined)
        compare(kstr.hexColor("#dead"),undefined)
        compare(kstr.hexColor('alive?'),undefined)
        compare(kstr.hexColor('deadbeef'),undefined)
        compare(kstr.hexColor(0),'#000000')
        compare(kstr.hexColor(128 << 8),'#008000')
        compare(kstr.hexColor(255 << 16),'#ff0000')
        compare(kstr.hexColor([0,0,0]),'#000000')
        compare(kstr.hexColor([0,255,0]),'#00ff00')
        compare(kstr.hexColor([255,255,0]),'#ffff00')
        compare(kstr.hexColor("#ead"),[238,170,221])
        compare(kstr.hexColor("#adbeef"),[173,190,239])
        compare(kstr.hexColor("#ffffff"),[255,255,255])
        compare(kstr.hexColor("#fff"),[255,255,255])
        compare(kstr.hexColor("#ffff00"),[255,255,0])
        compare(kstr.hexColor("#ff0"),[255,255,0])
        compare(kstr.hexColor('rgb(255,100,0)'),[255,100,0])
        compare(kstr.hexColor('rgba(255,100,0)'),[255,100,0])
        compare(kstr.hexColor('rgba(255,100,0,0)'),[0,0,0])
        compare(kstr.hexColor('rgba(255,100,0,1)'),[255,100,0])
        compare(kstr.hexColor('rgba(255,100,0,0.5)'),[127,50,0])
        compare(kstr.hexColor('rgb(a,b,c)'),undefined)
        compare(kstr.hexColor('rgba(a,b,c)'),undefined)
        compare(kstr.hexColor('rgba(a,b,c,d)'),undefined)
        compare(kstr.hexColor('rgba(-1,-2,-3)'),undefined)
        compare(kstr.hexColor('rgba(256,256,256)'),undefined)
        compare(kstr.hexColor('rgba(255,100,0,1.1)'),undefined)
        compare(kstr.hexColor('rgba(255,100,0,-1)'),undefined)
    })
    section("scaleColor", function ()
    {
        compare(kstr.scaleColor('ffff00',1),'#ffff00')
        compare(kstr.scaleColor('ffff00',0.9),'#e5e500')
        compare(kstr.scaleColor('ffff00',0.8),'#cccc00')
        compare(kstr.scaleColor('ffff00',0.7),'#b2b200')
        compare(kstr.scaleColor('ffff00',0.6),'#999900')
        compare(kstr.scaleColor('ffff00'),'#7f7f00')
        compare(kstr.scaleColor('ffff00',0.4),'#666600')
        compare(kstr.scaleColor('ffff00',0.3),'#4c4c00')
        compare(kstr.scaleColor('ffff00',0.2),'#333300')
        compare(kstr.scaleColor('ffff00',0.1),'#191900')
        compare(kstr.scaleColor('ffff00',0),'#000000')
    })
}
toExport["kstr"]._section_ = true
toExport._test_ = true
export default toExport
