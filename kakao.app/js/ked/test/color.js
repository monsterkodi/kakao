var toExport = {}
var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.r5=_k_.k.F256(_k_.k.r(5));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.G5=_k_.k.B256(_k_.k.G(5))

import kxk from "../../kxk.js"
let kseg = kxk.kseg

import color from "../theme/color.js"

import belt from "../edit/tool/belt.js"

toExport["color"] = function ()
{
    section("hex", function ()
    {
        compare(color.hex([0,0,0]),'#000000')
        compare(color.hex([0,255,0]),'#00ff00')
        compare(color.hex([255,255,0]),'#ffff00')
        compare(color.hex('#ffff00'),'#ffff00')
    })
    section("darken", function ()
    {
        compare(color.darken(color.values('ffff00'),1),color.values('#ffff00'))
        compare(color.darken(color.values('ffff00'),0.9),color.values('#e5e500'))
        compare(color.darken(color.values('ffff00'),0.8),color.values('#cccc00'))
        compare(color.darken(color.values('ffff00'),0.7),color.values('#b2b200'))
        compare(color.darken(color.values('ffff00'),0.6),color.values('#999900'))
        compare(color.darken(color.values('ffff00')),color.values('#7f7f00'))
        compare(color.darken(color.values('ffff00'),0.4),color.values('#666600'))
        compare(color.darken(color.values('ffff00'),0.3),color.values('#4c4c00'))
        compare(color.darken(color.values('ffff00'),0.2),color.values('#333300'))
        compare(color.darken(color.values('ffff00'),0.1),color.values('#191900'))
        compare(color.darken(color.values('ffff00'),0),color.values('#000000'))
    })
    section("colorSeglsForText", function ()
    {
        compare(belt.colorSeglsForText("hello\nworld"),[[],kseg.segls("hello\nworld")])
        compare(belt.colorSeglsForText(_k_.r5("red")),[[[{x:0,fg:[255,0,0],w:3}]],kseg.segls("red")])
        compare(belt.colorSeglsForText(_k_.r5("red") + _k_.g5("green")),[[[{x:0,fg:[255,0,0],w:3},{x:3,fg:[0,255,0],w:5}]],kseg.segls("redgreen")])
        compare(belt.colorSeglsForText(_k_.G5(_k_.r5("redOnGreen"))),[[[{x:0,bg:[0,255,0],w:10},{x:0,fg:[255,0,0],w:10}]],kseg.segls("redOnGreen")])
        compare(belt.colorSeglsForText(color.bg_rgb([12,123,234]) + ("bgrgb")),[[[{x:0,bg:[12,123,234]}]],kseg.segls("bgrgb")])
        compare(belt.colorSeglsForText(color.fg_rgb([12,123,234]) + ("fgrgb")),[[[{x:0,fg:[12,123,234]}]],kseg.segls("fgrgb")])
        compare(belt.colorSeglsForText(color.bg_rgb([12,123,234]) + color.fg_rgb([12,123,234]) + ("rgb")),[[[{x:0,bg:[12,123,234]},{x:0,fg:[12,123,234]}]],kseg.segls("rgb")])
        compare(belt.colorSeglsForText(`▸ ${color.fg_rgb([255,255,0,0])}${color.fg_rgb()} ms`),[[[{x:2,fg:[255,255,0],w:1}]],kseg.segls("▸  ms")])
    })
}
toExport["color"]._section_ = true
toExport._test_ = true
export default toExport
