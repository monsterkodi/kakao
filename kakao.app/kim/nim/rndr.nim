# ████████   ███   ███  ███████    ████████ 
# ███   ███  ████  ███  ███   ███  ███   ███
# ███████    ███ █ ███  ███   ███  ███████  
# ███   ███  ███  ████  ███   ███  ███   ███
# ███   ███  ███   ███  ███████    ███   ███

import std/[strformat, strutils]
import kommon
import tknz
import pars

type
    Rndr = object
        s           : string
        indent      : int
        needsIndent : bool

proc add(r: var Rndr, text: string)     = r.s &= text
proc space(r: var Rndr)                 = r.s &= " "
proc addTok(r: var Rndr, n: Node)       = r.s &= n.token.str

proc render(r: var Rndr, n: Node)

proc render(r: var Rndr, nodes: seq[Node]) =

    for i,n in nodes:
        r.render n
        if i<nodes.len-1:
            r.add ", "

proc ▸block(r: var Rndr, n: Node) = 

    var idt : string
    if n.token.tok == ◆indent:
        idt = n.token.str
        r.add "\n" & idt
        
    for i,exp in n.expressions:
        r.render exp
        if i < n.expressions.len-1:
            if n.expressions[i+1].token.line > exp.token.line:
                r.add "\n" & idt
            else:
                r.add " "

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
    
proc ▸arrayLike(r: var Rndr, n: Node) = 

    r.render n.array_like
    r.add "["
    r.render n.array_args
    r.add "]"

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
    if n.func_body != nil:
        r.add " "
        r.render n.func_body
    
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
        
proc ▸var(r: var Rndr, n: Node) =

    if n.token.tok == ◆var:
        r.add "var "
    else:
        r.add "let "
    r.render n.var_name
    if n.var_type != nil:
        r.add " : "
        r.render n.var_type
    if n.var_value != nil:
        r.add " = "
        r.render n.var_value.default

proc ▸string(r: var Rndr, n: Node) = 

    let delimiter = n.token.str
    
    if n.string_stripols.len > 0:
        r.add "&"
        
    r.add delimiter
    r.addTok n.string_content
    for stripol in n.string_stripols:
        r.add "{"
        r.render stripol.stripol_xprssns
        r.add "}"
        if stripol.stripol_content != nil:
            r.addTok stripol.stripol_content
    
    r.add delimiter
    
proc ▸use(r: var Rndr, n: Node) = 
    
    r.add "import "
    r.addTok n.use_module
    if n.use_kind != nil and n.use_kind.token.str == "▪":
        r.add "/["
        r.render n.use_items
        r.add "]"
    
proc ▸comment(r: var Rndr, n: Node) = 

    r.addTok n
    r.addTok n.comment_content
    
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
    
proc ▸list(r: var Rndr, n: Node) =

    for i,item in n.list_values:
        r.render item
        if i < n.list_values.len-1:
            r.add ", "
    
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

    var idt = " ".repeat n.token.col
    
    r.add idt & "case "
    r.render(n.switch_value)
    r.add ":"
    
    var cdt = " ".repeat n.switch_cases[0].token.col
    
    for i,caseNode in n.switch_cases:
        r.add "\n" & cdt
        r.add "of "
        for j,whenNode in caseNode.case_when:
            if j > 0:
                r.add ", "
            r.render(whenNode)
        r.add ": "
        r.render(caseNode.case_then)
    
    if n.switch_default != nil:
        r.add "\n" & cdt
        r.add "else: "
        r.render(n.switch_default)

proc ▸testCase(r: var Rndr, n: Node) =

    r.add "check "
    r.render n.test_expression
    r.add " == "
    r.render n.test_expected

proc ▸testSuite(r:var Rndr, n:Node) =

    if n.kind == ●testSuite:
        r.add "suite"
    else:
        r.add "test"
    r.add " \"" 
    r.add n.token.str[4..^1] 
    r.add "\": "
    r.render n.test_block

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
        of ●list:
            r.▸list(n)
        of ●range:
            r.▸range(n)
        of ●string:
            r.▸string(n)
        of ●comment:
            r.▸comment(n)
        of ●use:
            r.▸use(n)
        of ●propertyAccess:
            r.▸propertyAccess(n)
        of ●arrayLike:
            r.▸arrayLike(n)
        of ●var:
            r.▸var(n)
        of ●return:
            r.▸return(n)
        of ●testSuite, ●testSection:
            r.▸testSuite(n)
        of ●testCase:
            r.▸testCase(n)
        of ●literal, ●type, ●import:
            r.addTok n
        else:
            echo &"unhandled {n} {n.kind}"
            r.addTok n

proc rndr*(root: Node): string =

    var r = Rndr()
    r.render(root)
    r.s

proc rndr*(code: string): string =

    let a = ast(code)
    # echo &"ast {a}"
    rndr(a)
    
proc file*(file: string) : string = 

    var fileOut = file.swapLastPathComponentAndExt("kim", "nim")
    echo &"fileOut {fileOut}"
    let code = file.readFile()
    # echo &"code {code}"
    let trns = rndr code
    echo &"{trns}"
    fileOut
    
proc files*(files: seq[string]): seq[string] = 

    var transpiled: seq[string]
    for f in files:
        transpiled.add file f
        
    # echo "render.files done: ", transpiled
    transpiled
        
                            
