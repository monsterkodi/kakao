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
    
    test("rfind", function()
        test.cmp(kstr.rfind("123.56", "."), 4)
        test.cmp(kstr.rfind(".23.56", "."), 4)
        test.cmp(kstr.rfind("some.ext", "."), 5)
    end)
    end)