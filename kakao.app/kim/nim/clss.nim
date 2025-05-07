#  ███████  ███       ███████   ███████
# ███       ███      ███       ███     
# ███       ███      ███████   ███████ 
# ███       ███           ███       ███
#  ███████  ███████  ███████   ███████ 
import pars
type NodeIt = proc(node:Node):Node
var defaultToken = Token(tok: ◂name)
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
        else: discard
    n
proc traverse(n : Node, iter : NodeIt) : Node = 
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
        else: 
            echo(&"unhandled {n.kind}")
    n
proc methodify(clss : Node) : seq[Node] = 
    proc isMethod(it : Node) : bool = ((it.kind == ●member) and (it.member_value.kind == ●func))
    var (funcs, members) = pullIf(clss.class_body.expressions, isMethod)
    clss.class_body.expressions = members
    var className = clss.class_name.token.str
    proc thisify(n : Node) : Node = 
        if ((n.token.tok == ◂name) and (n.token.str[0] == '@')): 
            var owner = nod(●literal, Token(tok: ◂name, str: "this"))
            var property = nod(●literal, Token(tok: ◂name, str: n.token.str[1..^1]))
            return nod(●propertyAccess, Token(tok: ◂dot, str: "."), owner, property)
        n
    proc convert(it : Node) : Node = 
        var token = Token(tok: ◂assign, line: it.token.line, col: it.token.col)
        var funcn = it.member_value
        var arg_type = nod(●type, Token(tok: ◂val_type, str: className))
        var arg_name = nod(●literal, Token(tok: ◂name, str: "this"))
        var this_arg = nod(●arg, Token(tok: ◂type), arg_type, arg_name)
        if funcn.func_signature: 
            funcn.func_signature.sig_args.list_values.unshift(this_arg)
        else: 
            var sig_args = nod(●list, Token(tok: ◂square_open), this_arg)
            funcn.func_signature = Node(kind: ●signature, sig_args: sig_args)
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