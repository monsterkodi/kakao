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
                discard s.scope(e.operand_right.func_body)
            elif (e.token.tok == ◂assign): 
                let lhs = e.operand_left
                if (lhs.kind == ●literal): 
                    insert(lhs.token.str, e)
        of ●var: 
            insert(e.var_name.token.str, e)
        of ●if: 
            for condThen in e.condThens: 
                discard s.scope(condThen.then_branch)
            discard s.scope(e.else_branch)
        else: 
            discard
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