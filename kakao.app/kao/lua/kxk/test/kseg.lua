kxk = require "kxk/kxk"

test("kseg", function()
    test("simple", function()
        local s = kseg("../")
        s:pop()
        test.cmp(s:str(), "..")
    end)
    
    test("is", function()
        local a = kseg("")
        test.cmp(a:is(kseg), true)
        test.cmp(a:is(array), true)
        test.cmp(a:is(table), false)
        test.cmp(a:is(false), false)
        test.cmp(a:is(true), false)
        test.cmp(a:is(nil), false)
    end)
    end)