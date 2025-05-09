# ████████   ███   ███  ███████    ████████ 
# ███   ███  ████  ███  ███   ███  ███   ███
# ███████    ███ █ ███  ███   ███  ███████  
# ███   ███  ███  ████  ███   ███  ███   ███
# ███   ███  ███   ███  ███████    ███   ███
import pars
import vars
import clss
export pars
type Rndr = ref object
    code: string
    s: string
    annotateVarArg: bool
proc `$`*(this : Rndr) : string = 
        var s = ""
        (s &= "▸")
        (s &= this.code)
        (s &= "◂")
        s
proc add(this : Rndr, text : string) = (this.s &= text)
proc spc(this : Rndr) = (this.s &= " ")
proc tok(this : Rndr, n : Node) = (this.s &= n.token.str)
proc rnd(this : Rndr, n : Node)
proc rnd(this : Rndr, nodes : seq[Node]) = 
        for i, n in nodes: 
            this.rnd(n)
            if (i < (nodes.len - 1)): 
                this.add(", ")
proc ▸block(this : Rndr, n : Node) = 
        var idt : string
        if (n.token.tok == ◂indent): 
            idt = n.token.str
            this.add("\n" & idt)
        for i, exp in n.expressions: 
            this.rnd(exp)
            if (i < (n.expressions.len - 1)): 
                if (n.expressions[(i + 1)].token.line > exp.token.line): 
                    this.add("\n" & idt)
                else: 
                    this.add(" ")
proc sigBody(this : Rndr, n : Node) = 
        this.annotateVarArg = true
        this.rnd(n.func_signature)
        this.annotateVarArg = false
        if n.func_mod: 
            this.add(" ")
            this.tok(n.func_mod)
        if n.func_body: 
            this.add(" =")
            this.add(" ")
            this.rnd(n.func_body)
proc ▸func(this : Rndr, n : Node) = 
        this.add("proc ")
        this.sigBody(n)
proc ▸proc(this : Rndr, n : Node) = 
        var f = n.operand_right
        this.add("proc ")
        if (n.operand_left.token.str[0] == '$'): 
            this.add("`$`" & n.operand_left.token.str[1..^1])
        else: 
            this.rnd(n.operand_left)
        this.sigBody(n.operand_right)
proc ▸operation(this : Rndr, n : Node) = 
        if (((n == nil) or (n.operand_left == nil)) or (n.operand_right == nil)): 
            echo(&"DAFUK? {n} {n.token}")
            return
        if (n.token.tok == ◂assign): 
            if (n.operand_right.token.tok == ◂func): 
                this.▸proc(n)
                return
        var outerbr = (n.token.tok notin {◂assign, ◂ampersand})
        var bracket = ((n.token.tok == ◂assign) and (n.operand_left.kind == ●list))
        if (bracket or outerbr): this.add("(")
        this.rnd(n.operand_left)
        if bracket: this.add(")")
        this.spc()
        case n.token.tok:
            of ◂and: this.add("and")
            of ◂or: this.add("or")
            else: this.tok(n)
        this.spc()
        bracket = ((n.token.tok == ◂assign) and (n.operand_right.kind == ●list))
        if bracket: this.add("(")
        this.rnd(n.operand_right)
        if (bracket or outerbr): this.add(")")
proc ▸let(this : Rndr, n : Node) = 
        this.tok(n)
        this.add(" ")
        this.rnd(n.let_expr)
proc ▸preOp(this : Rndr, n : Node) = 
        if (n.token.tok == ◂not): 
            this.add("not ")
        else: 
            this.tok(n)
        this.rnd(n.operand)
proc ▸postOp(this : Rndr, n : Node) = 
        this.rnd(n.operand)
        this.tok(n)
proc ▸propertyAccess(this : Rndr, n : Node) = 
        this.rnd(n.owner)
        this.tok(n)
        this.rnd(n.property)
proc ▸arrayAccess(this : Rndr, n : Node) = 
        this.rnd(n.array_owner)
        this.add("[")
        this.rnd(n.array_index)
        this.add("]")
proc ▸signature(this : Rndr, n : Node) = 
        this.add("(")
        this.annotateVarArg = true
        this.rnd(n.sig_args)
        this.annotateVarArg = false
        this.add(")")
        if n.sig_type: 
            this.add(" : ")
            this.rnd(n.sig_type)
proc ▸var(this : Rndr, n : Node) = 
        if (n.var_name.kind == ●list): 
            this.add("(")
        this.rnd(n.var_name)
        if (n.var_name.kind == ●list): 
            this.add(")")
        if n.var_type: 
            this.add(" : ")
            this.rnd(n.var_type)
        if n.var_value: 
            this.add(" = ")
            this.rnd(n.var_value)
proc ▸arg(this : Rndr, n : Node) = 
        this.rnd(n.arg_name)
        if n.arg_type: 
            this.add(" : ")
            if ((n.token.tok == ◂var_type) and this.annotateVarArg): 
                this.add("var ")
            this.rnd(n.arg_type)
        if n.arg_value: 
            this.add(" = ")
            this.rnd(n.arg_value)
