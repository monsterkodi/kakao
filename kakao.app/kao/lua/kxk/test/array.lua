--[[
     ███████   ████████   ████████    ███████   ███   ███       █████████  ████████   ███████  █████████  
    ███   ███  ███   ███  ███   ███  ███   ███   ███ ███           ███     ███       ███          ███     
    █████████  ███████    ███████    █████████    █████            ███     ███████   ███████      ███     
    ███   ███  ███   ███  ███   ███  ███   ███     ███             ███     ███            ███     ███     
    ███   ███  ███   ███  ███   ███  ███   ███     ███             ███     ████████  ███████      ███     
--]]

kxk = require "kxk/kxk"

test("array", function()
    test("from", function()
        test.cmp(array.from({1, 2, 3}), array(1, 2, 3))
        test.cmp(type(array.from({1, 2, 3})), "table")
        test.cmp(array.from({1, 2, 3}):str(), ".\n    1    1\n    2    2\n    3    3")
        
        local a = array(1, 2, 3)
        local b = array.from(a)
        b:push(4)
        test.cmp(b, array(1, 2, 3, 4))
        test.cmp(a, array(1, 2, 3))
    end)
    
    test("map", function()
        local s = {"huga", "dork", "farz"}
        s = array(unpack(s))
        local m = s:map(function (s) 
    return "▸" .. s
end)
        test.cmp(m, array("▸huga", "▸dork", "▸farz"))
        m = s:map(function (s) 
    return 1
end)
        test.cmp(m, array(1, 1, 1))
    end)
    
    test("filter", function()
        local s = array("huga", "dork", "farz")
        local f = s:filter(function (s) 
    return (kstr.find(s, "a") > 0)
end)
        test.cmp(f, array("huga", "farz"))
    end)
    
    test("slice", function()
        local a = array(1, 2, 3, 4, 5)
        local s = a:slice(1, 2)
        test.cmp(s, array(1, 2))
        s = a:slice(1, 1)
        test.cmp(s, array(1))
        s = a:slice(3)
        test.cmp(s, array(3, 4, 5))
        s = a:slice(2, 4)
        test.cmp(s, array(2, 3, 4))
        s = a:slice(2, 5)
        test.cmp(s, array(2, 3, 4, 5))
        s = a:slice(2, 60)
        test.cmp(s, array(2, 3, 4, 5))
        s = a:slice(-20, 3)
        test.cmp(s, array(1, 2, 3))
        
        s = a:slice(6)
        test.cmp(s, array())
        s = a:slice(5, 1)
        test.cmp(s, array())
        s = a:slice(4, 2)
        test.cmp(s, array())
        s = a:slice(20)
        test.cmp(s, array())
        s = a:slice(0, 0)
        test.cmp(s, array())
    end)
    
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
    
    test("unshift ", function()
        local a = array(0)
        local x = a:unshift(1, 2, 3)
        test.cmp(a, array(1, 2, 3, 0))
        test.cmp(x, a)
        x = a:unshift(array(4, 5, 6))
        test.cmp(a, array(array(4, 5, 6), 1, 2, 3, 0))
        test.cmp(x, a)
    end)
    
    test("concat", function()
        local a = array(1)
        local b = array(2)
        local c = (a + b)
        test.cmp(a, array(1))
        test.cmp(b, array(2))
        test.cmp(c, array(1, 2))
    end)
    
    test("splice", function()
        local a = array()
        a:splice(1, 0, "a")
        test.cmp(a, array("a"))
        a:splice(1, 0, "b")
        test.cmp(a, array("b", "a"))
        a:splice(1, 1, "_")
        test.cmp(a, array("_", "a"))
        a:splice(1, 2, "▸◂")
        test.cmp(a, array("▸◂"))
        a:splice(2, 0, "∙", "◌")
        test.cmp(a, array("▸◂", "∙", "◌"))
    end)
    
    test("rnd", function()
        local e = array(1, 2, 3)
        test.cmp(e:has(e:rnd()), true)
    end)
    
    test("swap", function()
        local e = array(1, 2, 3)
        e:swap(1, 3)
        test.cmp(e, array(3, 2, 1))
        e:swap(1, 6)
        test.cmp(e, array(3, 2, 1))
    end)
    
    test("each", function()
        local e = array(1, 2, 3)
        local c = 1
        for i in e:each() do 
            test.cmp(e[c], i)
            c = c + 1
        end
        
        for i, idx in e:each() do 
            test.cmp(e[i], idx)
        end
        
        e = array()
        for i in e:each() do 
            test.cmp(false, true)
        end
    end)
    
    test("join", function()
        local e = array("a", 1, "cd")
        test.cmp(e:join(), "a1cd")
        test.cmp(e:join(" "), "a 1 cd")
        test.cmp(e:join("●∙"), "a●∙1●∙cd")
    end)
    
    test("indexdict", function()
        local a = array(3, 2, 1)
        test.cmp(a:indexdict(), {3, 2, 1})
        
        a = array("3", "2", "1")
        test.cmp(a:indexdict(), {["1"] = 3, ["2"] = 2, ["3"] = 1})
    end)
    
    test("keydict", function()
        local a = array({k = "1"}, {k = "2"}, {k = "3"})
        test.cmp(a:keydict("k"), {["1"] = {k = "1"}, ["2"] = {k = "2"}, ["3"] = {k = "3"}})
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
    
    test("is", function()
        local a = array()
        test.cmp(a:is(array), true)
        test.cmp(a:is(table), false)
        test.cmp(a:is(false), false)
        test.cmp(a:is(true), false)
        test.cmp(a:is(nil), false)
    end)
    
    test("iter", function()
        local a = array()
        for i in iter(4, 0) do a:push(i) end
        test.cmp(a, array(4, 3, 2, 1, 0))
        
        a = array()
        for i in iter(-4, 4, 2) do a:push(i) end
        test.cmp(a, array(-4, -2, 0, 2, 4))
        
        a = array()
        for i in iter(4, -4, -2) do a:push(i) end
        test.cmp(a, array(4, 2, 0, -2, -4))
        
        a = array()
        for i in iter(4, -4, 2) do a:push(i) end
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