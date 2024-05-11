var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var dict, k, key, keyResult, l, list, result, t

import symbol from "../symbol.js"
import calc from "../calc.js"

toExport["calc"] = function ()
{
    section("inactive", function ()
    {
        list = [[['8°',symbol.phi],['0','1','2','3','4','5','6','7','8','9']],[['0.','8°',symbol.phi],[symbol.euler,symbol.pi,symbol.phi]],[['','0.'],[symbol.deg2rad]],[['','0.'],[symbol.rad2deg]],[['0.','(','2+2','((2+2)*3)'],[symbol.open]],[['','0.','(','4^','6/','7*','((2+2)*3)','666',symbol.phi],[symbol.close]],[['0.','(','4^','6/','7*'],[symbol.sqrt,symbol.oneoverx]],[['','0.','(','4^','6/','7*'],['*','/',symbol.exp,symbol.pow]],[['','0.','(','8°','5.5'],[symbol.dot]]]
        var list1 = _k_.list(list)
        for (var _32_14_ = 0; _32_14_ < list1.length; _32_14_++)
        {
            l = list1[_32_14_]
            var list2 = _k_.list(l[0])
            for (var _33_18_ = 0; _33_18_ < list2.length; _33_18_++)
            {
                t = list2[_33_18_]
                var list3 = _k_.list(l[1])
                for (var _34_22_ = 0; _34_22_ < list3.length; _34_22_++)
                {
                    k = list3[_34_22_]
                    compare(calc.activeKey(t,k),false)
                }
            }
        }
    })
    section("active", function ()
    {
        list = [[['1','(1+2)','5.5',symbol.phi],[symbol.deg2rad]],[['1','(1+2)','5.5',symbol.phi],[symbol.rad2deg]],[['1','(1+2)','5.5',symbol.phi],[symbol.pow]],[['','1','(1+2)','5.5','9/10+12','8°',symbol.phi],[symbol.sqrt,symbol.oneoverx]],[['1','(1+2)','5.5','9/10+12','8/','5*',symbol.phi],['+','-']],[['','0.','1','5.5','9/10+12','8/','5*'],['1','2','9','0']],[['1+2','9/10+12','8/5'],[symbol.close]],[['','-','+','1*','2/','3^','4-','5+'],[symbol.open]]]
        var list4 = _k_.list(list)
        for (var _55_14_ = 0; _55_14_ < list4.length; _55_14_++)
        {
            l = list4[_55_14_]
            var list5 = _k_.list(l[0])
            for (var _56_18_ = 0; _56_18_ < list5.length; _56_18_++)
            {
                t = list5[_56_18_]
                var list6 = _k_.list(l[1])
                for (var _57_22_ = 0; _57_22_ < list6.length; _57_22_++)
                {
                    k = list6[_57_22_]
                    compare(calc.activeKey(t,k),true)
                }
            }
        }
    })
    section("calc", function ()
    {
        list = [['2^2^2','16'],['2^(3^4)','2417851639229258349412352'],['2^3^4','2417851639229258349412352'],['(2^3)^4','4096'],['9*-3','-27'],['180°','3.141592653589793'],['√(9)','3'],['√(8+1','3'],['log(E','1'],['cos(π','-1'],['sin(π/2','1'],['cos(sin(π','1'],['1/0','∞'],['1/(∞','0'],['0/0','']]
        var list7 = _k_.list(list)
        for (var _79_14_ = 0; _79_14_ < list7.length; _79_14_++)
        {
            l = list7[_79_14_]
            compare(calc.calc(l[0]),l[1])
        }
    })
    section("equals", function ()
    {
        list = [['2^2','=','4'],['2^4','=','16'],['2^2^2','=','16']]
        var list8 = _k_.list(list)
        for (var _89_14_ = 0; _89_14_ < list8.length; _89_14_++)
        {
            l = list8[_89_14_]
            compare(calc.textKey(l[0],l[1]),l[2])
        }
    })
    section("replace", function ()
    {
        list = [['2^0','1'],['2^0','2'],['∞','3']]
        var list9 = _k_.list(list)
        for (var _99_14_ = 0; _99_14_ < list9.length; _99_14_++)
        {
            l = list9[_99_14_]
            compare(calc.textKey(l[0],l[1]),l[0].substr(0,l[0].length - 1) + l[1])
        }
    })
    section("block", function ()
    {
        list = [[['0','0°',symbol.euler,symbol.pi],'0'],[['1°',symbol.euler,symbol.pi],'1'],[['2°',symbol.euler,symbol.pi],symbol.pi],[['3°',symbol.euler,symbol.pi],symbol.euler],[['','4^'],symbol.pow],[['','5.','5°','5.5'],symbol.dot],[['','6.','6/'],'/'],[['','7.','7*'],'*'],[['8°','8.'],symbol.deg2rad],[['9.'],symbol.sqrt],[['','(','((2+2)*3)'],symbol.close]]
        var list10 = _k_.list(list)
        for (var _123_14_ = 0; _123_14_ < list10.length; _123_14_++)
        {
            l = list10[_123_14_]
            var list11 = _k_.list(l[0])
            for (var _124_18_ = 0; _124_18_ < list11.length; _124_18_++)
            {
                t = list11[_124_18_]
                compare(calc.textKey(t,l[1]),t)
            }
        }
    })
    section("textKey", function ()
    {
        dict = {'':{'+':'+','-':'-','√':'√(','¹⧸ₓ':'1/'}}
        for (t in dict)
        {
            keyResult = dict[t]
            for (key in keyResult)
            {
                result = keyResult[key]
                compare(calc.textKey(t,key),result)
            }
        }
    })
}
toExport["calc"]._section_ = true
toExport._test_ = true
export default toExport
