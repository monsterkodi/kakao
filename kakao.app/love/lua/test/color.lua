--[[
 0000000   0000000   000       0000000   00000000   
000       000   000  000      000   000  000   000  
000       000   000  000      000   000  0000000    
000       000   000  000      000   000  000   000  
 0000000   0000000   0000000   0000000   000   000  
--]]

-- use ../../kxk    ▪ kseg
-- use ../theme     ◆ color
-- use ../edit/tool ◆ belt

test("color", function()
    -- 000   000  00000000  000   000  
    -- 000   000  000        000 000   
    -- 000000000  0000000     00000    
    -- 000   000  000        000 000   
    -- 000   000  00000000  000   000  
    
    test("hex", function()
        test.cmp(color.hex(array(0, 0, 0)), '#000000')
        test.cmp(color.hex(array(0, 255, 0)), '#00ff00')
        test.cmp(color.hex(array(255, 255, 0)), '#ffff00')
        
        test.cmp(color.hex('#ffff00'), '#ffff00')
    end)
    
    -- 0000000     0000000   00000000   000   000  00000000  000   000  
    -- 000   000  000   000  000   000  000  000   000       0000  000  
    -- 000   000  000000000  0000000    0000000    0000000   000 0 000  
    -- 000   000  000   000  000   000  000  000   000       000  0000  
    -- 0000000    000   000  000   000  000   000  00000000  000   000  
    
    test("darken", function()
        test.cmp(color.darken(color.values('ffff00'), 1), color.values('#ffff00'))
        test.cmp(color.darken(color.values('ffff00'), 0.9), color.values('#e5e500'))
        test.cmp(color.darken(color.values('ffff00'), 0.8), color.values('#cccc00'))
        test.cmp(color.darken(color.values('ffff00'), 0.7), color.values('#b2b200'))
        test.cmp(color.darken(color.values('ffff00'), 0.6), color.values('#999900'))
        test.cmp(color.darken(color.values('ffff00')), color.values('#7f7f00'))
        test.cmp(color.darken(color.values('ffff00'), 0.4), color.values('#666600'))
        test.cmp(color.darken(color.values('ffff00'), 0.3), color.values('#4c4c00'))
        test.cmp(color.darken(color.values('ffff00'), 0.2), color.values('#333300'))
        test.cmp(color.darken(color.values('ffff00'), 0.1), color.values('#191900'))
        test.cmp(color.darken(color.values('ffff00'), 0), color.values('#000000'))
    end)
    
    --  0000000   0000000   000       0000000   00000000        0000000  00000000   0000000   000       0000000  
    -- 000       000   000  000      000   000  000   000      000       000       000        000      000       
    -- 000       000   000  000      000   000  0000000        0000000   0000000   000  0000  000      0000000   
    -- 000       000   000  000      000   000  000   000           000  000       000   000  000           000  
    --  0000000   0000000   0000000   0000000   000   000      0000000   00000000   0000000   0000000  0000000   
    
    test("colorSeglsForText", function()
        test.cmp(belt.colorSeglsForText("hello\nworld"), array(array(), kseg.segls("hello\nworld")))
        test.cmp(belt.colorSeglsForText(r5("red")), array(array(array(x:0, fg:array(255, 0, 0), w:3)), kseg.segls("red")))
        test.cmp(belt.colorSeglsForText((r5("red") + g5("green"))), array(array(array({x = 0, fg = array(255, 0, 0), w = 3}, {x = 3, fg = array(0, 255, 0), w = 5})), kseg.segls("redgreen")))
        test.cmp(belt.colorSeglsForText(G5(r5("redOnGreen"))), array(array(array({x = 0, bg = array(0, 255, 0), w = 10}, {x = 0, fg = array(255, 0, 0), w = 10})), kseg.segls("redOnGreen")))
        
        test.cmp(belt.colorSeglsForText((color.bg_rgb(array(12, 123, 234)) + "bgrgb")), array(array(array({x = 0, bg = array(12, 123, 234)})), kseg.segls("bgrgb")))
        test.cmp(belt.colorSeglsForText((color.fg_rgb(array(12, 123, 234)) + "fgrgb")), array(array(array({x = 0, fg = array(12, 123, 234)})), kseg.segls("fgrgb")))
        test.cmp(belt.colorSeglsForText(((color.bg_rgb(array(12, 123, 234)) + color.fg_rgb(array(12, 123, 234))) + "rgb")), array(array(array({x = 0, bg = array(12, 123, 234)}, {x = 0, fg = array(12, 123, 234)})), kseg.segls("rgb")))
        
        test.cmp(belt.colorSeglsForText("▸ " .. tostring(color.fg_rgb(array(255, 255, 00))) .. "" .. tostring(color.fg_rgb()) .. " ms"), array(array(array({x = 2, fg = array(255, 255, 0), w = 1})), kseg.segls("▸  ms")))
    end)
    
    test("adjustForBackground", function()
        test.cmp(color.adjustForBackground(array(255, 255, 0), array(0, 0, 0)), array(255, 255, 0))
        test.cmp(color.adjustForBackground(array(255, 255, 0), array(200, 200, 0)), array(76, 77, 0))
        test.cmp(color.adjustForBackground(array(255, 255, 255), array(170, 170, 170)), array(51, 51, 51))
    end)
    end)