kxk = require "kxk/kxk"

test("dict", function()
    test("size", function()
        local d = {a = 1, b = 2}
        test.cmp(dict.size(d), 2)
        
        local a = array(1, 2, 3)
        test.cmp(dict.size(a), 0)
        test.cmp(a:len(), 3)
        
        local i = immutable(a)
        test.cmp(dict.size(i), 0)
        test.cmp(i:len(), 3)
        
        test.cmp(dict.size(post), 1)
    end)
    
    test("isdict", function()
        test.cmp(dict.isdict({a = 1, b = 2}), true)
        test.cmp(dict.isdict({["1"] = 2}), true)
        test.cmp(dict.isdict({a, b}), false)
        test.cmp(dict.isdict({}), false)
    end)
    
    test("iskey", function()
        
        function f() 
    
        end
        
        test.cmp(dict.iskey("a"), true)
        test.cmp(dict.iskey("_a"), true)
        test.cmp(dict.iskey("__x"), false)
        test.cmp(dict.iskey("class"), false)
        test.cmp(dict.iskey(f), false)
        test.cmp(dict.iskey(array()), false)
    end)
    
    test("iter", function()
        local k = kseg("abc")
        for k, v in dict.iter(k) do 
            if (k == 1) then test.cmp(v, "a")
            elseif (k == 2) then test.cmp(v, "b")
            elseif (k == 3) then test.cmp(v, "c")
            end
        end
    end)
    
    test("keys", function()
        local d = {a = 1, b = 2}
        local k = dict.keys(d)
        k:sort()
        test.cmp(k, array("a", "b"))
    end)
    
    test("values", function()
        local d = {a = 1, b = 2}
        local v = dict.values(d)
        v:sort()
        test.cmp(v, array(1, 2))
    end)
    
    test("str", function()
        local d = {a = 1, b = 2}
        test.cmp(dict.str(d), [[
a   1
b   2]])
    end)
    end)