proc ▸string(this : Rndr, n : Node) = 
        var delimiter = n.token.str
        if ((delimiter == "'") and (n.string_content.token.str.len > 1)): 
            delimiter = "\""
        if (n.string_stripols.len > 0): 
            this.add("&")
        elif n.string_prefix: 
            this.tok(n.string_prefix)
        this.add(delimiter)
        var sct = n.string_content.token.str
        var mill = high(int)
        if (delimiter == "\"\"\""): 
            var lines = n.string_content.token.str.split("\n")
            if (lines.len > 1): 
                var ill = indentLen(lines[1..^1])
                mill = min(mill, ill)
            for stripol in n.string_stripols: 
                if stripol.stripol_content: 
                    lines = stripol.stripol_content.token.str.split("\n")
                    if (lines.len > 1): 
                        var ill = indentLen(lines[1..^1])
                        mill = min(mill, ill)
        proc demill(n : Node) = 
            if (mill == 0): 
                this.tok(n)
            else: 
                var lines = n.token.str.split("\n")
                for i in 1..<lines.len: 
                    lines[i] = lines[i][mill..^1]
                this.add(lines.join("\n"))
        demill(n.string_content)
        for stripol in n.string_stripols: 
            this.add("{")
            this.rnd(stripol.stripol_xprssns)
            this.add("}")
            if (stripol.stripol_content != nil): 
                demill(stripol.stripol_content)
        this.add(delimiter)
proc ▸use(this : Rndr, n : Node) = 
        var split = n.use_module.token.str.split(" ")
        while (split.len > 1): 
            this.add(&"import {split[0]}\n")
            split = split.shift
        this.add("import ")
        this.add(split[0])
        if ((n.use_kind != nil) and (n.use_kind.token.str == "▪")): 
            this.add("/[")
            this.rnd(n.use_items)
            this.add("]")
proc ▸comment(this : Rndr, n : Node) = 
        if (n.token.str == "###"): 
            this.add("#[")
        else: 
            this.tok(n)
        this.tok(n.comment_content)
        if (n.token.str == "###"): 
            this.add("]#")
proc ▸call(this : Rndr, n : Node) = 
        if (n.callee.token.str == "log"): 
            this.add("echo")
        elif (n.callee.token.str[0] == '@'): 
            this.add(n.callee.token.str[1..^1])
            this.add("().init")
        else: 
            this.rnd(n.callee)
        if (n.callee.token.str != "export"): 
            this.add("(")
        else: 
            this.add(" ")
        this.rnd(n.call_args)
        if (n.callee.token.str != "export"): 
            this.add(")")
proc ▸if(this : Rndr, n : Node) = 
        var idt = ' '.repeat(n.token.col)
        var line = n.token.line
        this.tok(n)
        this.add(" ")
        for i, condThen in n.cond_thens: 
            if (i > 0): 
                if (condThen.token.line > line): 
                    this.add("\n" & idt & "elif ")
                else: 
                    this.add(" elif ")
            this.rnd(condThen.condition)
            this.add(": ")
            this.rnd(condThen.then_branch)
        if n.else_branch: 
            if (n.else_branch.token.line > line): 
                this.add("\n" & idt & "else: ")
            else: 
                this.add(" else: ")
            this.rnd(n.else_branch)
proc ▸for(this : Rndr, n : Node) = 
        this.add("for ")
        if (n.for_value.kind == ●list): 
            for i, v in n.for_value.list_values: 
                this.rnd(v)
                if (i < (n.for_value.list_values.len - 1)): 
                    this.add(", ")
        else: 
            this.rnd(n.for_value)
        this.add(" in ")
        this.rnd(n.for_range)
        this.add(": ")
        this.rnd(n.for_body)
proc ▸while(this : Rndr, n : Node) = 
       this.add("while ")
       this.rnd(n.while_cond)
       this.add(": ")
       this.rnd(n.while_body)
proc ▸list(this : Rndr, n : Node) = 
        for i, item in n.list_values: 
            this.rnd(item)
            if (i < (n.list_values.len - 1)): 
                this.add(", ")
proc ▸curly(this : Rndr, n : Node) = 
        this.add("{")
        for i, item in n.list_values: 
            this.rnd(item)
            if (i < (n.list_values.len - 1)): 
                this.add(", ")
        this.add("}")
proc ▸squarely(this : Rndr, n : Node) = 
        this.add("@[")
        for i, item in n.list_values: 
            this.rnd(item)
            if (i < (n.list_values.len - 1)): 
                this.add(", ")
        this.add("]")
proc ▸range(this : Rndr, n : Node) = 
        this.rnd(n.range_start)
        if (n.token.str == "..."): 
            this.add("..<")
        else: 
            this.tok(n)
        this.rnd(n.range_end)
