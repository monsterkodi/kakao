class = require "../class"
kxk = require "../kxk"

local A = class("A")
A.static.bling = 'plink'


function A:init(a) self.a = a
end

function A:print() print("INSTANCE", self.class.name, self.a, self.b, self.c)
end

function A:deng() print('base')
end

local B = class("B", A)
B.static.bling = 'blink'


function B:init(b) 
    A.init(self, 42)
    self.b = b
end


function B:deng() 
    print('blurk')
end

local C = class("C", B)

function C:init(c) 
    B.init(self, 77)
    self.c = c
end


function C:deng() 
    print(self.class.bling)
    self.class.super.deng(self)
    self.class.super.super.deng(self)
end

a = A:new(1)
b = B:new(2)
c = C:new(3)

a:print()
b:print()
c:print()

print(c)
print(c.class.super)
print(c.class.super.super)
print(c:isOf(A))
print(c:isOf(B))
print(c:isOf(C))

print(C:extends(A))
print(C:extends(B))
print(C:extends(C))

c:deng()