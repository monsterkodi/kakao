--[[
     ███████  ███████     ███████           █████████  ████████   ███████  █████████  
    ███       ███   ███  ███                   ███     ███       ███          ███     
    ███████   ███   ███  ███████               ███     ███████   ███████      ███     
         ███  ███   ███       ███              ███     ███            ███     ███     
    ███████   ███████    ███████               ███     ████████  ███████      ███     
--]]

kxk = require "kxk/kxk"

test("sds", function()
    test("get", function()
        local o = {a = 1, b = 2, c = 3}
        test.cmp(sds.get(o, 'a'), 1)
        test.cmp(sds.get(o, 'b'), 2)
        test.cmp(sds.get(o, 'c'), 3)
        test.cmp(sds.get(o, 'd'), nil)
        
        local a = array(1, 2, 3)
        test.cmp(sds.get(a, "1"), 1)
        test.cmp(sds.get(a, "2"), 2)
        test.cmp(sds.get(a, "3"), 3)
        test.cmp(sds.get(a, "4"), nil)
        
        o = {a = {b = {c = 3}}}
        
        test.cmp(sds.get(o, 'a'), {b = {c = 3}})
        test.cmp(sds.get(o, 'a▸b'), {c = 3})
        test.cmp(sds.get(o, 'a▸b▸c'), 3)
    end)
    
    test("set", function()
        local o = {a = 1, b = 2, c = 3}
        test.cmp(sds.set(o, 'a', 4), {a = 4, b = 2, c = 3})
        test.cmp(sds.set(o, 'b', 5), {a = 4, b = 5, c = 3})
        test.cmp(sds.set(o, 'c', 6), {a = 4, b = 5, c = 6})
        test.cmp(sds.set(o, 'd', 7), {a = 4, b = 5, c = 6, d = 7})
        
        local a = array(1, 2, 3)
        test.cmp(sds.set(a, "1", 4), array(4, 2, 3))
        test.cmp(sds.set(a, "2", 5), array(4, 5, 3))
        test.cmp(sds.set(a, "3", 6), array(4, 5, 6))
        test.cmp(sds.set(a, "4", 7), array(4, 5, 6, 7))
        
        o = {a = {b = {c = 3}}}
        
        test.cmp(sds.set(o, 'a▸b▸c', 4), {a = {b = {c = 4}}})
        test.cmp(sds.set(o, 'd', 5), {a = {b = {c = 4}}, d = 5})
    end)
    
    test("del", function()
        local o = {a = {b = {c = 3}}}
        
        test.cmp(sds.del(o, 'a▸b▸c'), {a = {b = {}}})
        test.cmp(dict.size(o), 1)
        test.cmp(dict.keys(o), array('a'))
        test.cmp(sds.get(o, 'a'), {b = {c = nil}})
        test.cmp(sds.get(o, 'a▸b'), {c = nil})
        test.cmp(dict.size(sds.get(o, 'a▸b')), 0)
        
        o = {a = {b = {c = 4}}, d = 5}
        test.cmp(sds.del(o, 'a'), {d = 5})
        test.cmp(dict.size(o), 1)
        test.cmp(dict.keys(o), array('d'))
    end)
    end)