# ████████   ███   ███  ███████    ████████ 
# ███   ███  ████  ███  ███   ███  ███   ███
# ███████    ███ █ ███  ███   ███  ███████  
# ███   ███  ███  ████  ███   ███  ███   ███
# ███   ███  ███   ███  ███████    ███   ███
import ../rndr
template t(a:string, b:string) = testCmp(a, render(a, false), b, instantiationInfo())
suite "rndr": 
    test "toplevel": 
        t("", "")
        t("43", "43")
        t("true", "true")
        t("false", "false")
        t("\"hello\"", "\"hello\"")
        t("# comment", "# comment")
        t("\n\n# comment\n\n", "# comment")
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
    test "ampersand                                     ": 
        t("a & b", "a & b")
    test "parens                                        ": 
        t("(1 + 2) * 3", "((1 + 2) * 3)")
        t("(1)", "1")
        t("(a + b) * c", "((a + b) * c)")
        t("a * (b + c)", "(a * (b + c))")
        t("((1))", "1")
        t("(a.b).c", "a.b.c")
        t("a * (b + c) / d", "((a * (b + c)) / d)")
        t("3 * (1 + 2)", "(3 * (1 + 2))")
    test "vars": 
        t("optParser = initOptParser()", "optParser = initOptParser()")
        t("str = \"\"\nbool = false\nnum = 1", "str = \"\"\nbool = false\nnum = 1")
        t("s ◇string", "s : string")
        t("i ◇int = 1", "i : int = 1")
        t("l ◇seq[int]", "l : seq[int]")
        t("var i", "var i")
        t("let i", "let i")
        t("let (output exitCode) = execCmdEx(cmd)", "let (output, exitCode) = execCmdEx(cmd)")
    test "arg types": 
        t("◇seq[string] files = @[]", "files : seq[string] = @[]")
        t("◇ seq[string] files      = @[]", "files : seq[string] = @[]")
    test "func": 
        t("f = ->", "proc f")
        t("f = a=1 ->", "proc f(a = 1)")
        t("f = ◇string a ->", "proc f(a : string)")
        t("f = ◇string a ◇int b ->", "proc f(a : string, b : int)")
        t("f = ◆Parser p ->", "proc f(p : var Parser)")
        t("f = ◆Parser p ◇string a ◇int b ->", "proc f(p : var Parser, a : string, b : int)")
        t("f = ➜ Node ->", "proc f() : Node")
        t("f = ◆Parser p ➜ Node ->", "proc f(p : var Parser) : Node")
        t("f = ◇seq[Node] s ➜ seq[Node] ->", "proc f(s : seq[Node]) : seq[Node]")
        t("f = ◇Parser p ◇int ahead=1 ➜ Token ->", "proc f(p : Parser, ahead : int = 1) : Token")
        t("f = ◇Parser p ahead=1 ➜ Token ->", "proc f(p : Parser, ahead = 1) : Token")
        t("l.map(◇tuple r ➜string -> r.path)", "l.map(proc (r : tuple) : string = r.path)")
        t("l.map(◇ tuple r  ➜ string -> r.path)", "l.map(proc (r : tuple) : string = r.path)")
        t("f = ◇int i ->", "proc f(i : int)")
        t("f = ◇int a ◇int b ->", "proc f(a : int, b : int)")
        t("f = ◇int a = 1 ->", "proc f(a : int = 1)")
        t("setHook(() -> {.noconv.} quit(0))", "setHook(proc () {.noconv.} = quit(0))")
        t("$* = ◇Tknzr t ➜string ->", "proc `$`*(t : Tknzr) : string")
        t("$ = ◇Tknzr t ➜string ->", "proc `$`(t : Tknzr) : string")
        t("commit = ◇Tknzr t i=0 ->", "proc commit(t : Tknzr, i = 0)")
        t("commit = ◇Tknzr t i=◂assign ->", "proc commit(t : Tknzr, i = ◂assign)")
        t("commit = ◇Tknzr t i=\"\" ->", "proc commit(t : Tknzr, i = \"\")")
        t("commit = ◇Tknzr t a=1 b=2 ->", "proc commit(t : Tknzr, a = 1, b = 2)")
        t("expression = ◇Parser p precedenceRight=0 ➜Node ->\nx", "proc expression(p : Parser, precedenceRight = 0) : Node\nx")
        t("spc = ◇Rndr r -> r.s &= \" \"", "proc spc(r : Rndr) = (r.s &= \" \")")
        t("""
hook = -> {.noconv.}
    1 + 2
""", """
proc hook {.noconv.} = 
    (1 + 2)""")
        t("pushToken = ◇Tknzr t str=2 tk=3 incr=0 ->", "proc pushToken(t : Tknzr, str = 2, tk = 3, incr = 0)")
        t("pushToken = ◇Tknzr t str=\"\" incr=0 ->", "proc pushToken(t : Tknzr, str = \"\", incr = 0)")
        t("pushToken = ◇Tknzr t str=\"\" tk=◂name incr=0 ->", "proc pushToken(t : Tknzr, str = \"\", tk = ◂name, incr = 0)")
    test "call": 
        t("f()", "f()")
        t("f(g())", "f(g())")
        t("f(g() / h())", "f((g() / h()))")
        t("f(1)", "f(1)")
        t("f(1 + 2)", "f((1 + 2))")
        t("f(1 + 2 4 + 5)", "f((1 + 2), (4 + 5))")
        t("f(1 2 3)", "f(1, 2, 3)")
        t("f(1 g(h(2)))", "f(1, g(h(2)))")
        t("f = dir(a().b() / \"x\").toSeq()", "f = dir((a().b() / \"x\")).toSeq()")
        t("f = dir(a().b()[0] / \"x\").toSeq()", "f = dir((a().b()[0] / \"x\")).toSeq()")
        t("log a", "echo(a)")
        t("let p = startProcess command = \"nim\" args = [\"r\" f] options = {poStdErrToStdOut poUsePath}", "let p = startProcess(command = \"nim\", args = @[\"r\", f], options = {poStdErrToStdOut, poUsePath})")
    test "arglist": 
        t("f(a, b, c)", "f(a, b, c)")
        t("g a, b, c", "g(a, b, c)")
        t("h a b c", "h(a, b, c)")
        t("i 1 '2' false", "i(1, '2', false)")
        t("t \"a\" , \"b\"", "t(\"a\", \"b\")")
        t("t \"a\",\n  \"b\"", "t(\"a\", \"b\")")
        t("t \"a\"\n  \"b\"", "t(\"a\", \"b\")")
    test "tuple assign": 
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
# comment
b = false""")
    test "arrays": 
        t("a = [ 1  2 ]", "a = @[1, 2]")
        t("a = [\n    1\n    2\n    ]", "a = @[1, 2]")
        t("s.vars.push initTable[string,bool]()", "s.vars.push(initTable[string, bool]())")
        t("let mono = getMonoTime() - timers[msg][0]", "let mono = (getMonoTime() - timers[msg][0])")
        t("""
