--[[
     ███████  █████████  ████████    ███████ 
    ███          ███     ███   ███  ███      
    ███████      ███     ███████    ███  ████
         ███     ███     ███   ███  ███   ███
    ███████      ███     ███   ███   ███████ 
--]]

kxk = require "kxk/kxk"

test("strg", function()
    test("init", function()
        test.cmp(tostring(strg()), "")
        test.cmp(tostring(strg("a")), "a")
        test.cmp(tostring(strg("a", "b")), "ab")
    end)
    
    test("add", function()
        local itr = 100000
        profileStart("add")
        local s = strg("a")
        s = s + "b"
        test.cmp(s:num(), 2)
        test.cmp(tostring(s), "ab")
        for i in iter(0, itr) do 
            s = s + "c"
        end
        
        profileStop("add")
        profileStart("len")
        test.cmp(s:len(), (itr + 3))
        profileStop("len")
        profileStart("num")
        test.cmp(s:num(), (itr + 3))
        profileStop("num")
        
        -- profileStart "add2"
        -- s = "a"
        -- s &= "b"
        -- s.len ▸ 2
        -- s ▸ "ab"
        -- for i in 0..itr
        --     s &= "c"
        -- s.len ▸ itr+3 
        -- profileStop "add2"
        -- 1 ▸ 2
    end)
    
    test("num", function()
        local s = strg("a")
        test.cmp(s:num(), 1)
        s = s + "bc"
        test.cmp(s:num(), 3)
    end)
    
    test("index", function()
        local s = strg("abc")
        test.cmp(s[1], "a")
        test.cmp(s[2], "b")
        test.cmp(s[3], "c")
    end)
    
    test("lines", function()
        local s = strg("1\n2\n3")
        local l = s:lines()
        test.cmp(tostring(l[1]), "1")
        test.cmp(tostring(l[2]), "2")
        test.cmp(tostring(l[3]), "3")
        l[1] = l[1] + "a"
        test.cmp(tostring(l[1]), "1a")
        l[2] = l[2] + "b"
        test.cmp(tostring(l[2]), "2b")
    end)
    end)