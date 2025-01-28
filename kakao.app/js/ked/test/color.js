var toExport = {}
import color from "../color.js"

toExport["color"] = function ()
{
    section("hex", function ()
    {
        compare(color.hex([0,0,0]),'#000000')
        compare(color.hex([0,255,0]),'#00ff00')
        compare(color.hex([255,255,0]),'#ffff00')
    })
    section("darken", function ()
    {
        compare(color.darken('ffff00',1),'#ffff00')
        compare(color.darken('ffff00',0.9),'#e5e500')
        compare(color.darken('ffff00',0.8),'#cccc00')
        compare(color.darken('ffff00',0.7),'#b2b200')
        compare(color.darken('ffff00',0.6),'#999900')
        compare(color.darken('ffff00'),'#7f7f00')
        compare(color.darken('ffff00',0.4),'#666600')
        compare(color.darken('ffff00',0.3),'#4c4c00')
        compare(color.darken('ffff00',0.2),'#333300')
        compare(color.darken('ffff00',0.1),'#191900')
        compare(color.darken('ffff00',0),'#000000')
    })
}
toExport["color"]._section_ = true
toExport._test_ = true
export default toExport
