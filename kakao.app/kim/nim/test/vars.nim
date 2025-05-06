# ███   ███   ███████   ████████    ███████
# ███   ███  ███   ███  ███   ███  ███     
#  ███ ███   █████████  ███████    ███████ 
#    ███     ███   ███  ███   ███       ███
#     █      ███   ███  ███   ███  ███████ 
import ../kommon
import ../rndr
template v(a:string, b:string) = testCmp(a, render(a, true), b, instantiationInfo())
suite "vars": 
    test "toplevel": 
        v("optParser = initOptParser()", "var optParser = initOptParser()")
        v("str = \"\"\nbool = false\nnum = 1", "var str = \"\"\nvar bool = false\nvar num = 1")
        v("s ◇string", "var s : string")
        v("i ◇int = 1", "var i : int = 1")
        v("l ◇seq[int]", "var l : seq[int]")
        v("var i", "var i")
        v("let i", "let i")
        v("let (output exitCode) = execCmdEx(cmd)", "let (output, exitCode) = execCmdEx(cmd)")
        v("a=1\nb=2\nc=b", "var a = 1\nvar b = 2\nvar c = b")
        v("a=1\nb=2\nc=b\na=b\nb=2\nc=4", "var a = 1\nvar b = 2\nvar c = b\na = b\nb = 2\nc = 4")
        v("a=1\nb=2\n# ██ \nb=2\nd=4", "var a = 1\nvar b = 2\n# ██ \nb = 2\nvar d = 4")
        v("""
# ███  

test = false

params ◇ seq[string]

""", """
# ███  
var test = false
var params : seq[string]""")
    test "func": 
        v("rImport = ◇Parser p ➜Node ->\n    n = Node(token:p.consume(), kind: ●import)", "proc rImport(p : Parser) : Node = \n    var n = Node(token: p.consume(), kind: ●import)")
        v("rImport = ◇Parser p ➜Node ->\n    n = Node(token:p.consume(), kind: ●import)\n    n = nil", "proc rImport(p : Parser) : Node = \n    var n = Node(token: p.consume(), kind: ●import)\n    n = nil")
        v("y=1\nf1 = ◇typ p ->\n    y = p.a()\nf2 = ◇typ p ->\n    z = p.b()", "var y = 1\nproc f1(p : typ) = \n    y = p.a()\nproc f2(p : typ) = \n    var z = p.b()")
        v("f1 = ◇typ p ➜Node ->\n    y = p.a()\nf2 = ◇typ p ->\n    y=p.b()", "proc f1(p : typ) : Node = \n    var y = p.a()\nproc f2(p : typ) = \n    var y = p.b()")
        v("f1 = ◇typ p ➜Node ->\n    n = Node(token:p.consume(), kind: ●import)\nf2 = ◇typ p -> p.b()", "proc f1(p : typ) : Node = \n    var n = Node(token: p.consume(), kind: ●import)\nproc f2(p : typ) = p.b()")
        v("n = nil\nrImport = ◇Parser p ➜Node ->\n    n = Node(token:p.consume(), kind: ●import)\nrProc = ◇Parser p ➜Node ->\n    n = Node(token:p.consume(), kind: ●proc)", "var n = nil\nproc rImport(p : Parser) : Node = \n    n = Node(token: p.consume(), kind: ●import)\nproc rProc(p : Parser) : Node = \n    n = Node(token: p.consume(), kind: ●proc)")
        v("""
f = ->
    g = ->
        a = 2
    b = 3
""", """
proc f = 
    proc g = 
        var a = 2
    var b = 3""")
        v("""
f = ->
    a = 1
    g = ->
        b = 2
        a = 1
        c = 0
    c = 3
""", """
proc f = 
    var a = 1
    proc g = 
        var b = 2
        a = 1
        var c = 0
    var c = 3""")
    test "if then else": 
        v("""
x = 0
y ◇ int
var z ◇ int
var q = 1
if true
    a = 1
    x = 2
    z = 3
else
    b = 1
    a = 1
    y = 3
    q = 4
""", """
var x = 0
var y : int
var z : int
var q = 1
if true: 
    var a = 1
    x = 2
    z = 3
else: 
    var b = 1
    var a = 1
    y = 3
    q = 4""")
    test "switch": 
        v("""
a = 1
b = 2
switch z

    a b c
        c = 0
        d = c + 1

    else
        a = 2
        b = 3
        d = a - b
""", """
var a = 1
var b = 2
case z:
    of a, b, c: 
        var c = 0
        var d = (c + 1)
    else: 
        a = 2
        b = 3
        var d = (a - b)""")
    test "for loop": 
        v("""
a = 1
b = 2
for z in y
    c = 0
    d = c + 1
    a = 2
    b = 3
    d = a - b
""", """
var a = 1
var b = 2
for z in y: 
    var c = 0
    var d = (c + 1)
    a = 2
    b = 3
    d = (a - b)""")
    test "while": 
        v("""
a = 1
b = 2
while z

    c = 0
    d = c + 1
    a = 2
    b = 3
    d = a - b
""", """
var a = 1
var b = 2
while z: 
    var c = 0
    var d = (c + 1)
    a = 2
    b = 3
    d = (a - b)""")