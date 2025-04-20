# ████████   ███   ███  ███████    ████████ 
# ███   ███  ████  ███  ███   ███  ███   ███
# ███████    ███ █ ███  ███   ███  ███████  
# ███   ███  ███  ████  ███   ███  ███   ███
# ███   ███  ███   ███  ███████    ███   ███

import std/[strformat, strutils]
import kommon
import lexi
import pars

type
    Rndr = object
        s           : string
        indent      : int
        needsIndent : bool

proc add(r: var Rndr, text: string)     = r.s &= text
proc space(r: var Rndr)                 = r.s &= " "
proc addTok(r: var Rndr, n: Node)       = r.s &= n.token.str
proc addLine(r: var Rndr, text: string) = 

    r.s &= text

proc indent(r: var Rndr) = echo "indent"
 
proc dedent(r: var Rndr) = echo "dedent"

proc render(r: var Rndr, n: Node)

proc ▸block(r: var Rndr, n: Node) = 

    for exp in n.expressions:
        
        r.render exp

proc ▸if(r: var Rndr, n: Node) =

    echo "if"
    
proc ▸operation(r: var Rndr, n: Node) = 

    r.add "("
    r.render n.operand_left
    r.space()
    case n.token.tok:
        of ◆and:
            r.add "and"
        of ◆or:
            r.add "or"
        else :
            r.addTok n
    r.space()
    r.render n.operand_right
    r.add ")"

proc ▸preOp(r: var Rndr, n: Node) = 

    if n.token.tok == ◆not:
        r.add "not "
    else:
        r.addTok n
        
    r.render n.operand
    
proc ▸postOp(r: var Rndr, n: Node) = 

    r.render n.operand
    r.addTok n
    
proc ▸propertyAccess(r: var Rndr, n: Node) = 

    r.render n.owner
    r.addTok n
    r.render n.property

proc ▸condThen(r: var Rndr, n: Node)       = echo "▸condThen"
proc ▸switch(r: var Rndr, n: Node)         = echo "▸switch"
proc ▸switchCase(r: var Rndr, n: Node)     = echo "▸switchCase"
proc ▸func(r: var Rndr, n: Node)           = echo "▸func"
proc ▸call(r: var Rndr, n: Node)           = echo "▸call"
proc ▸range(r: var Rndr, n: Node)          = echo "▸range"
proc ▸literal(r: var Rndr, n: Node)        = echo "▸literal"
proc ▸ident(r: var Rndr, n: Node)          = echo "▸iden"
proc ▸var(r: var Rndr, n: Node)            = echo "▸var"
proc ▸return(r: var Rndr, n: Node)         = echo "▸return"
proc ▸testCase(r: var Rndr, n: Node)       = echo "▸testCase"

proc render(r: var Rndr, n: Node) =

    # let b1 = true
    # let b2 = false
    # echo &"render {node.kind} {b1 and b2}"
    
    case n.kind:
    
        of ●block:
            r.▸block(n)
        of ●if:
            r.▸if(n)
        of ●condThen:
            r.▸condThen(n)
        of ●switch:
            r.▸switch(n)
        of ●switchCase:
            r.▸switchCase(n)
        of ●func:
            r.▸func(n)
        of ●call:
            r.▸call(n)
        of ●operation:
            r.▸operation(n)
        of ●postOp:
            r.▸postOp(n)
        of ●preOp:
            r.▸preOp(n)
        of ●range:
            r.▸range(n)
        of ●propertyAccess:
            r.▸propertyAccess(n)
        of ●var:
            r.▸var(n)
        of ●return:
            r.▸return(n)
        of ●testCase:
            r.▸testCase(n)
        else:
            # echo &"unhandled {n}"
            r.addTok n

proc rndr*(root: Node): string =

    var r = Rndr()
    r.render(root)
    r.s

proc rndr*(code: string): string =

    rndr(ast(code))
                            
