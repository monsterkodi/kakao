kxk = require "kxk/kxk"


local A = class("A")
    A.a = 0


function A:init(a, b) 
        self.a = a
        self.b = b
        return self
    end


local FunInc = class("FunInc")
    FunInc.m = 0


function FunInc:fun(m) 
        self.m = m
        return self.m
    end


function FunInc:inc(a1) 
        return self:fun((self.m + a1))
    end


local Print = class("Print")
    Print.m = "hello"


function Print:__tostring() 
    return self.m
    end

test("class", function()
    test("simple", function()
        local a = A(1, 2)
        test.cmp(a.a, 1)
        test.cmp(a.b, 2)
    end)
    
    test("inc    ", function()
        local f = FunInc()
        f:inc(2)
        f:inc(2)
        
        test.cmp(f.m, 4)
    end)
    
    test("prnt", function()
        local p = Print()
        test.cmp(string.format("%s", p), "hello")
        p.m = "howdy"
        test.cmp(string.format("%s", p), "howdy")
    end)
    
    test("is", function()
        local f = FunInc()
        local p = Print()
        test.cmp(type(f), "table")
        test.cmp(tostring(f), "instance of class FunInc")
        test.cmp(f.class.name, "FunInc")
        test.cmp(type(f.is), "function")
        
        local a = array()
        test.cmp(is(a, "table"), true)
        test.cmp(is(a, array()), true)
        test.cmp(is(a, array), true)
        test.cmp(is(a, "string"), false)
        
        local d = {}
        test.cmp(is(d, "table"), true)
        test.cmp(is(d, {}), true)
        test.cmp(is(d, "string"), false)
        test.cmp(is(d, array), false)
        
        test.cmp(f:is(FunInc), true)
        test.cmp(f:is(Print), false)
        test.cmp(p:is(Print), true)
        test.cmp(p:is(FunInc), false)
        
        test.cmp(_G.is(nil, nil), true)
        test.cmp(_G.is(1, 2), true)
        test.cmp(_G.is("", ""), true)
        test.cmp(_G.is("a", "z"), true)
        test.cmp(_G.is(f, FunInc), true)
        test.cmp(_G.is(f, Print), false)
        test.cmp(_G.is(nil, ""), false)
        test.cmp(_G.is("", nil), false)
        test.cmp(_G.is("a", 1), false)
        test.cmp(_G.is(1, "a"), false)
        test.cmp(_G.is(nil, 0), false)
        test.cmp(_G.is(0, nil), false)
        
        test.cmp(is(nil, nil), true)
        test.cmp(is(1, 2), true)
        test.cmp(is("", ""), true)
        test.cmp(is("a", "z"), true)
        test.cmp(is(f, FunInc), true)
        test.cmp(is(f, Print), false)
        test.cmp(is(nil, ""), false)
        test.cmp(is("", nil), false)
        test.cmp(is("a", 1), false)
        test.cmp(is(1, "a"), false)
        test.cmp(is(nil, 0), false)
        test.cmp(is(0, nil), false)
    end)
    end)