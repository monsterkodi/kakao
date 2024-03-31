var toExport = {}
var _k_

import linediff from "../ko/tools/linediff.js"

toExport["linediff"] = function ()
{
    compare(linediff('','y'),[{index:0,length:1}])
    compare(linediff('x','y'),[{index:0,length:1}])
    compare(linediff('xy','z'),[{index:0,length:1}])
    compare(linediff('x','yz'),[{index:0,length:2}])
    compare(linediff('ABC',''),[])
    compare(linediff('ABC','A'),[{index:0,length:1}])
    compare(linediff('ABC','AB'),[{index:0,length:2}])
    compare(linediff('ABC','AC'),[{index:0,length:2}])
    compare(linediff('ABC','ABC'),[])
    compare(linediff('ABCD','ABC'),[{index:0,length:3}])
    compare(linediff('ABC','AbC'),[{index:0,length:3}])
    compare(linediff('C D E','CxDyE'),[{index:0,length:5}])
    compare(linediff('C','ABBB'),[{index:0,length:4}])
    compare(linediff('xyz',' x y z '),[{index:1,length:1},{index:3,length:1},{index:5,length:1}])
    compare(linediff('t = w','t  =  w'),[])
    compare(linediff('if diff','continue if not diff'),[{index:0,length:8},{index:12,length:3}])
}
toExport["linediff"]._section_ = true
toExport._test_ = true
export default toExport
