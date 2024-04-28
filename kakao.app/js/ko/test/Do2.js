var toExport = {}
var _k_

var doo, lines, text

import Do2 from "../editor/Do2.js"

toExport["Do2"] = function ()
{
    section("setLines", function ()
    {
        text = "hello\nworld"
        lines = text.split('\n')
        doo = new Do2
        doo.setLines(lines)
        compare(doo.lines(),lines)
        compare(doo.text(),text)
    })
    section("insert", function ()
    {
        doo.insert(1,'beautiful')
        compare(doo.lines(),['hello','beautiful','world'])
        doo.insert(3,'!')
        compare(doo.lines(),['hello','beautiful','world','!'])
        doo.insert(666,'?')
        compare(doo.lines(),['hello','beautiful','world','!'])
        doo.insert(-666,'▴')
        compare(doo.lines(),['hello','beautiful','world','!'])
    })
    section("delete", function ()
    {
        doo = new Do2(lines)
        doo.delete(0)
        compare(doo.lines(),['world'])
        doo.delete(1)
        compare(doo.lines(),['world'])
        doo.delete(-2)
        compare(doo.lines(),['world'])
        doo.delete(-1)
        compare(doo.lines(),[])
    })
    section("change", function ()
    {
        doo = new Do2(['hello','world','○'])
        doo.change(2,'~')
        compare(doo.lines(),['hello','world','~'])
        doo.change(-1,'!!')
        compare(doo.lines(),['hello','world','!!'])
        doo.change(-3,'hi')
        compare(doo.lines(),['hi','world','!!'])
        doo.change(-5,'blork')
        compare(doo.lines(),['hi','world','!!'])
        doo.change(666,'blark')
        compare(doo.lines(),['hi','world','!!'])
    })
    section("undo", function ()
    {
        doo = new Do2(['a','b','c'])
        doo.start()
        doo.insert(1,'d')
        doo.change(2,'C')
        doo.end()
        compare(doo.lines(),['a','d','C','c'])
        doo.undo()
        compare(doo.lines(),['a','b','c'])
        doo.undo()
        compare(doo.lines(),['a','b','c'])
    })
    section("redo", function ()
    {
        compare(doo.lines(),['a','b','c'])
        doo.redo()
        compare(doo.lines(),['a','d','C','c'])
        doo.redo()
        compare(doo.lines(),['a','d','C','c'])
    })
}
toExport["Do2"]._section_ = true
toExport._test_ = true
export default toExport
