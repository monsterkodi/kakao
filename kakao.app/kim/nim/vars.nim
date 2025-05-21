#[
    ███   ███   ███████   ████████    ███████
    ███   ███  ███   ███  ███   ███  ███     
     ███ ███   █████████  ███████    ███████ 
       ███     ███   ███  ███   ███       ███
        █      ███   ███  ███   ███  ███████ 

    nim:
        adds var to assignments
    
    lua:
        adds local to assignments
        inserts argument ?= default value statements
        inserts return for last function expression
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

proc addbody(this : Scoper, fn : Node) = 
        if not fn.func_body: 
            fn.func_body = nod(●block, tkn(◂indent, "    "), @[])
        if (fn.func_body.kind notin {●block, ●semicolon}): 
            fn.func_body = nod(●block, tkn(◂indent, "    "), @[fn.func_body])

proc returnize(this : Scoper, fn : Node) = 
        if not fn.func_body: return
        case fn.func_body.kind:
            of ●block, ●semicolon: 
                if (fn.func_body.expressions.len == 0): return
                var lastExp = fn.func_body.expressions[^1]
                if (lastExp.kind != ●return): 
                    if (lastExp.kind in {●if, ●switch, ●while, ●for}): 
                        echo(&"todo: handle implicit return {lastExp.kind}")
                        discard
                    else: 
                        if ((lastExp.kind != ●operation) or (lastExp.token.tok notin assignToks)): 
                            var retval = lastExp
                            var line = retval.token.line
                            fn.func_body.expressions[^1] = nod(●return, tkn(◂return, "return", line), retval)
                        else: 
                            var retval = lastExp.operand_left
                            var line = retval.token.line
                            fn.func_body.expressions.add(nod(●return, tkn(◂return, "return", (line + 1)), retval))
            of ●return: discard
            else: 
                var line = fn.func_body.token.line
                var retval = fn.func_body
                fn.func_body = nod(●return, tkn(◂return, "return", (line + 1)), retval)

proc luanize(this : Scoper, fn : Node) = 
        this.addbody(fn)
        this.returnize(fn)
        if (fn.func_signature and fn.func_signature.sig_args.list_values): 
            for arg in fn.func_signature.sig_args.list_values: 
                if arg.arg_value: 
                    if (fn.func_body and (fn.func_body.kind in {●block, ●semicolon})): 
                        var argdef = nod(●operation, tkn(◂qmark_assign), arg.arg_name, arg.arg_value)
                        fn.func_body.expressions.insert(argdef, 0)
                        arg.arg_value = nil
# 00000000  000   000  00000000   
# 000        000 000   000   000  
# 0000000     00000    00000000   
# 000        000 000   000        
# 00000000  000   000  000        

proc exp(this : Scoper, body : Node, i : int, e : Node) = 
        if (e == nil): return
        # log "vars.exp #{body.expressions.len} #{i} #{e.kind}"
        
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
                        this.vars.push(initTable[string, bool]())
                        for a in e.operand_right.func_signature.sig_args.list_values: 
                            case a.kind:
                                of ●arg: 
                                    if a.arg_name: add(a.arg_name.token.str)
                                of ●literal: add(a.token.str)
                                else: discard
                        var body = e.operand_right.func_body
                        if (body and (body.kind in {●block, ●semicolon})): 
                            for i, e in body.expressions: 
                                this.exp(body, i, e)
                        this.vars.pops()
                    else: 
                        this.branch(e.operand_right.func_body)
                    if (this.lang == "lua"): 
                        this.luanize(e.operand_right)
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
                if (this.lang == "lua"): 
                    this.luanize(e)
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