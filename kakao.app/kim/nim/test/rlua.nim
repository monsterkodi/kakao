# ████████   ███      ███   ███   ███████ 
# ███   ███  ███      ███   ███  ███   ███
# ███████    ███      ███   ███  █████████
# ███   ███  ███      ███   ███  ███   ███
# ███   ███  ███████   ███████   ███   ███
import ../rlua
import ../kxk/kxk

template t(a:string, b:string) = testCmp(a, renderLua(a, false), b, instantiationInfo())
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
    #▸ ampersand                                     
    #                                                
    #    t "a & b"                                     "a & b"
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
        t("f = a=1 ->", "\nfunction f(a = 1)\nend")
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
    test "arglist": 
        t("f(a, b, c)", "f(a, b, c)")
        t("g a, b, c", "g(a, b, c)")
        t("h a b c", "h(a, b, c)")
        t("i 1 '2' false", "i(1, '2', false)")
        t("t \"a\" , \"b\"", "t(\"a\", \"b\")")
        t("t \"a\",\n  \"b\"", "t(\"a\", \"b\")")
        t("t \"a\"\n  \"b\"", "t(\"a\", \"b\")")
    test "list assign": 
        t("(a, b) = c", "(a, b) = c")
        t("(a b) = c", "(a, b) = c")
        t("(a, b, c) = f()", "(a, b, c) = f()")
        t("(a b c) = f()", "(a, b, c) = f()")
        t("(a b c) = (c b a)", "(a, b, c) = (c, b, a)")
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
    test "arrays": 
        t("a = [ 1  2 ]", "a = {1, 2}")
        t("a = [\n    1\n    2\n    ]", "a = {1, 2}")
    test "properties        ": 
        t("a.b", "a.b")
        t("a.b.c", "a.b.c")
        t("a.b()", "a.b()")
        t("a.b().c", "a.b().c")
    test "use                                           ": 
        t("use std", "std = require \"std\"")
    #    t "use std ▪ pegs strutils strformat"         "import std/[pegs, strutils, strformat]"
    #    t "use rndr"                                  "import rndr"
    #    t "use ./rndr"                                "import ./rndr"
    #    t "use ../rndr"                               "import ../rndr"
    #    t "use ../../rel"                             "import ../../rel"
    #    t "use ../../rel ▪ s1 s2"                     "import ../../rel/[s1, s2]"
    #                                                
    #    t "import ../../rel/[s1, s2]"                 "\nimport ../../rel/[s1, s2]"
    #    t "use std ▪ os logging\nuse kommon"          "import std/[os, logging]\nimport kommon"
    #    t "use std ▪ a b c\nuse d\nuse e\nuse f"      "import std/[a, b, c]\nimport d\nimport e\nimport f"
    #                                                
    #    t "use a b c"                                 "import a\nimport b\nimport c"
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
{a:1 b:2}
""", """
if a then 
    1
