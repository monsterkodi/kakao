#[
    ███   ███   ███████   ████████    ███████
    ███   ███  ███   ███  ███   ███  ███     
     ███ ███   █████████  ███████    ███████ 
       ███     ███   ███  ███   ███       ███
        █      ███   ███  ███   ███  ███████ 

    inserts var keywords for assignment operations
]#
import kommon
import tknz
import pars
type Scoper* = ref object
    vars*: seq[Table[string, bool]]
proc `$`*(v : Scoper) : string = $v.vars
proc exp(s : Scoper, body : Node, i : int, e : Node)
proc scope(s : Scoper, body : Node) : Node
proc branch(s : Scoper, body : Node) = discard s.scope(body)
# 00000000  000   000  00000000   
# 000        000 000   000   000  
# 0000000     00000    00000000   
# 000        000 000   000        
# 00000000  000   000  000        
proc exp(s : Scoper, body : Node, i : int, e : Node) = 
    if (e == nil): return
    proc insert(name : string, expr : Node) = 
        for map in s.vars: 
            if map.hasKey(name): return
        body.expressions[i] = Node(token: Token(tok: ◂let, str: "var", line: expr.token.line), kind: ●let, let_expr: expr)
        s.vars[^1][name] = true
    case e.kind:
        of ●operation: 
            if (e.operand_right.kind == ●func): 
                s.branch(e.operand_right.func_body)
            elif (e.token.tok == ◂assign): 
                var lhs = e.operand_left
                if (lhs.kind == ●literal): 
                    insert(lhs.token.str, e)
        of ●var: 
            insert(e.var_name.token.str, e)
        of ●let: 
            if ((e.let_expr.kind == ●operation) and (e.let_expr.token.tok == ◂assign)): 
                s.vars[^1][e.let_expr.operand_left.token.str] = true
            elif (e.let_expr.kind == ●var): 
                s.vars[^1][e.let_expr.var_name.token.str] = true
            else: 
                echo(&"unhandled let type {e} {e.let_expr}")
        of ●if: 
            for condThen in e.condThens: 
                s.branch(condThen.then_branch)
            s.branch(e.else_branch)
        of ●for: 
            s.branch(e.for_body)
        of ●while: 
            s.branch(e.while_body)
        of ●switch: 
            for switchCase in e.switch_cases: 
                s.branch(switchCase.case_then)
            s.branch(e.switch_default)
        else: discard
#  0000000   0000000   0000000   00000000   00000000  
# 000       000       000   000  000   000  000       
# 0000000   000       000   000  00000000   0000000   
#      000  000       000   000  000        000       
# 0000000    0000000   0000000   000        00000000  
proc scope(s : Scoper, body : Node) : Node = 
    if (((body == nil) or (body.kind != ●block)) or (body.expressions.len == 0)): 
        return body
    s.vars.push(initTable[string, bool]())
    for i, e in body.expressions: 
        s.exp(body, i, e)
    s.vars.pops()
    body
proc variables*(body : Node) : Node = 
    Scoper().scope(body)