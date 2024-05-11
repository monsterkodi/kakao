var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var k, l, list, t

import symbol from "../symbol.js"
import calc from "../calc.js"

toExport["calc"] = function ()
{
    section("inactive", function ()
    {
        list = [[['8°',symbol.phi],['0','1',symbol.euler,symbol.phi]],[['0.','8°',symbol.phi],[symbol.euler,symbol.pi]],[['','0.'],[symbol.rad2deg]],[['','0.'],[symbol.deg2rad]],[['','0.','4^','6/'],[symbol.oneoverx,symbol.exp]],[['','4^'],['^']],[['','0.','8°','5.5'],['.']],[['','0.','6/'],['/']],[['','0.','7*'],['*']],[['','5.','8°','5.5'],[symbol.dot]],[['','4^','6/'],[symbol.pow]],[['','0.'],[symbol.sqrt]],[['','(','2+2','((2+2)*3)'],[symbol.close]],[['(','2+2','((2+2)*3)'],[symbol.open]]]
        var list1 = _k_.list(list)
        for (var _37_14_ = 0; _37_14_ < list1.length; _37_14_++)
        {
            l = list1[_37_14_]
            var list2 = _k_.list(l[0])
            for (var _38_18_ = 0; _38_18_ < list2.length; _38_18_++)
            {
                t = list2[_38_18_]
                var list3 = _k_.list(l[1])
                for (var _39_22_ = 0; _39_22_ < list3.length; _39_22_++)
                {
                    k = list3[_39_22_]
                    compare(calc.activeKey(t,k),false)
                }
            }
        }
    })
    section("active", function ()
    {
        list = [[['1','(1+2)','5.5',symbol.phi],[symbol.deg2rad]],[['1','(1+2)','5.5',symbol.phi],[symbol.rad2deg]],[['1','(1+2)','5.5',symbol.phi],[symbol.pow]],[['1','(1+2)','5.5','9/10+12',symbol.phi],[symbol.oneoverx]],[['1','(1+2)','5.5','8°',symbol.phi],[symbol.sqrt]],[['1','(1+2)','5.5','9/10+12','8/','5*',symbol.phi],['+','-']],[['','0.','1','5.5','9/10+12','8/','5*'],['1','2','9','0']]]
        var list4 = _k_.list(list)
        for (var _59_14_ = 0; _59_14_ < list4.length; _59_14_++)
        {
            l = list4[_59_14_]
            var list5 = _k_.list(l[0])
            for (var _60_18_ = 0; _60_18_ < list5.length; _60_18_++)
            {
                t = list5[_60_18_]
                var list6 = _k_.list(l[1])
                for (var _61_22_ = 0; _61_22_ < list6.length; _61_22_++)
                {
                    k = list6[_61_22_]
                    compare(calc.activeKey(t,k),true)
                }
            }
        }
    })
    section("calc", function ()
    {
        list = [['2^2^2','16'],['2^(3^4)','2417851639229258349412352'],['2^3^4','2417851639229258349412352'],['(2^3)^4','4096'],['9*-3','-27'],['180°','3.141592653589793'],['√(9)','3'],['√(8+1','3'],['log(E','1'],['cos(π','-1'],['sin(π/2','1'],['cos(sin(π','1'],['1/0','∞'],['1/(∞','0'],['0/0','']]
        var list7 = _k_.list(list)
        for (var _83_14_ = 0; _83_14_ < list7.length; _83_14_++)
        {
            l = list7[_83_14_]
            compare(calc.calc(l[0]),l[1])
        }
    })
    section("equals", function ()
    {
        list = [['2^2','=','4'],['2^4','=','16'],['2^2^2','=','16']]
        var list8 = _k_.list(list)
        for (var _93_14_ = 0; _93_14_ < list8.length; _93_14_++)
        {
            l = list8[_93_14_]
            compare(calc.textKey(l[0],l[1]),l[2])
        }
    })
    section("replace", function ()
    {
        list = [['2^0','1'],['2^0','2'],['∞','3']]
        var list9 = _k_.list(list)
        for (var _103_14_ = 0; _103_14_ < list9.length; _103_14_++)
        {
            l = list9[_103_14_]
            compare(calc.textKey(l[0],l[1]),l[0].substr(0,l[0].length - 1) + l[1])
        }
    })
    section("block", function ()
    {
        list = [[['0','0°',symbol.euler,'π'],'0'],[['1°',symbol.euler,'π'],'1'],[['2°',symbol.euler,'π'],'π'],[['3°',symbol.euler,'π'],symbol.euler],[['','4^'],'^'],[['','5.','5°','5.5'],'.'],[['','6.','6/'],'/'],[['','7.','7*'],'*'],[['8°','8.',symbol.euler,'π'],'°'],[['9.'],'√'],[['','(','2+2','((2+2)*3)'],')']]
        var list10 = _k_.list(list)
        for (var _127_14_ = 0; _127_14_ < list10.length; _127_14_++)
        {
            l = list10[_127_14_]
            var list11 = _k_.list(l[0])
            for (var _128_18_ = 0; _128_18_ < list11.length; _128_18_++)
            {
                t = list11[_128_18_]
                compare(calc.textKey(t,l[1]),t)
            }
        }
    })
}
toExport["calc"]._section_ = true
toExport._test_ = true
export default toExport
