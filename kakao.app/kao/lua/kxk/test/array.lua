kxk = require "kxk/kxk"

test("array", function()
    test("shift", function()
        local a = array(1, 2, 3)
        local x = a:shift()
        test.cmp(x, 1)
        test.cmp(a, array(2, 3))
        x = a:shift()
        test.cmp(a, array(3))
        test.cmp(x, 2)
        x = a:shift()
        test.cmp(a, array())
        test.cmp(x, 3)
        x = a:shift()
        test.cmp(a, array())
        test.cmp(x, nil)
    end)
    
    test("push ", function()
        local a = array()
        local x = a:push(1, 2, 3)
        test.cmp(a, array(1, 2, 3))
        test.cmp(x, a)
        x = a:push(array(4, 5, 6))
        test.cmp(a, array(1, 2, 3, array(4, 5, 6)))
        test.cmp(x, a)
    end)
    
    test("pop", function()
        local a = array(1, 2, 3)
        local x = a:pop()
        test.cmp(a, array(1, 2))
        test.cmp(x, 3)
        x = a:pop()
        test.cmp(a, array(1))
        test.cmp(x, 2)
        x = a:pop()
        test.cmp(a, array())
        test.cmp(x, 1)
        x = a:pop()
        test.cmp(a, array())
        test.cmp(x, nil)
    end)
    
    test("shift", function()
        local a = array(1, 2, 3)
        local x = a:shift()
        test.cmp(a, array(2, 3))
        test.cmp(x, 1)
        x = a:shift()
        test.cmp(a, array(3))
        test.cmp(x, 2)
        x = a:shift()
        test.cmp(a, array())
        test.cmp(x, 3)
        x = a:shift()
        test.cmp(a, array())
        test.cmp(x, nil)
    end)
    
    test("isarr", function()
        local a = array(1, 2)
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
        local a = array()
        for i in iter(4, 0) do a:push(i) end
        test.cmp(a, array(4, 3, 2, 1, 0))
        
        a = array()
        for i in iter(-4, 4, 2) do a:push(i) end
        test.cmp(a, array(-4, -2, 0, 2, 4))
        
        a = array()
        for i in iter(4, 0, -2) do a:push(i) end
        test.cmp(a, array(4, 2, 0, -2, -4))
        
        a = array()
        for i in iter(4, 2, 2) do a:push(i) end
        test.cmp(a, array(4, 2, 0, -2, -4))
        
        a = array()
        for i in iter((2 / 3), (1 / 3), 0.1) do a:push(i) end
        test.cmp(a, array((2 / 3), ((2 / 3) - 0.1), ((2 / 3) - 0.2), ((2 / 3) - 0.3)))
        
        a = array()
        for i in iter((2 / 3), (2 / 3), 1.001) do a:push(i) end
        test.cmp(a, array((2 / 3)))
        
        a = array()
        for i in iter((0.1 + 0.2), 0.3, 0.1) do a:push(i) end
        test.cmp(a, array(0.3))
        
        a = array()
        for i in iter(0, 3) do a:push(i) end
        test.cmp(a, array(0, 1, 2, 3))
        
        a = array()
        for i = 0, 3-1 do a:push(i) end
        test.cmp(a, array(0, 1, 2))
        
        a = array()
        for i = 0, 3-1 do a:push(i) end
        test.cmp(a, array(0, 1, 2))
        
        a = array()
        for i in iter(3, 0) do a:push(i) end
        test.cmp(a, array(3, 2, 1, 0))
        
        a = array()
        for i = 3, 0-1 do a:push(i) end
        test.cmp(a, array())
        
        a = array()
        for i = 3, 0-1 do a:push(i) end
        test.cmp(a, array())
    end)
    end)