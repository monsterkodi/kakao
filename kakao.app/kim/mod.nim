
import sugar
from std/strformat import `&`

proc getNum* : int =

    42
    
let getNum2* = () => 

    43
    
proc getNum3*(n: int = 2) : int =

    44*n
    
let getNum4* = (n:int) =>

    45*n
    
type test = ref object
    mem1:int
    mem2:string
     
proc increment(self:test) = 

    self.mem1 += 1   
    
var t = test(mem1:1, mem2:"2")
t.increment()
echo &"t:{$t[]}"