# ████████    ███████   ████████    ███████
# ███   ███  ███   ███  ███   ███  ███     
# ████████   █████████  ███████    ███████ 
# ███        ███   ███  ███   ███       ███
# ███        ███   ███  ███   ███  ███████ 

import ../kommon
import ../pars
    
template t(a:string, b:string) = testCmp(a, $ast(a), b, instantiationInfo())

suite "pars":

    test "math ops":
        
        t "1 + 5 * 3"                               , "▪[(◆number + (◆number * ◆number))]"
        t "1 * 5 - 3"                               , "▪[((◆number * ◆number) - ◆number)]"
        t "-5 - -3"                                 , "▪[((- ◆number) - (- ◆number))]"
        t "a++ + b--"                               , "▪[((◆name ++) + (◆name --))]"
        t "1 + 2 + 3"                               , "▪[((◆number + ◆number) + ◆number)]"
        t "1 * 2 + 3 * 4"                           , "▪[((◆number * ◆number) + (◆number * ◆number))]"
        
    test "boolean ops":
    
        t "a && b || c"                             , "▪[((◆name && ◆name) || ◆name)]"
        t "a and b or c"                            , "▪[((◆name && ◆name) || ◆name)]"
        t "!a && b"                                 , "▪[((! ◆name) && ◆name)]"
        t "not a && b"                              , "▪[((! ◆name) && ◆name)]"
        t "a || b && c"                             , "▪[(◆name || (◆name && ◆name))]"
        t "a or b and c"                            , "▪[(◆name || (◆name && ◆name))]"
        t "a && b == c"                             , "▪[((◆name && ◆name) == ◆name)]"
        t "a and b == c"                            , "▪[((◆name && ◆name) == ◆name)]"
        t "x = a || b"                              , "▪[(◆name = (◆name || ◆name))]"
        t "x = a or b"                              , "▪[(◆name = (◆name || ◆name))]"
        t "!a || !b"                                , "▪[((! ◆name) || (! ◆name))]"
        t "not a or not b"                          , "▪[((! ◆name) || (! ◆name))]"
        
    test "comparison ops":
    
        t "a == b"                                  , "▪[(◆name == ◆name)]"
        t "a != b"                                  , "▪[(◆name != ◆name)]"
        t "a >= b"                                  , "▪[(◆name >= ◆name)]"
        t "a <= b"                                  , "▪[(◆name <= ◆name)]"

    test "parens":
    
        t "(1 + 2) * 3"                             , "▪[((◆number + ◆number) * ◆number)]"
        t "(1)"                                     , "▪[◆number]"
        t "(a + b) * c"                             , "▪[((◆name + ◆name) * ◆name)]"
        t "a * (b + c)"                             , "▪[(◆name * (◆name + ◆name))]"
        t "((1))"                                   , "▪[◆number]"
        t "(a.b).c"                                 , "▪[((◆name . ◆name) . ◆name)]"
        t "a.b.c"                                   , "▪[((◆name . ◆name) . ◆name)]"
        
        t "a * (b + c) / d"                         , "▪[((◆name * (◆name + ◆name)) / ◆name)]"
        t "3 * (1 + 2)"                             , "▪[(◆number * (◆number + ◆number))]"
        
    test "types":
    
        t "files ◇ seq[string] = @[]"               , "▪[(◆name ◇ ◆type (= (◆name[])))]"         
        
    test "func":
    
        t "->"                                      , "▪[(-> @[])]"
        t "f = ->"                                  , "▪[(-> ◆name @[])]" 
        t "f = a◇string ->"                         , "▪[(-> ◆name @[(◆name ◇ ◆type)])]"
        t "f = a◇string b◇int ->"                   , "▪[(-> ◆name @[(◆name ◇ ◆type), (◆name ◇ ◆type)])]"
        t "f = p◆Parser a◇string b◇int ->"          , "▪[(-> ◆name @[(◆name ◆ ◆type), (◆name ◇ ◆type), (◆name ◇ ◆type)])]"
        t "f = p◆Parser ->"                         , "▪[(-> ◆name @[(◆name ◆ ◆type)])]"
        t "f = ➜ Node ->"                           , "▪[(-> ◆name @[] ◆type)]"
        t "f = p◆Parser ➜ Node ->"                  , "▪[(-> ◆name @[(◆name ◆ ◆type)] ◆type)]"
        t "f = s◇seq[Node] ➜ seq[Node] ->"          , "▪[(-> ◆name @[(◆name ◇ ◆type)] ◆type)]"
        t "f = p◇Parser ahead◇int=1 ➜ Token ->"     , "▪[(-> ◆name @[(◆name ◇ ◆type), (◆name ◇ ◆type (= ◆number))] ◆type)]"
        t "f = p◇Parser ahead=1 ➜ Token ->"         , "▪[(-> ◆name @[(◆name ◇ ◆type), (◆name (= ◆number))] ◆type)]"
        
        t "f = i ◇ int ->"                          , "▪[(-> ◆name @[(◆name ◇ ◆type)])]"
        t "f = a ◇ int b ◇ int ->"                  , "▪[(-> ◆name @[(◆name ◇ ◆type), (◆name ◇ ◆type)])]"
        t "f = a ◇ int = 1 ->"                      , "▪[(-> ◆name @[(◆name ◇ ◆type (= ◆number))])]"
        
    test "func body":
    
        t "f = ->\n  b = 1 + 2\n  b += 3"           , "▪[(-> ◆name @[] ▪[(◆name = (◆number + ◆number))(◆name += ◆number)])]" 
        
    test "call":
    
        t "f()"                                     , "▪[(◆name ◆call @[])]"
        t "f(g())"                                  , "▪[(◆name ◆call @[(◆name ◆call @[])])]"
        t "f(g() / h())"                            , "▪[(◆name ◆call @[((◆name ◆call @[]) / (◆name ◆call @[]))])]"
        t "f(1)"                                    , "▪[(◆name ◆call @[◆number])]"
        t "f(1 + 2)"                                , "▪[(◆name ◆call @[(◆number + ◆number)])]"
        t "f(1 + 2 4 + 5)"                          , "▪[(◆name ◆call @[(◆number + ◆number), (◆number + ◆number)])]"
        t "f(1 2 3)"                                , "▪[(◆name ◆call @[◆number, ◆number, ◆number])]"
        t "f(1 g(h(2)))"                            , "▪[(◆name ◆call @[◆number, (◆name ◆call @[(◆name ◆call @[◆number])])])]"
    
    test "implicit call    ":
    
        t "f a"                                     , "▪[(◆name ◆call @[◆name])]"
        t "f a.b"                                   , "▪[(◆name ◆call @[(◆name . ◆name)])]"
        t "f a.b, c"                                , "▪[(◆name ◆call @[(◆name . ◆name), ◆name])]"
        t "f a.b c"                                 , "▪[(◆name ◆call @[(◆name . ◆name), ◆name])]"
        t "f(a.b c)"                                , "▪[(◆name ◆call @[(◆name . ◆name), ◆name])]"
        t "f a.b(c)"                                , "▪[(◆name ◆call @[((◆name . ◆name) ◆call @[◆name])])]"
        t "f a[0] c"                                , "▪[(◆name ◆call @[(◆name[◆number]), ◆name])]"
        t "f(a[0] c)"                               , "▪[(◆name ◆call @[(◆name[◆number]), ◆name])]"
        
    test "arglist":
    
        t "f(a, b, c)"                              , "▪[(◆name ◆call @[◆name, ◆name, ◆name])]"
        t "f a, b, c"                               , "▪[(◆name ◆call @[◆name, ◆name, ◆name])]"
        t "(a, b, c) = f()"                         , "▪[(◆[◆name, ◆name, ◆name] = (◆name ◆call @[]))]"
        # ϝ𝚒𝓍⫙ϵ!
        # t "(a b c) = f()"                         , "▪[(@[◆name, ◆name, ◆name] = (◆name ◆call @[]))]"
        
    test "assign":
    
        t "a = 1"                                   , "▪[(◆name = ◆number)]"
        t "a = b = 1"                               , "▪[(◆name = (◆name = ◆number))]"
        t "a = b = c = 2"                           , "▪[(◆name = (◆name = (◆name = ◆number)))]"
        
        t "(a, b) = c"                              , "▪[(◆[◆name, ◆name] = ◆name)]"
        
    test "property access        ":
        
        t "a.b"                                     , "▪[(◆name . ◆name)]"
        t "a.b.c"                                   , "▪[((◆name . ◆name) . ◆name)]"
        t "a.b()"                                   , "▪[((◆name . ◆name) ◆call @[])]"
        t "a.b().c"                                 , "▪[(((◆name . ◆name) ◆call @[]) . ◆name)]"
        
    test "array access":
    
        t "a[0]"                                    , "▪[(◆name[◆number])]"
        
    test "if":
    
        t "if true then ⮐  false"                   , "▪[(◆if @[(✔ (⮐ ✘))])]"
        t "if true then ⮐  1 else ⮐  2"             , "▪[(◆if @[(✔ (⮐ ◆number))] (⮐ ◆number))]"
        t "if a ➜ 1 elif b ➜ 2 elif c ➜ 3"          , "▪[(◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)])]"
        t "if a ➜ 1 elif b ➜ 2 elif c ➜ 3 else 4"   , "▪[(◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)] ◆number)]"
        t "if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3"           , "▪[(◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)])]"
        t "if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3\n  ➜ 4"    , "▪[(◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)] ◆number)]"
        
        t "if a then if b then 1 else 2 else 3"     , "▪[(◆if @[(◆name (◆if @[(◆name ◆number)] ◆number))] ◆number)]"
        t "x = if a then b else c"                  , "▪[(◆name = (◆if @[(◆name ◆name)] ◆name))]"
        t "x = if a then b else c+d"                , "▪[(◆name = (◆if @[(◆name ◆name)] (◆name + ◆name)))]"
        
        t "if a then ⮐"                             , "▪[(◆if @[(◆name (⮐))])]"
        t "a + if b then c else d"                  , "▪[(◆name + (◆if @[(◆name ◆name)] ◆name))]"
        
        t "if true\n  log msg"                      , "▪[(◆if @[(✔ ▪[(◆name ◆call @[◆name])])])]"
        t "if true\n  log(1)\n  log(2)"             , "▪[(◆if @[(✔ ▪[(◆name ◆call @[◆number])(◆name ◆call @[◆number])])])]"
        
        t "if a ➜ 1\nelif b == 2 ➜ 2"               , "▪[(◆if @[(◆name ◆number), ((◆name == ◆number) ◆number)])]"
        
    test "for":
    
        t "0..2"                                    , "▪[(◆number .. ◆number)]"
        t "for a in 0..2 ➜ true"                    , "▪[(◆for ◆name in (◆number .. ◆number) ✔)]"
        t "for a in 0..2\n  true"                   , "▪[(◆for ◆name in (◆number .. ◆number) ▪[✔])]"
        t "for a in 0..2 ➜\n  true"                 , "▪[(◆for ◆name in (◆number .. ◆number) ▪[✔])]"
        t "for key val in a"                        , "▪[(◆for ◆[◆name, ◆name] in ◆name)]"  
        t "for kind, key, val in a"                 , "▪[(◆for ◆[◆name, ◆name, ◆name] in ◆name)]"  
        
    test "switch":
    
        t "switch x\n  a ➜ 1\n  b c ➜ 2"            , "▪[(◆switch ◆name @[(@[◆name] ◆number), (@[◆name, ◆name] ◆number)])]"
        t "switch x\n  a ➜ 1\n  b c ➜ 2\n  ➜ 4"     , "▪[(◆switch ◆name @[(@[◆name] ◆number), (@[◆name, ◆name] ◆number)] ◆number)]"

        t "switch x\n  1 2 ➜ a"                     , "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name)])]"
        t "switch x\n  1 2 ➜ a\n  3 ➜ b"            , "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name), (@[◆number] ◆name)])]"
        t "switch x\n  1 2 ➜ a\n  3 ➜ b\n  else c"  , "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name), (@[◆number] ◆name)] ◆name)]"
        t "switch x\n  1 2 ➜ a\n  3 ➜ b\n  ➜ c"     , "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name), (@[◆number] ◆name)] ◆name)]"
        t "switch x\n  1 2\n    a\n  ➜ c"           , "▪[(◆switch ◆name @[(@[◆number, ◆number] ▪[◆name])] ◆name)]"
        t "switch x\n  1 2➜\n    a\n  ➜ c"          , "▪[(◆switch ◆name @[(@[◆number, ◆number] ▪[◆name])] ◆name)]"
        t "switch x\n  1 2 ➜ a\n  else\n    c"      , "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)]"
        t "switch x\n  1 2 ➜ a\n  ➜\n    c"         , "▪[(◆switch ◆name @[(@[◆number, ◆number] ◆name)] ◆name)]"
        t "switch x\n a ➜ if b then c"              , "▪[(◆switch ◆name @[(@[◆name] (◆if @[(◆name ◆name)]))])]"
        
    test "while":
    
        t "while true"                              , "▪[(◆while ✔)]"
        t "while false ➜ 1"                         , "▪[(◆while ✘ ◆number)]"
        t "while false ➜\n 1"                       , "▪[(◆while ✘ ▪[◆number])]"
        t "while false\n 1"                         , "▪[(◆while ✘ ▪[◆number])]"
        t "while 2\n continue"                      , "▪[(◆while ◆number ▪[◆continue])]"
        t "while 2\n break"                         , "▪[(◆while ◆number ▪[◆break])]"
        
    test "strings":
    
        t "s = \"hello\""                           , "▪[(◆name = ◆string)]"
        t "s = \"\"\"hello\"\"\""                   , "▪[(◆name = ◆string)]"
        t "s = \"\"\"\n\n\"\"\""                    , "▪[(◆name = ◆string)]"
        t "s = \"\"\"num #{1+2} end\"\"\""          , "▪[(◆name = ◆string#{@[(◆number + ◆number)]})]"
        t "s = \"\"\"\nl1 #{1}\nl2 #{2}\"\"\""      , "▪[(◆name = ◆string#{@[◆number] @[◆number]})]"
        
        t "\"a #{1} e\""                            , "▪[◆string#{@[◆number]}]"
        t "\"a #{1}\""                              , "▪[◆string#{@[◆number]}]"
        t "\"#{1}\""                                , "▪[◆string#{@[◆number]}]"
        
    test "toplevel":

        t ""                                        , "▪[]"
        t "42"                                      , "▪[◆number]"
        t "true"                                    , "▪[✔]"
        t "false"                                   , "▪[✘]"
        t "\"hello\""                               , "▪[◆string]"
        
    test "use":
    
        t "use rndr"                                , "▪[(◆use ◆name)]"
        t "use std ▪ unittest"                      , "▪[(◆use ◆name ▪ @[◆name])]"
        t "use ../rndr"                             , "▪[(◆use ◆name)]"
        t "use std ▪ os logging\nuse kommon"        , "▪[(◆use ◆name ▪ @[◆name, ◆name])(◆use ◆name)]"
        t "use std ▪ a b c\nuse d\nuse e\nuse f"    , "▪[(◆use ◆name ▪ @[◆name, ◆name, ◆name])(◆use ◆name)(◆use ◆name)(◆use ◆name)]" 

        t "import ../../rel/[s1, s2]"               , "▪[◆import]"
        
    test "var":
        
        t "var a = 1"                               , "▪[(◆ ◆name (= ◆number))]"
        t "let a = 1"                               , "▪[(◇ ◆name (= ◆number))]"
        t "◆a = 1"                                  , "▪[(◆ ◆name (= ◆number))]"
        t "◇a = 1"                                  , "▪[(◇ ◆name (= ◆number))]"
        t "◆str = \"\"\n◆bool = false\n◆num = 1"    , "▪[(◆ ◆name (= ◆string))(◆ ◆name (= ✘))(◆ ◆name (= ◆number))]"
        
    test "tests":
    
        t "▸ a test suite"                          , "▪[(▸ suite)]"
        check ast("▸ a test suite").expressions[0].kind      == ●testSuite
        
        t "    ▸ test section"                      , "▪[(▸ section)]"
        check ast("    ▸ test section").expressions[0].kind  == ●testSection
        
        t "    f(a) ▸ 42"                           , "▪[((◆name ◆call @[◆name]) ▸ ◆number)]"
        t "    f(a) ▸\n        42"                  , "▪[((◆name ◆call @[◆name]) ▸ ◆number)]"
        
        t "▸ suite\n  ▸ test"                       , "▪[(▸ suite ▪[(▸ section)])]"
        
        t """
▸ rndr
   ▸ toplevel
       rndr("")   ▸ ""
       rndr("42") ▸ "42" """  , "▪[(▸ suite ▪[(▸ section ▪[((◆name ◆call @[◆string]) ▸ ◆string)((◆name ◆call @[◆string]) ▸ ◆string)])])]"

    test "blocks":
    
        t """
f = -> 
    if x
        2
    1
"""  , "▪[(-> ◆name @[] ▪[(◆if @[(◆name ▪[◆number])])◆number])]"

        t """
f = -> 
    g = -> 
        2
        2
    1
"""  , "▪[(-> ◆name @[] ▪[(-> ◆name @[] ▪[◆number◆number])◆number])]"

        t """
f = -> 
    g = -> 
        2
        2
    1
0
0"""  , "▪[(-> ◆name @[] ▪[(-> ◆name @[] ▪[◆number◆number])◆number])◆number◆number]"

        t """
◇icon = 
    if ex == ".kim"
        "  "
    else
        "  """"  , "▪[(◇ ◆name (= ▪[(◆if @[((◆name == ◆string) ▪[◆string])] ▪[◆string])]))]"
        
