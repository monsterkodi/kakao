kxk = require "../kxk"


local A = class("A")
    A.a = 0


function A:init(a, b) 
        self.a = a
        self.b = b
        return self
    end

local a = A(1, 2)


local FunInc = class("FunInc")
    FunInc.m = 0


function FunInc:__tostring() return "FunInc " .. self.m
    end

function FunInc:fun(m) 
        self.m = m
    end


function FunInc:inc(a1) 
        self:fun((self.m + a1))
        print(self)
    end

local f = FunInc()

print(f)
f:inc(2)
f:inc(2)


local Print = class("Print")
    Print.m = "hello"


function Print:__tostring() return self.m
    end

local p = Print()
print(p)
p.m = "howdy"
print(p)

test("class", function()
    test("fail", function()
        test.cmp(2, 1)
    end)
    
    test("simple", function()
        test.cmp(1, 1)
    end)
    end)