# ████████    ███████   ████████    ███████
# ███   ███  ███   ███  ███   ███  ███     
# ████████   █████████  ███████    ███████ 
# ███        ███   ███  ███   ███       ███
# ███        ███   ███  ███   ███  ███████ 
import ../kommon
import ../pars
template t(a:string, b:string) = testCmp(a, $ast(a), b, instantiationInfo())
template s(a:string, r:string, b:string) = testCmp(a, r, b, instantiationInfo())
suite "pars": 
    test "math ops": 
        t("1 + 5 * 3", "▪[(◂number + (◂number * ◂number))]")
        t("1 * 5 - 3", "▪[((◂number * ◂number) - ◂number)]")
        t("-5 - -3", "▪[((- ◂number) - (- ◂number))]")
        t("a++ + b--", "▪[((◂name ++) + (◂name --))]")
        t("1 + 2 + 3", "▪[((◂number + ◂number) + ◂number)]")
        t("1 * 2 + 3 * 4", "▪[((◂number * ◂number) + (◂number * ◂number))]")
    test "boolean ops": 
        t("a && b || c", "▪[((◂name && ◂name) || ◂name)]")
        t("a and b or c", "▪[((◂name && ◂name) || ◂name)]")
        t("!a && b", "▪[((! ◂name) && ◂name)]")
        t("not a && b", "▪[((! ◂name) && ◂name)]")
        t("a || b && c", "▪[(◂name || (◂name && ◂name))]")
        t("a or b and c", "▪[(◂name || (◂name && ◂name))]")
        t("a && b == c", "▪[(◂name && (◂name == ◂name))]")
        t("a and b == c", "▪[(◂name && (◂name == ◂name))]")
        t("x = a || b", "▪[(◂name = (◂name || ◂name))]")
        t("x = a or b", "▪[(◂name = (◂name || ◂name))]")
        t("!a || !b", "▪[((! ◂name) || (! ◂name))]")
        t("not a or not b", "▪[((! ◂name) || (! ◂name))]")
    test "comparison ops": 
        t("a == b", "▪[(◂name == ◂name)]")
        t("a != b", "▪[(◂name != ◂name)]")
        t("a >= b", "▪[(◂name >= ◂name)]")
        t("a <= b", "▪[(◂name <= ◂name)]")
    test "parens": 
        t("(1 + 2) * 3", "▪[(◂[(◂number + ◂number)] * ◂number)]")
        t("(1)", "▪[◂[◂number]]")
        t("(a + b) * c", "▪[(◂[(◂name + ◂name)] * ◂name)]")
        t("a * (b + c)", "▪[(◂name * ◂[(◂name + ◂name)])]")
        t("((1))", "▪[◂[◂number]]")
        t("(a.b).c", "▪[(◂[(◂name . ◂name)] . ◂name)]")
        t("a.b.c", "▪[((◂name . ◂name) . ◂name)]")
        t("a * (b + c) / d", "▪[((◂name * ◂[(◂name + ◂name)]) / ◂name)]")
        t("3 * (1 + 2)", "▪[(◂number * ◂[(◂number + ◂number)])]")
    test "brackets": 
        t("options = {poStdErrToStdOut, poUsePath}", "▪[(◂name = {◂name, ◂name})]")
        t("args = [\"r\", f]", "▪[(◂name = [[◂string, ◂name]]])]")
    test "types": 
        t("◇int i", "▪[(◇type(int) ◂name)]")
        t("◆int i", "▪[(◆type(int) ◂name)]")
        t("◇string s", "▪[(◇type(string) ◂name)]")
        t("◆string s", "▪[(◆type(string) ◂name)]")
        t("◇seq[string] s", "▪[(◇type(seq[string]) ◂name)]")
        t("◆seq[string] s", "▪[(◆type(seq[string]) ◂name)]")
        t("◇Parser p", "▪[(◇type(Parser) ◂name)]")
        t("◆Parser p", "▪[(◆type(Parser) ◂name)]")
        t("◇int i = 1", "▪[(◇type(int) ◂name (= ◂number))]")
        t("◇int i = 1+1", "▪[(◇type(int) ◂name (= (◂number + ◂number)))]")
        t("◆string s = \"a\"", "▪[(◆type(string) ◂name (= ◂string))]")
        t("◆string s = \"a\" & \"b\"", "▪[(◆type(string) ◂name (= (◂string & ◂string)))]")
        t("◇seq[string] s = @[]", "▪[(◇type(seq[string]) ◂name (= (◂name[])))]")
        t("◇seq[Table[string,bool]] s", "▪[(◇type(seq[Table[string,bool]]) ◂name)]")
    test "func": 
        t("->", "▪[(->)]")
        t("f = ->", "▪[(◂name = (->))]")
        t("f = (a=1) ->", "▪[(◂name = (◂[(◇ ◂name (= ◂number))] ->))]")
        t("f = a=1 ->", "▪[(◂name = (◂[(◇ ◂name (= ◂number))] ->))]")
        t("f = (a) ->", "▪[(◂name = (◂[(◇ ◂name)] ->))]")
        t("f = a ->", "▪[(◂name = (◂[(◇ ◂name)] ->))]")
        t("f = a b ->", "▪[(◂name = (◂[(◇ ◂name), (◇ ◂name)] ->))]")
        t("◇int i ->", "▪[(◂[(◇type(int) ◂name)] ->)]")
        t("◇int a ◇int b ->", "▪[(◂[(◇type(int) ◂name), (◇type(int) ◂name)] ->)]")
        t("◇int a ◇int b ◇int c ->", "▪[(◂[(◇type(int) ◂name), (◇type(int) ◂name), (◇type(int) ◂name)] ->)]")
        t("◆Parser p ◇string a ◇int b ->", "▪[(◂[(◆type(Parser) ◂name), (◇type(string) ◂name), (◇type(int) ◂name)] ->)]")
        t("➜int ->", "▪[( ➜ type(int) ->)]")
        t("➜ string ->", "▪[( ➜ type(string) ->)]")
        t("◇int i ➜int ->", "▪[(◂[(◇type(int) ◂name)] ➜ type(int) ->)]")
        t("◇int i ➜string ->", "▪[(◂[(◇type(int) ◂name)] ➜ type(string) ->)]")
        t("◇int i=1 ->", "▪[(◂[(◇type(int) ◂name (= ◂number))] ->)]")
        t("◇int i=1 ◇int j=2 ->", "▪[(◂[(◇type(int) ◂name (= ◂number)), (◇type(int) ◂name (= ◂number))] ->)]")
        t("◇int i=1 ◇int j=2 ➜string ->", "▪[(◂[(◇type(int) ◂name (= ◂number)), (◇type(int) ◂name (= ◂number))] ➜ type(string) ->)]")
        t("◇string s=\"✔\" ->", "▪[(◂[(◇type(string) ◂name (= ◂string))] ->)]")
        t("f = ◇string a ->", "▪[(◂name = (◂[(◇type(string) ◂name)] ->))]")
        t("f = ◇string a ◇int b ->", "▪[(◂name = (◂[(◇type(string) ◂name), (◇type(int) ◂name)] ->))]")
        t("f = ◆Parser p ◇string a ◇int b ->", "▪[(◂name = (◂[(◆type(Parser) ◂name), (◇type(string) ◂name), (◇type(int) ◂name)] ->))]")
        t("f = ◆Parser p ->", "▪[(◂name = (◂[(◆type(Parser) ◂name)] ->))]")
        t("f = ➜Node ->", "▪[(◂name = ( ➜ type(Node) ->))]")
        t("f = ◆Parser p ➜Node ->", "▪[(◂name = (◂[(◆type(Parser) ◂name)] ➜ type(Node) ->))]")
        t("f = ◇seq[Node] s ➜seq[Node] ->", "▪[(◂name = (◂[(◇type(seq[Node]) ◂name)] ➜ type(seq[Node]) ->))]")
        t("f = ◇Parser p ◇int ahead=1 ➜Token ->", "▪[(◂name = (◂[(◇type(Parser) ◂name), (◇type(int) ◂name (= ◂number))] ➜ type(Token) ->))]")
        t("f = ◇int i ->", "▪[(◂name = (◂[(◇type(int) ◂name)] ->))]")
        t("f = ◇int a ◇int b ->", "▪[(◂name = (◂[(◇type(int) ◂name), (◇type(int) ◂name)] ->))]")
        t("f = ◇int a = 1 ->", "▪[(◂name = (◂[(◇type(int) ◂name (= ◂number))] ->))]")
        t("f = a=1 b=2 ->", "▪[(◂name = (◂[(◇ ◂name (= ◂number)), (◇ ◂name (= ◂number))] ->))]")
        t("f = ◇Parser p ahead=1 ->", "▪[(◂name = (◂[(◇type(Parser) ◂name), (◇ ◂name (= ◂number))] ->))]")
        t("f = ◇Parser p ahead=1 ➜Token ->", "▪[(◂name = (◂[(◇type(Parser) ◂name), (◇ ◂name (= ◂number))] ➜ type(Token) ->))]")
    test "func modfifier": 
        t("{.noconv.}", "▪[{.]")
        t("() -> {.noconv.}", "▪[(◂[] -> {.noconv.} )]")
        t("a = () -> {.noconv.}", "▪[(◂name = (◂[] -> {.noconv.} ))]")
        t("setHook(() -> {.noconv.}\n  1 + 2)", "▪[(◂name ◂call @[(◂[] -> {.noconv.}  ▪[(◂number + ◂number)])])]")
    test "func body": 
        t("f = ->\n  b = 1 + 2\n  b += 3", "▪[(◂name = (-> ▪[(◂name = (◂number + ◂number))(◂name += ◂number)]))]")
    test "call": 
        t("f()", "▪[(◂name ◂call @[])]")
        t("f(g())", "▪[(◂name ◂call @[(◂name ◂call @[])])]")
        t("f(g() / h())", "▪[(◂name ◂call @[((◂name ◂call @[]) / (◂name ◂call @[]))])]")
        t("f(1)", "▪[(◂name ◂call @[◂number])]")
        t("f(1 + 2)", "▪[(◂name ◂call @[(◂number + ◂number)])]")
        t("f(1 + 2 4 + 5)", "▪[(◂name ◂call @[(◂number + ◂number), (◂number + ◂number)])]")
        t("f(1 2 3)", "▪[(◂name ◂call @[◂number, ◂number, ◂number])]")
        t("f(1 g(h(2)))", "▪[(◂name ◂call @[◂number, (◂name ◂call @[(◂name ◂call @[◂number])])])]")
    test "constructor call": 
        t("Token(tok:◂let)", "▪[(◂name ◂call @[(◂name : ◂name)])]")
        t("Node(token:Token(tok:◂let, str:\"var\", line:expr.token.line), kind:●let, let_expr:expr)", "▪[(◂name ◂call @[(◂name : (◂name ◂call @[(◂name : ◂name), (◂name : ◂string), (◂name : ((◂name . ◂name) . ◂name))])), (◂name : ◂name), (◂name : ◂name)])]")
    test "implicit call    ": 
        t("f a", "▪[(◂name ◂call @[◂name])]")
        t("f a.b", "▪[(◂name ◂call @[(◂name . ◂name)])]")
        t("f a.b, c", "▪[(◂name ◂call @[(◂name . ◂name), ◂name])]")
        t("f a.b c", "▪[(◂name ◂call @[(◂name . ◂name), ◂name])]")
        t("f(a.b c)", "▪[(◂name ◂call @[(◂name . ◂name), ◂name])]")
        t("f a.b(c)", "▪[(◂name ◂call @[((◂name . ◂name) ◂call @[◂name])])]")
        t("f a[0] c", "▪[(◂name ◂call @[(◂name[◂number]), ◂name])]")
        t("f(a[0] c)", "▪[(◂name ◂call @[(◂name[◂number]), ◂name])]")
        t("f 1 '2' false", "▪[(◂name ◂call @[◂number, ◂string, ✘])]")
        t("let r = read(fd, addr(line[0]), l.len)", "▪[(◂let (◂name (= (◂name ◂call @[◂name, (◂name ◂call @[(◂name[◂number])]), (◂name . ◂name)]))))]")
        t("read(fd, 1)", "▪[(◂name ◂call @[◂name, ◂number])]")
        t("read(fd 1)", "▪[(◂name ◂call @[◂name, ◂number])]")
        t("read fd, 1", "▪[(◂name ◂call @[◂name, ◂number])]")
        t("read fd 1", "▪[(◂name ◂call @[◂name, ◂number])]")
        t("read(fd addr(line[0]) line.len)", "▪[(◂name ◂call @[◂name, (◂name ◂call @[(◂name[◂number])]), (◂name . ◂name)])]")
        t("read fd addr 1", "▪[(◂name ◂call @[◂name, ◂name, ◂number])]")
        t("read fd addr(line[0]) l.len", "▪[(◂name ◂call @[◂name, (◂name ◂call @[(◂name[◂number])]), (◂name . ◂name)])]")
        t("let r = read fd addr(line[0]) l.len", "▪[(◂let (◂name (= (◂name ◂call @[◂name, (◂name ◂call @[(◂name[◂number])]), (◂name . ◂name)]))))]")
        t("f a # comment", "▪[(◂name ◂call @[◂name])#]")
        t("a = f 1", "▪[(◂name = (◂name ◂call @[◂number]))]")
        t("a = b.f 1", "▪[(◂name = ((◂name . ◂name) ◂call @[◂number]))]")
        t("a.b.c 2", "▪[(((◂name . ◂name) . ◂name) ◂call @[◂number])]")
    test "arglist": 
        t("f(a, b, c)", "▪[(◂name ◂call @[◂name, ◂name, ◂name])]")
        t("f a, b, c", "▪[(◂name ◂call @[◂name, ◂name, ◂name])]")
        t("(a, b, c) = f()", "▪[(◂[◂name, ◂name, ◂name] = (◂name ◂call @[]))]")
        t("(a b c) = f()", "▪[(◂[◂name, ◂name, ◂name] = (◂name ◂call @[]))]")
        t("(a b c) = (c b a)", "▪[(◂[◂name, ◂name, ◂name] = ◂[◂name, ◂name, ◂name])]")
        t("t \"a\" , \"b\"", "▪[(◂name ◂call @[◂string, ◂string])]")
        t("t \"a\",\n  \"b\"", "▪[(◂name ◂call @[◂string, ◂string])]")
        t("t \"a\"\n  \"b\"", "▪[(◂name ◂call @[◂string, ◂string])]")
    test "var": 
        t("var a", "▪[(◂var (◂name))]")
        t("var a=1", "▪[(◂var (◂name (= ◂number)))]")
        t("var a ◇int", "▪[(◂var (◂name ◇type(int)))]")
        t("a ◇int", "▪[(◂name ◇type(int))]")
        t("a ◇int=1", "▪[(◂name ◇type(int) (= ◂number))]")
        t("a ◇int=1+2", "▪[(◂name ◇type(int) (= (◂number + ◂number)))]")
    test "assign": 
        t("a = 1", "▪[(◂name = ◂number)]")
        t("a = b = 1", "▪[(◂name = (◂name = ◂number))]")
        t("a = b = c = 2", "▪[(◂name = (◂name = (◂name = ◂number)))]")
        t("(a, b) = c", "▪[(◂[◂name, ◂name] = ◂name)]")
        t("(a b) = c", "▪[(◂[◂name, ◂name] = ◂name)]")
        t("let (dir name ext) = triple", "▪[(◂let (◂[◂name, ◂name, ◂name] (= ◂name)))]")
        t("s &= v", "▪[(◂name &= ◂name)]")
    test "arrays": 
        t("a = [ 1  2 ]", "▪[(◂name = [[◂number, ◂number]]])]")
        t("a = [\n    1\n    2\n    ]", "▪[(◂name = [[◂number, ◂number]]])]")
    test "tables": 
        t("a = initTable[string,bool]()", "▪[(◂name = ((◂name[◂[◂name, ◂name]]) ◂call @[]))]")
    test "property access        ": 
        t("a.b", "▪[(◂name . ◂name)]")
        t("a.b.c", "▪[((◂name . ◂name) . ◂name)]")
        t("a.b()", "▪[((◂name . ◂name) ◂call @[])]")
        t("a.b().c", "▪[(((◂name . ◂name) ◂call @[]) . ◂name)]")
        t("f().g().h()", "▪[(((((◂name ◂call @[]) . ◂name) ◂call @[]) . ◂name) ◂call @[])]")
        t("f()\n .g()\n .h()", "▪[(((((◂name ◂call @[]) . ◂name) ◂call @[]) . ◂name) ◂call @[])]")
        t("a = f().g().h()", "▪[(◂name = (((((◂name ◂call @[]) . ◂name) ◂call @[]) . ◂name) ◂call @[]))]")
        t("a = f()\n    .g()\n    .h()", "▪[(◂name = (((((◂name ◂call @[]) . ◂name) ◂call @[]) . ◂name) ◂call @[]))]")
        t("log f().g().h()", "▪[(◂name ◂call @[(((((◂name ◂call @[]) . ◂name) ◂call @[]) . ◂name) ◂call @[])])]")
        t("log f()\n    .g()\n    .h()", "▪[(◂name ◂call @[(((((◂name ◂call @[]) . ◂name) ◂call @[]) . ◂name) ◂call @[])])]")
        t("""
if 1
    log output.replace("[O]" fg(fgYellow) & "▸")
              .replace("[P]" fg(fgGreen) & "✔")
              .replace("[Q]" fg(fgRed) & "✘")
else
    count = output.count("[R]")
    log output.replace("[S]" fg(fgYellow) & "▸")
              .replace("[T]" fg(fgGeen)   & "▸")""", "▪[(◂if @[(◂number ▪[(◂name ◂call @[((((((◂name . ◂name) ◂call @[◂string, ((◂name ◂call @[◂name]) & ◂string)]) . ◂name) ◂call @[◂string, ((◂name ◂call @[◂name]) & ◂string)]) . ◂name) ◂call @[◂string, ((◂name ◂call @[◂name]) & ◂string)])])])] ▪[(◂name = ((◂name . ◂name) ◂call @[◂string]))(◂name ◂call @[((((◂name . ◂name) ◂call @[◂string, ((◂name ◂call @[◂name]) & ◂string)]) . ◂name) ◂call @[◂string, ((◂name ◂call @[◂name]) & ◂string)])])])]")
    test "array access": 
        t("a[0]", "▪[(◂name[◂number])]")
    test "if": 
        t("if true then ⮐  false", "▪[(◂if @[(✔ (⮐ ✘))])]")
        t("if true then ⮐  1 else ⮐  2", "▪[(◂if @[(✔ (⮐ ◂number))] (⮐ ◂number))]")
        t("if a ➜ 1 elif b ➜ 2 elif c ➜ 3", "▪[(◂if @[(◂name ◂number), (◂name ◂number), (◂name ◂number)])]")
        t("if a ➜ 1 elif b ➜ 2 elif c ➜ 3 else 4", "▪[(◂if @[(◂name ◂number), (◂name ◂number), (◂name ◂number)] ◂number)]")
        t("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3", "▪[(◂if @[(◂name ◂number), (◂name ◂number), (◂name ◂number)])]")
        t("if\n  a ➜ 1\n  b ➜ 2\n  c ➜ 3\n  ➜ 4", "▪[(◂if @[(◂name ◂number), (◂name ◂number), (◂name ◂number)] ◂number)]")
        t("if a then if b then 1 else 2 else 3", "▪[(◂if @[(◂name (◂if @[(◂name ◂number)] ◂number))] ◂number)]")
        t("x = if a then b else c", "▪[(◂name = (◂if @[(◂name ◂name)] ◂name))]")
        t("x = if a then b else c+d", "▪[(◂name = (◂if @[(◂name ◂name)] (◂name + ◂name)))]")
        t("if a then ⮐", "▪[(◂if @[(◂name (⮐))])]")
        t("a + if b then c else d", "▪[(◂name + (◂if @[(◂name ◂name)] ◂name))]")
        t("if true\n  log msg", "▪[(◂if @[(✔ ▪[(◂name ◂call @[◂name])])])]")
        t("if true\n  log(1)\n  log(2)", "▪[(◂if @[(✔ ▪[(◂name ◂call @[◂number])(◂name ◂call @[◂number])])])]")
        t("if a ➜ 1\nelif b == 2 ➜ 2", "▪[(◂if @[(◂name ◂number), ((◂name == ◂number) ◂number)])]")
        t("if hasKey(name) ➜ 1", "▪[(◂if @[((◂name ◂call @[◂name]) ◂number)])]")
        t("if hasKey name ➜ 1", "▪[(◂if @[((◂name ◂call @[◂name]) ◂number)])]")
        t("if map.hasKey name ➜ 1", "▪[(◂if @[(((◂name . ◂name) ◂call @[◂name]) ◂number)])]")
        t("""
if 
    cond
        true
    else
        break""", "▪[(◂if @[(◂name ▪[✔])] ▪[◂break])]")
        t("""
if 
    cond
        true
    # comment
    else
        break""", "▪[(◂if @[(◂name ▪[✔])] ▪[◂break])]")
        t("""
if a
    if b
        1
elif e
    2""", "▪[(◂if @[(◂name ▪[(◂if @[(◂name ▪[◂number])])]), (◂name ▪[◂number])])]")
        t("""
if a
    if b
        if c
            1
elif e
    2""", "▪[(◂if @[(◂name ▪[(◂if @[(◂name ▪[(◂if @[(◂name ▪[◂number])])])])]), (◂name ▪[◂number])])]")
        t("""
if a
    if b
        1
    elif c
        if d
            2
elif e
    4""", "▪[(◂if @[(◂name ▪[(◂if @[(◂name ▪[◂number]), (◂name ▪[(◂if @[(◂name ▪[◂number])])])])]), (◂name ▪[◂number])])]")
        t("""
if e.kind == ●operation
    if e.operand_right.kind == ●func
        discard s.scope e.operand_right.func_body
    elif e.token.tok == ◂assign
        let lhs = e.operand_left
        if lhs.kind == ●literal
            insert lhs.token.str, e
elif e.kind == ●var
    insert e.var_name.token.str, e""", "▪[(◂if @[(((◂name . ◂name) == ◂name) ▪[(◂if @[((((◂name . ◂name) . ◂name) == ◂name) ▪[((◂discard . ◂name) ◂call @[((◂name . ◂name) . ◂name)])]), ((((◂name . ◂name) . ◂name) == ◂name) ▪[(◂let (◂name (= (◂name . ◂name))))(◂if @[(((◂name . ◂name) == ◂name) ▪[(◂name ◂call @[((◂name . ◂name) . ◂name), ◂name])])])])])]), (((◂name . ◂name) == ◂name) ▪[(◂name ◂call @[(((◂name . ◂name) . ◂name) . ◂name), ◂name])])])]")
    test "for": 
        t("0..2", "▪[(◂number .. ◂number)]")
        t("for a in 0..2 ➜ true", "▪[(◂for ◂name in (◂number .. ◂number) ✔)]")
        t("for a in 0..2\n  true", "▪[(◂for ◂name in (◂number .. ◂number) ▪[✔])]")
        t("for a in 0..2 ➜\n  true", "▪[(◂for ◂name in (◂number .. ◂number) ▪[✔])]")
        t("for key val in a", "▪[(◂for ◂[◂name, ◂name] in ◂name)]")
        t("for kind, key, val in a", "▪[(◂for ◂[◂name, ◂name, ◂name] in ◂name)]")
    test "switch": 
        t("switch x\n  a ➜ 1\n  b c ➜ 2", "▪[(◂switch ◂name @[(@[◂name] ◂number), (@[◂name, ◂name] ◂number)])]")
        t("switch x\n  a ➜ 1\n  b c ➜ 2\n  ➜ 4", "▪[(◂switch ◂name @[(@[◂name] ◂number), (@[◂name, ◂name] ◂number)] ◂number)]")
        t("switch x\n  1 2 ➜ a", "▪[(◂switch ◂name @[(@[◂number, ◂number] ◂name)])]")
        t("switch x\n  1 2 ➜ a\n  3 ➜ b", "▪[(◂switch ◂name @[(@[◂number, ◂number] ◂name), (@[◂number] ◂name)])]")
        t("switch x\n  1 2 ➜ a\n  3 ➜ b\n  else c", "▪[(◂switch ◂name @[(@[◂number, ◂number] ◂name), (@[◂number] ◂name)] ◂name)]")
        t("switch x\n  1 2 ➜ a\n  3 ➜ b\n  ➜ c", "▪[(◂switch ◂name @[(@[◂number, ◂number] ◂name), (@[◂number] ◂name)] ◂name)]")
        t("switch x\n  1 2\n    a\n  ➜ c", "▪[(◂switch ◂name @[(@[◂number, ◂number] ▪[◂name])] ◂name)]")
        t("switch x\n  1 2➜\n    a\n  ➜ c", "▪[(◂switch ◂name @[(@[◂number, ◂number] ▪[◂name])] ◂name)]")
        t("switch x\n  1 2 ➜ a\n  else\n    c", "▪[(◂switch ◂name @[(@[◂number, ◂number] ◂name)] ▪[◂name])]")
        t("switch x\n  1 2 ➜ a\n  ➜\n    c", "▪[(◂switch ◂name @[(@[◂number, ◂number] ◂name)] ▪[◂name])]")
        t("switch x\n a ➜ if b then c", "▪[(◂switch ◂name @[(@[◂name] (◂if @[(◂name ◂name)]))])]")
        t("switch a\n  ●block ➜ r.▸block(n)", "▪[(◂switch ◂name @[(@[◂name] ((◂name . ◂name) ◂call @[◂name]))])]")
        t("switch a\n  ●block ➜ r.▸block n", "▪[(◂switch ◂name @[(@[◂name] ((◂name . ◂name) ◂call @[◂name]))])]")
        t("""
switch ext
    ".kim"  ➜ fun()
    else continue""", "▪[(◂switch ◂name @[(@[◂string] (◂name ◂call @[]))] ◂continue)]")
        t("""
switch ext
    ".kim"  ➜ fun()
            ➜ continue""", "▪[(◂switch ◂name @[(@[◂string] (◂name ◂call @[]))] ◂continue)]")
    test "case": 
        t("case x\n  of a\n    1\n  of b, c\n    2", "▪[(◂switch ◂name @[(@[◂name] ▪[◂number]), (@[◂name, ◂name] ▪[◂number])])]")
    test "tailIf": 
        t("1*2 if true", "▪[(◂if @[(✔ (◂number * ◂number))])]")
        t("1 if true", "▪[(◂if @[(✔ ◂number)])]")
        t("break if true", "▪[(◂if @[(✔ ◂break)])]")
        t("continue if true", "▪[(◂if @[(✔ ◂continue)])]")
        t("⮐  if true", "▪[(◂if @[(✔ (⮐))])]")
        t("⮐  1 + 2 if 3 + 4", "▪[(◂if @[((◂number + ◂number) (⮐ (◂number + ◂number)))])]")
        t("⮐  if map.hasKey(name)", "▪[(◂if @[(((◂name . ◂name) ◂call @[◂name]) (⮐))])]")
        t("⮐  if hasKey name", "▪[(◂if @[((◂name ◂call @[◂name]) (⮐))])]")
        t("⮐  if map.hasKey name", "▪[(◂if @[(((◂name . ◂name) ◂call @[◂name]) (⮐))])]")
    test "no tailIf": 
        t("⮐  if true ➜ 1", "▪[(⮐ (◂if @[(✔ ◂number)]))]")
        t("⮐  if\n    true ➜ 1", "▪[(⮐ (◂if @[(✔ ◂number)]))]")
        t("""
if 1
    2
if x
    y""", "▪[(◂if @[(◂number ▪[◂number])])(◂if @[(◂name ▪[◂name])])]")
    test "while": 
        t("while true", "▪[(◂while ✔)]")
        t("while false ➜ 1", "▪[(◂while ✘ ◂number)]")
        t("while false ➜\n 1", "▪[(◂while ✘ ▪[◂number])]")
        t("while false\n 1", "▪[(◂while ✘ ▪[◂number])]")
        t("while 2\n continue", "▪[(◂while ◂number ▪[◂continue])]")
        t("while 2\n break", "▪[(◂while ◂number ▪[◂break])]")
    test "not in ": 
        t("while a notin b", "▪[(◂while (◂name ◂notin ◂name))]")
        t("while a not in b", "▪[(◂while (◂name ◂notin ◂name))]")
    test "strings": 
        t("s = \"hello\"", "▪[(◂name = ◂string)]")
        t("s = \"\"\"hello\"\"\"", "▪[(◂name = ◂string)]")
        t("s = \"\"\"\n\n\"\"\"", "▪[(◂name = ◂string)]")
        t("t \"\"\"a\"\"\" , \"\"\"b\"\"\"", "▪[(◂name ◂call @[◂string, ◂string])]")
        t("t \"\"\"\na\"\"\" , \"\"\"\nb\"\"\"", "▪[(◂name ◂call @[◂string, ◂string])]")
        t("let e = choose(n.return_value, \" #" & "{n.return_value}\", \"\")", "▪[(◂let (◂name (= (◂name ◂call @[(◂name . ◂name), ◂string<@[(◂name . ◂name)]>, ◂string]))))]")
        t("s = \"\"\"num #" & "{1+2} end\"\"\"", "▪[(◂name = ◂string<@[(◂number + ◂number)]>)]")
        t("s = \"\"\"\nl1 #" & "{1}\nl2 #" & "{2}\"\"\"", "▪[(◂name = ◂string<@[◂number]@[◂number]>)]")
        t("\"a #" & "{1} e\"", "▪[◂string<@[◂number]>]")
        t("\"a #" & "{1}\"", "▪[◂string<@[◂number]>]")
        t("\"#" & "{1}\"", "▪[◂string<@[◂number]>]")
        t("s = \"(#" & "{s}#" & "{e})\"", "▪[(◂name = ◂string<@[◂name]@[◂name]>)]")
        t("peg = peg\"abc\"", "▪[(◂name = ◂pegstring)]")
        t("raw = r\"abc\"", "▪[(◂name = ◂rstring)]")
        t("reg = re\"abc\"", "▪[(◂name = ◂restring)]")
    test "toplevel": 
        t("", "▪[]")
        t("42", "▪[◂number]")
        t("true", "▪[✔]")
        t("false", "▪[✘]")
        t("\"hello\"", "▪[◂string]")
        t("\n\n# comment\n\n", "▪[#]")
        t("""
# ███  
test = false
""", "▪[#(◂name = ✘)]")
        t("""
# ███  
# ███  
test = false
""", "▪[##(◂name = ✘)]")
    test "verbatim": 
        t("proc ast*(text:string) : Node =", "▪[=>]")
    test "use": 
        t("use rndr", "▪[(◂use ◂name)]")
        t("use std ▪ unittest", "▪[(◂use ◂name ▪ @[◂name])]")
        t("use ../rndr", "▪[(◂use ◂name)]")
        t("use std ▪ os logging\nuse kommon", "▪[(◂use ◂name ▪ @[◂name, ◂name])(◂use ◂name)]")
        t("use std ▪ a b c\nuse d\nuse e\nuse f", "▪[(◂use ◂name ▪ @[◂name, ◂name, ◂name])(◂use ◂name)(◂use ◂name)(◂use ◂name)]")
        s("use a b c", ast("use a b c").expressions[0].use_module.token.str, "a b c")
        t("import ../../rel/[s1, s2]", "▪[◂import]")
    test "enum": 
        t("enum Kind", "▪[(◂enum ◂name)]")
        t("enum Kind\na", "▪[(◂enum ◂name)◂name]")
        t("enum Kind\n  a\n  b", "▪[(◂enum ◂name ▪[◂name◂name])]")
        t("enum Kind\n  a\n  b\nc", "▪[(◂enum ◂name ▪[◂name◂name])◂name]")
        t("""
enum tok
        ◂when
        ◂then   = "➜"
""", "▪[(◂enum ◂name ▪[◂name(◂name = ◂string)])]")
    test "class": 
        t("class Node", "▪[(◂class ◂name ▪[])]")
        t("class Node\n member:string", "▪[(◂class ◂name ▪[(◂name : ◂name)])]")
        t("class Node\n member:string\n i:int", "▪[(◂class ◂name ▪[(◂name : ◂name)(◂name : ◂name)])]")
        t("class Node\n member:string\ni:int", "▪[(◂class ◂name ▪[(◂name : ◂name)])(◂name : ◂name)]")
    test "comments": 
        t("###\n\nhello from\na comment###\na = 1", "▪[#(◂name = ◂number)]")
    test "tests": 
        t("▸ a test suite", "▪[(▸ suite)]")
        check((ast("▸ a test suite").expressions[0].kind == ●testSuite))
        t("    ▸ test section", "▪[(▸ section)]")
        check((ast("    ▸ test section").expressions[0].kind == ●testSection))
        t("    f(a) ▸ 42", "▪[((◂name ◂call @[◂name]) ▸ ◂number)]")
        t("    f(a) ▸\n        42", "▪[((◂name ◂call @[◂name]) ▸ ◂number)]")
        t("▸ suite\n  ▸ test", "▪[(▸ suite ▪[(▸ section)])]")
        t("""
▸ rndr
   ▸ toplevel
       rndr("")   ▸ ""
       rndr("42") ▸ "42" """, "▪[(▸ suite ▪[(▸ section ▪[((◂name ◂call @[◂string]) ▸ ◂string)((◂name ◂call @[◂string]) ▸ ◂string)])])]")
    test "blocks": 
        t("t \"a\",\n  \"b\"", "▪[(◂name ◂call @[◂string, ◂string])]")
        t("""
f = -> 
    if x
        2
    1
""", "▪[(◂name = (-> ▪[(◂if @[(◂name ▪[◂number])])◂number]))]")
        t("""
f = -> 
    if x
        2
    else
        discard
    1
""", "▪[(◂name = (-> ▪[(◂if @[(◂name ▪[◂number])] ▪[◂discard])◂number]))]")
        t("""
f = ->

    if x
    
        2
    
    else
    
        discard
    
    1
""", "▪[(◂name = (-> ▪[(◂if @[(◂name ▪[◂number])] ▪[◂discard])◂number]))]")
        t("""
f = -> 
    g = -> 
        2
        2
    1
""", "▪[(◂name = (-> ▪[(◂name = (-> ▪[◂number◂number]))◂number]))]")
        t("""
f = -> 
    g = -> 
        2
        2
    1
0
0""", "▪[(◂name = (-> ▪[(◂name = (-> ▪[◂number◂number]))◂number]))◂number◂number]")
        t("""
icon = 
    if ex == ".kim"
        " "
    else
        " "
        """, "▪[(◂name = ▪[(◂if @[((◂name == ◂string) ▪[◂string])] ▪[◂string])])]")
        t("icon = if ext == \".kim\" ➜ \"  \" ➜ \"  \"", "▪[(◂name = (◂if @[((◂name == ◂string) ◂string)] ◂string))]")
        t("let icon = if ext == \".kim\" ➜ \"  \" ➜ \"  \"", "▪[(◂let (◂name (= (◂if @[((◂name == ◂string) ◂string)] ◂string))))]")
        t("""
let icon = 
    if ext == ".kim"
        " " 
    else
        " "
        """, "▪[(◂let (◂name (= ▪[(◂if @[((◂name == ◂string) ▪[◂string])] ▪[◂string])])))]")