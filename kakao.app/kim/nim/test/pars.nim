# ████████    ███████   ████████    ███████
# ███   ███  ███   ███  ███   ███  ███     
# ████████   █████████  ███████    ███████ 
# ███        ███   ███  ███   ███       ███
# ███        ███   ███  ███   ███  ███████ 

import std/[unittest]
import ../pars

suite "pars":

    test "math ops":
        
        check $ast("1 + 5 * 3")                              == "◆root\n (◆number ◆plus (◆number ◆multiply ◆number))"
        check $ast("1 / 5 - 3")                              == "◆root\n (◆number ◆divide (◆number ◆minus ◆number))"
        check $ast("-5 - -3")                                == "◆root\n ((◆minus ◆number) ◆minus (◆minus ◆number))"
        check $ast("a++ + b--")                              == "◆root\n ((◆name ◆increment) ◆plus (◆name ◆decrement))"
        check $ast("1 + 2 + 3")                              == "◆root\n ((◆number ◆plus ◆number) ◆plus ◆number)"
        check $ast("1 * 2 + 3 * 4")                          == "◆root\n ((◆number ◆multiply ◆number) ◆plus (◆number ◆multiply ◆number))"
        
    test "boolean ops":
    
        check $ast("a && b || c")                            == "◆root\n ((◆name ◆and ◆name) ◆or ◆name)"
        check $ast("a and b or c")                           == "◆root\n ((◆name ◆and ◆name) ◆or ◆name)"
        check $ast("!a && b")                                == "◆root\n ((◆not ◆name) ◆and ◆name)"
        check $ast("not a && b")                             == "◆root\n ((◆not ◆name) ◆and ◆name)"
        check $ast("a || b && c")                            == "◆root\n (◆name ◆or (◆name ◆and ◆name))"
        check $ast("a or b and c")                           == "◆root\n (◆name ◆or (◆name ◆and ◆name))"
        check $ast("a && b == c")                            == "◆root\n ((◆name ◆and ◆name) ◆equal ◆name)"
        check $ast("a and b == c")                           == "◆root\n ((◆name ◆and ◆name) ◆equal ◆name)"
        check $ast("x = a || b")                             == "◆root\n (◆name ◆assign (◆name ◆or ◆name))"
        check $ast("x = a or b")                             == "◆root\n (◆name ◆assign (◆name ◆or ◆name))"
        check $ast("!a || !b")                               == "◆root\n ((◆not ◆name) ◆or (◆not ◆name))"
        check $ast("not a or not b")                         == "◆root\n ((◆not ◆name) ◆or (◆not ◆name))"

    test "parens":
    
        check $ast("(1 + 2) * 3")                            == "◆root\n ((◆number ◆plus ◆number) ◆multiply ◆number)"
        check $ast("(1)")                                    == "◆root\n ◆number"
        check $ast("(a + b) * c")                            == "◆root\n ((◆name ◆plus ◆name) ◆multiply ◆name)"
        check $ast("a * (b + c)")                            == "◆root\n (◆name ◆multiply (◆name ◆plus ◆name))"
        check $ast("((1))")                                  == "◆root\n ◆number"
        check $ast("(a.b).c")                                == "◆root\n ((◆name ◆dot ◆name) ◆dot ◆name)"
        
        check $ast("a * (b + c) / d")                        == "◆root\n ((◆name ◆multiply (◆name ◆plus ◆name)) ◆divide ◆name)"
        check $ast("3 * (1 + 2)")                            == "◆root\n (◆number ◆multiply (◆number ◆plus ◆number))"        
        
    test "call":
    
        check $ast("f(1)")                                   == "◆root\n (◆name ◆call @[◆number])"
        check $ast("f(1 + 2)")                               == "◆root\n (◆name ◆call @[(◆number ◆plus ◆number)])"
        
    test "assign":
    
        check $ast("a = 1")                                  == "◆root\n (◆name ◆assign ◆number)"
        check $ast("a = b = 1")                              == "◆root\n (◆name ◆assign (◆name ◆assign ◆number))"
        check $ast("a = b = c = 2")                          == "◆root\n (◆name ◆assign (◆name ◆assign (◆name ◆assign ◆number)))"
        
    test "properties        ":
        
        check $ast("a.b")                                    == "◆root\n (◆name ◆dot ◆name)"
        check $ast("a.b.c")                                  == "◆root\n ((◆name ◆dot ◆name) ◆dot ◆name)"
        
    test "if":
    
        check $ast("if true then ⮐  false")                  == "◆root\n (◆if @[(◆true (◆return ◆false))])"
        check $ast("if true then ⮐  1 else ⮐  2")            == "◆root\n (◆if @[(◆true (◆return ◆number))] (◆return ◆number))"
        check $ast("if a ➜ 1 elif b ➜ 2 elif c ➜ 3")         == "◆root\n (◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)])"
        check $ast("if a ➜ 1 elif b ➜ 2 elif c ➜ 3 else 4")  == "◆root\n (◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)] ◆number)"
        check $ast("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3")          == "◆root\n (◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)])"
        check $ast("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3\n  ➜ 4")   == "◆root\n (◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)] ◆number)"
        
        check $ast("if a then if b then 1 else 2 else 3")    == "◆root\n (◆if @[(◆name (◆if @[(◆name ◆number)] ◆number))] ◆number)"
        check $ast("x = if a then b else c")                 == "◆root\n (◆name ◆assign (◆if @[(◆name ◆name)] ◆name))"
        check $ast("x = if a then b else c+d")               == "◆root\n (◆name ◆assign (◆if @[(◆name ◆name)] (◆name ◆plus ◆name)))"
        
        check $ast("if a then ⮐")                            == "◆root\n (◆if @[(◆name (◆return))])"
        
    test "switch":
    
        check $ast("switch x\n  a ➜ 1\n  b c ➜ 2")           == "◆root\n (◆switch ◆name @[(@[◆name] ◆number), (@[◆name, ◆name] ◆number)])"
        check $ast("switch x\n  a ➜ 1\n  b c ➜ 2\n  ➜ 4")    == "◆root\n (◆switch ◆name @[(@[◆name] ◆number), (@[◆name, ◆name] ◆number)] ◆number)"

        check $ast("switch x\n  1 2 ➜ a")                    == "◆root\n (◆switch ◆name @[(@[◆number, ◆number] ◆name)])"
        check $ast("switch x\n  1 2 ➜ a\n  3 ➜ b")           == "◆root\n (◆switch ◆name @[(@[◆number, ◆number] ◆name), (@[◆number] ◆name)])"
        check $ast("switch x\n  1 2 ➜ a\n  3 ➜ b\n  else c") == "◆root\n (◆switch ◆name @[(@[◆number, ◆number] ◆name), (@[◆number] ◆name)] ◆name)"
        check $ast("switch x\n  1 2 ➜ a\n  3 ➜ b\n  ➜ c")    == "◆root\n (◆switch ◆name @[(@[◆number, ◆number] ◆name), (@[◆number] ◆name)] ◆name)"
        check $ast("switch x\n  1 2\n    a\n  ➜ c")          == "◆root\n (◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)"
        check $ast("switch x\n  1 2➜\n    a\n  ➜ c")         == "◆root\n (◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)"
        check $ast("switch x\n  1 2 ➜ a\n  else\n    c")     == "◆root\n (◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)"
        check $ast("switch x\n  1 2 ➜ a\n  ➜\n    c")        == "◆root\n (◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)"
        
    test "strings":
    
        check $ast("\"hello\"")                              == "◆root\n ◆string"
        check $ast("s = \"hello\"")                          == "◆root\n (◆name ◆assign ◆string)"
        
    test "edge_cases":

        check $ast("")                                       == "◆root"
        check $ast("42")                                     == "◆root\n ◆number"

        check $ast("a + if b then c else d")                 == "◆root\n (◆name ◆plus (◆if @[(◆name ◆name)] ◆name))"
        check $ast("switch x\n a ➜ if b then c")             == "◆root\n (◆switch ◆name @[(@[◆name] (◆if @[(◆name ◆name)]))])"
        
