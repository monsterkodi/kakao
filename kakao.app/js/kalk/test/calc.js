var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var k, l, list, t

import symbol from "../symbol.js"
import calc from "../calc.js"

toExport["calc"] = function ()
{
    section("inactive", function ()
    {
        list = [[['1°',symbol.euler,symbol.pi],['0','1',symbol.euler,symbol.phi]],[['2°','0.',symbol.euler,symbol.pi],[symbol.euler,symbol.pi]],[[symbol.rad2deg,'0.'],[symbol.rad2deg]],[['3°','0.'],[symbol.deg2rad]],[['','4^'],['^']],[['','5.','5°','5.5'],['.']],[['','6.','6/'],['/']],[['','7.','7*'],['*']],[['','(','2+2','((2+2)*3)'],[symbol.close]],[['','5.','5°','5.5'],[symbol.dot]],[['','4^','6/'],[symbol.pow]],[['9.'],[symbol.sqrt]]]
        var list1 = _k_.list(list)
        for (var _35_14_ = 0; _35_14_ < list1.length; _35_14_++)
        {
            l = list1[_35_14_]
            var list2 = _k_.list(l[0])
            for (var _36_18_ = 0; _36_18_ < list2.length; _36_18_++)
            {
                t = list2[_36_18_]
                var list3 = _k_.list(l[1])
                for (var _37_22_ = 0; _37_22_ < list3.length; _37_22_++)
                {
                    k = list3[_37_22_]
                    compare(calc.activeKey(t,k),false)
                }
            }
        }
    })
    section("active", function ()
    {
        list = [[['1','(1+2)','5.5',symbol.euler,symbol.pi],[symbol.deg2rad]],[['1','(1+2)','5.5',symbol.phi],[symbol.pow]],[['1','(1+2)','5.5','9/10+12',symbol.phi],[symbol.oneoverx]]]
        var list4 = _k_.list(list)
        for (var _53_14_ = 0; _53_14_ < list4.length; _53_14_++)
        {
            l = list4[_53_14_]
            var list5 = _k_.list(l[0])
            for (var _54_18_ = 0; _54_18_ < list5.length; _54_18_++)
            {
                t = list5[_54_18_]
                var list6 = _k_.list(l[1])
                for (var _55_22_ = 0; _55_22_ < list6.length; _55_22_++)
                {
                    k = list6[_55_22_]
                    compare(calc.activeKey(t,k),true)
                }
            }
        }
    })
    section("calc", function ()
    {
        list = [['2^2^2','16'],['2^(3^4)','2417851639229258349412352'],['2^3^4','2417851639229258349412352'],['(2^3)^4','4096'],['9*-3','-27'],['180°','3.141592653589793'],['√(9)','3'],['√(8+1','3'],['log(E','1'],['cos(π','-1'],['sin(π/2','1'],['cos(sin(π','1'],['1/0','∞'],['1/(∞','0'],['0/0','']]
        var list7 = _k_.list(list)
        for (var _77_14_ = 0; _77_14_ < list7.length; _77_14_++)
        {
            l = list7[_77_14_]
            compare(calc.calc(l[0]),l[1])
        }
    })
    section("equals", function ()
    {
        list = [['2^2','=','4'],['2^4','=','16'],['2^2^2','=','16']]
        var list8 = _k_.list(list)
        for (var _87_14_ = 0; _87_14_ < list8.length; _87_14_++)
        {
            l = list8[_87_14_]
            compare(calc.textKey(l[0],l[1]),l[2])
        }
    })
    section("replace", function ()
    {
        list = [['2^0','1'],['2^0','2'],['∞','3']]
        var list9 = _k_.list(list)
        for (var _97_14_ = 0; _97_14_ < list9.length; _97_14_++)
        {
            l = list9[_97_14_]
            compare(calc.textKey(l[0],l[1]),l[0].substr(0,l[0].length - 1) + l[1])
        }
    })
    section("block", function ()
    {
        list = [[['0','0°',symbol.euler,'π'],'0'],[['1°',symbol.euler,'π'],'1'],[['2°',symbol.euler,'π'],'π'],[['3°',symbol.euler,'π'],symbol.euler],[['','4^'],'^'],[['','5.','5°','5.5'],'.'],[['','6.','6/'],'/'],[['','7.','7*'],'*'],[['8°','8.',symbol.euler,'π'],'°'],[['9.'],'√'],[['','(','2+2','((2+2)*3)'],')']]
        var list10 = _k_.list(list)
        for (var _121_14_ = 0; _121_14_ < list10.length; _121_14_++)
        {
            l = list10[_121_14_]
            var list11 = _k_.list(l[0])
            for (var _122_18_ = 0; _122_18_ < list11.length; _122_18_++)
            {
                t = list11[_122_18_]
                compare(calc.textKey(t,l[1]),t)
            }
        }
    })
}
toExport["calc"]._section_ = true
toExport._test_ = true
export default toExport
