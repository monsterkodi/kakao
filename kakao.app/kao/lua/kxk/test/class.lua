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
        return self.m
    end


function FunInc:inc(a1) 
        self:fun((self.m + a1))
        return print(self)
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

local files1 = slash.files(".")
print(table.concat(files1, " "))
local files2 = slash.files("..")
print(table.concat(files2, " "))
local files3 = slash.files("/Users/kodi")
print(table.concat(files3, " "))
local files4 = slash.files("/Users/kodi/.config")
print(table.concat(files4, " "))

-- files5 = slash.walk "/Users/kodi"
-- log inspect(files5)
test("slash", function()
    test("normalize", function()
          test.cmp(slash.normalize("a/"), "a")
          test.cmp(slash.normalize("xyz"), "xyz")
          test.cmp(slash.normalize("x/y/z"), "x/y/z")
          test.cmp(slash.normalize("x\\y/z\\"), "x/y/z")
          test.cmp(slash.normalize("\\x\\y/z"), "/x/y/z")
          test.cmp(slash.normalize("..\\x\\y/z"), "../x/y/z")
          test.cmp(slash.normalize("./x\\y/z"), "./x/y/z")
          test.cmp(slash.normalize("x/./z"), "x/z")
          test.cmp(slash.normalize("x/../z"), "z")
          test.cmp(slash.normalize("./x/y/z/../../a"), "./x/a")
          test.cmp(slash.normalize("../up"), "../up")
          test.cmp(slash.normalize("//"), "/")
          test.cmp(slash.normalize("//././////././"), "/")
          test.cmp(slash.normalize("./x/../../z"), "../z")
          test.cmp(slash.normalize("./x/../../../y"), "../../y")
    end)
    end)

local s = "a/abc/ed.x"
print(s)
print(kstr.splice(s, 1, 1))
print(kstr.splice(s, 2, 1))
print(kstr.splice(s, -1, 1))
print(kstr.splice(s, -2, 1))
print(kstr.splice(s, -3, 1))
print(kstr.shift(s, 2))
print(kstr.pop(s, 2))

print(string.sub(s, 0, 1))
print(string.sub(s, 1, 1))
print(string.sub(s, 2, 2))

for i in iter(4, 0) do print(i) end
for i in iter(0, 4) do print(i) end
for i in iter(4, -4) do print(i) end
for i in iter(-4, 4) do print(i) end

for i in iter(4, 0, 2) do print(i) end
for i in iter(0, 4, 2) do print(i) end
for i in iter(4, -4, 2) do print(i) end
for i in iter(-4, 4, 2) do print(i) end
for i in iter(4, 0, -2) do print(i) end
for i in iter(0, 4, -2) do print(i) end
for i in iter(4, -4, -2) do print(i) end
for i in iter(-4, 4, -2) do print(i) end
print("---")
for i in iter(-4, 4, 0) do print(i) end
for i in iter(2, 2, -100) do print(i) end
for i in iter(2, 0, -100) do print(i) end
for i in iter(2, -3, -100) do print(i) end
for i in iter(1, 2, 100) do print(i) end
for i in iter(1, 0, 100) do print(i) end
for i in iter(1, -3, 100) do print(i) end

for i in iter((2 / 3), (1 / 3), 0.1) do print(i) end
for i in iter((2 / 3), (2 / 3), 1.001) do print(i) end
for i in iter((0.1 + 0.2), 0.3, 0.1) do print(i) end

for i in iter(0, 3) do print(i) end
print("")
for i = 0, 3-1 do print(i) end
print("")
for i = 0, 3-1 do print(i) end
print("")
for i in iter(3, 0) do print(i) end