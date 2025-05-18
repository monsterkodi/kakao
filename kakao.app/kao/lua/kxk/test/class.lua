class = require "../class"
kxk = require "../kxk"


local A = class("A")
    A.a = 0


function A:init(a, b) 
        self.a = a
        self.b = b
        return self
    end

local a = A(1, 2)
print(inspect(a))


local FunInc = class("FunInc")
    FunInc.m = 1


function FunInc:fun(m) 
        self.m = m
    end


function FunInc:inc(a1) 
        self:fun((self.m + 1))
    end

local f = FunInc()
print(inspect(f))
print(f.m)