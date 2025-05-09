

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
a.p()
