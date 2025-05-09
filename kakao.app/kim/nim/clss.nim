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
        of ●block: 
            trvl(n.expressions)
        of ●string: 
            for s in n.string_stripols: 
                trvl(s.stripol_xprssns)
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
        of ●list: 
            trvl(n.list_values)
        of ●func: 
            trav(n.func_body)
        else: 
            echo(&"clss.traverse -- unhandled {n.kind}")
    n
proc methodify(clss : Node) : seq[Node] = 
    proc isMethod(it : Node) : bool = ((it.kind == ●member) and (it.member_value.kind == ●func))
    var (funcs, members) = pullIf(clss.class_body.expressions, isMethod)
    clss.class_body.expressions = members
    var className = clss.class_name.token.str
    if (className[^1] == '*'): 
        className = className[0..^2]
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
    proc convert(it : Node) : Node = 
        var token = tkn(◂assign, it.token.line, it.token.col)
        var funcn = it.member_value
        var arg_type = nod(●type, tkn(◂val_type, className))
        var arg_name = nod(●literal, tkn(◂name, "this"))
        var this_arg = nod(●arg, tkn(◂type), arg_type, arg_name)
        if funcn.func_signature: 
            funcn.func_signature.sig_args.list_values.unshift(this_arg)
        else: 
            var sig_args = nod(●list, tkn(◂square_open), @[this_arg])
            funcn.func_signature = nod(●signature, token, sig_args, nil)
        funcn.func_body = traverse(funcn.func_body, thisify)
        nod(●operation, token, it.member_key, funcn)
    var methods = funcs.map(convert)
    methods
proc classify*(body : Node) : Node = 
    if (((body == nil) or (body.kind != ●block)) or (body.expressions.len == 0)): 
        return body
    for i in countdown(body.expressions.high, 0): 
        var e = body.expressions[i]
        if (e.kind == ●class): 
            var methods = methodify(e)
            body.expressions.insert(methods, (i + 1))
    body