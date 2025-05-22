kxk = require "../kxk"

--class A
--    a: 0
--    @: a b ->
--        @a = a
--        @b = b
--        
--a = A(1 2)
--
--class FunInc
--    m: 0
--    $: -> "FunInc " & @m
--    fun: m -> 
--        @m = m
--    inc: a1 ->
--        @fun @m + a1
--        log @
--        
--f = FunInc()
--
--log f
--f:inc 2
--f:inc 2
--
--class Print
--    m: "hello"
--    $: -> @m
--
--p = Print()
--log p
--p.m = "howdy"
--log p
--
--▸ class
--    ▸ fail
--        2 ▸ 1
--    ▸ simple
--        1 ▸ 1

-- files1 = slash.files "."
-- log table.concat(files1 " ")
-- files2 = slash.files ".."
-- log array.str files2
-- files3 = slash.files "/Users/kodi"
-- log table.concat(files3 " ")
-- files4 = slash.files "/Users/kodi/.config"
-- log table.concat(files4 " ")

-- files5 = slash.walk "/Users/kodi"
-- log inspect(files5)

test("slash", function()
   test("normalize", function()
         test.cmp(slash.normalize("a/"), "a")
         test.cmp(slash.normalize("/Users/kodi/kao/lua/../kua/test"), "/Users/kodi/kao/kua/test")
         test.cmp(slash.normalize("xyz"), "xyz")
         test.cmp(slash.normalize("x/y/z"), "x/y/z")
         test.cmp(slash.normalize("x\\y/z\\"), "x/y/z")
         test.cmp(slash.normalize("\\x\\y/z"), "/x/y/z")
         test.cmp(slash.normalize("..\\x\\y/z"), "../x/y/z")
         test.cmp(slash.normalize("./x\\y/z"), "./x/y/z")
         test.cmp(slash.normalize("x/./z"), "x/z")
         test.cmp(slash.normalize("../up"), "../up")
         test.cmp(slash.normalize("//"), "/")
         test.cmp(slash.normalize("//././////././"), "/")
         
         test.cmp(slash.normalize("x/../z"), "z")
         test.cmp(slash.normalize("./x/y/z/../../a"), "./x/a")
         test.cmp(slash.normalize("./x/../../z"), "../z")
         test.cmp(slash.normalize("./x/../../../y"), "../../y")
    end)
    end)

--s = "a/abc/ed.x"
--log s
--log kstr.splice(s 1 1)
--log kstr.splice(s 2 1)
--log kstr.splice(s, -1 1)
--log kstr.splice(s, -2 1)
--log kstr.splice(s, -3 1)
--log kstr.shift(s 2)
--log kstr.pop(s 2)
--
--log string.sub(s 0 1)
--log string.sub(s 1 1)
--log string.sub(s 2 2)
--
--for i in iter(4 0)   ➜ log i
--for i in iter(0 4)   ➜ log i
--for i in iter(4,-4)  ➜ log i
--for i in iter(-4 4)  ➜ log i
--
--for i in iter(4 0 2)  ➜ log i
--for i in iter(0 4 2)  ➜ log i
--for i in iter(4,-4 2) ➜ log i
--for i in iter(-4 4 2) ➜ log i
--for i in iter(4 0,  -2) ➜ log i
--for i in iter(0 4,  -2) ➜ log i
--for i in iter(4,-4, -2) ➜ log i
--for i in iter(-4 4, -2) ➜ log i
--log "---"
--for i in iter(-4 4, 0) ➜ log i
--for i in iter(2 2, -100)  ➜ log i
--for i in iter(2 0, -100)  ➜ log i
--for i in iter(2,-3, -100)  ➜ log i
--for i in iter(1 2,  100)  ➜ log i
--for i in iter(1 0,  100)  ➜ log i
--for i in iter(1, -3,  100)  ➜ log i
--
--for i in iter(2/3, 1/3, 0.1) ➜ log i
--for i in iter(2/3, 2/3, 1.001) ➜ log i
--for i in iter(0.1+0.2, 0.3, 0.1) ➜ log i
--
--for i in 0..3  ➜ log i
--log ""
--for i in 0...3 ➜ log i
--log ""
--for i in 0..<3 ➜ log i
--log ""
--for i in 3..0 ➜ log i