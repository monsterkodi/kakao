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

proc render(r: var Rndr, nodes: seq[Node]) =

    for i,n in nodes:
        r.render n
        if i<nodes.len-1:
            r.add ", "

proc ▸block(r: var Rndr, n: Node) = 

    for i,exp in n.expressions:
        r.render exp
        if i<n.expressions.len-1:
            r.add "\n"

proc ▸operation(r: var Rndr, n: Node) = 

    if n.token.tok notin {◆assign}:
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
    if n.token.tok notin {◆assign}:
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

proc ▸func(r: var Rndr, n: Node) = 

    r.add "proc "
    r.render n.func_name
    r.add "("
    r.render n.func_args
    r.add ")"
    if n.func_type != nil:
        r.add " : "
        r.render n.func_type
    r.add " ="
    
proc ▸argType(r: var Rndr, n: Node) =

    r.render n.arg_name
    if n.arg_type != nil:
        r.add ":"
        if n.token.tok == ◆var:
            r.add "var "
        r.render n.arg_type
    if n.arg_default != nil:
        r.add "="
        r.render n.arg_default.default

proc ▸string(r: var Rndr, n: Node) = 

    r.add "\""
    r.addTok n
    r.add "\""
    
proc ▸call(r: var Rndr, n: Node) =

    r.render n.callee
    r.add "("
    r.render n.call_args
    r.add ")"

proc ▸if(r: var Rndr, n: Node) =

    r.add "if "
    for i,condThen in n.cond_thens:
        if i > 0:
            r.add " elif "
        r.render condThen.cond
        r.add ": "
        r.render condThen.then
    if n.else != nil   :
        r.add " else: "
        r.render n.else
        
proc ▸for(r: var Rndr, n: Node) =

    r.add "for "
    r.render n.for_value
    r.add " in "
    r.render n.for_range
    r.add ": "
    r.render n.for_body
    
proc ▸range(r: var Rndr, n: Node) = 

    r.add "["
    r.render n.range_start
    r.addTok n
    r.render n.range_end
    r.add "]"
        
proc ▸return(r: var Rndr, n: Node) =

    r.add "return"
    if n.return_value != nil:
        r.space()
        r.render n.return_value
     
proc ▸switch(r: var Rndr, n: Node) =

    r.add "case "
    r.render(n.switch_value)
    r.add ":\n"
    
    for i,caseNode in n.switch_cases:
        if i > 0:
            r.add "\n"
        r.add "    of "
        for j,whenNode in caseNode.case_when:
            if j > 0:
                r.add ", "
            r.render(whenNode)
        r.add ": "
        r.render(caseNode.case_then)
    
    if n.switch_default != nil:
        r.add "\n    else: "
        r.render(n.switch_default)

proc ▸testCase(r: var Rndr, n: Node) =

    r.add "        check "
    r.render n.test_expression
    r.add " == "
    r.render n.test_expected

proc ▸indent(r: var Rndr, n: Node)         = echo "▸indent"
# proc ▸var(r: var Rndr, n: Node)            = log "▸var"

proc render(r: var Rndr, n: Node) =

    if n == nil:
        return  
    
    case n.kind:
    
        of ●block:
            r.▸block(n)
        of ●if:
            r.▸if(n)
        of ●switch:
            r.▸switch(n)
        of ●func:
            r.▸func(n)
        of ●argType:
            r.▸argType(n)
        of ●call:
            r.▸call(n)
        of ●operation:
            r.▸operation(n)
        of ●postOp:
            r.▸postOp(n)
        of ●preOp:
            r.▸preOp(n)
        of ●for:
            r.▸for(n)
        of ●range:
            r.▸range(n)
        of ●propertyAccess:
            r.▸propertyAccess(n)
        # of ●var
        #     r.▸var(n)
        of ●return:
            r.▸return(n)
        of ●testSuite:
            r.add "suite \"" 
            r.add n.token.str[4..^1] 
            r.add "\":" 
        of ●testSection:
            r.add "    test \"" 
            r.add n.token.str[4..^1] 
            r.add "\":" 
        of ●testCase:
            r.▸testCase(n)
        of ●literal:
            if n.token.tok == ◆string:
                r.▸string(n)
            else:
                r.addTok n
        of ●type:
            r.addTok n
        else:
            echo &"unhandled {n} {n.kind}"
            r.addTok n

proc rndr*(root: Node): string =

    var r = Rndr()
    r.render(root)
    r.s

proc rndr*(code: string): string =

    rndr(ast(code))
                            
