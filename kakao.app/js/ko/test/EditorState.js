var toExport = {}
var _k_

var bs, es, fs, is, ns, ss

import kstr from "../../kxk/kstr.js"

import EditorState from "../editor/EditorState.js"

toExport["EditorState"] = function ()
{
    section("init", function ()
    {
        is = new EditorState(['hello','world','!'])
        compare(is.lines(),['hello','world','!'])
    })
    section("delete", function ()
    {
        ns = is.deleteLine(1)
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','!'])
        ss = ns.deleteLine(1)
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','!'])
        compare(ss.lines(),['hello'])
        es = ss.deleteLine(0)
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','!'])
        compare(ss.lines(),['hello'])
        compare(es.lines(),[])
        es = es.deleteLine(0)
        compare(es.lines(),[])
        es = is.deleteLine(100)
        compare(es.lines(),['hello','world','!'])
    })
    section("change", function ()
    {
        ns = is.changeLine(1,'test')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','test','!'])
        fs = ns.changeLine(0,'good')
        compare(fs.lines(),['good','test','!'])
        fs = fs.changeLine(2,'!!!')
        compare(fs.lines(),['good','test','!!!'])
    })
    section("insert", function ()
    {
        ns = is.insertLine(1,'new')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','new','world','!'])
        bs = ns.insertLine(1,'brave')
        compare(bs.lines(),['hello','brave','new','world','!'])
        ns = is.insertLine(0,'hi')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hi','hello','world','!'])
        ns = is.insertLine(2,'?')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','world','?','!'])
        ns = is.insertLine(-1,'>')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['>','hello','world','!'])
        ns = is.insertLine(Infinity,'<')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','world','!','<'])
    })
    section("append", function ()
    {
        ns = is.appendLine('howdy?')
        compare(is.lines(),['hello','world','!'])
        compare(ns.lines(),['hello','world','!','howdy?'])
    })
}
toExport["EditorState"]._section_ = true
toExport._test_ = true
export default toExport
