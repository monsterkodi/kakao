
type A = ref object of RootObj
    a: int
proc init(this : A, a : int) : A = 
        this.a = a
        this
method p(this : A) {.base.} = echo("A:", this.a)
type B = ref object of A
    b: int
proc init(this : B, a : int) : B = 
        discard procCall init(A(this), (a * 2))
        this
method p(this : B) = echo("B:", this.a, this.b)
var a = A().init(1)
a.p()
a = B().init(2)
a.p()
                              
                              
if (discard true;false): echo("a") ; echo("b") ; echo("c") else: echo("d") ; echo("e") ; echo("f")