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
        
        -- _G.is nil nil   ▸ true
        -- _G.is 1     2   ▸ true
        -- _G.is ""   ""   ▸ true
        -- _G.is "a" "z"   ▸ true
        -- _G.is f FunInc  ▸ true
        -- _G.is f Print   ▸ false
        -- _G.is nil  ""   ▸ false
        -- _G.is ""  nil   ▸ false
        -- _G.is "a"   1   ▸ false
        -- _G.is 1   "a"   ▸ false
        -- _G.is nil   0   ▸ false
        -- _G.is 0   nil   ▸ false
        
        -- nil is nil      ▸ true
        -- 1   is   2      ▸ true
        -- ""  is  ""      ▸ true
        -- "a" is "z"      ▸ true
        -- f   is  FunInc  ▸ true
        -- f   is  Print   ▸ false
        -- nil is   ""     ▸ false
        -- ""  is  nil     ▸ false
        -- "a" is   1      ▸ false
        -- 1   is "a"      ▸ false
        -- nil is   0      ▸ false
        -- 0   is nil      ▸ false
    end)
    end)