let greetings = [
    "💋 Keep It Simple, Stupid!",
    "💋 Overthink less, grin more!"
    ]
""", """
let greetings = @["💋 Keep It Simple, Stupid!", "💋 Overthink less, grin more!"]""")
    test "properties        ": 
        t("a.b", "a.b")
        t("a.b.c", "a.b.c")
        t("a.b()", "a.b()")
        t("a.b().c", "a.b().c")
    test "use                                           ": 
        t("use std ▪ unittest", "import std/[unittest]")
        t("use std ▪ pegs strutils strformat", "import std/[pegs, strutils, strformat]")
        t("use rndr", "import rndr")
        t("use ./rndr", "import ./rndr")
        t("use ../rndr", "import ../rndr")
        t("use ../../rel", "import ../../rel")
        t("use ../../rel ▪ s1 s2", "import ../../rel/[s1, s2]")
        t("import ../../rel/[s1, s2]", "import ../../rel/[s1, s2]")
        t("use std ▪ os logging\nuse kommon", "import std/[os, logging]\nimport kommon")
        t("use std ▪ a b c\nuse d\nuse e\nuse f", "import std/[a, b, c]\nimport d\nimport e\nimport f")
        t("use a b c", "import a\nimport b\nimport c")
    test "if                                            ": 
        t("if true then ⮐  false", "if true: return false")
        t("if true then ⮐  1 else ⮐  2", "if true: return 1 else: return 2")
        t("if a ➜ 1 elif b ➜ 2 elif c ➜ 3", "if a: 1 elif b: 2 elif c: 3")
        t("if a ➜ 1 elif b ➜ 2 elif c ➜ 3 else 4", "if a: 1 elif b: 2 elif c: 3 else: 4")
        t("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3", "if a: 1\nelif b: 2\nelif c: 3")
        t("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3\n  ➜ 4", "if a: 1\nelif b: 2\nelif c: 3\nelse: 4")
        t("if a then if b then 1 else 2 else 3", "if a: if b: 1 else: 2 else: 3")
        t("x = if a then b else c", "x = if a: b else: c")
        t("x = if a then b else c+d", "x = if a: b else: (c + d)")
        t("if a then ⮐", "if a: return")
        t("a + if b then c else d", "(a + if b: c else: d)")
        t("if true ➜ log msg", "if true: echo(msg)")
        t("if true ➜\n  log msg", "if true: \n  echo(msg)")
        t("if true\n  log msg", "if true: \n  echo(msg)")
        t("if true\n  log msg\n  log msg", "if true: \n  echo(msg)\n  echo(msg)")
        t("""
