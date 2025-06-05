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
        test.cmp(tostring(strg("a", "b", 1, 2, (1 / 2))), "ab120.5")
    end)
    
    test("find", function()
        test.cmp(strg(""):find(""), -1)
        test.cmp(strg(""):find("x"), -1)
        test.cmp(strg("a  a"):find("x"), -1)
        test.cmp(strg("a  a"):find("a"), 1)
        test.cmp(strg("a  3"):find(" "), 2)
        test.cmp(strg("a  x"):find("  "), 2)
        test.cmp(strg("a  3"):find("3"), 4)
    end)
    
    test("rfind", function()
        test.cmp(strg(""):rfind(""), -1)
        test.cmp(strg(""):rfind("x"), -1)
        test.cmp(strg("a  3"):rfind("a"), 1)
        test.cmp(strg("a  3"):rfind(" "), 3)
        test.cmp(strg("a  x"):rfind("  "), 2)
        test.cmp(strg("3  3"):rfind("3"), 4)
    end)
    
    test("slice", function()
        test.cmp(tostring(strg("a  b"):slice(1, 2)), "a ")
        test.cmp(tostring(strg("a  b"):slice(1, 3)), "a  ")
        test.cmp(tostring(strg("a  b"):slice(1, 4)), "a  b")
        test.cmp(tostring(strg("a  b"):slice(1)), "a  b")
        test.cmp(tostring(strg("a  b"):slice(3)), " b")
    end)
    
    test("add", function()
        local itr = 100000
        -- profileStart "add"
        local s = strg("a")
        s = s + "b"
        test.cmp(s:num(), 2)
        test.cmp(tostring(s), "ab")
        for i in iter(0, itr) do 
            s = s + "c"
        end
        
        -- profileStop "add"
        -- profileStart "len"
        test.cmp(s:len(), (itr + 3))
        -- profileStop "len"
        -- profileStart "num"
        test.cmp(s:num(), (itr + 3))
        -- profileStop "num"
        
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
    
    test("flatten", function()
        local s = strg("ab")
        s = s + "cde"
        test.cmp(#s.buff, 5)
        test.cmp(#s.frags, 0)
        test.cmp(tostring(s), "abcde")
        s:flatten()
        test.cmp(s.buff, nil)
        test.cmp(#s.frags, 1)
        test.cmp(tostring(s), "abcde")
    end)
    
    test("startsWith", function()
        local s = strg("abcde")
        test.cmp(s:startsWith("b"), false)
        test.cmp(s:startsWith("a"), true)
        test.cmp(s:startsWith("ab"), true)
        test.cmp(s:startsWith("abcde"), true)
        test.cmp(s:startsWith("abcdef"), false)
    end)
    
    test("endsWith", function()
        local s = strg("abcde")
        test.cmp(s:endsWith("b"), false)
        test.cmp(s:endsWith("e"), true)
        test.cmp(s:endsWith("abcde"), true)
        test.cmp(s:endsWith("xabcde"), false)
    end)
    
    test("trim", function()
        local s = strg("  bb c  ")
        test.cmp(tostring(s:trim()), "bb c")
        s = strg("  bb c  ")
        test.cmp(tostring(s:ltrim()), "bb c  ")
        s = strg("  bb c  ")
        test.cmp(tostring(s:rtrim()), "  bb c")
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
    
    test("indent", function()
        local s = strg("")
        test.cmp(s:indent(), 0)
        s = strg("x")
        test.cmp(s:indent(), 0)
        s = strg(" x")
        test.cmp(s:indent(), 1)
        s = strg("  x  ")
        test.cmp(s:indent(), 2)
        s = strg("x  ")
        test.cmp(s:indent(), 0)
    end)
    
    test("number", function()
        local s = strg("10")
        test.cmp(s:number(), 10)
        
        s = strg("10z")
        test.cmp(s:number(), nil)
        
        s = strg("1 2")
        test.cmp(s:number(), nil)
        
        s = strg("1.0")
        test.cmp(s:number(), 1)
        
        s = strg("1.5")
        test.cmp(s:number(), 1.5)
        
        s = strg("1.5.0")
        test.cmp(s:number(), nil)
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
    
    test("unicode", function()
        local s = strg("▸")
        test.cmp(s:num(), 1)
        test.cmp(s:len(), 3)
        s = s + "●"
        test.cmp(s:num(), 2)
        test.cmp(s:len(), 6)
    end)
    end)