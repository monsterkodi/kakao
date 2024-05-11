var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var k, l, list, t

import symbol from "../symbol.js"
import calc from "../calc.js"

toExport["calc"] = function ()
{
    section("inactive", function ()
    {
        list = [[['1°',symbol.euler,symbol.pi],['0','1',symbol.euler,symbol.phi]],[['2°','0.',symbol.euler,symbol.pi],[symbol.euler,symbol.pi]],[['',symbol.rad2deg,'0.'],[symbol.rad2deg]],[['',symbol.deg2rad,'0.'],[symbol.deg2rad]],[['','8°','0.','4^','6/'],[symbol.oneoverx,symbol.exp]],[['','4^'],['^']],[['','0.','8°','5.5'],['.']],[['','0.','6/'],['/']],[['','0.','7*'],['*']],[['','(','2+2','((2+2)*3)'],[symbol.close]],[['','5.','8°','5.5'],[symbol.dot]],[['','4^','6/'],[symbol.pow]],[['','8°'],[symbol.sqrt]]]
        var list1 = _k_.list(list)
        for (var _38_14_ = 0; _38_14_ < list1.length; _38_14_++)
        {
            l = list1[_38_14_]
            var list2 = _k_.list(l[0])
            for (var _39_18_ = 0; _39_18_ < list2.length; _39_18_++)
            {
                t = list2[_39_18_]
                var list3 = _k_.list(l[1])
                for (var _40_22_ = 0; _40_22_ < list3.length; _40_22_++)
                {
                    k = list3[_40_22_]
                    compare(calc.activeKey(t,k),false)
                }
            }
        }
    })
    section("active", function ()
    {
        list = [[['1','(1+2)','5.5',symbol.euler,symbol.pi],[symbol.deg2rad]],[['1','(1+2)','5.5',symbol.euler,symbol.pi],[symbol.rad2deg]],[['1','(1+2)','5.5',symbol.phi],[symbol.pow]],[['1','(1+2)','5.5','9/10+12',symbol.phi],[symbol.oneoverx]],[['1','(1+2)','5.5','9/10+12',symbol.phi,'8/','5*'],['+','-']]]
        var list4 = _k_.list(list)
        for (var _58_14_ = 0; _58_14_ < list4.length; _58_14_++)
        {
            l = list4[_58_14_]
            var list5 = _k_.list(l[0])
            for (var _59_18_ = 0; _59_18_ < list5.length; _59_18_++)
            {
                t = list5[_59_18_]
                var list6 = _k_.list(l[1])
                for (var _60_22_ = 0; _60_22_ < list6.length; _60_22_++)
                {
                    k = list6[_60_22_]
                    compare(calc.activeKey(t,k),true)
                }
            }
        }
    })
    section("calc", function ()
    {
        list = [['2^2^2','16'],['2^(3^4)','2417851639229258349412352'],['2^3^4','2417851639229258349412352'],['(2^3)^4','4096'],['9*-3','-27'],['180°','3.141592653589793'],['√(9)','3'],['√(8+1','3'],['log(E','1'],['cos(π','-1'],['sin(π/2','1'],['cos(sin(π','1'],['1/0','∞'],['1/(∞','0'],['0/0','']]
        var list7 = _k_.list(list)
        for (var _82_14_ = 0; _82_14_ < list7.length; _82_14_++)
        {
            l = list7[_82_14_]
            compare(calc.calc(l[0]),l[1])
        }
    })
    section("equals", function ()
    {
        list = [['2^2','=','4'],['2^4','=','16'],['2^2^2','=','16']]
        var list8 = _k_.list(list)
        for (var _92_14_ = 0; _92_14_ < list8.length; _92_14_++)
        {
            l = list8[_92_14_]
            compare(calc.textKey(l[0],l[1]),l[2])
        }
    })
    section("replace", function ()
    {
        list = [['2^0','1'],['2^0','2'],['∞','3']]
        var list9 = _k_.list(list)
        for (var _102_14_ = 0; _102_14_ < list9.length; _102_14_++)
        {
            l = list9[_102_14_]
            compare(calc.textKey(l[0],l[1]),l[0].substr(0,l[0].length - 1) + l[1])
        }
    })
    section("block", function ()
    {
        list = [[['0','0°',symbol.euler,'π'],'0'],[['1°',symbol.euler,'π'],'1'],[['2°',symbol.euler,'π'],'π'],[['3°',symbol.euler,'π'],symbol.euler],[['','4^'],'^'],[['','5.','5°','5.5'],'.'],[['','6.','6/'],'/'],[['','7.','7*'],'*'],[['8°','8.',symbol.euler,'π'],'°'],[['9.'],'√'],[['','(','2+2','((2+2)*3)'],')']]
        var list10 = _k_.list(list)
        for (var _126_14_ = 0; _126_14_ < list10.length; _126_14_++)
        {
            l = list10[_126_14_]
            var list11 = _k_.list(l[0])
            for (var _127_18_ = 0; _127_18_ < list11.length; _127_18_++)
            {
                t = list11[_127_18_]
                compare(calc.textKey(t,l[1]),t)
            }
        }
    })
}
toExport["calc"]._section_ = true
toExport._test_ = true
export default toExport
