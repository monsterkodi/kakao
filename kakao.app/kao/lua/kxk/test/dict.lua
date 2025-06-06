kxk = require "kxk/kxk"

test("dict", function()
    test("size", function()
        local d = {a = 1, b = 2}
        test.cmp(dict.size(d), 2)
    end)
    
    test("isdict", function()
        test.cmp(dict.isdict({a = 1, b = 2}), true)
        test.cmp(dict.isdict({["1"] = 2}), true)
        test.cmp(dict.isdict({a, b}), false)
        test.cmp(dict.isdict({}), false)
    end)
    end)