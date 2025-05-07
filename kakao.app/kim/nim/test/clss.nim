import ../kommon
import ../rndr
template t(a:string, b:string) = testCmp(a, render(a, true), b, instantiationInfo())
suite "class": 
    test "simple": 
        t("class A", "type A = ref object")
    test "members": 
        t("class ABC\n a:int\n b:int\n c:int", "type ABC = ref object\n a: int\n b: int\n c: int")
        t("""
class Tknzr
    tokens      : seq[Token]
    openStack   : seq[tok]
    token       : Token
    inStripol   : bool
    delimiter   : string
    segi        : int
    segs        : seq[string]
    line        : int
""", """
type Tknzr = ref object
    tokens: seq[Token]
    openStack: seq[tok]
    token: Token
    inStripol: bool
    delimiter: string
    segi: int
    segs: seq[string]
    line: int""")
    test "methods": 
        t("""
class A
    m : int
    fun: -> 
        m = 1
    inc: ◇int a1 ➜int ->
        a1 + 1
""", """
type A = ref object
    m: int
proc fun(this : A) = 
        var m = 1
proc inc(this : A, a1 : int) : int = 
        (a1 + 1)""")
    test "this vars": 
        t("""
class A
    m : int
    fun: -> 
        m = 1
    inc: ◇int a1 ➜int ->
        a1 + 1
""", """
type A = ref object
    m: int
proc fun(this : A) = 
        var m = 1
proc inc(this : A, a1 : int) : int = 
        (a1 + 1)""")