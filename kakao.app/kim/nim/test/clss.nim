import ../rndr
template t(a:string, b:string) = testCmp(a, render(a, true), b, instantiationInfo())
suite "class": 
    test "simple": 
        t("class A", "type A = ref object of RootObj")
        t("struct A", "type A = object")
    test "members": 
        t("class ABC\n a:int\n b:int\n c:int", "type ABC = ref object of RootObj\n a: int\n b: int\n c: int")
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
type Tknzr = ref object of RootObj
    tokens: seq[Token]
    openStack: seq[tok]
    token: Token
    inStripol: bool
    delimiter: string
    segi: int
    segs: seq[string]
    line: int""")
    test "constructor": 
        t("""
class A
    a : int
    b : int
    @: ◇int a ◇int b ->
        @a = a
        @b = b

a = @A 1 2
""", """
type A = ref object of RootObj
    a: int
    b: int
proc init(this : A, a : int, b : int) : A = 
        this.a = a
        this.b = b
        this
var a = A().init(1, 2)""")
    test "inheritance": 
        t("""
class A
    a : int
    @: ◇int a ->
        @a = a
    p: -> log @a
class B extends A
    b : int
    @: ◇int a ->
        super a*2
a = @A 1
a.p()
a = @B 2
a.p()
""", """
type A = ref object of RootObj
    a: int
proc init(this : A, a : int) : A = 
        this.a = a
        this
proc p(this : A) = echo(this.a)
type B = ref object of A
    b: int
proc init(this : B, a : int) : B = 
        discard procCall init(A(this), (a * 2))
        this
var a = A().init(1)
a.p()
a = B().init(2)
a.p()""")
    test "methods": 
        t("""
class A
    m : int
    fun: -> 
        m = 1
    inc: ◇int a1 ➜int ->
        a1 + 1
""", """
type A = ref object of RootObj
    m: int
proc fun(this : A) = 
        var m = 1
proc inc(this : A, a1 : int) : int = 
        (a1 + 1)""")
    test "export": 
        t("class A*\n    add: ◇string text -> @s &= text", "type A* = ref object of RootObj\n    \nproc add*(this : A, text : string) = (this.s &= text)")
        t("struct A*\n    add: ◇string text -> @s &= text", "type A* = object\n    \nproc add*(this : var A, text : string) = (this.s &= text)")
        t("""
class A*
    m : int
    switch kind : int
        0 
            x : int
        1
            y : bool
    @: -> 
    inc: ◇int a1 ➜int ->
""", """
type A* = ref object of RootObj
    m*: int
    case kind*: int:
        of 0: 
            x*: int
        of 1: 
            y*: bool
proc init*(this : A) : A = this
proc inc*(this : A, a1 : int) : int""")
    test "struct methods": 
        t("""
struct S
    m : int
    hello: ->
        @m += 1
""", """
type S = object
    m: int
proc hello(this : var S) = 
        (this.m += 1)""")
    test "this vars": 
        t("class A\n    add: ◇string text -> @s &= text", "type A = ref object of RootObj\n    \nproc add(this : A, text : string) = (this.s &= text)")
        t("""
class A
    m : int
    fun: -> 
        log $@m
        @m = 1
""", """
type A = ref object of RootObj
    m: int
proc fun(this : A) = 
        echo($this.m)
        this.m = 1""")
        t("""
class A
    m : int
    sqr: -> 
        @m = @m * @m
    inc: ◇int a1 ➜int ->
        @sqr() + @inc(@m)
""", """
type A = ref object of RootObj
    m: int
proc sqr(this : A) = 
        this.m = (this.m * this.m)
proc inc(this : A, a1 : int) : int = 
        (this.sqr() + this.inc(this.m))""")
        t("""
class A
    m : int
    n : int
    o : int
    loop: ->
        if @m < @n.len
            ⮐  @o[@m]
        for i in @m
            switch @m
                @m ➜ @m
                @n ➜ @n
                   ➜ @o
        if @m ➜ @n ➜ @o
        if @m
            @n
        else
            @o
""", """
type A = ref object of RootObj
    m: int
    n: int
    o: int
proc loop(this : A) = 
        if (this.m < this.n.len): 
            return this.o[this.m]
        for i in this.m: 
            case this.m:
                of this.m: this.m
                of this.n: this.n
                else: this.o
        if this.m: this.n else: this.o
        if this.m: 
            this.n
        else: 
            this.o""")
        t("""
class A
    m : int
    n : int
    o : int
    loop: ->
        while @m < @n.len
            ⮐  @o[@m]
        fun = ->
            switch @m
                @m ➜ @m
                @n ➜ @n
                   ➜ @o
        moreFun = -> if @m ➜ @n ➜ @o
        fun(@m)
        moreFun @o
""", """
type A = ref object of RootObj
    m: int
    n: int
    o: int
proc loop(this : A) = 
        while (this.m < this.n.len): 
            return this.o[this.m]
        proc fun = 
            case this.m:
                of this.m: this.m
                of this.n: this.n
                else: this.o
        proc moreFun = if this.m: this.n else: this.o
        fun(this.m)
        moreFun(this.o)""")
        t("""
class A
    m : int
    loop: ->
        log "m: #""" & """
{@m}"
        @m
""", """
type A = ref object of RootObj
    m: int
proc loop(this : A) = 
        echo(&"m: {this.m}")
        this.m""")
        t("""
class Token
    tok: tok
    
    logp: -> 
        log @tok
    
class Node

    token : Token
    
    switch kind : NodeKind
    
        ●block
        
            expressions: seq[Node]
            
        ●if
            # also handles when
            cond_thens     : seq[Node]
            else_branch    : Node
            
        ➜ discard
    
    loop: ->
        log @m
        
nod = ◇NodeKind kind ◇Token token ◇varargs[Node] args ➜ Node ->
""", """
type Token = ref object of RootObj
    tok: tok
proc logp(this : Token) = 
        echo(this.tok)
type Node = ref object of RootObj
    token: Token
    case kind: NodeKind:
        of ●block: 
            expressions: seq[Node]
        of ●if: 
            # also handles when
            cond_thens: seq[Node]
            else_branch: Node
        else: discard
proc loop(this : Node) = 
        echo(this.m)
proc nod(kind : NodeKind, token : Token, args : varargs[Node]) : Node""")