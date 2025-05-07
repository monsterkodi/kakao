#  ███████  ███       ███████   ███████
# ███       ███      ███       ███     
# ███       ███      ███████   ███████ 
# ███       ███           ███       ███
#  ███████  ███████  ███████   ███████ 
import pars
proc methodify(clss : Node) : seq[Node] = 
    proc isMethod(it : Node) : bool = ((it.kind == ●member) and (it.member_value.kind == ●func))
    var (funcs, members) = pullIf(clss.class_body.expressions, isMethod)
    clss.class_body.expressions = members
    var className = clss.class_name.token.str
    proc convert(it : Node) : Node = 
        let token = Token(tok: ◂assign, line: it.token.line, col: it.token.col)
        var funcn = it.member_value
        var arg_type = Node(token: Token(tok: ◂val_type, str: className), kind: ●type)
        var arg_name = Node(token: Token(tok: ◂name, str: "this"), kind: ●literal)
        var this_arg = Node(kind: ●arg, arg_type: arg_type, arg_name: arg_name)
        if funcn.func_signature: 
            funcn.func_signature.sig_args.list_values.unshift(this_arg)
        else: 
            var sig_args = Node(kind: ●list, list_values: @[this_arg])
            funcn.func_signature = Node(kind: ●signature, sig_args: sig_args)
        Node(token: token, kind: ●operation, operand_left: it.member_key, operand_right: funcn)
    var methods = funcs.map(convert)
    methods
proc classify*(body : Node) : Node = 
    if (((body == nil) or (body.kind != ●block)) or (body.expressions.len == 0)): 
        return body
    for i, e in body.expressions: 
        if (e.kind == ●class): 
            var methods = methodify(e)
            echo(&"methods>>> {methods}")
            body.expressions.insert(methods, (i + 1))
    body