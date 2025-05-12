#  ███████  ███       ███████   ███████
# ███       ███      ███       ███     
# ███       ███      ███████   ███████ 
# ███       ███           ███       ███
#  ███████  ███████  ███████   ███████ 
import pars

type NodeIt = proc(node:Node):Node

proc traverse(n : Node, iter : NodeIt) : Node = 
    if (n == nil): return
    
    template trav(arg:Node) = 
    
        arg = traverse(arg, iter)
    
    template trvl(arg:seq[Node]) = 
    
        for i, e in arg: 
            arg.splice(i, 1, @[traverse(e, iter)])
    var n = n
    case n.kind:
        of ●literal: 
            n = iter(n)
        of ●block, ●semicolon: 
            trvl(n.expressions)
        of ●string: 
            trvl(n.string_stripols)
        of ●stripol: 
            trvl(n.stripol_xprssns)
        of ●operation: 
            trav(n.operand_left)
            trav(n.operand_right)
        of ●preOp, ●postOp: 
            trav(n.operand)
        of ●call: 
            trav(n.callee)
            trvl(n.call_args)
        of ●for: 
            trav(n.for_body)
            trav(n.for_range)
        of ●if: 
            trvl(n.cond_thens)
            trav(n.else_branch)
        of ●condThen: 
            trav(n.condition)
            trav(n.then_branch)
        of ●switch: 
            trav(n.switch_value)
            trvl(n.switch_cases)
            trav(n.switch_default)
        of ●switchCase: 
            trvl(n.case_when)
            trav(n.case_then)
        of ●propertyAccess: 
            trav(n.owner)
        of ●arrayAccess: 
            trav(n.array_owner)
            trav(n.array_index)
        of ●return: 
            trav(n.return_value)
        of ●discard: 
            trav(n.discard_value)
        of ●while: 
            trav(n.while_cond)
            trav(n.while_body)
        of ●range: 
            trav(n.range_start)
            trav(n.range_end)
        of ●member: 
            trav(n.member_value)
        of ●let: 
            trav(n.let_expr)
        of ●list, ●curly, ●squarely: 
            trvl(n.list_values)
        of ●func: 
            trav(n.func_body)
        else: 
            # log "clss.traverse -- unhandled #{n.kind}"
            discard
    n

proc methodify(clss : Node) : seq[Node] = 
    # isMethod = ◇Node it ➜bool -> it.kind == ●member and it.member_value.kind == ●func
    
    proc isMethod(it : Node) : bool = (((it.kind == ●member) and (it.member_value.kind == ●func)) or (it.kind == ●comment))
    var (funcs, members) = pullIf(clss.class_body.expressions, isMethod)
    var strugt = (clss.kind == ●struct)
    var exporting = false
    var className = clss.class_name.token.str
    if (className[^1] == '*'): 
        className = className[0..^2]
        exporting = true
    
    proc thisify(n : Node) : Node = 
        if (n.token.tok == ◂name): 
            if (n.token.str[0] == '@'): 
                if (n.token.str.len > 1): 
                    var owner = nod(●literal, tkn(◂name, "this"))
                    var property = nod(●literal, tkn(◂name, n.token.str[1..^1]))
                    return nod(●propertyAccess, tkn(◂dot, ".", n.token.line, n.token.col), owner, property)
                else: 
                    n.token.str = "this"
        n
    
    proc constructor(fn : Node) : Node = 
        fn.operand_left.token.str = "init"
        fn.operand_right.func_signature.sig_type = nod(●type, tkn(◂name, className))
        if fn.operand_right.func_body: 
            var line = fn.operand_right.func_body.expressions[^1].token.line
            fn.operand_right.func_body.expressions.add(nod(●literal, tkn(◂name, "this", (line + 1))))
        else: 
            fn.operand_right.func_body = nod(●literal, tkn(◂name, "this"))
        fn
    
    proc superize(fn : Node) = 
        if (fn.func_body and (fn.func_body.kind == ●block)): 
            for i, e in fn.func_body.expressions: 
                if ((e.kind == ●call) and (e.token.str == "super")): 
                    e.call_args.unshift(Node(kind: ●call, token: tkn(◂name), callee: nod(●literal, tkn(◂name, clss.class_parent.token.str)), call_args: @[nod(●literal, tkn(◂name, "this"))]))
                    var initcall = Node(kind: ●call, token: tkn(◂name), callee: nod(●literal, tkn(◂name, "init")), call_args: e.call_args)
                    fn.func_body.expressions[i] = nod(●discard, tkn(◂discard), nod(●preOp, tkn(◂name, "procCall "), initcall))
    
    proc funkify(it : Node) : Node = 
        if (it.kind == ●comment): return it
        var token = tkn(◂assign, it.token.line, it.token.col)
        var funcn = it.member_value
        var valType = if (strugt and (it.member_key.token.str[0] != '$')): ◂var_type else: ◂val_type
        var arg_type = nod(●type, tkn(valType, className))
        var arg_name = nod(●literal, tkn(◂name, "this"))
        var this_arg = nod(●arg, tkn(valType), arg_type, arg_name)
        if funcn.func_signature: 
            funcn.func_signature.sig_args.list_values.unshift(this_arg)
        else: 
            var sig_args = nod(●list, tkn(◂square_open), @[this_arg])
            funcn.func_signature = nod(●signature, token, sig_args, nil)
        if (funcn.token.tok == ◂method): 
            if not clss.class_parent: 
                funcn.func_mod = nod(●literal, tkn(◂mod, "{.base.}"))
        funcn.func_body = traverse(funcn.func_body, thisify)
        superize(funcn)
        var fn = nod(●operation, token, it.member_key, funcn)
        if (it.member_key.token.str == "@"): fn = constructor(fn)
        if exporting: 
            if (it.member_key.token.str[^1] != '*'): 
                (it.member_key.token.str &= "*")
        fn
    
    proc publicify(it : Node) : Node = 
        if exporting: 
            case it.kind:
                of ●member: 
                    if (it.member_key.token.str[^1] != '*'): 
                        (it.member_key.token.str &= "*")
                of ●switch: 
                    if (it.switch_value.kind == ●member): 
                        if (it.switch_value.member_key.token.str[^1] != '*'): 
                            (it.switch_value.member_key.token.str &= "*")
                    for switchCase in it.switch_cases: 
                        if (switchCase.case_then.kind == ●block): 
                            for thenExpr in switchCase.case_then.expressions: 
                                if (thenExpr.kind == ●member): 
                                    if (thenExpr.member_key.token.str[^1] != '*'): 
                                        (thenExpr.member_key.token.str &= "*")
                        elif (switchCase.case_then.kind == ●member): 
                            var thenExpr = switchCase.case_then
                            if (thenExpr.member_key.token.str[^1] != '*'): 
                                (thenExpr.member_key.token.str &= "*")
                else: discard
        it
    clss.class_body.expressions = members.map(publicify)
    var methods = funcs.map(funkify)
    methods

proc classify*(body : Node) : Node = 
    if (((body == nil) or (body.kind != ●block)) or (body.expressions.len == 0)): 
        return body
    for i in countdown(body.expressions.high, 0): 
        var e = body.expressions[i]
        if (e.kind in {●class, ●struct}): 
            var methods = methodify(e)
            body.expressions.insert(methods, (i + 1))
    body