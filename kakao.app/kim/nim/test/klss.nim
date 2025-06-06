import ../rndr
import ../rlua

template t(a:string, b:string) = testCmp(a, renderNim(a, true), b, instantiationInfo())

template l(a:string, b:string) = testCmp(a, renderLua(a, true), b, instantiationInfo())
suite "nim class": 
    test "simple": 
        t("class A", "\ntype A = ref object of RootObj")
        t("struct A", "\ntype A = object")
    test "members": 
        t("class ABC\n a:int\n b:int\n c:int", "\ntype ABC = ref object of RootObj\n a: int\n b: int\n c: int")
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
class Constr
    a: int
    b: int
    @: ◇int a ◇int b ->
        @a = a
        @b = b

a = @Constr 1 2
""", """

type Constr = ref object of RootObj
    a: int
    b: int

proc init(this : Constr, a : int, b : int) : Constr = 
        this.a = a
        this.b = b
        this
var a = Constr().init(1, 2)""")
    test "methods": 
        t("""
class FunInc
    m: int
    fun: -> 
        m = 1
    inc: ◇int a1 ➜int ->
        a1 + 1
""", """

type FunInc = ref object of RootObj
    m: int

proc fun(this : FunInc) = 
        var m = 1

proc inc(this : FunInc, a1 : int) : int = 
        (a1 + 1)""")
    test "export": 
        t("class Export*\n    add: ◇string text -> @s &= text", "\ntype Export* = ref object of RootObj\n    \n\nproc add*(this : Export, text : string) = (this.s &= text)")
        t("struct Export*\n    add: ◇string text -> @s &= text", "\ntype Export* = object\n    \n\nproc add*(this : var Export, text : string) = (this.s &= text)")
        t("""
class Export*
    m: int
    switch kind : int
        0 
            x : int
        1
            y : bool
    @: -> 
    inc: ◇int a1 ➜int ->
""", """

type Export* = ref object of RootObj
    m*: int
    case kind*: int:
        of 0: 
            x*: int
        of 1: 
            y*: bool

proc init*(this : Export) : Export = this

proc inc*(this : Export, a1 : int) : int""")
    test "struct methods": 
        t("""
struct Struct
    m: int
    hello: ->
        @m += 1
""", """

type Struct = object
    m: int

proc hello(this : var Struct) = 
        (this.m += 1)""")
        t("""
struct Struct
    $: ->
        "hello"
    o: ->
""", """

type Struct = object
    

proc `$`(this : Struct) = 
        "hello"

proc o(this : var Struct)""")
    test "this vars": 
        t("class A\n    add: ◇string text -> @s &= text", "\ntype A = ref object of RootObj\n    \n\nproc add(this : A, text : string) = (this.s &= text)")
        t("""
class VarsA
    m: int
    fun: -> 
        log $@m
        @m = 1
""", """

type VarsA = ref object of RootObj
    m: int

proc fun(this : VarsA) = 
        echo($this.m)
        this.m = 1""")
        t("""
class VarsB
    m: int
    sqr: -> 
        @m = @m * @m
    inc: ◇int a1 ➜int ->
        @sqr() + @inc(@m)
""", """

type VarsB = ref object of RootObj
    m: int

proc sqr(this : VarsB) = 
        this.m = (this.m * this.m)

proc inc(this : VarsB, a1 : int) : int = 
        (this.sqr() + this.inc(this.m))""")
        t("""
class VarsC
    m: int
    n: int
    o: int
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

type VarsC = ref object of RootObj
    m: int
    n: int
    o: int

proc loop(this : VarsC) = 
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
class VarsD
    m: int
    n: int
    o: int
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

type VarsD = ref object of RootObj
    m: int
    n: int
    o: int

proc loop(this : VarsD) = 
        while (this.m < this.n.len): 
            return this.o[this.m]
        
        proc fun = 
            case this.m:
                of this.m: this.m
                of this.n: this.n
                else: this.o
        
        proc moreFun = 
                  if this.m: this.n else: this.o
        fun(this.m)
        moreFun(this.o)""")
        t("""
