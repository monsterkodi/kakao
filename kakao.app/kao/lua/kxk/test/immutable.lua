--[[
    ███  ██     ██  ██     ██  ███   ███  █████████   ███████   ███████    ███      ████████      █████████  ████████   ███████  █████████  
    ███  ███   ███  ███   ███  ███   ███     ███     ███   ███  ███   ███  ███      ███              ███     ███       ███          ███     
    ███  █████████  █████████  ███   ███     ███     █████████  ███████    ███      ███████          ███     ███████   ███████      ███     
    ███  ███ █ ███  ███ █ ███  ███   ███     ███     ███   ███  ███   ███  ███      ███              ███     ███            ███     ███     
    ███  ███   ███  ███   ███   ███████      ███     ███   ███  ███████    ███████  ████████         ███     ████████  ███████      ███     
--]]

kxk = require "kxk.kxk"

test("immutable", function()
    test("construct", function()
        test.cmp(immutable({}), immutable({}))
        
        local ia = immutable({a = 1})
        test.cmp(ia.a, 1)
        test.cmp(ia.b, nil)
        test.cmp(ia.class, immutable)
        test.cmp(ia._data, {a = 1})
        test.cmp(ia:set("a", 2), immutable({a = 2}))
        test.cmp(ia, immutable({a = 1}))
        local ab = ia:set("b", 2)
        test.cmp(ab, immutable({a = 1, b = 2}))
        ab = ab:set("a", nil)
        test.cmp(ab, immutable({b = 2}))
    end)
    
    test("immutability", function()
        local ia = immutable({a = 1})
        local fail = pcall(function () 
    ia.a = 2
    return ia.a
end)
        test.cmp(fail, false)
        
        fail = pcall(function () 
    ia.b = 2
    return ia.b
end)
        test.cmp(fail, false)
        
        local ib = immutable({a = array(1, 2, 3)})
        fail = pcall(function () 
    ib.a[1] = 0
    return ib.a[1]
end)
        test.cmp(fail, false)
        
        local ic = immutable({array(array(1, 2), array(3, 4))})
        fail = pcall(function () 
    ib[1][2] = 0
    return ib[1][2]
end)
        test.cmp(fail, false)
    end)
    
    test("mutable", function()
        local ia = immutable({a = 1})
        local ma = ia:mut()
        test.cmp(ia, immutable({a = 1}))
        ma.a = 2
        test.cmp(ma, {a = 2})
        ma.b = 3
        test.cmp(ma, {a = 2, b = 3})
        
        test.cmp(ia, immutable({a = 1}))
        ia = ia:set("cursor", array(1, 2))
        test.cmp(ia.cursor, immutable(array(1, 2)))
        test.cmp(ia, immutable({a = 1, cursor = array(1, 2)}))
        
        ia = ia:set("cursor", array(3, 4))
        test.cmp(ia.cursor, immutable(array(3, 4)))
        test.cmp(ia, immutable({a = 1, cursor = array(3, 4)}))
    end)
    
    test("copies", function()
        local c1 = array(1, 2)
        local c2 = array(1, 2)
        test.cmp((c1 == c1), true)
        test.cmp((c2 == c2), true)
        test.cmp((c1 == c2), false)
        
        local ia = immutable({c = c1})
        test.cmp(ia.c, immutable(c1))
        test.cmp((ia.c == c1), false)
        test.cmp((ia.c == c2), false)
        
        local ib = ia:set("x", c2)
        test.cmp(ib.x, immutable(c2))
        test.cmp((ib.x == c2), false)
        test.cmp((ib.x == c1), false)
        
        test.cmp((ib.c == ia.c), true)
        
        local ic = ib:set("y", array(array(1, 2), array(3, 4), array(5, 6)))
        
        test.cmp((ic.c == ia.c), true)
        test.cmp((ic.c == ib.c), true)
        test.cmp((ic.x == ib.x), true)
        
        test.cmp(ic.y, immutable(array(array(1, 2), array(3, 4), array(5, 6))))
        test.cmp(ic.y[1], immutable(array(1, 2)))
        test.cmp(ic.y[2], immutable(array(3, 4)))
        test.cmp(ic.y[3], immutable(array(5, 6)))
        
        local my = ic.y:mod()
        my[2] = array(9, 9)
        
        local id = ic:set("y", my)
        test.cmp(id, immutable({c = c1, x = c2, y = array(array(1, 2), array(9, 9), array(5, 6))}))
        
        test.cmp((id.y[1] == ic.y[1]), true)
        test.cmp((id.y[2] == ic.y[2]), false)
        test.cmp((id.y[3] == ic.y[3]), true)
    end)
    
    test("bypassing immutability", function()
        local arr = immutable({1, 2, 3})
        test.cmp(#arr, 0)
        test.cmp(arr, immutable({1, 2, 3}))
        test.cmp(arr[1], 1)
        test.cmp(arr[2], 2)
        test.cmp(arr[3], 3)
        test.cmp(arr[4], nil)
        
        local success = pcall(function () 
    return table.insert(arr, 4)
end)
        test.cmp(success, true)
        test.cmp(#arr, 1)
        test.cmp(arr[1], 4)
        test.cmp(arr[2], 2)
        test.cmp(arr[3], 3)
        test.cmp(arr[4], nil)
        
        success = pcall(function () 
    return table.insert(arr, 5)
end)
        test.cmp(success, true)
        test.cmp(#arr, 2)
        test.cmp(arr[1], 4)
        test.cmp(arr[2], 5)
        test.cmp(arr[3], 3)
        test.cmp(arr[4], nil)
        
        local ia = immutable({a = 1})
        success = pcall(function () 
    ia._data = {}
    return ia._data
end)
        test.cmp(success, true)
    end)
    end)