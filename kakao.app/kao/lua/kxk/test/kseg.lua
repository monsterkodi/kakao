kxk = require "kxk/kxk"

test("kseg", function()
    test("simple", function()
        local s = kseg.segs("../")
        kseg.pop(s)
        test.cmp(kseg.str(s), "..")
    end)
    end)