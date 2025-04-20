# ████████    ███████   ████████    ███████
# ███   ███  ███   ███  ███   ███  ███     
# ████████   █████████  ███████    ███████ 
# ███        ███   ███  ███   ███       ███
# ███        ███   ███  ███   ███  ███████ 

import std/[unittest]
import ../pars

suite "pars":

    test "math ops":
        
        check $ast("1 + 5 * 3")                              == "◆\n (◆number ◆plus (◆number ◆multiply ◆number))"
        check $ast("1 * 5 - 3")                              == "◆\n ((◆number ◆multiply ◆number) ◆minus ◆number)"
        check $ast("-5 - -3")                                == "◆\n ((◆minus ◆number) ◆minus (◆minus ◆number))"
        check $ast("a++ + b--")                              == "◆\n ((◆name ◆increment) ◆plus (◆name ◆decrement))"
        check $ast("1 + 2 + 3")                              == "◆\n ((◆number ◆plus ◆number) ◆plus ◆number)"
        check $ast("1 * 2 + 3 * 4")                          == "◆\n ((◆number ◆multiply ◆number) ◆plus (◆number ◆multiply ◆number))"
        
    test "boolean ops":
    
        check $ast("a && b || c")                            == "◆\n ((◆name ◆and ◆name) ◆or ◆name)"
        check $ast("a and b or c")                           == "◆\n ((◆name ◆and ◆name) ◆or ◆name)"
        check $ast("!a && b")                                == "◆\n ((◆not ◆name) ◆and ◆name)"
        check $ast("not a && b")                             == "◆\n ((◆not ◆name) ◆and ◆name)"
        check $ast("a || b && c")                            == "◆\n (◆name ◆or (◆name ◆and ◆name))"
        check $ast("a or b and c")                           == "◆\n (◆name ◆or (◆name ◆and ◆name))"
        check $ast("a && b == c")                            == "◆\n ((◆name ◆and ◆name) ◆equal ◆name)"
        check $ast("a and b == c")                           == "◆\n ((◆name ◆and ◆name) ◆equal ◆name)"
        check $ast("x = a || b")                             == "◆\n (◆name ◆assign (◆name ◆or ◆name))"
        check $ast("x = a or b")                             == "◆\n (◆name ◆assign (◆name ◆or ◆name))"
        check $ast("!a || !b")                               == "◆\n ((◆not ◆name) ◆or (◆not ◆name))"
        check $ast("not a or not b")                         == "◆\n ((◆not ◆name) ◆or (◆not ◆name))"

    test "parens":
    
        check $ast("(1 + 2) * 3")                            == "◆\n ((◆number ◆plus ◆number) ◆multiply ◆number)"
        check $ast("(1)")                                    == "◆\n ◆number"
        check $ast("(a + b) * c")                            == "◆\n ((◆name ◆plus ◆name) ◆multiply ◆name)"
        check $ast("a * (b + c)")                            == "◆\n (◆name ◆multiply (◆name ◆plus ◆name))"
        check $ast("((1))")                                  == "◆\n ◆number"
        check $ast("(a.b).c")                                == "◆\n ((◆name ◆dot ◆name) ◆dot ◆name)"
        
        check $ast("a * (b + c) / d")                        == "◆\n ((◆name ◆multiply (◆name ◆plus ◆name)) ◆divide ◆name)"
        check $ast("3 * (1 + 2)")                            == "◆\n (◆number ◆multiply (◆number ◆plus ◆number))"        
        
    test "func":
    
        check $ast("->")                                     == "◆\n (◆func @[])"
        check $ast("f = ->")                                 == "◆\n (◆func ◆name @[])"        
        check $ast("f = a▪string ->")                        == "◆\n (◆func ◆name @[(◆name ◆val ◆type)])"        
        check $ast("f = a▪string b▪int ->")                  == "◆\n (◆func ◆name @[(◆name ◆val ◆type), (◆name ◆val ◆type)])"        
        check $ast("f = p◆Parser a▪string b▪int ->")         == "◆\n (◆func ◆name @[(◆name ◆var ◆type), (◆name ◆val ◆type), (◆name ◆val ◆type)])"        
        check $ast("f = p◆Parser ->")                        == "◆\n (◆func ◆name @[(◆name ◆var ◆type)])"
        check $ast("f = ➜ Node ->")                          == "◆\n (◆func ◆name @[] ◆type)"
        check $ast("f = p◆Parser ➜ Node ->")                 == "◆\n (◆func ◆name @[(◆name ◆var ◆type)] ◆type)"
        check $ast("f = s▪seq[Node] ➜ seq[Node] ->")         == "◆\n (◆func ◆name @[(◆name ◆val ◆type)] ◆type)"
        check $ast("f = p▪Parser ahead▪int=1 ➜ Token ->")    == "◆\n (◆func ◆name @[(◆name ◆val ◆type), (◆name ◆val ◆type (= ◆number))] ◆type)"
        check $ast("f = p▪Parser ahead=1 ➜ Token ->")        == "◆\n (◆func ◆name @[(◆name ◆val ◆type), (◆name (= ◆number))] ◆type)"
        
    test "call":
    
        check $ast("f()")                                    == "◆\n (◆name ◆call @[])"
        check $ast("f(g())")                                 == "◆\n (◆name ◆call @[(◆name ◆call @[])])"
        check $ast("f(g() / h())")                           == "◆\n (◆name ◆call @[((◆name ◆call @[]) ◆divide (◆name ◆call @[]))])"
        check $ast("f(1)")                                   == "◆\n (◆name ◆call @[◆number])"
        check $ast("f(1 + 2)")                               == "◆\n (◆name ◆call @[(◆number ◆plus ◆number)])"
        check $ast("f(1 + 2 4 + 5)")                         == "◆\n (◆name ◆call @[(◆number ◆plus ◆number), (◆number ◆plus ◆number)])"
        check $ast("f(1 2 3)")                               == "◆\n (◆name ◆call @[◆number, ◆number, ◆number])"
        check $ast("f(1 g(h(2)))")                           == "◆\n (◆name ◆call @[◆number, (◆name ◆call @[(◆name ◆call @[◆number])])])"
        
    test "assign":
    
        check $ast("a = 1")                                  == "◆\n (◆name ◆assign ◆number)"
        check $ast("a = b = 1")                              == "◆\n (◆name ◆assign (◆name ◆assign ◆number))"
        check $ast("a = b = c = 2")                          == "◆\n (◆name ◆assign (◆name ◆assign (◆name ◆assign ◆number)))"
        
    test "properties        ":
        
        check $ast("a.b")                                    == "◆\n (◆name ◆dot ◆name)"
        check $ast("a.b.c")                                  == "◆\n ((◆name ◆dot ◆name) ◆dot ◆name)"
        check $ast("a.b()")                                  == "◆\n ((◆name ◆dot ◆name) ◆call @[])"
        check $ast("a.b().c")                                == "◆\n (((◆name ◆dot ◆name) ◆call @[]) ◆dot ◆name)"
        
    test "if":
    
        check $ast("if true then ⮐  false")                  == "◆\n (◆if @[(◆true (◆return ◆false))])"
        check $ast("if true then ⮐  1 else ⮐  2")            == "◆\n (◆if @[(◆true (◆return ◆number))] (◆return ◆number))"
        check $ast("if a ➜ 1 elif b ➜ 2 elif c ➜ 3")         == "◆\n (◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)])"
        check $ast("if a ➜ 1 elif b ➜ 2 elif c ➜ 3 else 4")  == "◆\n (◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)] ◆number)"
        check $ast("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3")          == "◆\n (◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)])"
        check $ast("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3\n  ➜ 4")   == "◆\n (◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)] ◆number)"
        
        check $ast("if a then if b then 1 else 2 else 3")    == "◆\n (◆if @[(◆name (◆if @[(◆name ◆number)] ◆number))] ◆number)"
        check $ast("x = if a then b else c")                 == "◆\n (◆name ◆assign (◆if @[(◆name ◆name)] ◆name))"
        check $ast("x = if a then b else c+d")               == "◆\n (◆name ◆assign (◆if @[(◆name ◆name)] (◆name ◆plus ◆name)))"
        
        check $ast("if a then ⮐")                            == "◆\n (◆if @[(◆name (◆return))])"
        check $ast("a + if b then c else d")                 == "◆\n (◆name ◆plus (◆if @[(◆name ◆name)] ◆name))"
        
    test "for":
    
        check $ast("0..2")                                   == "◆\n (◆number ◆doubledot ◆number)"
        check $ast("for a in 0..2 ➜ true")                   == "◆\n (◆for ◆name (◆number ◆doubledot ◆number) ◆true)"
        check $ast("for a in 0..2\n  true")                  == "◆\n (◆for ◆name (◆number ◆doubledot ◆number) ◆\n ◆true)"
        check $ast("for a in 0..2 ➜\n  true")                == "◆\n (◆for ◆name (◆number ◆doubledot ◆number) ◆\n ◆true)"
        
    test "switch":
    
        check $ast("switch x\n  a ➜ 1\n  b c ➜ 2")           == "◆\n (◆switch ◆name @[(@[◆name] ◆number), (@[◆name, ◆name] ◆number)])"
        check $ast("switch x\n  a ➜ 1\n  b c ➜ 2\n  ➜ 4")    == "◆\n (◆switch ◆name @[(@[◆name] ◆number), (@[◆name, ◆name] ◆number)] ◆number)"

        check $ast("switch x\n  1 2 ➜ a")                    == "◆\n (◆switch ◆name @[(@[◆number, ◆number] ◆name)])"
        check $ast("switch x\n  1 2 ➜ a\n  3 ➜ b")           == "◆\n (◆switch ◆name @[(@[◆number, ◆number] ◆name), (@[◆number] ◆name)])"
        check $ast("switch x\n  1 2 ➜ a\n  3 ➜ b\n  else c") == "◆\n (◆switch ◆name @[(@[◆number, ◆number] ◆name), (@[◆number] ◆name)] ◆name)"
        check $ast("switch x\n  1 2 ➜ a\n  3 ➜ b\n  ➜ c")    == "◆\n (◆switch ◆name @[(@[◆number, ◆number] ◆name), (@[◆number] ◆name)] ◆name)"
        check $ast("switch x\n  1 2\n    a\n  ➜ c")          == "◆\n (◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)"
        check $ast("switch x\n  1 2➜\n    a\n  ➜ c")         == "◆\n (◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)"
        check $ast("switch x\n  1 2 ➜ a\n  else\n    c")     == "◆\n (◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)"
        check $ast("switch x\n  1 2 ➜ a\n  ➜\n    c")        == "◆\n (◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)"
        check $ast("switch x\n a ➜ if b then c")             == "◆\n (◆switch ◆name @[(@[◆name] (◆if @[(◆name ◆name)]))])"
        
    test "strings":
    
        check $ast("s = \"hello\"")                          == "◆\n (◆name ◆assign ◆string)"
        
    test "toplevel":

        check $ast("")                                       == "◆"
        check $ast("42")                                     == "◆\n ◆number"
        check $ast("true")                                   == "◆\n ◆true"
        check $ast("false")                                  == "◆\n ◆false"
        check $ast("\"hello\"")                              == "◆\n ◆string"
        
    test "tests":
    
        check $ast("▸ a test suite")                         == "◆\n ◆test"
        check ast("▸ a test suite").expressions[0].kind      == ●testSuite
        
        check $ast("    ▸ test section")                     == "◆\n ◆test"
        check ast("    ▸ test section").expressions[0].kind  == ●testSection
        
        check $ast("    f(a) ▸ 42")                          == "◆\n ((◆name ◆call @[◆name]) ◆test ◆number)"
        check $ast("    f(a) ▸\n        42")                 == "◆\n ((◆name ◆call @[◆name]) ◆test ◆number)"
        