proc ▸return(this : Rndr, n : Node) = 
        this.add("return")
        if n.return_value: 
            this.spc()
            this.rnd(n.return_value)
proc ▸discard(this : Rndr, n : Node) = 
        this.add("discard")
        if n.discard_value: 
            this.spc()
            this.rnd(n.discard_value)
proc ▸quote(this : Rndr, n : Node) = 
        this.add("quote do: ")
        this.rnd(n.quote_body)
proc ▸switch(this : Rndr, n : Node) = 
        var idt = ' '.repeat(n.token.col)
        this.add("case ")
        this.rnd(n.switch_value)
        this.add(":")
        var cdt = ' '.repeat(n.switch_cases[0].token.col)
        for i, caseNode in n.switch_cases: 
            this.add("\n" & cdt)
            this.add("of ")
            for j, whenNode in caseNode.case_when: 
                if (j > 0): 
                    this.add(", ")
                this.rnd(whenNode)
            this.add(": ")
            this.rnd(caseNode.case_then)
        if n.switch_default: 
            this.add("\n" & cdt)
            this.add("else: ")
            this.rnd(n.switch_default)
proc ▸enum(this : Rndr, n : Node) = 
        this.add("type ")
        this.rnd(n.enum_name)
        this.add(" = enum")
        this.rnd(n.enum_body)
proc ▸class(this : Rndr, n : Node) = 
        this.add("type ")
        this.rnd(n.class_name)
        this.add(" = ref object")
        this.rnd(n.class_body)
proc ▸struct(this : Rndr, n : Node) = 
        this.add("type ")
        this.rnd(n.class_name)
        this.add(" = object")
        this.rnd(n.class_body)
proc ▸member(this : Rndr, n : Node) = 
        this.rnd(n.member_key)
        this.add(": ")
        this.rnd(n.member_value)
proc ▸testCase(this : Rndr, n : Node) = 
        this.add("check ")
        this.rnd(n.test_value)
        this.add(" == ")
        this.rnd(n.test_expected)
proc ▸testSuite(this : Rndr, n : Node) = 
        if (n.kind == ●testSuite): 
            this.add("suite")
        else: 
            this.add("test")
        this.add(" \"")
        this.add(n.token.str[4..^1])
        this.add("\": ")
        this.rnd(n.test_block)
proc rnd(this : Rndr, n : Node) = 
        if (n == nil): return
        case n.kind:
            of ●block: this.▸block(n)
            of ●if: this.▸if(n)
            of ●switch: this.▸switch(n)
            of ●func: this.▸func(n)
            of ●signature: this.▸signature(n)
            of ●call: this.▸call(n)
            of ●operation: this.▸operation(n)
            of ●postOp: this.▸postOp(n)
            of ●preOp: this.▸preOp(n)
            of ●for: this.▸for(n)
            of ●while: this.▸while(n)
            of ●list: this.▸list(n)
            of ●curly: this.▸curly(n)
            of ●squarely: this.▸squarely(n)
            of ●range: this.▸range(n)
            of ●string: this.▸string(n)
            of ●comment: this.▸comment(n)
            of ●use: this.▸use(n)
            of ●propertyAccess: this.▸propertyAccess(n)
            of ●arrayAccess: this.▸arrayAccess(n)
            of ●var: this.▸var(n)
            of ●arg: this.▸arg(n)
            of ●let: this.▸let(n)
            of ●return: this.▸return(n)
            of ●discard: this.▸discard(n)
            of ●enum: this.▸enum(n)
            of ●class: this.▸class(n)
            of ●struct: this.▸struct(n)
            of ●quote: this.▸quote(n)
            of ●member: this.▸member(n)
            of ●testCase: this.▸testCase(n)
            of ●testSuite, ●testSection: this.▸testSuite(n)
            of ●literal, ●keyword, ●type, ●typeDef, ●import, ●proc, ●macro, ●template, ●converter: this.tok(n)
            else: 
                              echo(&"unhandled {n} {n.kind}")
                              this.tok(n)
proc render*(code : string, autovar = true) : string = 
    # profileStart "ast"
    var root = ast(code)
    if not root: return ""
    root = classify(root)
    # profileStop "ast"
    if autovar: 
        # profileStart "vars"
        root = variables(root)
        # profileStop "vars"
    var r = Rndr(code: code)
    # profileStart "rnd"
    r.rnd(root)
    # profileStop "rnd"
    r.s
proc file*(file : string) : string = 
    profileScope(file)
    var fileOut = file.swapLastPathComponentAndExt("kim", "nim")
    var kimCode = file.readFile()
    var nimCode = render(kimCode)
    if nimCode: 
        fileOut.writeFile(nimCode)
        fileOut
    else: 
        ""
proc files*(files : seq[string]) : seq[string] = 
    var transpiled : seq[string]
    for f in files: 
        var nimFile = file(f)
        if nimFile: 
            transpiled.add(nimFile)
    transpiled
    
        