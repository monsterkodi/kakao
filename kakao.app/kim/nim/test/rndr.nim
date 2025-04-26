# ████████   ███   ███  ███████    ████████ 
# ███   ███  ████  ███  ███   ███  ███   ███
# ███████    ███ █ ███  ███   ███  ███████  
# ███   ███  ███  ████  ███   ███  ███   ███
# ███   ███  ███   ███  ███████    ███   ███

import ../kommon
import ../rndr
    
template t(a:string, b:string) = testCmp(a, renderCode(a), b, instantiationInfo())

suite "rndr":

    test "toplevel":

        t ""                  , ""
        t "43"                , "43"
        t "true"              , "true"
        t "false"             , "false"
        t "\"hello\""         , "\"hello\""

    test "math ops":
        
        t "1 + 5 * 3"         , "(1 + (5 * 3))"
        t "1 / 5 - 3"         , "((1 / 5) - 3)"
        t "-5 - -3"           , "(-5 - -3)"
        t "a++ + b--"         , "(a++ + b--)"
        t "1 + 2 + 3"         , "((1 + 2) + 3)"
        t "1 * 2 + 3 * 4"     , "((1 * 2) + (3 * 4))"
        
    test "boolean ops":
    
        t "a && b || c"       , "((a and b) or c)"
        t "a and b or c"      , "((a and b) or c)"
        t "!a && b"           , "(not a and b)"
        t "not a && b"        , "(not a and b)"
        t "a || b && c"       , "(a or (b and c))"
        t "a or b and c"      , "(a or (b and c))"
        t "a && b == c"       , "((a and b) == c)"
        t "a and b == c"      , "((a and b) == c)"
        t "x = a || b"        , "x = (a or b)"
        t "x = a or b"        , "x = (a or b)"
        t "!a || !b"          , "(not a or not b)"
        t "not a or not b"    , "(not a or not b)"
        
    test "parens":
    
        t "(1 + 2) * 3"       , "((1 + 2) * 3)"
        t "(1)"               , "1"
        t "(a + b) * c"       , "((a + b) * c)"
        t "a * (b + c)"       , "(a * (b + c))"
        t "((1))"             , "1"
        t "(a.b).c"           , "a.b.c"
        t "a * (b + c) / d"   , "((a * (b + c)) / d)"
        t "3 * (1 + 2)"       , "(3 * (1 + 2))"
        
    test "vars":
    
        t "◆optParser = initOptParser()"           , "var optParser = initOptParser()"
        t "◆str = \"\"\n◆bool = false\n◆num = 1"   , "var str = \"\"\nvar bool = false\nvar num = 1"
        
    test "arg types":
    
        t "files     ◇ seq[string] = @[]"          , "files:seq[string]=@[]" 
        t "files     ◆ seq[string] = @[]"          , "files:var seq[string]=@[]" 
    
    test "var types":
    
        t "var files ◇ seq[string] = @[]"          , "var files : seq[string] = @[]" 
        t "let files ◇ seq[string] = @[]"          , "let files : seq[string] = @[]" 
        t "◆files ◇ seq[string] = @[]"             , "var files : seq[string] = @[]" 
        t "◇files ◇ seq[string] = @[]"             , "let files : seq[string] = @[]" 
        
    test "func":
    
        t "f = ->"                                 , "proc f() ="
        t "f = a◇string ->"                        , "proc f(a:string) ="
        t "f = a◇string b◇int ->"                  , "proc f(a:string, b:int) ="
        t "f = p◆Parser a◇string b◇int ->"         , "proc f(p:var Parser, a:string, b:int) ="
        t "f = p◆Parser ->"                        , "proc f(p:var Parser) ="
        t "f = ➜ Node ->"                          , "proc f() : Node ="
        t "f = p◆Parser ➜ Node ->"                 , "proc f(p:var Parser) : Node ="
        t "f = s◇seq[Node] ➜ seq[Node] ->"         , "proc f(s:seq[Node]) : seq[Node] ="
        t "f = p◇Parser ahead◇int=1 ➜ Token ->"    , "proc f(p:Parser, ahead:int=1) : Token ="
        t "f = p◇Parser ahead=1 ➜ Token ->"        , "proc f(p:Parser, ahead=1) : Token ="
        t "l.map(r◇tuple➜string -> r.path)"        , "l.map(proc (r:tuple) : string = r.path)"
        t "l.map(r ◇ tuple ➜ string -> r.path)"    , "l.map(proc (r:tuple) : string = r.path)"
        
    test "call":
    
        t "f()"                                    , "f()"             
        t "f(g())"                                 , "f(g())"          
        t "f(g() / h())"                           , "f((g() / h()))"    
        t "f(1)"                                   , "f(1)"            
        t "f(1 + 2)"                               , "f((1 + 2))"        
        t "f(1 + 2 4 + 5)"                         , "f((1 + 2), (4 + 5))"  
        t "f(1 2 3)"                               , "f(1, 2, 3)"        
        t "f(1 g(h(2)))"                           , "f(1, g(h(2)))"    
        t "f = dir(a().b() / \"x\").toSeq()"       , "f = dir((a().b() / \"x\")).toSeq()"
        t "f = dir(a().b()[0] / \"x\").toSeq()"    , "f = dir((a().b()[0] / \"x\")).toSeq()"
        
    test "arglist":
    
        t "f(a, b, c)"        , "f(a, b, c)"
        t "f a, b, c"         , "f(a, b, c)"
        t "f a b c"           , "f(a, b, c)"
        t "f 1 '2' false"     , "f(1, '2', false)"
        
    test "tuple assign":
    
        t "(a, b) = c"        , "(a, b) = c"
        t "(a, b, c) = f()"   , "(a, b, c) = f()"
        
    test "assign":
    
        t "a = 1"                                  , "a = 1"
        t "a = b = 1"                              , "a = b = 1"
        t "a = b = c = 2"                          , "a = b = c = 2"
        
        t """
a = 1
# comment
b = false""" , """
a = 1
# comment
b = false"""
        
    test "properties        ":
        
        t "a.b"                                    , "a.b"     
        t "a.b.c"                                  , "a.b.c"   
        t "a.b()"                                  , "a.b()"   
        t "a.b().c"                                , "a.b().c" 
        
    test "use":
    
        t "use std ▪ unittest"                     , "import std/[unittest]"
        t "use std ▪ pegs strutils strformat"      , "import std/[pegs, strutils, strformat]"
        t "use rndr"                               , "import rndr"
        t "use ./rndr"                             , "import ./rndr"
        t "use ../rndr"                            , "import ../rndr"
        t "use ../../rel"                          , "import ../../rel"
        t "use ../../rel ▪ s1 s2"                  , "import ../../rel/[s1, s2]"
        
        t "import ../../rel/[s1, s2]"              , "import ../../rel/[s1, s2]"
        t "use std ▪ os logging\nuse kommon"       , "import std/[os, logging]\nimport kommon"
        t "use std ▪ a b c\nuse d\nuse e\nuse f"   , "import std/[a, b, c]\nimport d\nimport e\nimport f"
        
    test "if":
    
        t "if true then ⮐  false"                  , "if true: return false"                 
        t "if true then ⮐  1 else ⮐  2"            , "if true: return 1 else: return 2"           
        t "if a ➜ 1 elif b ➜ 2 elif c ➜ 3"         , "if a: 1 elif b: 2 elif c: 3"        
        t "if a ➜ 1 elif b ➜ 2 elif c ➜ 3 else 4"  , "if a: 1 elif b: 2 elif c: 3 else: 4" 
        t "if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3"          , "if a: 1 elif b: 2 elif c: 3"        
        t "if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3\n  ➜ 4"   , "if a: 1 elif b: 2 elif c: 3 else: 4" 
        
        t "if a then if b then 1 else 2 else 3"    , "if a: if b: 1 else: 2 else: 3" 
        t "x = if a then b else c"                 , "x = if a: b else: c"              
        t "x = if a then b else c+d"               , "x = if a: b else: (c + d)"            
        
        t "if a then ⮐"                            , "if a: return"
        t "a + if b then c else d"                 , "(a + if b: c else: d)"
        
        t "if true ➜ log msg"                      , "if true: log(msg)"
        t "if true ➜\n  log msg"                   , "if true: \n  log(msg)"
        t "if true\n  log msg"                     , "if true: \n  log(msg)"
        t "if true\n  log msg\n  log msg"          , "if true: \n  log(msg)\n  log(msg)"
        
    test "for":
    
        t "for a in 0..2 ➜ true"                   , "for a in [0..2]: true"     
        t "for a in 0..2\n  true"                  , "for a in [0..2]: \n  true"   
        t "for a in 0..2 ➜\n  true"                , "for a in [0..2]: \n  true"  
        t "for kind, key, val in opt.get()"        , "for kind, key, val in opt.get(): "  
        
    test "switch":
    
        t "switch x\n  a ➜ 1\n  b c ➜ 2"           , "case x:\n  of a: 1\n  of b, c: 2"
        t "switch x\n  a ➜ 1\n  b c ➜ 2\n  ➜ 4"    , "case x:\n  of a: 1\n  of b, c: 2\n  else: 4"
        t "switch x\n  1 2 ➜ a"                    , "case x:\n  of 1, 2: a"
        t "switch x\n  1 2 ➜ a\n  3 ➜ b"           , "case x:\n  of 1, 2: a\n  of 3: b"
        t "switch x\n  1 2 ➜ a\n  3 ➜ b\n  else c" , "case x:\n  of 1, 2: a\n  of 3: b\n  else: c"
        t "switch x\n  1 2 ➜ a\n  3 ➜ b\n  ➜ c"    , "case x:\n  of 1, 2: a\n  of 3: b\n  else: c"
        t "switch x\n  1 2\n    a\n  ➜ c"          , "case x:\n  of 1, 2: \n    a\n  else: c"
        t "switch x\n  1 2➜\n    a\n  ➜ c"         , "case x:\n  of 1, 2: \n    a\n  else: c"
        t "switch x\n  1 2 ➜ a\n  else\n    c"     , "case x:\n  of 1, 2: a\n  else: c"
        t "switch x\n  1 2 ➜ a\n  ➜\n    c"        , "case x:\n  of 1, 2: a\n  else: c"
        t "switch x\n a ➜ if b then c"             , "case x:\n of a: if b: c"
        
    test "strings":
    
        t "s = ''"                                 , "s = ''"
        t "s = \"\""                               , "s = \"\""
        t "s = \"\"\"\"\"\""                       , "s = \"\"\"\"\"\""
        t "s = \"\"\"\n\n\"\"\""                   , "s = \"\"\"\n\n\"\"\""
        t "s = \"hello\""                          , "s = \"hello\""
        t "s = \"\"\"hello\"\"\""                  , "s = \"\"\"hello\"\"\""
        t "s = \"num #{1+2} end\""                 , "s = &\"num {(1 + 2)} end\""
        t "s = \"\"\"num #{1+2} end\"\"\""         , "s = &\"\"\"num {(1 + 2)} end\"\"\""
        t "s = \"\"\"\nl1 #{1+2}\nl2 #{2-3}\"\"\"" , "s = &\"\"\"\nl1 {(1 + 2)}\nl2 {(2 - 3)}\"\"\""
        
    test "blocks":
  
        t """
f = ->
    g = ->
        2
        2
    1""" , """
proc f() = 
    proc g() = 
        2
        2
    1"""
    
        t """
f = -> 
    if x
        2
    1
"""  , """
proc f() = 
    if x: 
        2
    1"""

        t """
f = -> 
    if 1
        2
# dedent""" , """
proc f() = 
    if 1: 
        2
# dedent"""

        t """
f = -> 
    g = -> 
        2
        2
    1
0""" , """
proc f() = 
    proc g() = 
        2
        2
    1
0"""

        t """
switch kind
    cmdEnd
        discard
# comment""" , """
case kind:
    of cmdEnd: 
        discard
# comment"""

    test "comments":
    
        t "two = 1 + 1 # addition"                       , "two = (1 + 1) # addition"
        
        t """
# ███   ███  ███  ██     ██
# ███  ███   ███  ███   ███
# ███████    ███  █████████
# ███  ███   ███  ███ █ ███
# ███   ███  ███  ███   ███
""" , """
# ███   ███  ███  ██     ██
# ███  ███   ███  ███   ███
# ███████    ███  █████████
# ███  ███   ███  ███ █ ███
# ███   ███  ███  ███   ███"""
        
    test "tests":

        t "▸ a test suite"                         , "suite \"a test suite\": "
        t """
▸ suite
    ▸ test1
        x   ▸ ""
    ▸ test2
        xy  ▸ "42"
""" , """
suite "suite": 
    test "test1": 
        check x == ""
    test "test2": 
        check xy == "42""""
        
#         t """
# ◇icon = 
#     if ext , ".kim"
#         "  "
#     else
#         "  """" , """
# let icon = 
#     if ext , ".kim"
#         "  "
#     else
#         "  """"
        
        
