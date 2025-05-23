kxk = require "kxk/kxk"

test("array", function()
    test("shift", function()
        local a = {1, 2, 3}
        local x = array.shift(a)
        test.cmp(a, {2, 3})
        test.cmp(x, 1)
        x = array.shift(a)
        test.cmp(a, {3})
        test.cmp(x, 2)
        x = array.shift(a)
        test.cmp(a, {})
        test.cmp(x, 3)
        x = array.shift(a)
        test.cmp(a, {})
        test.cmp(x, nil)
    end)
    end)

--for i in iter(4 0)   ➜ log i
--for i in iter(0 4)   ➜ log i
--for i in iter(4,-4)  ➜ log i
--for i in iter(-4 4)  ➜ log i

--for i in iter(4 0 2)  ➜ log i
--for i in iter(0 4 2)  ➜ log i
--for i in iter(4,-4 2) ➜ log i
--for i in iter(-4 4 2) ➜ log i
--for i in iter(4 0,  -2) ➜ log i
--for i in iter(0 4,  -2) ➜ log i
--for i in iter(4,-4, -2) ➜ log i
--for i in iter(-4 4, -2) ➜ log i

--for i in iter(-4 4, 0) ➜ log i
--for i in iter(2 2, -100)  ➜ log i
--for i in iter(2 0, -100)  ➜ log i
--for i in iter(2,-3, -100)  ➜ log i
--for i in iter(1 2,  100)  ➜ log i
--for i in iter(1 0,  100)  ➜ log i
--for i in iter(1, -3,  100)  ➜ log i

--for i in iter(2/3, 1/3, 0.1) ➜ log i
--for i in iter(2/3, 2/3, 1.001) ➜ log i
--for i in iter(0.1+0.2, 0.3, 0.1) ➜ log i

--for i in 0..3  ➜ log i
--for i in 0...3 ➜ log i
--for i in 0..<3 ➜ log i
--for i in 3..0 ➜ log i