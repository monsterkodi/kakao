# ████████   ███   ███  ███████    ████████ 
# ███   ███  ████  ███  ███   ███  ███   ███
# ███████    ███ █ ███  ███   ███  ███████  
# ███   ███  ███  ████  ███   ███  ███   ███
# ███   ███  ███   ███  ███████    ███   ███

import std/[unittest]
import ../rndr

suite "rndr":

    test "toplevel":

        check rndr("")                  == ""
        check rndr("42")                == "42"
        check rndr("true")              == "true"
        check rndr("false")             == "false"
        check rndr("\"hello\"")         == "\"hello\""

    test "math ops":
        
        check rndr("1 + 5 * 3")         == "(1 + (5 * 3))"
        check rndr("1 / 5 - 3")         == "((1 / 5) - 3)"
        check rndr("-5 - -3")           == "(-5 - -3)"
        check rndr("a++ + b--")         == "(a++ + b--)"
        check rndr("1 + 2 + 3")         == "((1 + 2) + 3)"
        check rndr("1 * 2 + 3 * 4")     == "((1 * 2) + (3 * 4))"
        
    test "boolean ops":
    
        check rndr("a && b || c")       == "((a and b) or c)"
        check rndr("a and b or c")      == "((a and b) or c)"
        check rndr("!a && b")           == "(not a and b)"
        check rndr("not a && b")        == "(not a and b)"
        check rndr("a || b && c")       == "(a or (b and c))"
        check rndr("a or b and c")      == "(a or (b and c))"
        check rndr("a && b == c")       == "((a and b) == c)"
        check rndr("a and b == c")      == "((a and b) == c)"
        check rndr("x = a || b")        == "x = (a or b)"
        check rndr("x = a or b")        == "x = (a or b)"
        check rndr("!a || !b")          == "(not a or not b)"
        check rndr("not a or not b")    == "(not a or not b)"
        
    test "parens":
    
        check rndr("(1 + 2) * 3")       == "((1 + 2) * 3)"
        check rndr("(1)")               == "1"
        check rndr("(a + b) * c")       == "((a + b) * c)"
        check rndr("a * (b + c)")       == "(a * (b + c))"
        check rndr("((1))")             == "1"
        check rndr("(a.b).c")           == "a.b.c"
        check rndr("a * (b + c) / d")   == "((a * (b + c)) / d)"
        check rndr("3 * (1 + 2)")       == "(3 * (1 + 2))"
        
    test "vars":
    
        check rndr("◆optParser = initOptParser()")           == "var optParser = initOptParser()"
        check rndr("◆str = \"\"\n◆bool = false\n◆num = 1")   == "var str = \"\"\nvar bool = false\nvar num = 1"
        
    test "arg types":
    
        check rndr("files     ◇ seq[string] = @[]")          == "files:seq[string]=@[]" 
        check rndr("files     ◆ seq[string] = @[]")          == "files:var seq[string]=@[]" 
    
    test "var types":
    
        check rndr("var files ◇ seq[string] = @[]")          == "var files : seq[string] = @[]" 
        check rndr("let files ◇ seq[string] = @[]")          == "let files : seq[string] = @[]" 
        check rndr("◆files ◇ seq[string] = @[]")             == "var files : seq[string] = @[]" 
        check rndr("◇files ◇ seq[string] = @[]")             == "let files : seq[string] = @[]" 
        
    test "func":
    
        check rndr("f = ->")                                 == "proc f() ="
        check rndr("f = a◇string ->")                        == "proc f(a:string) ="
        check rndr("f = a◇string b◇int ->")                  == "proc f(a:string, b:int) ="
        check rndr("f = p◆Parser a◇string b◇int ->")         == "proc f(p:var Parser, a:string, b:int) ="
        check rndr("f = p◆Parser ->")                        == "proc f(p:var Parser) ="
        check rndr("f = ➜ Node ->")                          == "proc f() : Node ="
        check rndr("f = p◆Parser ➜ Node ->")                 == "proc f(p:var Parser) : Node ="
        check rndr("f = s◇seq[Node] ➜ seq[Node] ->")         == "proc f(s:seq[Node]) : seq[Node] ="
        check rndr("f = p◇Parser ahead◇int=1 ➜ Token ->")    == "proc f(p:Parser, ahead:int=1) : Token ="
        check rndr("f = p◇Parser ahead=1 ➜ Token ->")        == "proc f(p:Parser, ahead=1) : Token ="
        check rndr("l.map(r◇tuple➜string -> r.path)")        == "l.map(proc (r:tuple) : string = r.path)"
        check rndr("l.map(r ◇ tuple ➜ string -> r.path)")    == "l.map(proc (r:tuple) : string = r.path)"
        
    test "call":
    
        check rndr("f()")                                    == "f()"             
        check rndr("f(g())")                                 == "f(g())"          
        check rndr("f(g() / h())")                           == "f((g() / h()))"    
        check rndr("f(1)")                                   == "f(1)"            
        check rndr("f(1 + 2)")                               == "f((1 + 2))"        
        check rndr("f(1 + 2 4 + 5)")                         == "f((1 + 2), (4 + 5))"  
        check rndr("f(1 2 3)")                               == "f(1, 2, 3)"        
        check rndr("f(1 g(h(2)))")                           == "f(1, g(h(2)))"    
        check rndr("f = dir(a().b() / \"x\").toSeq()")       == "f = dir((a().b() / \"x\")).toSeq()"
        check rndr("f = dir(a().b()[0] / \"x\").toSeq()")    == "f = dir((a().b()[0] / \"x\")).toSeq()"
        
    test "assign":
    
        check rndr("a = 1")                                  == "a = 1"
        check rndr("a = b = 1")                              == "a = b = 1"
        check rndr("a = b = c = 2")                          == "a = b = c = 2"
        
        check rndr("""
a = 1
# comment
b = false""") == """
a = 1
# comment
b = false"""
        
    test "properties        ":
        
        check rndr("a.b")                                    == "a.b"     
        check rndr("a.b.c")                                  == "a.b.c"   
        check rndr("a.b()")                                  == "a.b()"   
        check rndr("a.b().c")                                == "a.b().c" 
        
    test "use":
    
        check rndr("use std ▪ unittest")                     == "import std/[unittest]"
        check rndr("use std ▪ pegs strutils strformat")      == "import std/[pegs, strutils, strformat]"
        check rndr("use rndr")                               == "import rndr"
        check rndr("use ./rndr")                             == "import ./rndr"
        check rndr("use ../rndr")                            == "import ../rndr"
        check rndr("use ../../rel")                          == "import ../../rel"
        check rndr("use ../../rel ▪ s1 s2")                  == "import ../../rel/[s1, s2]"
        
        check rndr("import ../../rel/[s1, s2]")              == "import ../../rel/[s1, s2]"
        check rndr("use std ▪ os logging\nuse kommon")       == "import std/[os, logging]\nimport kommon"
        check rndr("use std ▪ a b c\nuse d\nuse e\nuse f")   == "import std/[a, b, c]\nimport d\nimport e\nimport f"
        
    test "if":
    
        check rndr("if true then ⮐  false")                  == "if true: return false"                 
        check rndr("if true then ⮐  1 else ⮐  2")            == "if true: return 1 else: return 2"           
        check rndr("if a ➜ 1 elif b ➜ 2 elif c ➜ 3")         == "if a: 1 elif b: 2 elif c: 3"        
        check rndr("if a ➜ 1 elif b ➜ 2 elif c ➜ 3 else 4")  == "if a: 1 elif b: 2 elif c: 3 else: 4" 
        check rndr("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3")          == "if a: 1 elif b: 2 elif c: 3"        
        check rndr("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3\n  ➜ 4")   == "if a: 1 elif b: 2 elif c: 3 else: 4" 
        
        check rndr("if a then if b then 1 else 2 else 3")    == "if a: if b: 1 else: 2 else: 3" 
        check rndr("x = if a then b else c")                 == "x = if a: b else: c"              
        check rndr("x = if a then b else c+d")               == "x = if a: b else: (c + d)"            
        
        check rndr("if a then ⮐")                            == "if a: return"
        check rndr("a + if b then c else d")                 == "(a + if b: c else: d)"
        
        check rndr("if true ➜ log msg")                      == "if true: log msg"
        check rndr("if true ➜\n  log msg")                   == "if true: \n  log msg"
        check rndr("if true\n  log msg")                     == "if true: \n  log msg"
        check rndr("if true\n  log msg\n  log msg")          == "if true: \n  log msg\n  log msg"
        
    test "for":
    
        check rndr("for a in 0..2 ➜ true")                   == "for a in [0..2]: true"     
        check rndr("for a in 0..2\n  true")                  == "for a in [0..2]: \n  true"   
        check rndr("for a in 0..2 ➜\n  true")                == "for a in [0..2]: \n  true"  
        check rndr("for kind, key, val in opt.get()")        == "for kind, key, val in opt.get(): "  
        
    test "switch":
    
        check rndr("switch x\n  a ➜ 1\n  b c ➜ 2")           == "case x:\n  of a: 1\n  of b, c: 2"
        check rndr("switch x\n  a ➜ 1\n  b c ➜ 2\n  ➜ 4")    == "case x:\n  of a: 1\n  of b, c: 2\n  else: 4"
        check rndr("switch x\n  1 2 ➜ a")                    == "case x:\n  of 1, 2: a"
        check rndr("switch x\n  1 2 ➜ a\n  3 ➜ b")           == "case x:\n  of 1, 2: a\n  of 3: b"
        check rndr("switch x\n  1 2 ➜ a\n  3 ➜ b\n  else c") == "case x:\n  of 1, 2: a\n  of 3: b\n  else: c"
        check rndr("switch x\n  1 2 ➜ a\n  3 ➜ b\n  ➜ c")    == "case x:\n  of 1, 2: a\n  of 3: b\n  else: c"
        check rndr("switch x\n  1 2\n    a\n  ➜ c")          == "case x:\n  of 1, 2: \n    a\n  else: c"
        check rndr("switch x\n  1 2➜\n    a\n  ➜ c")         == "case x:\n  of 1, 2: \n    a\n  else: c"
        check rndr("switch x\n  1 2 ➜ a\n  else\n    c")     == "case x:\n  of 1, 2: a\n  else: c"
        check rndr("switch x\n  1 2 ➜ a\n  ➜\n    c")        == "case x:\n  of 1, 2: a\n  else: c"
        check rndr("switch x\n a ➜ if b then c")             == "case x:\n of a: if b: c"
        
    test "strings":
    
        check rndr("s = ''")                                 == "s = ''"
        check rndr("s = \"\"")                               == "s = \"\""
        check rndr("s = \"\"\"\"\"\"")                       == "s = \"\"\"\"\"\""
        check rndr("s = \"\"\"\n\n\"\"\"")                   == "s = \"\"\"\n\n\"\"\""
        check rndr("s = \"hello\"")                          == "s = \"hello\""
        check rndr("s = \"\"\"hello\"\"\"")                  == "s = \"\"\"hello\"\"\""
        check rndr("s = \"num #{1+2} end\"")                 == "s = &\"num {(1 + 2)} end\""
        check rndr("s = \"\"\"num #{1+2} end\"\"\"")         == "s = &\"\"\"num {(1 + 2)} end\"\"\""
        check rndr("s = \"\"\"\nl1 #{1+2}\nl2 #{2-3}\"\"\"") == "s = &\"\"\"\nl1 {(1 + 2)}\nl2 {(2 - 3)}\"\"\""
        
    test "blocks":
  
        check rndr("""
f = ->
    g = ->
        2
        2
    1""") == """
proc f() = 
    proc g() = 
        2
        2
    1"""
    
        check rndr("""
f = -> 
    if x
        2
    1
""")  == """
proc f() = 
    if x: 
        2
    1"""

        check rndr("""
f = -> 
    if 1
        2
# dedent""") == """
proc f() = 
    if 1: 
        2
# dedent"""

        check rndr("""
f = -> 
    g = -> 
        2
        2
    1
0""") == """
proc f() = 
    proc g() = 
        2
        2
    1
0"""

    test "comments":
    
        check rndr("two = 1 + 1 # addition")                       == "two = (1 + 1) # addition"
        
        check rndr("""
# ███   ███  ███  ██     ██
# ███  ███   ███  ███   ███
# ███████    ███  █████████
# ███  ███   ███  ███ █ ███
# ███   ███  ███  ███   ███
""") == """
# ███   ███  ███  ██     ██
# ███  ███   ███  ███   ███
# ███████    ███  █████████
# ███  ███   ███  ███ █ ███
# ███   ███  ███  ███   ███"""
        
    test "tests":

        check rndr("▸ a test suite")                         == "suite \"a test suite\": "
        check rndr("""
▸ suite
    ▸ test1
        rndr("")   ▸ ""
    ▸ test2
        rndr("42") ▸ "42"
""") == """
suite "suite": 
    test "test1": 
        check rndr("") == ""
    test "test2": 
        check rndr("42") == "42""""
        
        
