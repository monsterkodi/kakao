kxk = require "../kxk"


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
    end)