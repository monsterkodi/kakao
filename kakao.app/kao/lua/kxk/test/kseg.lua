--[[
    ███   ███   ███████  ████████   ███████       █████████  ████████   ███████  █████████  
    ███  ███   ███       ███       ███               ███     ███       ███          ███     
    ███████    ███████   ███████   ███  ████         ███     ███████   ███████      ███     
    ███  ███        ███  ███       ███   ███         ███     ███            ███     ███     
    ███   ███  ███████   ████████   ███████          ███     ████████  ███████      ███     
--]]

kxk = require "kxk/kxk"

test("kseg", function()
    test("static", function()
        test.cmp(kseg.rep(4):str(), "    ")
        test.cmp(kseg.rep(4, 'x'):str(), "xxxx")
        test.cmp(kseg.rep(2, 'xy'):str(), "xyxy")
        
        test.cmp(kseg.segiAtWidth(kseg(''), 0), 1)
        test.cmp(kseg.segiAtWidth(kseg(''), 1), 1)
        test.cmp(kseg.segiAtWidth(kseg('a'), 1), 1)
        test.cmp(kseg.segiAtWidth(kseg('a'), 2), 2)
        test.cmp(kseg.segiAtWidth(kseg('abc'), 2), 2)
        test.cmp(kseg.segiAtWidth(kseg('ab3'), 3), 3)
        test.cmp(kseg.segiAtWidth(kseg('ab3'), 4), 4)
        test.cmp(kseg.segiAtWidth(kseg('ab3'), 5), 4)
        test.cmp(kseg.segiAtWidth(kseg('ab3'), 6), 4)
        
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 0), 1)
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 1), 1)
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 2), 1)
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 3), 2)
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 4), 2)
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 5), 3)
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 6), 3)
    end)
    
    test("segls", function()
        local lines = kstr.lines [[
123
456

abc
def]]
        
        test.cmp(lines, array("123", "456", "", "abc", "def"))
        
        local segls = kseg.segls([[
323
456

abc
def]])
        
        test.cmp(segls, array(kseg("323"), kseg("456"), kseg(""), kseg("abc"), kseg("def")))
        
        test.cmp(kseg.str(segls), [[
323
456

abc
def]])
        
        test.cmp(kseg.segls([[
◆1
◆2
◆3
◆4]], "\n"), array(kseg("◆1"), kseg("◆2"), kseg("◆3"), kseg("◆4")))
    end)
    
    test("construct", function()
        local s = kseg()
        test.cmp(s:str(), "")
        test.cmp(s:len(), 0)
        
        s = kseg(" ")
        test.cmp(s:str(), " ")
        test.cmp(s:len(), 1)
        
        s = kseg("a")
        test.cmp(s:str(), "a")
        test.cmp(s:len(), 1)
        test.cmp(s:has("a"), true)
        
        s = kseg("  ")
        test.cmp(s:str(), "  ")
        
        s = kseg(kseg("xx"))
        test.cmp(s:str(), "xx")
        
        s = kseg(kseg(kseg("yy")))
        test.cmp(s:str(), "yy")
        
        local st = strg("zz")
        s = kseg(strg("zz"))
        test.cmp(s:str(), "zz")
        
        s = kseg("abc")
        local z = kseg(s)
        test.cmp(s:str(), "abc")
        test.cmp(z:str(), "abc")
        test.cmp((s == z), false)
        z:push("d")
        test.cmp(s:str(), "abc")
        test.cmp(z:str(), "abcd")
    end)
    
    test("startsWith", function()
        local s = kseg("a  b")
        test.cmp(s:startsWith("a"), true)
        test.cmp(s:startsWith("a "), true)
        test.cmp(s:startsWith("a  b"), true)
        test.cmp(s:startsWith("a  bc"), false)
        test.cmp(s:startsWith("b"), false)
        
        s = kseg("# com")
        test.cmp(s:startsWith(kseg("#")), true)
        test.cmp(s:startsWith(kseg("# ")), true)
        test.cmp(s:startsWith(kseg("# c")), true)
        test.cmp(s:startsWith(kseg(" ")), false)
        test.cmp(s:startsWith(kseg("c")), false)
        
        test.cmp(kseg.startsWith(s, kseg("#")), true)
    end)
    
    test("endsWith", function()
        local s = kseg("a  b")
        test.cmp(s:endsWith("b"), true)
        test.cmp(s:endsWith(" b"), true)
        test.cmp(s:endsWith("a  b"), true)
        test.cmp(s:endsWith(" a  b"), false)
        test.cmp(s:endsWith("a"), false)
    end)
    
    test("find", function()
        local s = kseg("a  b")
        test.cmp(s:find(" "), 2)
        test.cmp(s:find("b"), 4)
        
        test.cmp(s:has("a"), true)
        test.cmp(s:has("b"), true)
        test.cmp(s:has(" "), true)
        test.cmp(s:has("c"), false)
    end)
    
    test("indexof", function()
        local s = kseg("a  b")
        test.cmp(s:indexof("  "), 2)
        test.cmp(s:indexof(" b"), 3)
        test.cmp(s:indexof(kseg("  ")), 2)
        test.cmp(s:indexof(kseg(" b")), 3)
    end)
    
    test("rindexof", function()
        local s = kseg("a  b")
        test.cmp(s:rindexof("  "), 2)
        test.cmp(s:rindexof(" b"), 3)
        test.cmp(s:rindexof(kseg("  ")), 2)
        test.cmp(s:rindexof(kseg(" b")), 3)
        
        s = kseg("a  b  c")
        test.cmp(s:rindexof(kseg("  ")), 5)
    end)
    
    test("trim", function()
        local s = kseg("abc")
        test.cmp(s:trim(), kseg("abc"))
        
        s = kseg("abc")
        test.cmp(s:trim("ac"), kseg("b"))
        
        s = kseg("abc")
        test.cmp(s:rtrim("c"), kseg("ab"))
        
        s = kseg("abc")
        test.cmp(s:trim("c"), kseg("ab"))
        
        s = kseg("abc")
        test.cmp(s:trim("a"), kseg("bc"))
        
        s = kseg("  abc  ")
        test.cmp(s:trim(), kseg("abc"))
    end)
    
    test("pop", function()
        local s = kseg("../")
        s:pop()
        test.cmp(s:str(), "..")
        
        s = kseg("◂▸○●")
        s:pop()
        test.cmp(s:str(), "◂▸○")
        s:pop()
        test.cmp(s:str(), "◂▸")
    end)
    
    test("push", function()
        local s = kseg()
        test.cmp(#s, 0)
        s:push("●")
        test.cmp(s:str(), "●")
        test.cmp(#s, 1)
        s:push("▪")
        test.cmp(s:str(), "●▪")
        test.cmp(#s, 2)
        s:push(" ")
        test.cmp(s:str(), "●▪ ")
        test.cmp(#s, 3)
    end)
    
    test("rpad", function()
        local s = kseg("▴")
        s:rpad(2)
        test.cmp(s:str(), "▴ ")
        s:rpad(4)
        test.cmp(s:str(), "▴   ")
        s:rpad(2)
        test.cmp(s:str(), "▴   ")
    end)
    
    test("trim", function()
        local s = kseg(" ▴  ")
        s:trim()
        test.cmp(s:str(), "▴")
        
        s = kseg(" ▴  ")
        s:rtrim()
        test.cmp(s:str(), " ▴")
        
        s = kseg(" ▴  ")
        s:ltrim()
        test.cmp(s:str(), "▴  ")
        
        s = kseg("\n\n ▴  \n  \n")
        s:trim()
        test.cmp(s:str(), "▴")
    end)
    
    test("slice", function()
        local s = kseg("abc")
        test.cmp(s:slice(1):str(), "abc")
        test.cmp(s:slice(2):str(), "bc")
        test.cmp(s:slice(3):str(), "c")
        test.cmp(s:slice(4, 3):str(), "")
        test.cmp(s:slice(4, 4):str(), "")
        test.cmp(s:slice(4):str(), "")
    end)
    
    test("emojii", function()
        local s = kseg("🧑")
        test.cmp(#s, 1)
        
        s = kseg("🧑‍🌾")
        test.cmp(#s, 3)
        test.cmp(s[#s], "🌾")
        s:pop()
        s:pop()
        test.cmp(#s, 1)
        test.cmp(s:str(), "🧑")
    end)
    
    test("segiAtWidth", function()
        test.cmp(kseg.segiAtWidth(kseg("abc"), 1), 1)
        test.cmp(kseg.segiAtWidth(kseg("abc"), 2), 2)
        test.cmp(kseg.segiAtWidth(kseg("abc"), 3), 3)
        test.cmp(kseg.segiAtWidth(kseg("abc"), 4), 4)
        
        test.cmp(kseg.segiAtWidth(kseg("▸◌◂"), 1), 1)
        test.cmp(kseg.segiAtWidth(kseg("▸◌◂"), 2), 2)
        test.cmp(kseg.segiAtWidth(kseg("▸◌◂"), 3), 3)
        test.cmp(kseg.segiAtWidth(kseg("▸◌◂"), 4), 4)
        
        test.cmp(kseg.segiAtWidth("abc", 1), 1)
        test.cmp(kseg.segiAtWidth("abc", 2), 2)
        test.cmp(kseg.segiAtWidth("abc", 3), 3)
        test.cmp(kseg.segiAtWidth("abc", 4), 4)
        
        test.cmp(kseg.segiAtWidth("▸◌◂", 1), 1)
        test.cmp(kseg.segiAtWidth("▸◌◂", 2), 2)
        test.cmp(kseg.segiAtWidth("▸◌◂", 3), 3)
        test.cmp(kseg.segiAtWidth("▸◌◂", 4), 4)
        
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 1), 1)
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 2), 1)
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 3), 2)
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 4), 2)
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 5), 3)
        test.cmp(kseg.segiAtWidth(kseg('🧑🧑'), 6), 3)
    end)
    
    test("indexAtWidth", function()
        test.cmp(kseg.indexAtWidth(kseg(''), 1), 1)
        test.cmp(kseg.indexAtWidth(kseg('a'), 1), 1)
        test.cmp(kseg.indexAtWidth(kseg('a'), 2), 2)
        test.cmp(kseg.indexAtWidth(kseg('abc'), 2), 2)
        test.cmp(kseg.indexAtWidth(kseg('ab3'), 3), 3)
        test.cmp(kseg.indexAtWidth(kseg('ab3'), 4), 4)
        
        test.cmp(kseg.indexAtWidth(kseg('🧑🧑'), 1), 1)
        test.cmp(kseg.indexAtWidth(kseg('🧑🧑'), 2), 2)
        test.cmp(kseg.indexAtWidth(kseg('🧑🧑'), 3), 2)
        test.cmp(kseg.indexAtWidth(kseg('🧑🧑'), 4), 3)
        test.cmp(kseg.indexAtWidth(kseg('🧑🧑'), 5), 3)
        test.cmp(kseg.indexAtWidth(kseg('🧑🧑'), 6), 3)
        
        -- kseg.indexAtWidth kseg('🧑‍🌾🧑‍🌾')  1 ▸ 1
        -- kseg.indexAtWidth kseg('🧑‍🌾🧑‍🌾')  2 ▸ 2
        -- kseg.indexAtWidth kseg('🧑‍🌾🧑‍🌾')  3 ▸ 2
        -- kseg.indexAtWidth kseg('🧑‍🌾🧑‍🌾')  4 ▸ 3
    end)
    
    test("widthAtSegi", function()
        test.cmp(kseg.widthAtSegi("", 1), 0)
        test.cmp(kseg.widthAtSegi("a", 1), 0)
        test.cmp(kseg.widthAtSegi("a", 2), 1)
        test.cmp(kseg.widthAtSegi("a", 3), 1)
        
        test.cmp(kseg.widthAtSegi(kseg('🧑🧑'), 1), 0)
        test.cmp(kseg.widthAtSegi(kseg('🧑🧑'), 2), 2)
    end)
    
    test("eql", function()
        test.cmp((kseg("abc") == kseg("abc")), false)
        
        test.cmp(kseg("abc"):eql(kseg("abc")), true)
        
        test.cmp(kseg.eql("abc", "abc"), true)
        test.cmp(kseg.eql("abc", kseg("abc")), true)
        test.cmp(kseg.eql(kseg("abc"), "abc"), true)
    end)
    
    test("is", function()
        local a = kseg("")
        test.cmp(a:is(kseg), true)
        test.cmp(a:is(array), true)
        test.cmp(a:is(table), false)
        test.cmp(a:is(false), false)
        test.cmp(a:is(true), false)
        test.cmp(a:is(nil), false)
    end)
    
    test("count", function()
        local s = kseg("__hellooo")
        test.cmp((s[#s] == "o"), true)
        test.cmp((s:slice(#s):str() == "o"), true)
        test.cmp(kseg.tailCount(s, "o"), 3)
        test.cmp(kseg.tailCount("__hellooo", "o"), 3)
        
        test.cmp(kseg.headCount(s, "_"), 2)
        test.cmp(kseg.headCount("__hellooo", "_"), 2)
        
        test.cmp(kseg.tailCount("◂◂○○●", "●"), 1)
        test.cmp(kseg.headCount("◂◂○○●", "◂"), 2)
        
        test.cmp(kseg.tailCountWord(kseg("1  2 33")), 2)
        test.cmp(kseg.tailCountWord(kseg("x233 ")), 0)
        
        test.cmp(kseg.headCountWord(kseg("1  2 33")), 1)
        test.cmp(kseg.headCountWord(kseg("  2 33")), 0)
        test.cmp(kseg.headCountWord(kseg(".  2 33")), 0)
        test.cmp(kseg.headCountWord(kseg("x233")), 4)
        test.cmp(kseg.headCountWord(kseg("x233 ")), 4)
        
        test.cmp(kseg.tailCount(" ", ""), 0)
        test.cmp(kseg.tailCount(" ", " "), 1)
        test.cmp(kseg.tailCount("  ", " "), 2)
        
        test.cmp(kseg.tailCountChunk(kseg("a bc")), 2)
        test.cmp(kseg.tailCountChunk(kseg("a b c")), 1)
        test.cmp(kseg.tailCountChunk(kseg("a b c  ")), 0)
        test.cmp(kseg.tailCountChunk(kseg("abc  ")), 0)
        test.cmp(kseg.tailCountChunk(kseg("  ")), 0)
        
        test.cmp(kseg.headCountChunk(kseg("a bc")), 1)
        test.cmp(kseg.headCountChunk(kseg("ab c")), 2)
        test.cmp(kseg.headCountChunk(kseg(" a b c  ")), 0)
        test.cmp(kseg.headCountChunk(kseg("abc  ")), 3)
        test.cmp(kseg.headCountChunk(kseg("  ")), 0)
    end)
    
    test("detab", function()
        test.cmp(kseg.detab("a\tb"), kseg("a   b"))
        test.cmp(kseg.detab("ab\tc"), kseg("ab  c"))
        test.cmp(kseg.detab("abc\td"), kseg("abc d"))
    end)
    
    test("spanForClosestWordAtColumn", function()
        test.cmp(kseg.spanForClosestWordAtColumn(kseg('abc def'), 1), array(1, 4))
        test.cmp(kseg.spanForClosestWordAtColumn(kseg('abc def'), 2), array(1, 4))
        test.cmp(kseg.spanForClosestWordAtColumn(kseg('abc def'), 3), array(1, 4))
        test.cmp(kseg.spanForClosestWordAtColumn(kseg('abc def'), 4), array(1, 4))
        test.cmp(kseg.spanForClosestWordAtColumn(kseg('ab  def'), 3), array(1, 3))
        test.cmp(kseg.spanForClosestWordAtColumn(kseg('ab  def'), 4), array(1, 3))
        test.cmp(kseg.spanForClosestWordAtColumn(kseg('ab  def'), 5), array(5, 8))
        
        test.cmp(kseg.spanForClosestWordAtColumn(kseg('     '), 1), array(1, 1))
        test.cmp(kseg.spanForClosestWordAtColumn(kseg('     '), 2), array(2, 2))
        test.cmp(kseg.spanForClosestWordAtColumn(kseg('     '), 3), array(3, 3))
        
        test.cmp(kseg.spanForClosestWordAtColumn(kseg('   xy'), 2), array(4, 6))
        test.cmp(kseg.spanForClosestWordAtColumn(kseg('xy   '), 3), array(1, 3))
        
        test.cmp(kseg.spanForClosestWordAtColumn("   aa123   ", 1), array(4, 9))
    end)
    
    test("words", function()
        test.cmp(kseg.words("b+=1"), array({word = "b", index = 1, segl = kseg("b")}, {word = "1", index = 4, segl = kseg("1")}))
    end)
    
    test("chunks", function()
        test.cmp(kseg.chunks("a+=1"), array({chunk = "a+=1", index = 1, segl = kseg("a+=1")}))
    end)
    end)