if a
    if b
        if c
            1
elif e
    2
""", """
if a: 
    if b: 
        if c: 
            1
elif e: 
    2""")
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
if a: 
    if b: 
        1
    elif c: 
        if d: 
            2
elif e: 
    4""")
        t("""
if e.kind == ●operation
    if e.operand_right.kind == ●func
        discard s.scope e.operand_right.func_body
    elif e.token.tok == ◂assign
        let lhs = e.operand_left
        if lhs.kind == ●literal
            insert lhs.token.str, e
elif e.kind == ●var
    insert e.var_name.token.str, e
""", """
if (e.kind == ●operation): 
    if (e.operand_right.kind == ●func): 
        discard s.scope(e.operand_right.func_body)
    elif (e.token.tok == ◂assign): 
        let lhs = e.operand_left
        if (lhs.kind == ●literal): 
            insert(lhs.token.str, e)
elif (e.kind == ●var): 
    insert(e.var_name.token.str, e)""")
    test "when": 
        t("when T is (seq or array)", "when (T is (seq or array)): ")
    test "for                                           ": 
        t("for a in 0..2 ➜ true", "for a in 0..2: true")
        t("for a in 0..2\n  true", "for a in 0..2: \n  true")
        t("for a in 0..2 ➜\n  true", "for a in 0..2: \n  true")
        t("for kind, key, val in opt.get()", "for kind, key, val in opt.get(): ")
    test "switch                                        ": 
        t("switch x\n  a ➜ 1\n  b c ➜ 2", "case x:\n  of a: 1\n  of b, c: 2")
        t("switch x\n  a ➜ 1\n  b c ➜ 2\n  ➜ 4", "case x:\n  of a: 1\n  of b, c: 2\n  else: 4")
        t("switch x\n  1 2 ➜ a", "case x:\n  of 1, 2: a")
        t("switch x\n  1 2 ➜ a\n  3 ➜ b", "case x:\n  of 1, 2: a\n  of 3: b")
        t("switch x\n  1 2 ➜ a\n  3 ➜ b\n  else c", "case x:\n  of 1, 2: a\n  of 3: b\n  else: c")
        t("switch x\n  1 2 ➜ a\n  3 ➜ b\n  ➜ c", "case x:\n  of 1, 2: a\n  of 3: b\n  else: c")
        t("switch x\n  1 2\n    a\n  ➜ c", "case x:\n  of 1, 2: \n    a\n  else: c")
        t("switch x\n  1 2➜\n    a\n  ➜ c", "case x:\n  of 1, 2: \n    a\n  else: c")
        t("switch x\n  1 2 ➜ a\n  else\n    c", "case x:\n  of 1, 2: a\n  else: \n    c")
        t("switch x\n  1 2 ➜ a\n  ➜\n    c", "case x:\n  of 1, 2: a\n  else: \n    c")
        t("switch x\n a ➜ if b then c", "case x:\n of a: if b: c")
    test "strings                                       ": 
        t("s = ''", "s = ''")
        t("s = \"\"", "s = \"\"")
        t("s = \"\"\"\"\"\"", "s = \"\"\"\"\"\"")
        t("s = 't'", "s = 't'")
        t("s = 't2'", "s = \"t2\"")
        t("s = 'test'", "s = \"test\"")
        t("s = \"\"\"\n\n\"\"\"", "s = \"\"\"\n\n\"\"\"")
        t("s = \"hello\"", "s = \"hello\"")
        t("s = \"\"\"hello\"\"\"", "s = \"\"\"hello\"\"\"")
        t("s = \"num #" & "{1+2} end\"", "s = &\"num {(1 + 2)} end\"")
        t("s = \"\"\"num #" & "{1+2} end\"\"\"", "s = &\"\"\"num {(1 + 2)} end\"\"\"")
        t("s = \"\"\"\nl1 #" & "{1+2}\nl2 #" & "{2-3}\"\"\"", "s = &\"\"\"\nl1 {(1 + 2)}\nl2 {(2 - 3)}\"\"\"")
        t("s = \"#" & "{o}\"", "s = &\"{o}\"")
        t("s = \"(#" & "{s}#" & "{e})\"", "s = &\"({s}{e})\"")
        t("cmd = \"nim c --outDir:#" & "{outdir} --stackTrace:on --lineTrace:on #" & "{file}\"", "cmd = &\"nim c --outDir:{outdir} --stackTrace:on --lineTrace:on {file}\"")
        t("let e = choose(n.return_value, \" #" & "{n.return_value}\", \"\")", "let e = choose(n.return_value, &\" {n.return_value}\", \"\")")
        t("p = peg\"abc\"", "p = peg\"abc\"")
        t("if line =~ peg\"abc\"", "if (line =~ peg\"abc\"): ")
    test "triple strings": 
        t("s = \"\"\"hello world\"\"\"", "s = \"\"\"hello world\"\"\"")
        t("s = \"\"\"hello\nworld\"\"\"", "s = \"\"\"hello\nworld\"\"\"")
        t("s = \"\"\"hello\n    world\"\"\"", "s = \"\"\"hello\nworld\"\"\"")
        t("s = \"\"\"hello\n    world\n    \"\"\"", "s = \"\"\"hello\nworld\n\"\"\"")
        t("s = \"\"\"hello\n        world\n    \"\"\"", "s = \"\"\"hello\n    world\n\"\"\"")
        t("s = \"\"\"hello\nworld\n    \"\"\"", "s = \"\"\"hello\nworld\n    \"\"\"")
        t("s = \"\"\"\n    #" & "{1+1}\n\"\"\"", "s = &\"\"\"\n    {(1 + 1)}\n\"\"\"")
        t("s = \"\"\"\n    #" & "{1+1}\n    #" & "{2+2}\n\"\"\"", "s = &\"\"\"\n    {(1 + 1)}\n    {(2 + 2)}\n\"\"\"")
        t("\"\"\"\n\"\"\"", "\"\"\"\n\"\"\"")
        t("\"\"\"\n    \"\"\"", "\"\"\"\n\"\"\"")
        t("\"\"\"\n    a = 1\"\"\"", "\"\"\"\na = 1\"\"\"")
        t("\"\"\"\n    a = 1\n    b = 2\"\"\"", "\"\"\"\na = 1\nb = 2\"\"\"")
        t("\"\"\"\n    a = 1\n    b = 2\n\"\"\"", "\"\"\"\n    a = 1\n    b = 2\n\"\"\"")
        t("\"\"\"\n        a = 1\n        b = 2\n    \"\"\"", "\"\"\"\n    a = 1\n    b = 2\n\"\"\"")
        t("t \"\"\"a\"\"\" , \"\"\"b\"\"\"", "t(\"\"\"a\"\"\", \"\"\"b\"\"\")")
        t("t \"\"\"\na\"\"\" , \"\"\"\nb\"\"\"", "t(\"\"\"\na\"\"\", \"\"\"\nb\"\"\")")
        t("t \"\"\"\na = 1\"\"\" , \"\"\"\nb = 2\"\"\"", "t(\"\"\"\na = 1\"\"\", \"\"\"\nb = 2\"\"\")")
        t("t \"\"\"\na = 1\nb = 2\"\"\" , \"\"\"\na = 1\nb = 2\"\"\"", "t(\"\"\"\na = 1\nb = 2\"\"\", \"\"\"\na = 1\nb = 2\"\"\")")
        t("t \"\"\"\n        a = 1\n        b = 2\n    \"\"\"", "t(\"\"\"\n    a = 1\n    b = 2\n\"\"\")")
    test "blocks": 
        t("""
f = ->
    g = ->
        2
        2
    1
""", """
proc f = 
    proc g = 
        2
        2
    1""")
        t("""
f = -> 
    if x
        2
    1
""", """
proc f = 
    if x: 
        2
    1""")
        t("""
f = -> 
    if 1
        2
# dedent
""", """
proc f = 
    if 1: 
        2
# dedent""")
        t("""
f = -> 
    g = -> 
        2
        2
    1
0
""", """
proc f = 
    proc g = 
        2
        2
    1
0""")
        t("""
switch kind
    cmdEnd
        discard
# comment
""", """
case kind:
    of cmdEnd: 
        discard
# comment""")
    test "enum": 
        t("enum ABC\n a\n b\n c", "type ABC = enum\n a\n b\n c")
        t("enum tok\n  ◆when\n  ◆then = \"➜\"\n  ◆if", "type tok = enum\n  ◆when\n  ◆then = \"➜\"\n  ◆if")
    test "comments": 
        t("two = 1 + 1 # addition", "two = (1 + 1) # addition")
        t("""
# ███   ███  ███  ██     ██
# ███  ███   ███  ███   ███
# ███████    ███  █████████
# ███  ███   ███  ███ █ ███
# ███   ███  ███  ███   ███
""", """
# ███   ███  ███  ██     ██
# ███  ███   ███  ███   ███
# ███████    ███  █████████
# ███  ███   ███  ███ █ ███
# ███   ███  ███  ███   ███""")
        t("""
###
    ███   ███  ███  ██     ██
    ███  ███   ███  ███   ███
    ███████    ███  █████████
    ███  ███   ███  ███ █ ███
    ███   ███  ███  ███   ███
###
""", """
#[
    ███   ███  ███  ██     ██
    ███  ███   ███  ███   ███
    ███████    ███  █████████
    ███  ███   ███  ███ █ ███
    ███   ███  ███  ███   ███
]#""")
    test "tests": 
        t("▸ a test suite", "suite \"a test suite\": ")
        t("""
▸ suite
    ▸ test1
        x   ▸ ""
    ▸ test2
        xy  ▸ "42"
    1
""", """
suite "suite": 
    test "test1": 
        check x == ""
    test "test2": 
        check xy == "42"
    1""")
    test "misc": 
        t("""    
if bytesRead > 0
    output.add(line & "\n")
elif bytesRead == 0
    break
elif errno == EAGAIN
    discard poll(nil, 0, 50)
elif not p.running
    break
else
    break
""", """
if (bytesRead > 0): 
    output.add(line & "\n")
elif (bytesRead == 0): 
    break
elif (errno == EAGAIN): 
    discard poll(nil, 0, 50)
elif not p.running: 
    break
else: 
    break""")
        t("""
icon = 
    if ext == ".kim"
        " "
    else
        " "
    1
""", """
icon = 
    if (ext == ".kim"): 
        " "
    else: 
        " "
    1""")
    test "proc": 
        t("proc ast*(text:string) : Node =", "proc ast*(text:string) : Node =")
    test "converter": 
        t("converter toBool*(x: int): bool = x != 0", "converter toBool*(x: int): bool = x != 0")
    test "template": 
        t("template t(a:string, b:string) = testCmp(a, render(a), b, instantiationInfo())", "template t(a:string, b:string) = testCmp(a, render(a), b, instantiationInfo())")
    test "macro": 
        t("macro dbg*(args: varargs[untyped]): untyped =", "macro dbg*(args: varargs[untyped]): untyped =")
        t("quote do:\n  profileStart(`msg`)\n  defer: profileStop(`msg`)", "quote do: \n  profileStart(`msg`)\n  defer: profileStop(`msg`)")
        t("quote\n  profileStart(`msg`)\n  defer: profileStop(`msg`)", "quote do: \n  profileStart(`msg`)\n  defer: profileStop(`msg`)")
    test "type": 
        t("type lineInfo* = tuple[filename: string, line: int, column: int]", "type lineInfo* = tuple[filename: string, line: int, column: int]")