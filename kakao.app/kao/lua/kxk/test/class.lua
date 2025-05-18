class = require "../class"
kxk = require "../kxk"

local A = class("A")
A.static.bling = 'plink'
A.mem = 2

print("A.proto", inspect(A.__proto))


function A:init(a) self.a = a
end

function A:print() print("INSTANCE", self.class.name, self.a, self.b, self.c, self.mem)
end

function A:deng() print('base')
end

local B = class("B", A)
B.static.bling = 'blink'

print("B.proto", inspect(B.__proto))

B.mem = 3

print("B.proto", inspect(B.__proto))


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
    print(self.mem)
    self.class.super.deng(self)
    self.class.super.super.deng(self)
end

a = A(1)
b = B(2)
c = C(3)
local d = C(4)

a:print()
b:print()
c:print()
d:print()
-- log c
-- log c.class.super
-- log c.class.super.super
-- log c:isOf(A)
-- log c:isOf(B)
-- log c:isOf(C)
-- log C:extends(A)
-- log C:extends(B)
-- log C:extends(C)

c.mem = 42
d:print()
d.mem = 64
d:print()
d.mem = nil

a:print()
b:print()
c:print()
d:print()

-- log "a.__members" inspect(a.class.__members)
-- log "b.__members" inspect(b.class.__members)
-- log "c.__members" inspect(c.class.__members)