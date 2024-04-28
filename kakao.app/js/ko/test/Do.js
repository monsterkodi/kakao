var toExport = {}
var _k_

var doo, lines, text

import Do from "../editor/Do.js"

toExport["Do"] = function ()
{
    section("setLines", function ()
    {
        text = "hello\nworld"
        lines = text.split('\n')
        doo = new Do
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
        doo = new Do(lines)
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
        doo = new Do(['hello','world','○'])
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
        doo = new Do(['a','b','c'])
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
        doo.redo()
        compare(doo.lines(),['a','d','C','c'])
    })
}
toExport["Do"]._section_ = true
toExport._test_ = true
export default toExport
