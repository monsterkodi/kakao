# ███      ████████  ███   ███  ███
# ███      ███        ███ ███   ███
# ███      ███████     █████    ███
# ███      ███        ███ ███   ███
# ███████  ████████  ███   ███  ███

import std/[pegs, strutils, strformat, unittest]
import ../kommon
import ../pars
import ../lexi

suite "pars":

    test "ast":
        
        check $ast("a = 1")                                  == "◆root\n (◆name ◆assign ◆number)"
        check $ast("1 + 5 * 3")                              == "◆root\n (◆number ◆plus (◆number ◆multiply ◆number))"
        check $ast("1 / 5 - 3")                              == "◆root\n (◆number ◆divide (◆number ◆minus ◆number))"
        check $ast("-5 - -3")                                == "◆root\n ((◆minus ◆number) ◆minus (◆minus ◆number))"
        check $ast("a++ + b--")                              == "◆root\n ((◆name ◆increment) ◆plus (◆name ◆decrement))"
        check $ast("if true then ⮐  false")                  == "◆root\n (◆if @[(◆true (◆return ◆false))])"
        check $ast("if true then ⮐  1 else ⮐  2")            == "◆root\n (◆if @[(◆true (◆return ◆number))] (◆return ◆number))"
        check $ast("if a ➜ 1 elif b ➜ 2 elif c ➜ 3")         == "◆root\n (◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)])"
        check $ast("if a ➜ 1 elif b ➜ 2 elif c ➜ 3 else 4")  == "◆root\n (◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)] ◆number)"
        check $ast("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3")          == "◆root\n (◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)])"
        check $ast("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3\n  ➜ 4")   == "◆root\n (◆if @[(◆name ◆number), (◆name ◆number), (◆name ◆number)] ◆number)"
        check $ast("switch x\n  a ➜ 1\n  b c ➜ 2")           == "◆root\n (◆switch ◆name @[(@[◆name] ◆number), (@[◆name, ◆name] ◆number)])"
        check $ast("switch x\n  a ➜ 1\n  b c ➜ 2\n  ➜ 4")    == "◆root\n (◆switch ◆name @[(@[◆name] ◆number), (@[◆name, ◆name] ◆number)] ◆number)"
        
