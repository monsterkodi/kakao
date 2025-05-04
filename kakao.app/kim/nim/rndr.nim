# ████████   ███   ███  ███████    ████████ 
# ███   ███  ████  ███  ███   ███  ███   ███
# ███████    ███ █ ███  ███   ███  ███████  
# ███   ███  ███  ████  ███   ███  ███   ███
# ███   ███  ███   ███  ███████    ███   ███
import kommon
import tknz
import pars
import vars
type Rndr = ref object
    code: string
    s: string
    annotateVarArg: bool
proc `$`*(r : Rndr) : string = 
    var s = ""
    (s &= "▸")
    (s &= r.code)
    (s &= "◂")
    s
proc add(r : Rndr, text : string) = (r.s &= text)
proc spc(r : Rndr) = (r.s &= " ")
proc tok(r : Rndr, n : Node) = (r.s &= n.token.str)
proc rnd(r : Rndr, n : Node)
proc rnd(r : Rndr, nodes : seq[Node]) = 
    for i, n in nodes: 
        r.rnd(n)
        if (i < (nodes.len - 1)): 
            r.add(", ")
proc ▸block(r : Rndr, n : Node) = 
    var idt : string
    if (n.token.tok == ◂indent): 
        idt = n.token.str
        r.add("\n" & idt)
    for i, exp in n.expressions: 
        r.rnd(exp)
        if (i < (n.expressions.len - 1)): 
            if (n.expressions[(i + 1)].token.line > exp.token.line): 
                r.add("\n" & idt)
            else: 
                r.add(" ")
proc ▸proc(r : Rndr, n : Node) = 
    if (((n == nil) or (n.operand_left == nil)) or (n.operand_right == nil)): 
        echo(&"DAFUK? {n} {n.token}")
        return
    var f = n.operand_right
    r.add("proc ")
    if (n.operand_left.token.str[0] == '$'): 
        r.add("`$`" & n.operand_left.token.str[1..^1])
    else: 
        r.rnd(n.operand_left)
    r.rnd(f.func_signature)
    if f.func_body: 
        r.add(" =")
        r.add(" ")
        r.rnd(f.func_body)
proc ▸operation(r : Rndr, n : Node) = 
    if (((n == nil) or (n.operand_left == nil)) or (n.operand_right == nil)): 
        echo(&"DAFUK? {n} {n.token}")
        return
    if (n.token.tok == ◂assign): 
        if (n.operand_right.token.tok == ◂func): 
            r.▸proc n
            return
    if (n.token.tok notin {◂assign, ◂ampersand}): 
        r.add("(")
    if ((n.token.tok == ◂assign) and (n.operand_left.kind == ●list)): 
        r.add("(")
    r.rnd(n.operand_left)
    if ((n.token.tok == ◂assign) and (n.operand_left.kind == ●list)): 
        r.add(")")
    r.spc()
    case n.token.tok:
        of ◂and: r.add("and")
        of ◂or: r.add("or")
        else: r.tok(n)
    r.spc()
    if ((n.token.tok == ◂assign) and (n.operand_right.kind == ●list)): 
        r.add("(")
    r.rnd(n.operand_right)
    if ((n.token.tok == ◂assign) and (n.operand_right.kind == ●list)): 
        r.add(")")
    if (n.token.tok notin {◂assign, ◂ampersand}): 
        r.add(")")
proc ▸let(r : Rndr, n : Node) = 
    r.tok(n)
    r.add(" ")
    r.rnd(n.let_expr)
proc ▸preOp(r : Rndr, n : Node) = 
    if (n.token.tok == ◂not): 
        r.add("not ")
    else: 
        r.tok(n)
    r.rnd(n.operand)
proc ▸postOp(r : Rndr, n : Node) = 
    r.rnd(n.operand)
    r.tok(n)
proc ▸propertyAccess(r : Rndr, n : Node) = 
    r.rnd(n.owner)
    r.tok(n)
    r.rnd(n.property)
proc ▸arrayAccess(r : Rndr, n : Node) = 
    r.rnd(n.array_owner)
    r.add("[")
    r.rnd(n.array_index)
    r.add("]")
proc ▸func(r : Rndr, n : Node) = 
    r.add("proc ")
    r.annotateVarArg = true
    r.rnd(n.func_signature)
    r.annotateVarArg = false
    if n.func_mod: 
        r.add(" ")
        r.tok(n.func_mod)
    if n.func_body: 
        r.add(" =")
        r.add(" ")
        r.rnd(n.func_body)
proc ▸signature(r : Rndr, n : Node) = 
    r.add("(")
    r.annotateVarArg = true
    r.rnd(n.sig_args)
    r.annotateVarArg = false
    r.add(")")
    if n.sig_type: 
        r.add(" : ")
        r.rnd(n.sig_type)
