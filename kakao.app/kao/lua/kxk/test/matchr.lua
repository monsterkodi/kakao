kxk = require "kxk/kxk"

test("matchr", function()
    test("config", function()
        local rgxs = [[
([^/%s]+)(%.noon)
    file_noon    
    file_ext_noon
([^/%s]+)(%.kode)
    file_kode    
    file_ext_kode
]]
        
        local cfg = matchr.config(rgxs)
        
        local a, b, c = string.match("testfile.noon", "([^/%s]+)(%.noon)")
        
        test.cmp(a, "testfile")
        test.cmp(b, ".noon")
        test.cmp(c, nil)
        
        local groups = matchr.match("testfile.noon", "([^/%s]+)(%.noon)")
        test.cmp(#groups, 2)
        
        test.cmp(groups[0], nil)
        test.cmp(groups[1], "testfile")
        test.cmp(groups[2], ".noon")
        test.cmp(groups[3], nil)
        
        test.cmp(matchr.ranges(cfg, "testfile.noon"), array({clss = "file_noon", length = 8, match = "testfile", start = 1}, {clss = "file_ext_noon", length = 5, match = ".noon", start = 9}))
        
        test.cmp(matchr.ranges(cfg, "test.kode"), array({clss = "file_kode", length = 4, match = "test", start = 1}, {clss = "file_ext_kode", length = 5, match = ".kode", start = 5}))
    end)
    end)