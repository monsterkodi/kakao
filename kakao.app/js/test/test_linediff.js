var toExport = {}
var _k_

import linediff from "../ko/tools/linediff.js"

toExport["linediff"] = function ()
{
    compare(linediff('ABC','A'),[{change:'delete',old:1,new:1,length:2}])
    compare(linediff('ABC','AbC'),[{change:'change',old:1,new:1,length:1}])
    compare(linediff('C D E','CxDyE'),[{change:'change',old:1,new:1,length:1},{change:'change',old:3,new:3,length:1}])
    compare(linediff('C','ABBB'),[{change:'change',old:0,new:0,length:1},{change:'insert',old:1,new:1,length:3}])
    compare(linediff('xyz',' x y z '),[{change:'insert',old:0,new:0,length:1},{change:'insert',old:1,new:2,length:1},{change:'insert',old:2,new:4,length:1},{change:'insert',old:3,new:6,length:1}])
    compare(linediff('t = w','t  =  w'),[{change:'insert',old:2,new:2,length:1},{change:'insert',old:4,new:5,length:1}])
    compare(linediff('window.terminal.appendMeta','if spacer ➜ window.terminal.appendMeta'),[{change:'insert',old:0,new:0,length:12}])
    compare(linediff('  window.terminal.appendMeta','  if spacer ➜ window.terminal.appendMeta'),[{change:'insert',old:2,new:2,length:12}])
    compare(linediff('if diff','continue if not diff'),[{change:'change',old:0,new:0,length:9},{change:'insert',old:3,new:12,length:4}])
    compare(linediff("       when 'change' then return false","       when 'change' ➜ return false"),[{change:'change',old:21,new:21,length:1}])
    compare(linediff("       when 'delete' then deletes++","       when 'delete' ➜ deletes++"),[{change:'change',old:21,new:21,length:1}])
    compare(linediff("       when 'insert' then inserts++","       when 'insert' ➜ inserts++"),[{change:'change',old:21,new:21,length:1}])
    compare(linediff("       when 'change' then return false","       'change' ➜ return false"),[{change:'delete',old:7,new:7,length:5},{change:'change',old:21,new:16,length:1}])
    compare(linediff("       when 'delete' then deletes++","       'delete' ➜ deletes++"),[{change:'delete',old:7,new:7,length:5},{change:'change',old:21,new:16,length:1}])
    compare(linediff("       when 'insert' then inserts++","       'insert' ➜ inserts++"),[{change:'delete',old:7,new:7,length:5},{change:'change',old:21,new:16,length:1}])
}
toExport["linediff"]._section_ = true
toExport._test_ = true
export default toExport
