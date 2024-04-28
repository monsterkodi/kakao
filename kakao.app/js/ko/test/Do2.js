var toExport = {}
var _k_

var do2, lines, text

import Do2 from "../editor/Do2.js"

toExport["Do2"] = function ()
{
    section("setLines", function ()
    {
        text = "hello\nworld"
        lines = text.split('\n')
        do2 = new Do2
        do2.setLines(lines)
        compare(do2.lines(),lines)
        compare(do2.text(),text)
    })
    section("insert", function ()
    {
        do2.insert(1,'beautiful')
        compare(do2.lines(),['hello','beautiful','world'])
        do2.insert(3,'!')
        compare(do2.lines(),['hello','beautiful','world','!'])
        do2.insert(666,'?')
        compare(do2.lines(),['hello','beautiful','world','!','?'])
        do2.insert(-666,'▴')
        compare(do2.lines(),['▴','hello','beautiful','world','!','?'])
    })
    section("delete", function ()
    {
        do2.delete(0)
        compare(do2.lines(),['hello','beautiful','world','!','?'])
        do2.delete(1)
        compare(do2.lines(),['hello','world','!','?'])
        do2.delete(666)
        compare(do2.lines(),['hello','world','!','?'])
        do2.delete(-2)
        compare(do2.lines(),['hello','world','?'])
    })
}
toExport["Do2"]._section_ = true
toExport._test_ = true
export default toExport
