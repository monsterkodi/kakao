#[
    ███   ███   ███████   ████████    ███████
    ███   ███  ███   ███  ███   ███  ███     
     ███ ███   █████████  ███████    ███████ 
       ███     ███   ███  ███   ███       ███
        █      ███   ███  ███   ███  ███████ 

    inserts var keywords for first assignment 
    operations in scope
]#
import pars

type Scoper = ref object of RootObj
    vars: seq[Table[string, bool]]
    lang: string

proc init(this : Scoper, lang : string) : Scoper = 
    this.lang = lang
    this

proc `$`(this : Scoper) : string = $this.vars

proc exp(this : Scoper, body : Node, i : int, e : Node)

proc scope(this : Scoper, body : Node) : Node

proc branch(this : Scoper, body : Node) = discard this.scope(body)
# 00000000  000   000  00000000   
# 000        000 000   000   000  
# 0000000     00000    00000000   
# 000        000 000   000        
# 00000000  000   000  000        

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
                    if ((this.lang == "lua") and e.operand_right.func_signature): 
                        for a in e.operand_right.func_signature.sig_args.list_values: 
                            case a.kind:
                                of ●arg: add(a.arg_name.token.str)
                                of ●literal: add(a.token.str)
                                else: discard #log "unhandled arg type #{a}"
                    this.branch(e.operand_right.func_body)
                elif (e.token.tok == ◂assign): 
                    var lhs = e.operand_left
                    case lhs.kind:
                        of ●literal: 
                            insert(lhs.token.str, e)
                        of ●list: 
                            for lv in lhs.list_values: 
                                if (lv.kind != ●literal): 
                                    return
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
            of ●testSuite, ●testSection: 
                this.branch(e.test_block)
            of ●semicolon: 
                this.branch(e)
            of ●func: 
                this.branch(e.func_body)
            of ●return: 
                this.exp(body, i, e.return_value)
            else: discard
#  0000000   0000000   0000000   00000000   00000000  
# 000       000       000   000  000   000  000       
# 0000000   000       000   000  00000000   0000000   
#      000  000       000   000  000        000       
# 0000000    0000000   0000000   000        00000000  

proc scope(this : Scoper, body : Node) : Node = 
        if (((body == nil) or (body.kind notin {●block, ●semicolon})) or (body.expressions.len == 0)): 
            return body
        this.vars.push(initTable[string, bool]())
        for i, e in body.expressions: 
            this.exp(body, i, e)
        this.vars.pops()
        body

proc variables*(body : Node, lang : string) : Node = 
    Scoper().init(lang).scope(body)