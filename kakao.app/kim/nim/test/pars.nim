# ████████    ███████   ████████    ███████
# ███   ███  ███   ███  ███   ███  ███     
# ████████   █████████  ███████    ███████ 
# ███        ███   ███  ███   ███       ███
# ███        ███   ███  ███   ███  ███████ 

import std/[unittest]
import ../pars

suite "pars":

    test "math ops":
        
        check $ast("1 + 5 * 3")                              == "▪[(◆number ◆plus (◆number ◆multiply ◆number))]"
        check $ast("1 * 5 - 3")                              == "▪[((◆number ◆multiply ◆number) ◆minus ◆number)]"
        check $ast("-5 - -3")                                == "▪[((◆minus ◆number) ◆minus (◆minus ◆number))]"
        check $ast("a++ + b--")                              == "▪[((◆name ◆increment) ◆plus (◆name ◆decrement))]"
        check $ast("1 + 2 + 3")                              == "▪[((◆number ◆plus ◆number) ◆plus ◆number)]"
        check $ast("1 * 2 + 3 * 4")                          == "▪[((◆number ◆multiply ◆number) ◆plus (◆number ◆multiply ◆number))]"
        
    test "boolean ops":
    
        check $ast("a && b || c")                            == "▪[((◆name ◆and ◆name) ◆or ◆name)]"
        check $ast("a and b or c")                           == "▪[((◆name ◆and ◆name) ◆or ◆name)]"
        check $ast("!a && b")                                == "▪[((◆not ◆name) ◆and ◆name)]"
        check $ast("not a && b")                             == "▪[((◆not ◆name) ◆and ◆name)]"
        check $ast("a || b && c")                            == "▪[(◆name ◆or (◆name ◆and ◆name))]"
        check $ast("a or b and c")                           == "▪[(◆name ◆or (◆name ◆and ◆name))]"
        check $ast("a && b == c")                            == "▪[((◆name ◆and ◆name) ◆equal ◆name)]"
        check $ast("a and b == c")                           == "▪[((◆name ◆and ◆name) ◆equal ◆name)]"
        check $ast("x = a || b")                             == "▪[(◆name ◆assign (◆name ◆or ◆name))]"
        check $ast("x = a or b")                             == "▪[(◆name ◆assign (◆name ◆or ◆name))]"
        check $ast("!a || !b")                               == "▪[((◆not ◆name) ◆or (◆not ◆name))]"
        check $ast("not a or not b")                         == "▪[((◆not ◆name) ◆or (◆not ◆name))]"

    test "parens":
    
        check $ast("(1 + 2) * 3")                            == "▪[((◆number ◆plus ◆number) ◆multiply ◆number)]"
        check $ast("(1)")                                    == "▪[◆number]"
        check $ast("(a + b) * c")                            == "▪[((◆name ◆plus ◆name) ◆multiply ◆name)]"
        check $ast("a * (b + c)")                            == "▪[(◆name ◆multiply (◆name ◆plus ◆name))]"
        check $ast("((1))")                                  == "▪[◆number]"
        check $ast("(a.b).c")                                == "▪[((◆name ◆dot ◆name) ◆dot ◆name)]"
        
        check $ast("a * (b + c) / d")                        == "▪[((◆name ◆multiply (◆name ◆plus ◆name)) ◆divide ◆name)]"
        check $ast("3 * (1 + 2)")                            == "▪[(◆number ◆multiply (◆number ◆plus ◆number))]"
        
    test "func":
    
        check $ast("->")                                     == "▪[(◆func @[])]"
        check $ast("f = ->")                                 == "▪[(◆func ◆name @[])]" 
        check $ast("f = a▪string ->")                        == "▪[(◆func ◆name @[(◆name ◆val ◆type)])]"
        check $ast("f = a▪string b▪int ->")                  == "▪[(◆func ◆name @[(◆name ◆val ◆type), (◆name ◆val ◆type)])]"
        check $ast("f = p◆Parser a▪string b▪int ->")         == "▪[(◆func ◆name @[(◆name ◆var ◆type), (◆name ◆val ◆type), (◆name ◆val ◆type)])]"
        check $ast("f = p◆Parser ->")                        == "▪[(◆func ◆name @[(◆name ◆var ◆type)])]"
        check $ast("f = ➜ Node ->")                          == "▪[(◆func ◆name @[] ◆type)]"
        check $ast("f = p◆Parser ➜ Node ->")                 == "▪[(◆func ◆name @[(◆name ◆var ◆type)] ◆type)]"
        check $ast("f = s▪seq[Node] ➜ seq[Node] ->")         == "▪[(◆func ◆name @[(◆name ◆val ◆type)] ◆type)]"
        check $ast("f = p▪Parser ahead▪int=1 ➜ Token ->")    == "▪[(◆func ◆name @[(◆name ◆val ◆type), (◆name ◆val ◆type (= ◆number))] ◆type)]"
        check $ast("f = p▪Parser ahead=1 ➜ Token ->")        == "▪[(◆func ◆name @[(◆name ◆val ◆type), (◆name (= ◆number))] ◆type)]"
        
    test "func body":
    
        check $ast("f = ->\n  b = 1 + 2\n  b += 3")          == "▪[(◆func ◆name @[] ▪[(◆name ◆assign (◆number ◆plus ◆number))(◆name ◆plus_assign ◆number)])]" 
        
    test "call":
    
        check $ast("f()")                                    == "▪[(◆name ◆call @[])]"
        check $ast("f(g())")                                 == "▪[(◆name ◆call @[(◆name ◆call @[])])]"
        check $ast("f(g() / h())")                           == "▪[(◆name ◆call @[((◆name ◆call @[]) ◆divide (◆name ◆call @[]))])]"
        check $ast("f(1)")                                   == "▪[(◆name ◆call @[◆number])]"
        check $ast("f(1 + 2)")                               == "▪[(◆name ◆call @[(◆number ◆plus ◆number)])]"
        check $ast("f(1 + 2 4 + 5)")                         == "▪[(◆name ◆call @[(◆number ◆plus ◆number), (◆number ◆plus ◆number)])]"
        check $ast("f(1 2 3)")                               == "▪[(◆name ◆call @[◆number, ◆number, ◆number])]"
        check $ast("f(1 g(h(2)))")                           == "▪[(◆name ◆call @[◆number, (◆name ◆call @[(◆name ◆call @[◆number])])])]"
        
    test "assign":
    
        check $ast("a = 1")                                  == "▪[(◆name ◆assign ◆number)]"
        check $ast("a = b = 1")                              == "▪[(◆name ◆assign (◆name ◆assign ◆number))]"
        check $ast("a = b = c = 2")                          == "▪[(◆name ◆assign (◆name ◆assign (◆name ◆assign ◆number)))]"
        
    test "properties        ":
        
        check $ast("a.b")                                    == "▪[(◆name ◆dot ◆name)]"
        check $ast("a.b.c")                                  == "▪[((◆name ◆dot ◆name) ◆dot ◆name)]"
        check $ast("a.b()")                                  == "▪[((◆name ◆dot ◆name) ◆call @[])]"
        check $ast("a.b().c")                                == "▪[(((◆name ◆dot ◆name) ◆call @[]) ◆dot ◆name)]"
        
    test "if":
    
        check $ast("if true then ⮐  false")                  == "▪[(◆if @[(◆true (◆return ◆false))])]"
        check $ast("if true then ⮐  1 else ⮐  2")            == "▪[(◆if @[(◆true (◆return ◆number))] (◆return ◆number))]"
        check $ast("if a ➜ 1 elif b ➜ 2 elif c ➜ 3")         == "▪[(◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)])]"
        check $ast("if a ➜ 1 elif b ➜ 2 elif c ➜ 3 else 4")  == "▪[(◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)] ◆number)]"
        check $ast("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3")          == "▪[(◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)])]"
        check $ast("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3\n  ➜ 4")   == "▪[(◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)] ◆number)]"
        
        check $ast("if a then if b then 1 else 2 else 3")    == "▪[(◆if @[(◆name (◆if @[(◆name ◆number)] ◆number))] ◆number)]"
        check $ast("x = if a then b else c")                 == "▪[(◆name ◆assign (◆if @[(◆name ◆name)] ◆name))]"
        check $ast("x = if a then b else c+d")               == "▪[(◆name ◆assign (◆if @[(◆name ◆name)] (◆name ◆plus ◆name)))]"
        
        check $ast("if a then ⮐")                            == "▪[(◆if @[(◆name (◆return))])]"
        check $ast("a + if b then c else d")                 == "▪[(◆name ◆plus (◆if @[(◆name ◆name)] ◆name))]"
        
    test "for":
    
        check $ast("0..2")                                   == "▪[(◆number ◆doubledot ◆number)]"
        check $ast("for a in 0..2 ➜ true")                   == "▪[(◆for ◆name (◆number ◆doubledot ◆number) ◆true)]"
        check $ast("for a in 0..2\n  true")                  == "▪[(◆for ◆name (◆number ◆doubledot ◆number) ▪[◆true])]"
        check $ast("for a in 0..2 ➜\n  true")                == "▪[(◆for ◆name (◆number ◆doubledot ◆number) ▪[◆true])]"
        
    test "switch":
    
        check $ast("switch x\n  a ➜ 1\n  b c ➜ 2")           == "▪[(◆switch ◆name @[(@[◆name] ◆number), (@[◆name, ◆name] ◆number)])]"
        check $ast("switch x\n  a ➜ 1\n  b c ➜ 2\n  ➜ 4")    == "▪[(◆switch ◆name @[(@[◆name] ◆number), (@[◆name, ◆name] ◆number)] ◆number)]"

        check $ast("switch x\n  1 2 ➜ a")                    == "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name)])]"
        check $ast("switch x\n  1 2 ➜ a\n  3 ➜ b")           == "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name), (@[◆number] ◆name)])]"
        check $ast("switch x\n  1 2 ➜ a\n  3 ➜ b\n  else c") == "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name), (@[◆number] ◆name)] ◆name)]"
        check $ast("switch x\n  1 2 ➜ a\n  3 ➜ b\n  ➜ c")    == "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name), (@[◆number] ◆name)] ◆name)]"
        check $ast("switch x\n  1 2\n    a\n  ➜ c")          == "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)]"
        check $ast("switch x\n  1 2➜\n    a\n  ➜ c")         == "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)]"
        check $ast("switch x\n  1 2 ➜ a\n  else\n    c")     == "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)]"
        check $ast("switch x\n  1 2 ➜ a\n  ➜\n    c")        == "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)]"
        check $ast("switch x\n a ➜ if b then c")             == "▪[(◆switch ◆name @[(@[◆name] (◆if @[(◆name ◆name)]))])]"
        
    test "strings":
    
        check $ast("s = \"hello\"")                          == "▪[(◆name ◆assign ◆string)]"
        
    test "toplevel":

        check $ast("")                                       == "▪[]"
        check $ast("42")                                     == "▪[◆number]"
        check $ast("true")                                   == "▪[◆true]"
        check $ast("false")                                  == "▪[◆false]"
        check $ast("\"hello\"")                              == "▪[◆string]"
        
    test "tests":
    
        check $ast("▸ a test suite")                         == "▪[◆test]"
        check ast("▸ a test suite").expressions[0].kind      == ●testSuite
        
        check $ast("    ▸ test section")                     == "▪[◆test]"
        check ast("    ▸ test section").expressions[0].kind  == ●testSection
        
        check $ast("    f(a) ▸ 42")                          == "▪[((◆name ◆call @[◆name]) ◆test ◆number)]"
        check $ast("    f(a) ▸\n        42")                 == "▪[((◆name ◆call @[◆name]) ◆test ◆number)]"
        
        check $ast("▸ suite\n  ▸ test")                      == "▪[◆test▪[◆test]]"
        
        check $ast("""
▸ rndr
   ▸ toplevel
       rndr("")   ▸ ""
       rndr("42") ▸ "42" """) == "▪[◆test▪[◆test▪[((◆name ◆call @[◆string]) ◆test ◆string)((◆name ◆call @[◆string]) ◆test ◆string)]]]"
        
