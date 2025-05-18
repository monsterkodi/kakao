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