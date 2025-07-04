# ████████   ███      ███   ███   ███████ 
# ███   ███  ███      ███   ███  ███   ███
# ███████    ███      ███   ███  █████████
# ███   ███  ███      ███   ███  ███   ███
# ███   ███  ███████   ███████   ███   ███
import ../rlua
import ../kxk/kxk

template t(a:string, b:string) = testCmp(a, renderLua(a, false), b, instantiationInfo())

template v(a:string, b:string) = testCmp(a, renderLua(a, true),  b, instantiationInfo())
suite "rlua": 
    test "toplevel": 
        t("", "")
        t("43", "43")
        t("true", "true")
        t("false", "false")
        t("\"hello\"", "\"hello\"")
        t("# comment", "-- comment")
        t("\n\n# comment\n\n", "-- comment")
    test "math ops                                      ": 
        t("1 + 5 * 3", "(1 + (5 * 3))")
        t("1 / 5 - 3", "((1 / 5) - 3)")
        t("-5 - -3", "(-5 - -3)")
        t("a++ + b--", "(a++ + b--)")
        t("1 + 2 + 3", "((1 + 2) + 3)")
        t("1 * 2 + 3 * 4", "((1 * 2) + (3 * 4))")
        t("-1 + -2", "(-1 + -2)")
    test "boolean ops                                   ": 
        t("a && b || c", "((a and b) or c)")
        t("a and b or c", "((a and b) or c)")
        t("!a && b", "(not a and b)")
        t("not a && b", "(not a and b)")
        t("a || b && c", "(a or (b and c))")
        t("a or b and c", "(a or (b and c))")
        t("a && b == c", "(a and (b == c))")
        t("a and b == c", "(a and (b == c))")
        t("x = a || b", "x = (a or b)")
        t("x = a or b", "x = (a or b)")
        t("!a || !b", "(not a or not b)")
        t("not a or not b", "(not a or not b)")
    test "comparison ops": 
        t("a != b", "(a ~= b)")
        t("a is 1", "is(a, 1)")
    test "assignment": 
        t("a += 1", "a = a + 1")
        t("a -= 1", "a = a - 1")
        t("a /= 1", "a = a / 1")
        t("a *= 1", "a = a * 1")
        t("a ?= 1", "a = a or 1")
    test "ampersand                                     ": 
       t("a & b", "a .. b")
    test "parens                                        ": 
        t("(1 + 2) * 3", "((1 + 2) * 3)")
        t("(1)", "1")
        t("(a + b) * c", "((a + b) * c)")
        t("a * (b + c)", "(a * (b + c))")
        t("((1))", "1")
        t("(a.b).c", "a.b.c")
        t("a * (b + c) / d", "((a * (b + c)) / d)")
        t("3 * (1 + 2)", "(3 * (1 + 2))")
    test "func": 
        t("f = ->", "\nfunction f()\nend")
        t("Inspector:getId = v ->", "\nfunction Inspector:getId(v)\nend")
    test "return": 
        v("f = -> 1", "\nfunction f() \n    return 1\nend")
    test "default arg": 
        # v "f = a=1 ->"                                "\nfunction f(a) \n    a = a or 1\n    \n    return a\nend"
        v("f = a=1 -> 2", "\nfunction f(a) \n    a = a or 1\n    \n    return 2\nend")
        v("f = (a b=1 c='' d=nil) -> urgs", """

function f(a, b, c, d) 
    b = b or 1
    c = c or ''
    d = d or nil
    
    return urgs
end""")
    test "call": 
        t("f()", "f()")
        t("f(g())", "f(g())")
        t("f(g() / h())", "f((g() / h()))")
        t("f(1)", "f(1)")
        t("f(1 + 2)", "f((1 + 2))")
        t("f(1 + 2 4 + 5)", "f((1 + 2), (4 + 5))")
        t("f(1 2 3)", "f(1, 2, 3)")
        t("f(1 g(h(2)))", "f(1, g(h(2)))")
        t("log a", "print(a)")
        t("array('/', '~'):contains('')", "array('/', '~'):contains('')")
    test "arglist": 
        t("f(a, b, c)", "f(a, b, c)")
        t("g a, b, c", "g(a, b, c)")
        t("h a b c", "h(a, b, c)")
        t("i 1 '2' false", "i(1, '2', false)")
        t("t \"a\" , \"b\"", "t(\"a\", \"b\")")
        t("t \"a\",\n  \"b\"", "t(\"a\", \"b\")")
        t("t \"a\"\n  \"b\"", "t(\"a\", \"b\")")
    test "list assign": 
        t("(a, b) = c", "a, b = c")
        t("(a b) = c", "a, b = c")
        t("(a, b, c) = f()", "a, b, c = f()")
        t("(a b c) = f()", "a, b, c = f()")
        t("(a b c) = (c b a)", "a, b, c = c, b, a")
    test "assign": 
        t("a = 1", "a = 1")
        t("a = b = 1", "a = b = 1")
        t("a = b = c = 2", "a = b = c = 2")
        t("""
a = 1
# comment
b = false
""", """
a = 1
-- comment
b = false""")
        t("(a b) = (c d)", "a, b = c, d")
        v("(ida idb) = (id id)", "local ida, idb = id, id")
        v("(ids[v] ids[tv]) = (id id)", "ids[v], ids[tv] = id, id")
    test "arrays": 
        t("a = [ 1  2 ]", "a = array(1, 2)")
        t("a = [\n    1\n    2\n    ]", "a = array(1, 2)")
        t("a = [ 1-2 ]", "a = array((1 - 2))")
        t("a = [ 1 - 2 ]", "a = array((1 - 2))")
        t("a = [ 1 -2 ]", "a = array(1, -2)")
    test "array access": 
        t("s[^1]", "s[#s]")
        t("s[^2]", "s[#s+1-2]")
    test "properties        ": 
        t("a.b", "a.b")
        t("a.b.c", "a.b.c")
        t("a.b()", "a.b()")
        t("a.b().c", "a.b().c")
    test "use                                           ": 
        t("use std", "std = require \"std\"")
        t("use ./rndr", "rndr = require \"./rndr\"")
        t("use ../rndr", "rndr = require \"../rndr\"")
        t("use ../../rel", "rel = require \"../../rel\"")
        t("use a b c", "a = require \"a\"\nb = require \"b\"\nc = require \"c\"")
        t("⮐  require('./init')( (...) -> )", "return require('./init')(function (...) end)")
        t("use kxk.array", "array = require \"kxk.array\"")
    test "if                                            ": 
        t("if true then ⮐  false", "if true then return false end")
        t("if true then ⮐  1 else ⮐  2", "if true then return 1 else return 2 end")
        t("if a ➜ 1 elif b ➜ 2 elif c ➜ 3", "if a then 1 elseif b then 2 elseif c then 3 end")
        t("if a ➜ 1 elif b ➜ 2 elif c ➜ 3 else 4", "if a then 1 elseif b then 2 elseif c then 3 else 4 end")
        t("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3", "if a then 1\nelseif b then 2\nelseif c then 3\nend")
        t("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3\n  ➜ 4", "if a then 1\nelseif b then 2\nelseif c then 3\nelse 4\nend")
        t("if a then if b then 1 else 2 else 3", "if a then if b then 1 else 2 end else 3 end")
        t("x = if a then b else c", "x = if a then b else c end")
        t("x = if a then b else c+d", "x = if a then b else (c + d) end")
        t("if a then ⮐", "if a then return end")
        t("if true ➜ log msg", "if true then print(msg) end")
        t("if true ➜\n  log msg", "if true then \n  print(msg)\nend")
        t("if true\n  log msg", "if true then \n  print(msg)\nend")
        t("if true\n  log msg\n  log msg", "if true then \n  print(msg)\n  print(msg)\nend")
        t("""
if 
    a ➜ nil
    b ➜ 1
    ➜ 2
""", """
if a then nil
elseif b then 1
else 2
end""")
        t("""
if a
    if b
        if c
            1
elif e
    2
""", """
if a then 
    if b then 
        if c then 
            1
        end
    end
elseif e then 
    2
end""")
        t("""
if a
    if b
        1
    elif c
        if d
            2
elif e
    4
""", """
if a then 
    if b then 
        1
    elseif c then 
        if d then 
            2
        end
    end
elseif e then 
    4
end""")
        t("""
if a
    1
{a=1 b=2}
""", """
if a then 
    1
end

{a = 1, b = 2}""")
        v("""
f = ->
    if true
        nil
    -1
""", """

function f() 
    if true then 
        nil
    end
    
    return -1
end""")
        v("""
f = ->
    if true
        nil
    [1 2]
""", """

function f() 
    if true then 
        nil
    end
    
    return array(1, 2)
end""")
    test "for                                            ": 
        t("for k in rawpairs(t) ➜ log k", "for k in rawpairs(t) do print(k) end")
        t("for a in 0..2 ➜ true", "for a in iter(0, 2) do true end")
        t("for a in 10..2\n  true", "for a in iter(10, 2) do \n  true\nend")
        t("for a in -10..-12 ➜\n  true", "for a in iter(-10, -12) do \n  true\nend")
        t("for val in opt", "for _, val in ipairs(opt) do end")
        t("for idx val in opt", "for idx, val in ipairs(opt) do end")
        t("for idx, val in opt", "for idx, val in ipairs(opt) do end")
        t("for (idx val) in opt", "for idx, val in ipairs(opt) do end")
        t("for (idx, val) in opt", "for idx, val in ipairs(opt) do end")
        t("for key val in pairs opt", "for key, val in pairs(opt) do end")
        t("for key, val in pairs opt", "for key, val in pairs(opt) do end")
        t("for (key val) in pairs opt", "for key, val in pairs(opt) do end")
        t("for (key, val) in pairs opt", "for key, val in pairs(opt) do end")
        t("for key val of opt", "for key, val in pairs(opt) do end")
        t("for key, val of opt", "for key, val in pairs(opt) do end")
        t("for (key val) of opt", "for key, val in pairs(opt) do end")
        t("for (key, val) of opt", "for key, val in pairs(opt) do end")
        t("for i a in ipairs l", "for i, a in ipairs(l) do end")
        t("for a in l", "for _, a in ipairs(l) do end")
    test "dotdotdot": 
        t("for v in ...\n    x = v\n    y = w", """
_argl_ = select("#", ...)
for _argi_ = 1, (_argl_ + 1)-1 do 
    v = select(_argi_, ...)
    x = v
    y = w
end""")
        v("for v in ...\n    x = v\n    v = w", """
local _argl_ = select("#", ...)
for _argi_ = 1, (_argl_ + 1)-1 do 
    local v = select(_argi_, ...)
    local x = v
    v = w
end""")
        v("f = (...) ->\n  for v in ...\n    x = v\n    y = w", """

function f(...) 
  local _argl_ = select("#", ...)
  for _argi_ = 1, (_argl_ + 1)-1 do 
    local v = select(_argi_, ...)
    
    local x = v
    local y = w
end
end""")
    test "while": 
        t("while true ➜ log a", "while true do print(a) end")
    test "switch                                         ": 
        t("switch x\n  a ➜ 1\n  b c ➜ 2", "if (x == a) then 1\nelseif (x == b) or (x == c) then 2\nend")
        t("switch x\n  a ➜ 1\n  b c ➜ 2\n  ➜ 4", "if (x == a) then 1\nelseif (x == b) or (x == c) then 2\nelse 4\nend")
        t("switch x\n  1 2 ➜ a", "if (x == 1) or (x == 2) then a\nend")
        t("switch x\n  1 2\n    a\n  ➜ c", "if (x == 1) or (x == 2) then \n    a\nelse c\nend")
        t("switch x\n  1 2➜\n    a\n  ➜\n    c", "if (x == 1) or (x == 2) then \n    a\nelse \n    c\nend")
        t("switch x\n  1 2 ➜ a\n  else\n    c", "if (x == 1) or (x == 2) then a\nelse \n    c\nend")
        t("switch x\n  1 2 ➜ a\n  ➜\n    c", "if (x == 1) or (x == 2) then a\nelse \n    c\nend")
        t("switch x\n a ➜ if b then c", "if (x == a) then if b then c end\nend")
        t("switch a\n  b ➜ c ; d\n  ➜ e; f", "if (a == b) then c ; d\nelse e ; f\nend")
        t("""
switch kind
    cmdEnd
        nil
# comment
""", """
if (kind == cmdEnd) then 
        nil
end

-- comment""")
    test "strings                                        ": 
        t("s = ''", "s = ''")
        t("s = \"\"", "s = \"\"")
        t("s = '\\\\'", "s = '\\\\'")
        t("s = 't'", "s = 't'")
        t("s = 't2'", "s = 't2'")
        t("s = 'test'", "s = 'test'")
        t("s = \"hello\"", "s = \"hello\"")
    test "string concatenation": 
        t("s = '' & ''", "s = '' .. ''")
    test "triple strings": 
        t("s = \"\"\"\"\"\"", "s = [[]]")
        t("s = \"\"\"\n\n\"\"\"", "s = [[\n\n]]")
        t("s = \"\"\"hello\"\"\"", "s = [[hello]]")
        t("s = \"\"\"hello world\"\"\"", "s = [[hello world]]")
        t("s = \"\"\"hello\nworld\"\"\"", "s = [[hello\nworld]]")
        t("s = \"\"\"hello\n    world\"\"\"", "s = [[hello\nworld]]")
        t("s = \"\"\"hello\n    world\n    \"\"\"", "s = [[hello\nworld\n]]")
        t("s = \"\"\"hello\n        world\n    \"\"\"", "s = [[hello\n    world\n]]")
        t("s = \"\"\"hello\nworld\n    \"\"\"", "s = [[hello\nworld\n    ]]")
        t("\"\"\"\n\"\"\"", "[[\n]]")
        t("\"\"\"\n    \"\"\"", "[[\n]]")
        t("\"\"\"\n    a = 1\"\"\"", "[[\na = 1]]")
        t("\"\"\"\n    a = 1\n    b = 2\"\"\"", "[[\na = 1\nb = 2]]")
        t("\"\"\"\n    a = 1\n    b = 2\n\"\"\"", "[[\n    a = 1\n    b = 2\n]]")
        t("\"\"\"\n        a = 1\n        b = 2\n    \"\"\"", "[[\n    a = 1\n    b = 2\n]]")
        t("t \"\"\"a\"\"\" , \"\"\"b\"\"\"", "t([[a]], [[b]])")
        t("t \"\"\"\na\"\"\" , \"\"\"\nb\"\"\"", "t([[\na]], [[\nb]])")
        t("t \"\"\"\na = 1\"\"\" , \"\"\"\nb = 2\"\"\"", "t([[\na = 1]], [[\nb = 2]])")
        t("t \"\"\"\na = 1\nb = 2\"\"\" , \"\"\"\na = 1\nb = 2\"\"\"", "t([[\na = 1\nb = 2]], [[\na = 1\nb = 2]])")
        t("t \"\"\"\n        a = 1\n        b = 2\n    \"\"\"", "t([[\n    a = 1\n    b = 2\n]])")
    test "stripol": 
        t("s = \"num #" & "{1+2} end\"", "s = \"num \" .. tostring((1 + 2)) .. \" end\"")
        t("s = \"#" & "{o}\"", "s = \"\" .. tostring(o) .. \"\"")
        t("s = \"(#" & "{s}#" & "{e})\"", "s = \"(\" .. tostring(s) .. \"\" .. tostring(e) .. \")\"")
        t("s = \"\"\"\n    #" & "{1+1}\n\"\"\"", "s = [[\n    ]] .. tostring((1 + 1)) .. [[\n]]")
        t("s = \"\"\"\n    #" & "{1+1}\n    #" & "{2+2}\n\"\"\"", "s = [[\n    ]] .. tostring((1 + 1)) .. [[\n    ]] .. tostring((2 + 2)) .. [[\n]]")
        t("s = \"\"\"num #" & "{1+2} end\"\"\"", "s = [[num ]] .. tostring((1 + 2)) .. [[ end]]")
        t("s = \"\"\"\nl1 #" & "{1+2}\nl2 #" & "{2-3}\"\"\"", "s = [[\nl1 ]] .. tostring((1 + 2)) .. [[\nl2 ]] .. tostring((2 - 3)) .. [[]]")
    test "len": 
        t("x = a.len", "x = #a")
        t("x = a.length", "x = a.length")
    test "tables": 
        t("t = {'a': 1}", "t = {['a'] = 1}")
    test "semicolon": 
        t("if a ➜ b ; c", "if a then b ; c end")
        t("if a ➜ b ; c ➜ d; e", "if a then b ; c else d ; e end")
    test "assert": 
        t("▴ false", "assert(false)")
        t("▴ 1 == 1 'equal'", "assert((1 == 1), 'equal')")
        t("assert 1 == 1 'equal'", "assert((1 == 1), 'equal')")
        t("assert(1 == 1 'equal')", "assert((1 == 1), 'equal')")
        t("assert(1 == 1, 'equal')", "assert((1 == 1), 'equal')")
    test "blocks": 
        t("""
f = ->
    g = ->
        2
        2
    1
""", """

function f() 
    
    function g() 
        2
        2
    end
    
    1
end""")
        t("""
f = -> 
    if x
        2
    1
""", """

function f() 
    if x then 
        2
    end
    
    1
end""")
        t("""
f = -> 
    if 1
        2
# dedent
""", """

function f() 
    if 1 then 
        2
    end
end

-- dedent""")
        t("""
f = -> 
    g = -> 
        2
        2
    1
0
""", """

function f() 
    
    function g() 
        2
        2
    end
    
    1
end

0""")
    test "misc": 
        t("⮐  type(str) == \"string\" and not not str:match(\"^[_%a][_%a%d]*$\") and not luaKeywords[str]", "return (((type(str) == \"string\") and not not str:match(\"^[_%a][_%a%d]*$\")) and not luaKeywords[str])")
        v("""
setmetatable(aClass, {  
    __tostring:   (self)      -> ⮐  "class " & self.name
    __call:       (self, ...) -> ⮐  self:new(...)
    __newindex:   _newMember })
""", """
setmetatable(aClass, {
    __tostring = function (self) return "class " .. self.name end, 
    __call = function (self, ...) return self:new(...) end, 
    __newindex = _newMember
    })""")
        v("s = a:slice -20 3", "local s = a:slice(-20, 3)")
        # t   "log ◌r"                                        "print(r)"
    test "comments": 
        t("two = 1 + 1 # addition", "two = (1 + 1) -- addition")
        t("log 1 # comment", "print(1) -- comment")
        t("""
# ███   ███  ███  ██     ██
# ███  ███   ███  ███   ███
# ███████    ███  █████████
# ███  ███   ███  ███ █ ███
# ███   ███  ███  ███   ███
""", """
-- ███   ███  ███  ██     ██
-- ███  ███   ███  ███   ███
-- ███████    ███  █████████
-- ███  ███   ███  ███ █ ███
-- ███   ███  ███  ███   ███""")
        t("""
###
    ███   ███  ███  ██     ██
    ███  ███   ███  ███   ███
    ███████    ███  █████████
    ███  ███   ███  ███ █ ███
    ███   ███  ███  ███   ███
###
""", """
--[[
    ███   ███  ███  ██     ██
    ███  ███   ███  ███   ███
    ███████    ███  █████████
    ███  ███   ███  ███ █ ███
    ███   ███  ███  ███   ███
--]]""")
    test "tests": 
        t("""
▸ suite
    # comment
    ▸ test1
        x   ▸ ""  # comment
        y   ▸ 24  # comment
        # comment
    ▸ test2
        # comment
        xy  ▸ "42"
    1
""", """
test("suite", function()
    -- comment
    test("test1", function()
        test.cmp(x, "") -- comment
        test.cmp(y, 24) -- comment
        -- comment
    end)
    
    test("test2", function()
        -- comment
        test.cmp(xy, "42")
    end)
    
    1
    end)""")