class VarsE
    m: int
    loop: ->
        log "m: #""" & """
{@m}"
        @m
""", """

type VarsE = ref object of RootObj
    m: int

proc loop(this : VarsE) = 
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
    test "inheritance": 
        t("""
class inheritanceA
    a: int
    @: ◇int a ->
        @a = a
    p: -> log @a
class inheritanceB extends inheritanceA
    b: int
    @: ◇int a ->
        super a*2
a = @inheritanceA 1
a.p()
a = @inheritanceB 2
a.p()
""", """

type inheritanceA = ref object of RootObj
    a: int

proc init(this : inheritanceA, a : int) : inheritanceA = 
        this.a = a
        this

proc p(this : inheritanceA) = echo(this.a)

type inheritanceB = ref object of inheritanceA
    b: int

proc init(this : inheritanceB, a : int) : inheritanceB = 
        discard procCall init(inheritanceA(this), (a * 2))
        this
var a = inheritanceA().init(1)
a.p()
a = inheritanceB().init(2)
a.p()""")
    test "virtual": 
        t("""
class virtualA
    a: int
    @: ◇int a ->
        @a = a
    p: => log "virtualA:" @a
class virtualB extends virtualA
    b: int
    @: ◇int a ->
        super a*2
    p: => log "virtualB:" @a @b
a = @virtualA 1
a.p()
a = @virtualB 2
a.p()
""", """

type virtualA = ref object of RootObj
    a: int

proc init(this : virtualA, a : int) : virtualA = 
        this.a = a
        this

method p(this : virtualA) {.base.} = echo("virtualA:", this.a)

type virtualB = ref object of virtualA
    b: int

proc init(this : virtualB, a : int) : virtualB = 
        discard procCall init(virtualA(this), (a * 2))
        this

method p(this : virtualB) = echo("virtualB:", this.a(this.b))
var a = virtualA().init(1)
a.p()
a = virtualB().init(2)
a.p()""")
# ███      ███   ███   ███████ 
# ███      ███   ███  ███   ███
# ███      ███   ███  █████████
# ███      ███   ███  ███   ███
# ███████   ███████   ███   ███
suite "lua class": 
    test "simple": 
        l("class A", "\nlocal A = class(\"A\")")
    test "members": 
        l("class ABC\n a:1\n b:2\n c:3", "\nlocal ABC = class(\"ABC\")\n ABC.a = 1\n ABC.b = 2\n ABC.c = 3")
    test "constructor": 
        l("""
class Constr
    a: 0
    @: a b ->
        @a = a
        @b = b

a = Constr 1 2
""", """

local Constr = class("Constr")
    Constr.a = 0


function Constr:init(a, b) 
        self.a = a
        self.b = b
        return self
    end

local a = Constr(1, 2)""")
        l("""
class Triple
    @: ... ->
    a: ... ->
""", """

local Triple = class("Triple")
    

function Triple:init(...) 
    return self
    end

function Triple:a(...) 
    
    end""")
    test "methods": 
        l("""
class FunInc
    m: 1
    fun: m -> 
        @m = m
    inc: a1 ->
        @fun @m + 1
""", """

local FunInc = class("FunInc")
    FunInc.m = 1


function FunInc:fun(m) 
        self.m = m
        return self.m
    end


function FunInc:inc(a1) 
        return self:fun((self.m + 1))
    end""")
    test "static": 
        l("""
class Static
    @m: 1
    @fun: m -> 
        @m = m
    @inc: a1 ->
        @fun @m + 1
""", """

local Static = class("Static")
    Static.static.m = 1


function Static.static.fun(m) 
        Static.m = m
        return Static.m
    end


function Static.static.inc(a1) 
        return Static.fun((Static.m + 1))
    end""")
    test "tostring": 
        l("""
class Print
    m: "hello"
    $: -> @m
""", """

local Print = class("Print")
    Print.m = "hello"


function Print:__tostring() 
    return self.m
    end""")
    test "self": 
        l("""
class trim
    f: -> @rtrim(c)∙ltrim(c)
    g: -> @rtrim∙ltrim(c)
""", """

local trim = class("trim")
    

function trim:f() 
    return self:rtrim(c):ltrim(c)
    end

function trim:g() 
    return self.rtrim:ltrim(c)
    end""")