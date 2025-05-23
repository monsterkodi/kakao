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
        s = "1234"
        test.cmp(kstr.shift(s, 2), "34")
    end)
    
    test("pop", function()
        s = "1234"
        test.cmp(kstr.pop(s, 2), "12")
    end)
    end)