end
{a = 1, b = 2}""")
    # ▸ for                                            
    #                                                  
    #     t "for a in 0..2 ➜ true"                     "for a in 0..2: true"     
    #     t "for a in 0..2\n  true"                    "for a in 0..2: \n  true"   
    #     t "for a in 0..2 ➜\n  true"                  "for a in 0..2: \n  true"  
    #     t "for kind, key, val in opt.get()"          "for kind, key, val in opt.get(): "  
    # ▸ switch                                         
    #                                                  
    #     t "switch x\n  a ➜ 1\n  b c ➜ 2"             "case x:\n  of a: 1\n  of b, c: 2"
    #     t "switch x\n  a ➜ 1\n  b c ➜ 2\n  ➜ 4"      "case x:\n  of a: 1\n  of b, c: 2\n  else: 4"
    #     t "switch x\n  1 2 ➜ a"                      "case x:\n  of 1, 2: a"
    #     t "switch x\n  1 2 ➜ a\n  3 ➜ b"             "case x:\n  of 1, 2: a\n  of 3: b"
    #     t "switch x\n  1 2 ➜ a\n  3 ➜ b\n  else c"   "case x:\n  of 1, 2: a\n  of 3: b\n  else: c"
    #     t "switch x\n  1 2 ➜ a\n  3 ➜ b\n  ➜ c"      "case x:\n  of 1, 2: a\n  of 3: b\n  else: c"
    #     t "switch x\n  1 2\n    a\n  ➜ c"            "case x:\n  of 1, 2: \n    a\n  else: c"
    #     t "switch x\n  1 2➜\n    a\n  ➜ c"           "case x:\n  of 1, 2: \n    a\n  else: c"
    #     t "switch x\n  1 2 ➜ a\n  else\n    c"       "case x:\n  of 1, 2: a\n  else: \n    c"
    #     t "switch x\n  1 2 ➜ a\n  ➜\n    c"          "case x:\n  of 1, 2: a\n  else: \n    c"
    #     t "switch x\n a ➜ if b then c"               "case x:\n of a: if b: c"
    #     t   """
    #         switch kind
    #             cmdEnd
    #                 discard
    #         # comment
    #         """ """
    #         case kind:
    #             of cmdEnd: 
    #                 discard
    #         # comment"""
    test "strings                                        ": 
        t("s = ''", "s = ''")
        t("s = \"\"", "s = \"\"")
        t("s = '\\\\'", "s = '\\\\'")
        t("s = 't'", "s = 't'")
        t("s = 't2'", "s = \"t2\"")
        t("s = 'test'", "s = \"test\"")
        t("s = \"hello\"", "s = \"hello\"")
        t("s = \"num #" & "{1+2} end\"", "s = &\"num {(1 + 2)} end\"")
        t("s = \"#" & "{o}\"", "s = &\"{o}\"")
        t("s = \"(#" & "{s}#" & "{e})\"", "s = &\"({s}{e})\"")
        t("cmd = \"nim c --outDir:#" & "{outdir} --stackTrace:on --lineTrace:on #" & "{file}\"", "cmd = &\"nim c --outDir:{outdir} --stackTrace:on --lineTrace:on {file}\"")
        t("let e = choose(n.return_value, \" #" & "{n.return_value}\", \"\")", "local e = choose(n.return_value, &\" {n.return_value}\", \"\")")
        t("var e = choose(n.return_value, \" #" & "{n.return_value}\", \"\")", "local e = choose(n.return_value, &\" {n.return_value}\", \"\")")
    test "triple strings": 
        t("s = \"\"\"\"\"\"", "s = [[]]")
        t("s = \"\"\"\n\n\"\"\"", "s = [[\n\n]]")
        t("s = \"\"\"hello\"\"\"", "s = [[hello]]")
        t("s = \"\"\"hello world\"\"\"", "s = [[hello world]]")
        t("s = \"\"\"num #" & "{1+2} end\"\"\"", "s = &[[num {(1 + 2)} end]]")
        t("s = \"\"\"\nl1 #" & "{1+2}\nl2 #" & "{2-3}\"\"\"", "s = &[[\nl1 {(1 + 2)}\nl2 {(2 - 3)}]]")
        t("s = \"\"\"hello\nworld\"\"\"", "s = [[hello\nworld]]")
        t("s = \"\"\"hello\n    world\"\"\"", "s = [[hello\nworld]]")
        t("s = \"\"\"hello\n    world\n    \"\"\"", "s = [[hello\nworld\n]]")
        t("s = \"\"\"hello\n        world\n    \"\"\"", "s = [[hello\n    world\n]]")
        t("s = \"\"\"hello\nworld\n    \"\"\"", "s = [[hello\nworld\n    ]]")
        t("s = \"\"\"\n    #" & "{1+1}\n\"\"\"", "s = &[[\n    {(1 + 1)}\n]]")
        t("s = \"\"\"\n    #" & "{1+1}\n    #" & "{2+2}\n\"\"\"", "s = &[[\n    {(1 + 1)}\n    {(2 + 2)}\n]]")
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
    test "semicolon": 
        t("if a ➜ b ; c", "if a then b ; c end")
        t("if a ➜ b ; c ➜ d; e", "if a then b ; c else d ; e end")
        # t "switch a\n  b ➜ c ; d\n  ➜ e; f"             "case a:\n  of b: c ; d\n  else: e ; f"
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
    test "comments": 
        t("two = 1 + 1 # addition", "two = (1 + 1) -- addition")
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