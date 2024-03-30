var toExport = {}
var _k_

import linediff from "../ko/tools/linediff.js"

toExport["linediff"] = function ()
{
    compare(linediff('ABC','AbC'),[{change:'change',old:1,new:1,length:1}])
    compare(linediff('ABC','A'),[{change:'delete',old:1,new:1,length:2}])
    compare(linediff('C D E','CxDyE'),[{change:'change',old:1,new:1,length:1},{change:'change',old:3,new:3,length:1}])
    compare(linediff('xyz',' x y z '),[{change:'insert',old:0,new:0,length:1},{change:'insert',old:1,new:2,length:1},{change:'insert',old:2,new:4,length:1},{change:'insert',old:3,new:6,length:1}])
    compare(linediff('C','ABBB'),[{change:'change',old:0,new:0,length:1},{change:'insert',old:1,new:1,length:3}])
    compare(linediff('t = w','t  =  w'),[{change:'insert',old:2,new:2,length:1},{change:'insert',old:4,new:5,length:1}])
}
toExport["linediff"]._section_ = true
toExport._test_ = true
export default toExport
