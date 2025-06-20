--[[
 0000000   0000000   000       0000000   00000000   
000       000   000  000      000   000  000   000  
000       000   000  000      000   000  0000000    
000       000   000  000      000   000  000   000  
 0000000   0000000   0000000   0000000   000   000  
--]]

kxk = require "kxk.kxk"
color = require "theme.color"

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
    
    --▸ colorSeglsForText
    
    
        --belt.colorSeglsForText "hello\nworld" ▸ [[] kseg.segls("hello\nworld")]
        -- belt.colorSeglsForText r5("red") ▸ [[[x:0 fg:[255 0 0] w:3]] kseg.segls("red")]
        -- belt.colorSeglsForText r5("red") + g5("green") ▸ [[[{x:0 fg:[255 0 0] w:3} {x:3 fg:[0 255 0] w:5}]] kseg.segls("redgreen")]
        -- belt.colorSeglsForText G5(r5("redOnGreen")) ▸ [[[{x:0 bg:[0 255 0] w:10}{x:0 fg:[255 0 0] w:10}]] kseg.segls("redOnGreen")]
        
        --belt.colorSeglsForText color.bg_rgb([12 123 234])+("bgrgb") ▸ [[[{x:0 bg:[12 123 234]}]] kseg.segls("bgrgb")]
        --belt.colorSeglsForText color.fg_rgb([12 123 234])+("fgrgb") ▸ [[[{x:0 fg:[12 123 234]}]] kseg.segls("fgrgb")]
        --belt.colorSeglsForText color.bg_rgb([12 123 234])+color.fg_rgb([12 123 234])+("rgb") ▸ [[[{x:0 bg:[12 123 234]} {x:0 fg:[12 123 234]}]] kseg.segls("rgb")]
        --        
        --belt.colorSeglsForText "▸ #{color.fg_rgb([255 255 00])}#{color.fg_rgb()} ms" ▸ [[[{x:2 fg:[255 255 0] w:1}]] kseg.segls("▸  ms")]
    
    test("colorRangesInLine", function()
        test.cmp(belt.colorRangesInLine(kseg("")), array())
        test.cmp(belt.colorRangesInLine(kseg("abc")), array())
        test.cmp(belt.colorRangesInLine(kseg("#abc")), array(array(1, 4)))
        test.cmp(belt.colorRangesInLine(kseg("123 #123456 456")), array(array(5, 11)))
        test.cmp(belt.colorRangesInLine(kseg("123 #123 #456 456")), array(array(5, 8), array(10, 13)))
        -- belt.colorRangesInLine kseg("123 #123#456 456") ▸ []
    end)
    
    test("adjustForBackground", function()
        test.cmp(color.adjustForBackground(array(255, 255, 0), array(0, 0, 0)), array(255, 255, 0))
        test.cmp(color.adjustForBackground(array(255, 255, 0), array(200, 200, 0)), array(76, 77, 0))
        test.cmp(color.adjustForBackground(array(255, 255, 255), array(170, 170, 170)), array(51, 51, 51))
    end)
    end)