proc ▸var(r : Rndr, n : Node) = 
    if (n.var_name.kind == ●list): 
        r.add("(")
    r.rnd(n.var_name)
    if (n.var_name.kind == ●list): 
        r.add(")")
    if n.var_type: 
        r.add(" : ")
        r.rnd(n.var_type)
    if n.var_value: 
        r.add(" = ")
        r.rnd(n.var_value)
proc ▸arg(r : Rndr, n : Node) = 
    r.rnd(n.arg_name)
    if n.arg_type: 
        r.add(" : ")
        if ((n.token.tok == ◂var_type) and r.annotateVarArg): 
            r.add("var ")
        r.rnd(n.arg_type)
    if n.arg_value: 
        r.add(" = ")
        r.rnd(n.arg_value)
proc ▸string(r : Rndr, n : Node) = 
    var delimiter = n.token.str
    if ((delimiter == "'") and (n.string_content.token.str.len > 1)): 
        delimiter = "\""
    if (n.string_stripols.len > 0): 
        r.add("&")
    elif n.string_prefix: 
        r.tok(n.string_prefix)
    r.add(delimiter)
    var sct = n.string_content.token.str
    var mill = high(int)
    if (delimiter == "\"\"\""): 
        var lines = n.string_content.token.str.split("\n")
        if (lines.len > 1): 
            let ill = indentLen(lines[1..^1])
            mill = min(mill, ill)
        for stripol in n.string_stripols: 
            if stripol.stripol_content: 
                lines = stripol.stripol_content.token.str.split("\n")
                if (lines.len > 1): 
                    let ill = indentLen(lines[1..^1])
                    mill = min(mill, ill)
    proc demill(n : Node) = 
        if (mill == 0): 
            r.tok(n)
        else: 
            var lines = n.token.str.split("\n")
            for i in 1..<lines.len: 
                lines[i] = lines[i][mill..^1]
            r.add(lines.join("\n"))
    demill(n.string_content)
    for stripol in n.string_stripols: 
        r.add("{")
        r.rnd(stripol.stripol_xprssns)
        r.add("}")
        if (stripol.stripol_content != nil): 
            demill(stripol.stripol_content)
    r.add(delimiter)
proc ▸use(r : Rndr, n : Node) = 
    var split = n.use_module.token.str.split(" ")
    while (split.len > 1): 
        r.add(&"import {split[0]}\n")
        split = split.shift
    r.add("import ")
    r.add(split[0])
    if ((n.use_kind != nil) and (n.use_kind.token.str == "▪")): 
        r.add("/[")
        r.rnd(n.use_items)
        r.add("]")
proc ▸comment(r : Rndr, n : Node) = 
    if (n.token.str == "###"): 
        r.add("#[")
    else: 
        r.tok(n)
    r.tok(n.comment_content)
    if (n.token.str == "###"): 
        r.add("]#")
proc ▸call(r : Rndr, n : Node) = 
    if (n.callee.token.str == "log"): 
        r.add("echo")
    else: 
        r.rnd(n.callee)
    if (n.callee.token.str != "export"): 
        r.add("(")
    else: 
        r.add(" ")
    r.rnd(n.call_args)
    if (n.callee.token.str != "export"): 
        r.add(")")
proc ▸if(r : Rndr, n : Node) = 
    var idt = ' '.repeat(n.token.col)
    var line = n.token.line
    r.tok(n)
    r.add(" ")
    for i, condThen in n.cond_thens: 
        if (i > 0): 
            if (condThen.token.line > line): 
                r.add("\n" & idt & "elif ")
            else: 
                r.add(" elif ")
        r.rnd(condThen.condition)
        r.add(": ")
        r.rnd(condThen.then_branch)
    if n.else_branch: 
        if (n.else_branch.token.line > line): 
            r.add("\n" & idt & "else: ")
        else: 
            r.add(" else: ")
        r.rnd(n.else_branch)
proc ▸for(r : Rndr, n : Node) = 
    r.add("for ")
    if (n.for_value.kind == ●list): 
        for i, v in n.for_value.list_values: 
            r.rnd(v)
            if (i < (n.for_value.list_values.len - 1)): 
                r.add(", ")
    else: 
        r.rnd(n.for_value)
    r.add(" in ")
    r.rnd(n.for_range)
    r.add(": ")
    r.rnd(n.for_body)
proc ▸while(r : Rndr, n : Node) = 
   r.add("while ")
   r.rnd(n.while_cond)
   r.add(": ")
   r.rnd(n.while_body)
proc ▸list(r : Rndr, n : Node) = 
    for i, item in n.list_values: 
        r.rnd(item)
        if (i < (n.list_values.len - 1)): 
            r.add(", ")
proc ▸curly(r : Rndr, n : Node) = 
    r.add("{")
    for i, item in n.list_values: 
        r.rnd(item)
        if (i < (n.list_values.len - 1)): 
            r.add(", ")
    r.add("}")
