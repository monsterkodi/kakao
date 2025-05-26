kxk = require "kxk/kxk"

test("kstr", function()
    test("splice", function()
        local s = "a/abc/ed.x"
        s = kstr.splice(s, 1, 1)
        test.cmp(s, "/abc/ed.x")
        s = kstr.splice(s, 2, 1)
        test.cmp(s, "/bc/ed.x")
        s = kstr.splice(s, -1, 1)
        test.cmp(s, "/bc/ed.")
        s = kstr.splice(s, -2, 1)
        test.cmp(s, "/bc/e.")
        s = kstr.splice(s, -2, 2, "1", "2", "3")
        test.cmp(s, "/bc/123")
        s = kstr.splice(s, -3, 3, "4", "5", "6")
        test.cmp(s, "/bc/456")
    end)
    
    test("shift", function()
        local s = "1234"
        test.cmp(kstr.shift(s, 2), "34")
    end)
    
    test("pop", function()
        test.cmp(kstr.pop("1234", 2), "12")
        test.cmp(kstr.pop("ab\n"), "ab")
    end)
    
    test("split", function()
        test.cmp(kstr.split("/", "/"), array("", ""))
        test.cmp(kstr.split("a/b/c", "/"), array("a", "b", "c"))
        test.cmp(kstr.split("/b/c", "/"), array("", "b", "c"))
        test.cmp(kstr.split("/b/", "/"), array("", "b", ""))
        test.cmp(kstr.split("//", "/"), array("", "", ""))
        test.cmp(kstr.split("//", ""), array("/", "/"))
        test.cmp(kstr.split("a.b.c.d", ".", 0), array("a.b.c.d"))
        test.cmp(kstr.split("a.b.c.d", ".", 1), array("a", "b.c.d"))
        test.cmp(kstr.split("a.b.c.d", ".", 2), array("a", "b", "c.d"))
    end)
    
    test("dollar", function()
        test.cmp(tostring(1), "1")
        test.cmp(tostring(true), "true")
        test.cmp(tostring(nil), "nil")
        local x = 42
        test.cmp(tostring(x), "42")
        test.cmp(tostring((1 / 3)), "0.33333333333333")
    end)
    
    test("endsWith", function()
        test.cmp(kstr.endsWith("uv\n", "\n"), true)
    end)
    
    test("trim", function()
        test.cmp(kstr.rtrim("xyz\n"), "xyz")
        test.cmp(kstr.trim("abc\n"), "abc")
    end)
    
    test("find", function()
        test.cmp(kstr.find("123.56", "."), 4)
        test.cmp(kstr.find(".23.56", "."), 1)
        test.cmp(kstr.find("some.ext", "e"), 4)
        test.cmp(kstr.find("abc", "d"), -1)
    end)
    
    test("rfind", function()
        test.cmp(kstr.rfind("123.56", "."), 4)
        test.cmp(kstr.rfind(".23.56", "."), 4)
        test.cmp(kstr.rfind("some.ext", "e"), 6)
        test.cmp(kstr.find("abc", "d"), -1)
    end)
    
    test("count", function()
        test.cmp(kstr.count("", ""), 0)
        test.cmp(kstr.count(" ", ""), 0)
        test.cmp(kstr.count(" ", " "), 1)
        test.cmp(kstr.count("  ", " "), 2)
        test.cmp(kstr.count("121", "1"), 2)
        test.cmp(kstr.count("123...321", "1"), 2)
        test.cmp(kstr.count("123.321.123.312", "1"), 4)
        test.cmp(kstr.count("123.321.123.312", "12"), 8)
    end)
    
    test("stripol", function()
        test.cmp("" .. (1 + 2) .. " x " .. (3 * 4) .. "", "3 x 12")
        
        test.cmp([[
]] .. (2 / 2) .. [[, ...
]] .. (5 * 4) .. [[
]], [[
1, ...
20]])
    end)
    end)