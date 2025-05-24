kxk = require "kxk/kxk"

test("array", function()
    test("shift", function()
        local a = {1, 2, 3}
        local x = array.shift(a)
        test.cmp(a, {2, 3})
        test.cmp(x, 1)
        x = array.shift(a)
        test.cmp(a, {3})
        test.cmp(x, 2)
        x = array.shift(a)
        test.cmp(a, {})
        test.cmp(x, 3)
        x = array.shift(a)
        test.cmp(a, {})
        test.cmp(x, nil)
    end)
    
    test("push ", function()
        local a = {}
        array.push(a, 1, 2, 3)
        test.cmp(a, {1, 2, 3})
    end)
    
    test("isarr", function()
        local a = {1, 2}
        test.cmp(array.isarr(a), true)
        
        local b = {c = 1, d = 2}
        test.cmp(array.isarr(b), false)
        
        local c = {}
        test.cmp(array.isarr(c), false)
        
        test.cmp(array.isarr(false), false)
        
        test.cmp(array.isarr(nil), false)
        
        local d = {}
        d[2] = "d"
        test.cmp(array.isarr(d), true)
        test.cmp(d[1], nil)
        
        local e = {}
        e.hello = "world"
        test.cmp(array.isarr(e), false)
        e[1] = "and now?"
        test.cmp(array.isarr(e), true)
        test.cmp(#e, 1)
        e[1] = nil
        test.cmp(array.isarr(e), false)
        e[3] = {}
        test.cmp(array.isarr(e), false)
        e[2] = "{}"
        test.cmp(array.isarr(e), true)
        test.cmp(#e, 3)
    end)
    
    test("iter", function()
        local a = {}
        for i in iter(4, 0) do array.push(a, i) end
        test.cmp(a, {4, 3, 2, 1, 0})
        
        a = {}
        for i in iter(-4, 4, 2) do array.push(a, i) end
        test.cmp(a, {-4, -2, 0, 2, 4})
        
        a = {}
        for i in iter(4, 0, -2) do array.push(a, i) end
        test.cmp(a, {4, 2, 0, -2, -4})
        
        a = {}
        for i in iter(4, 2, 2) do array.push(a, i) end
        test.cmp(a, {4, 2, 0, -2, -4})
        
        a = {}
        for i in iter((2 / 3), (1 / 3), 0.1) do array.push(a, i) end
        test.cmp(a, {(2 / 3), ((2 / 3) - 0.1), ((2 / 3) - 0.2), ((2 / 3) - 0.3)})
        
        a = {}
        for i in iter((2 / 3), (2 / 3), 1.001) do array.push(a, i) end
        test.cmp(a, {(2 / 3)})
        
        a = {}
        for i in iter((0.1 + 0.2), 0.3, 0.1) do array.push(a, i) end
        test.cmp(a, {0.3})
        
        a = {}
        for i in iter(0, 3) do array.push(a, i) end
        test.cmp(a, {0, 1, 2, 3})
        
        a = {}
        for i = 0, 3-1 do array.push(a, i) end
        test.cmp(a, {0, 1, 2})
        
        a = {}
        for i = 0, 3-1 do array.push(a, i) end
        test.cmp(a, {0, 1, 2})
        
        a = {}
        for i in iter(3, 0) do array.push(a, i) end
        test.cmp(a, {3, 2, 1, 0})
        
        a = {}
        for i = 3, 0-1 do array.push(a, i) end
        test.cmp(a, {})
        
        a = {}
        for i = 3, 0-1 do array.push(a, i) end
        test.cmp(a, {})
    end)
    end)