proc ▸squarely(r : Rndr, n : Node) = 
    r.add("@[")
    for i, item in n.list_values: 
        r.rnd(item)
        if (i < (n.list_values.len - 1)): 
            r.add(", ")
    r.add("]")
proc ▸range(r : Rndr, n : Node) = 
    r.rnd(n.range_start)
    if (n.token.str == "..."): 
        r.add("..<")
    else: 
        r.tok(n)
    r.rnd(n.range_end)
proc ▸return(r : Rndr, n : Node) = 
    r.add("return")
    if n.return_value: 
        r.spc()
        r.rnd(n.return_value)
proc ▸discard(r : Rndr, n : Node) = 
    r.add("discard")
    if n.discard_value: 
        r.spc()
        r.rnd(n.discard_value)
proc ▸quote(r : Rndr, n : Node) = 
    r.add("quote do: ")
    r.rnd(n.quote_body)
proc ▸switch(r : Rndr, n : Node) = 
    var idt = ' '.repeat(n.token.col)
    r.add("case ")
    r.rnd(n.switch_value)
    r.add(":")
    var cdt = ' '.repeat(n.switch_cases[0].token.col)
    for i, caseNode in n.switch_cases: 
        r.add("\n" & cdt)
        r.add("of ")
        for j, whenNode in caseNode.case_when: 
            if (j > 0): 
                r.add(", ")
            r.rnd(whenNode)
        r.add(": ")
        r.rnd(caseNode.case_then)
    if n.switch_default: 
        r.add("\n" & cdt)
        r.add("else: ")
        r.rnd(n.switch_default)
proc ▸enum(r : Rndr, n : Node) = 
    r.add("type ")
    r.rnd(n.enum_name)
    r.add(" = enum")
    r.rnd(n.enum_body)
proc ▸class(r : Rndr, n : Node) = 
    r.add("type ")
    r.rnd(n.class_name)
    r.add(" = ref object")
    r.rnd(n.class_body)
proc ▸member(r : Rndr, n : Node) = 
    r.rnd(n.member_key)
    r.add(": ")
    r.rnd(n.member_value)
proc ▸testCase(r : Rndr, n : Node) = 
    r.add("check ")
    r.rnd(n.test_value)
    r.add(" == ")
    r.rnd(n.test_expected)
proc ▸testSuite(r : Rndr, n : Node) = 
    if (n.kind == ●testSuite): 
        r.add("suite")
    else: 
        r.add("test")
    r.add(" \"")
    r.add(n.token.str[4..^1])
    r.add("\": ")
    r.rnd(n.test_block)
proc rnd(r : Rndr, n : Node) = 
    if (n == nil): return
    case n.kind:
        of ●block: r.▸block(n)
        of ●if: r.▸if(n)
        of ●switch: r.▸switch(n)
        of ●func: r.▸func(n)
        of ●signature: r.▸signature(n)
        of ●call: r.▸call(n)
        of ●operation: r.▸operation(n)
        of ●postOp: r.▸postOp(n)
        of ●preOp: r.▸preOp(n)
        of ●for: r.▸for(n)
        of ●while: r.▸while(n)
        of ●list: r.▸list(n)
        of ●curly: r.▸curly(n)
        of ●squarely: r.▸squarely(n)
        of ●range: r.▸range(n)
        of ●string: r.▸string(n)
        of ●comment: r.▸comment(n)
        of ●use: r.▸use(n)
        of ●propertyAccess: r.▸propertyAccess(n)
        of ●arrayAccess: r.▸arrayAccess(n)
        of ●var: r.▸var(n)
        of ●arg: r.▸arg(n)
        of ●let: r.▸let(n)
        of ●return: r.▸return(n)
        of ●discard: r.▸discard(n)
        of ●enum: r.▸enum(n)
        of ●class: r.▸class(n)
        of ●quote: r.▸quote(n)
        of ●member: r.▸member(n)
        of ●testCase: r.▸testCase(n)
        of ●testSuite, ●testSection: r.▸testSuite(n)
        of ●literal, ●keyword, ●type: r.tok(n)
        of ●typeDef, ●import, ●proc, ●macro, ●template, ●converter: r.tok(n)
        else: 
            echo(&"unhandled {n} {n.kind}")
            r.tok(n)
proc render*(code : string, autovar = true) : string = 
    var root = ast(code)
    if autovar: 
        root = variables(root)
    # echo &"root {root}"
    var r = Rndr(code: code)
    r.rnd(root)
    r.s
proc file*(file : string) : string = 
    var fileOut = file.swapLastPathComponentAndExt("kim", "nim")
    var kimCode = file.readFile()
    # echo &"code {code}"
    var nimCode = render(kimCode)
    # log &"▸▸▸ {fileOut} {nimCode.len}"
    fileOut.writeFile(nimCode)
    fileOut
proc files*(files : seq[string]) : seq[string] = 
    var transpiled : seq[string]
    for f in files: 
        transpiled.add(file(f))
    # echo "render.files done: ", transpiled
    transpiled
    
        