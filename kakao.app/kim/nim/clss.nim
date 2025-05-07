#  ███████  ███       ███████   ███████
# ███       ███      ███       ███     
# ███       ███      ███████   ███████ 
# ███       ███           ███       ███
#  ███████  ███████  ███████   ███████ 
import pars
type NodeIt = proc(node:Node):Node
proc tkn(tok = ◂name, str = "", line = -1, col = -1) : Token = Token(tok: tok, str: str, line: line, col: col)
proc nod(kind : NodeKind, token : Token, args : varargs[Node]) : Node = 
    var n = Node(kind: kind, token: token)
    case kind:
        of ●arg: 
            n.arg_type = args[0]
            n.arg_name = args[1]
        of ●propertyAccess: 
            n.owner = args[0]
            n.property = args[1]
        of ●operation: 
            n.operand_left = args[0]
            n.operand_right = args[1]
        of ●list: 
            n.list_values = @(args)
        of ●signature: 
            n.sig_args = args[0]
        else: discard
    n
proc traverse(n : Node, iter : NodeIt) : Node = 
    if (n == nil): return
    var n = n
    case n.kind:
        of ●block: 
            for i, e in n.expressions: 
                n.expressions.splice(i, 1, @[traverse(e, iter)])
        of ●literal: 
            n = iter(n)
        of ●operation: 
            n.operand_left = traverse(n.operand_left, iter)
            n.operand_right = traverse(n.operand_right, iter)
        of ●call: 
            n.callee = traverse(n.callee, iter)
            for i, e in n.call_args: 
                n.call_args.splice(i, 1, @[traverse(e, iter)])
        of ●for: 
            n.for_body = traverse(n.for_body, iter)
            n.for_range = traverse(n.for_range, iter)
        of ●if: 
            for i, e in n.cond_thens: 
                n.cond_thens.splice(i, 1, @[traverse(e, iter)])
            n.else_branch = traverse(n.else_branch, iter)
        of ●condThen: 
            n.condition = traverse(n.condition, iter)
            n.then_branch = traverse(n.then_branch, iter)
        of ●switch: 
            n.switch_value = traverse(n.switch_value, iter)
            for i, e in n.switch_cases: 
                n.switch_cases.splice(i, 1, @[traverse(e, iter)])
            n.switch_default = traverse(n.switch_default, iter)
        of ●switchCase: 
            for i, e in n.case_when: 
                n.case_when.splice(i, 1, @[traverse(e, iter)])
            n.case_then = traverse(n.case_then, iter)
        of ●propertyAccess: 
            n.owner = traverse(n.owner, iter)
        of ●arrayAccess: 
            n.array_owner = traverse(n.array_owner, iter)
            n.array_index = traverse(n.array_index, iter)
        of ●return: 
            n.return_value = traverse(n.return_value, iter)
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
        if ((n.token.tok == ◂name) and (n.token.str[0] == '@')): 
            var owner = nod(●literal, tkn(◂name, "this"))
            var property = nod(●literal, tkn(◂name, n.token.str[1..^1]))
            return nod(●propertyAccess, tkn(◂dot, "."), owner, property)
        n
    proc convert(it : Node) : Node = 
        var token = Token(tok: ◂assign, line: it.token.line, col: it.token.col)
        var funcn = it.member_value
        var arg_type = nod(●type, tkn(◂val_type, className))
        var arg_name = nod(●literal, tkn(◂name, "this"))
        var this_arg = nod(●arg, tkn(◂type), arg_type, arg_name)
        if funcn.func_signature: 
            funcn.func_signature.sig_args.list_values.unshift(this_arg)
        else: 
            var sig_args = nod(●list, tkn(◂square_open), this_arg)
            funcn.func_signature = nod(●signature, tkn(), sig_args)
        funcn.func_body = traverse(funcn.func_body, thisify)
        nod(●operation, token, it.member_key, funcn)
    var methods = funcs.map(convert)
    methods
proc classify*(body : Node) : Node = 
    if (((body == nil) or (body.kind != ●block)) or (body.expressions.len == 0)): 
        return body
    for i, e in body.expressions: 
        if (e.kind == ●class): 
            var methods = methodify(e)
            body.expressions.insert(methods, (i + 1))
    body