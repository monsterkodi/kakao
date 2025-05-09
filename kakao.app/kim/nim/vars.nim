#[
    ███   ███   ███████   ████████    ███████
    ███   ███  ███   ███  ███   ███  ███     
     ███ ███   █████████  ███████    ███████ 
       ███     ███   ███  ███   ███       ███
        █      ███   ███  ███   ███  ███████ 

    inserts var keywords for firs assignment 
    operations in scope
]#
import pars
type Scoper* = ref object
    vars*: seq[Table[string, bool]]
    # 00000000  000   000  00000000   
    # 000        000 000   000   000  
    # 0000000     00000    00000000   
    # 000        000 000   000        
    # 00000000  000   000  000        
    #  0000000   0000000   0000000   00000000   00000000  
    # 000       000       000   000  000   000  000       
    # 0000000   000       000   000  00000000   0000000   
    #      000  000       000   000  000        000       
    # 0000000    0000000   0000000   000        00000000  
proc `$`*(this : Scoper) : string = $this.vars
proc exp(this : Scoper, body : Node, i : int, e : Node)
proc scope(this : Scoper, body : Node) : Node
proc branch(this : Scoper, body : Node) = discard this.scope(body)
proc exp(this : Scoper, body : Node, i : int, e : Node) = 
        if (e == nil): return
        proc add(name : string) = this.vars[^1][name] = true
        proc insert(name : string, expr : Node) = 
            for map in this.vars: 
                if map.hasKey(name): return
            body.expressions[i] = Node(token: Token(tok: ◂let, str: "var", line: expr.token.line), kind: ●let, let_expr: expr)
            add(name)
        case e.kind:
            of ●operation: 
                if (e.operand_right.kind == ●func): 
                    this.branch(e.operand_right.func_body)
                elif (e.token.tok == ◂assign): 
                    var lhs = e.operand_left
                    case lhs.kind:
                        of ●literal: 
                            insert(lhs.token.str, e)
                        of ●list: 
                            insert(lhs.token.str, e)
                            for item in lhs.list_values: 
                                add(item.token.str)
                        else: discard
                    # else
                    #     log "vars lhs #{lhs}"
            of ●var: 
                insert(e.var_name.token.str, e)
            of ●let: 
                if ((e.let_expr.kind == ●operation) and (e.let_expr.token.tok == ◂assign)): 
                    add(e.let_expr.operand_left.token.str)
                elif (e.let_expr.kind == ●var): 
                    add(e.let_expr.var_name.token.str)
                else: 
                    echo(&"unhandled let type {e} {e.let_expr}")
            of ●if: 
                for condThen in e.condThens: 
                    this.branch(condThen.then_branch)
                this.branch(e.else_branch)
            of ●for: 
                this.branch(e.for_body)
            of ●while: 
                this.branch(e.while_body)
            of ●switch: 
                for switchCase in e.switch_cases: 
                    this.branch(switchCase.case_then)
                this.branch(e.switch_default)
            else: discard
proc scope(this : Scoper, body : Node) : Node = 
        if (((body == nil) or (body.kind != ●block)) or (body.expressions.len == 0)): 
            return body
        this.vars.push(initTable[string, bool]())
        for i, e in body.expressions: 
            this.exp(body, i, e)
        this.vars.pops()
        body
proc variables*(body : Node) : Node = 
    Scoper().scope(body)