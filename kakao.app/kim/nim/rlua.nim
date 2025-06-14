# ████████   ███      ███   ███   ███████ 
# ███   ███  ███      ███   ███  ███   ███
# ███████    ███      ███   ███  █████████
# ███   ███  ███      ███   ███  ███   ███
# ███   ███  ███████   ███████   ███   ███
import pars
import klss
import vars

type Rlua = ref object of RootObj
    code: string
    s: string
    incurly: int

proc `$`(this : Rlua) : string = 
        var s = ""
        (s &= "▸")
        (s &= this.code)
        (s &= "◂")
        s

proc add(this : Rlua, text : string) = (this.s &= text)

proc spc(this : Rlua) = (this.s &= " ")

proc tok(this : Rlua, n : Node) = (this.s &= n.token.str)

proc rnd(this : Rlua, n : Node)

proc rnd(this : Rlua, nodes : seq[Node]) = 
        for i, n in nodes: 
            this.rnd(n)
            if (i < (nodes.len - 1)): 
                this.add(", ")

proc nodeIndent(this : Rlua, n : Node) : string = 
        case n.kind:
            of ●operation: return this.nodeIndent(n.operand_left)
            of ●propertyAccess: return this.nodeIndent(n.owner)
            else: ' '.repeat(n.token.col)

proc ▸block(this : Rlua, n : Node) = 
        var idt : string
        if (n.token.tok == ◂indent): 
            idt = n.token.str
            this.add("\n" & idt)
        for i, exp in n.expressions: 
            if (((exp.kind in {●class, ●struct}) or ((exp.token.tok == ◂assign) and (exp.operand_right.kind in {●func}))) or (exp.token.tok == ◂verbatim)): 
                this.add("\n" & idt)
            this.rnd(exp)
            if (i < (n.expressions.len - 1)): 
                if (n.expressions[(i + 1)].token.line > exp.token.line): 
                    this.add("\n" & idt)
                    if (n.expressions[(i + 1)].token.line > (exp.token.line + 1)): 
                        this.add("\n" & idt)
                else: 
                    this.add(" ")

proc ▸semicolon(this : Rlua, n : Node) = 
        for i, exp in n.expressions: 
            this.rnd(exp)
            if (i < (n.expressions.len - 1)): 
                this.add(" ; ")

proc ▸signature(this : Rlua, n : Node) = 
        this.add("(")
        this.rnd(n.sig_args)
        this.add(")")

proc sigBody(this : Rlua, n : Node) = 
        if n.func_signature: 
            this.rnd(n.func_signature)
        else: 
            this.add("()")
        if n.func_body: 
            this.add(" ")
            if (n.func_body.kind in {●semicolon, ●if, ●while, ●for, ●switch}): 
                this.add("\n")
                var idt = if n.func_signature: n.func_signature.token.col else: n.token.col
                this.add(' '.repeat(idt))
            var crly = this.incurly
            this.incurly = 0
            this.rnd(n.func_body)
            this.incurly = crly

proc ▸func(this : Rlua, n : Node) = 
        if (n.token.tok == ◂method): 
            this.add("method ")
        else: 
            this.add("function ")
        this.sigBody(n)
        if (n.func_body and (n.func_body.kind == ●block)): 
            var idt = ' '.repeat((n.func_body.token.str.len - 4))
            this.add("\n" & idt)
        else: 
            this.add(" ")
        this.add("end")

proc ▸function(this : Rlua, n : Node) = 
        var f = n.operand_right
        if (f.token.tok == ◂method): 
            this.add("method ")
        else: 
            this.add("function ")
        if (n.operand_left.token.str[^1] == '$'): 
            this.add(n.operand_left.token.str[0..^2] & "__tostring")
        else: 
            this.rnd(n.operand_left)
        this.sigBody(f)
        var idt = this.nodeIndent(n.operand_left)
        this.add("\n" & idt & "end")

proc ▸operation(this : Rlua, n : Node) = 
        if (((n == nil) or (n.operand_left == nil)) or (n.operand_right == nil)): 
            echo(&"DAFUK? {n} {n.token}")
            return
        if (n.token.tok == ◂assign): 
            if (n.operand_right.token.tok in {◂func, ◂method}): 
                this.▸function(n)
                return
        if (n.token.tok == ◂bitor): 
            this.add("bit.bor(")
            this.rnd(n.operand_left)
            this.add(", ")
            this.rnd(n.operand_right)
            this.add(")")
            return
        if (n.token.tok == ◂is): 
            this.add("is(")
            this.rnd(n.operand_left)
            this.add(", ")
            this.rnd(n.operand_right)
            this.add(")")
            return
        var outerbr = (n.token.tok notin ({◂ampersand} + assignToks))
        if outerbr: this.add("(")
        this.rnd(n.operand_left)
        this.spc()
        case n.token.tok:
            of ◂ampersand: this.add("..")
            of ◂not_equal: this.add("~=")
            of ◂plus_assign: 
                this.add("= ")
                this.rnd(n.operand_left)
                this.add(" +")
            of ◂minus_assign: 
                this.add("= ")
                this.rnd(n.operand_left)
                this.add(" -")
            of ◂multiply_assign: 
                this.add("= ")
                this.rnd(n.operand_left)
                this.add(" *")
            of ◂divide_assign: 
                this.add("= ")
                this.rnd(n.operand_left)
                this.add(" /")
            of ◂qmark_assign: 
                this.add("= ")
                this.rnd(n.operand_left)
                this.add(" or")
            of ◂ampersand_assign: 
                this.add("= ")
                this.rnd(n.operand_left)
                this.add(" ..")
            of ◂and: this.add("and")
            of ◂or: this.add("or")
            else: this.tok(n)
        this.spc()
        var rbr = (((n.token.tok != ◂assign) and (n.token.tok in assignToks)) and (n.operand_right.kind notin {●literal, ●string}))
        if rbr: this.add("(")
        this.rnd(n.operand_right)
        if rbr: this.add(")")
        if outerbr: this.add(")")

proc ▸literal(this : Rlua, n : Node) = 
        case n.token.str:
            of "●dir": this.add("currentSourcePath().split(\"/\")[0..^2].join(\"/\")")
            of "●file": this.add("currentSourcePath()")
            else: this.tok(n)

proc ▸let(this : Rlua, n : Node) = 
        this.add("local ")
        this.rnd(n.let_expr)

proc ▸preOp(this : Rlua, n : Node) = 
        case n.token.tok:
            of ◂dollar: this.add("tostring(")
            of ◂not: this.add("not ")
            of ◂log: this.add("print(")
            else: this.tok(n)
        this.rnd(n.operand)
        if (n.token.tok in {◂log, ◂dollar}): 
            this.add(")")

proc ▸postOp(this : Rlua, n : Node) = 
        this.rnd(n.operand)
        this.tok(n)

proc ▸propertyAccess(this : Rlua, n : Node) = 
        if (n.property.token.str in @["len", "length"]): 
            this.add("#")
            this.rnd(n.owner)
        else: 
            this.rnd(n.owner)
            this.tok(n)
            this.rnd(n.property)

proc ▸arrayAccess(this : Rlua, n : Node) = 
        this.rnd(n.array_owner)
        this.add("[")
        if ((n.array_index.kind == ●preOp) and (n.array_index.token.tok == ◂caret)): 
            this.add("#")
            this.rnd(n.array_owner)
            if (n.array_index.operand.token.str != "1"): 
                this.add("+1-")
                this.rnd(n.array_index.operand)
        else: 
            this.rnd(n.array_index)
        this.add("]")

proc ▸var(this : Rlua, n : Node) = 
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

proc ▸arg(this : Rlua, n : Node) = 
        this.rnd(n.arg_name)
        if n.arg_type: 
            this.add(" : ")
            this.rnd(n.arg_type)
        if n.arg_value: 
            this.add(" = ")
            this.rnd(n.arg_value)

proc ▸string(this : Rlua, n : Node) = 
        var delimiter = n.token.str
        var triple = (delimiter == "\"\"\"")
        if triple: 
            this.add("[[")
        else: 
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
            if triple: 
                this.add("]] .. ")
            else: 
                this.add("\" .. ")
            this.add("tostring(")
            this.rnd(stripol.stripol_xprssns)
            this.add(")")
            if triple: 
                this.add(" .. [[")
            else: 
                this.add(" .. \"")
            if (stripol.stripol_content != nil): 
                demill(stripol.stripol_content)
        if triple: 
            this.add("]]")
        else: 
            this.add(delimiter)

proc ▸use(this : Rlua, n : Node) = 
        var split = n.use_module.token.str.split(" ")
        
        proc modName(s : string) : string = 
            if (count(split[0], "/") > 0): 
                slash.name(split[0])
            elif (count(split[0], ".") > 0): 
                slash.ext(split[0])
            else: 
                split[0]
        while (split.len > 1): 
            this.add(&"{modName(split[0])} = require \"{split[0]}\"\n" & this.nodeIndent(n))
            split = split.shift()
        this.add(&"{modName(split[0])} = require \"{split[0]}\"")
        # if n.use_kind != nil and n.use_kind.token.str == '▪'
        #     @add "/["
        #     @rnd n.use_items
        #     @add "]"

proc ▸color(this : Rlua, n : Node) = 
        var ansi = {"r": "\\x1b[31m", "g": "\\x1b[32m", "b": "\\x1b[34m", "c": "\\x1b[36m", "m": "\\x1b[35m", "y": "\\x1b[33m", "w": "\\x1b[37m", "d": "\\x1b[90m", "s": "\\x1b[30m", "R": "\\x1b[41m", "G": "\\x1b[42m", "B": "\\x1b[44m", "C": "\\x1b[46m", "M": "\\x1b[45m", "Y": "\\x1b[43m", "W": "\\x1b[47m", "D": "\\x1b[100m", "S": "\\x1b[40m", "+": "\\x1b[1m", "-": "\\x1b[2m", "i": "\\x1b[3m", "x": "\\x1b[9m", "n": "\\x1b[7m", "_": "\\x1b[4m", ".": "\\x1b[4:4m", "~": "\\x1b[4:3m"}.toTable()
        
        proc fg(r : int, g : int, b : int) : string = &"\\x1b[38;2;{r};{g};{b}m"
        
        proc bg(r : int, g : int, b : int) : string = &"\\x1b[48;2;{r};{g};{b}m"
        this.add("\"")
        var code = n.color_value.token.str
        var hex = {'0'..'9', 'a'..'f'}
        this.add("\\x1b[0m")
        if ((((code.len == 3) and (code[0] in hex)) and (code[1] in hex)) and (code[2] in hex)): 
            var r = (parseHexInt($code[0]) * 16)
            var g = (parseHexInt($code[1]) * 16)
            var b = (parseHexInt($code[2]) * 16)
            this.add(fg(r, g, b))
        elif code.len: 
            for chr in code: 
                if ansi[$chr]: 
                    this.add(ansi[$chr])
        this.add("\"")

proc ▸comment(this : Rlua, n : Node) = 
        if (n.token.str == "###"): 
            this.add("--[[")
        else: 
            this.add("--")
        this.tok(n.comment_content)
        if (n.token.str == "###"): 
            this.add("--]]")

proc ▸call(this : Rlua, n : Node) = 
        if (n.callee.token.str == "log"): 
            this.add("print")
        elif (n.callee.token.str == "▴"): 
            this.add("assert")
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

proc ▸if(this : Rlua, n : Node) = 
        var idt = this.nodeIndent(n)
        var line = n.token.line
        var ml = false
        this.tok(n)
        this.add(" ")
        for i, condThen in n.cond_thens: 
            if (i > 0): 
                if (condThen.token.line > line): 
                    this.add("\n" & idt & "elseif ")
                    ml = true
                else: 
                    this.add(" elseif ")
            this.rnd(condThen.condition)
            this.add(" then ")
            if (condThen.then_branch.kind == ●block): ml = true
            this.rnd(condThen.then_branch)
        if n.else_branch: 
            if (n.else_branch.token.line > line): 
                this.add("\n" & idt & "else ")
                ml = true
            else: 
                this.add(" else ")
            this.rnd(n.else_branch)
        if ml: this.add("\n" & idt) else: this.add(" ")
        this.add("end")

proc ▸for(this : Rlua, n : Node) = 
        this.add("for ")
        if (n.for_value.kind == ●list): 
            for i, v in n.for_value.list_values: 
                this.rnd(v)
                if (i < (n.for_value.list_values.len - 1)): 
                    this.add(", ")
        else: 
            # if n.for_range.kind != ●range
            if (n.for_range.kind in {●literal, ●propertyAccess}): 
                this.add("_, ")
                this.rnd(n.for_value)
            else: 
                this.rnd(n.for_value)
        if (n.for_range.kind == ●range): 
            if (n.for_range.token.tok == ◂doubledot): 
                this.add(" in iter(")
                this.rnd(n.for_range.range_start)
                this.add(", ")
                this.rnd(n.for_range.range_end)
                this.add(")")
            else: 
                this.add(" = ")
                this.rnd(n.for_range.range_start)
                this.add(", ")
                if (n.for_range.token.tok == ◂tripledot): 
                    this.rnd(n.for_range.range_end)
                    this.add("-1")
                else: 
                    this.rnd(n.for_range.range_end)
        else: 
            this.add(" in ")
            if (n.for_range.kind in {●literal, ●propertyAccess}): 
                if (n.for_inof.token.str == "of"): 
                    this.add("pairs(")
                else: 
                    this.add("ipairs(")
                this.rnd(n.for_range)
                this.add(")")
            else: 
                this.rnd(n.for_range)
        this.add(" do ")
        if n.for_body: 
            this.rnd(n.for_body)
            if (n.for_body.kind == ●block): this.add("\n" & this.nodeIndent(n)) else: this.add(" ")
        this.add("end")

proc ▸while(this : Rlua, n : Node) = 
        this.add("while ")
        this.rnd(n.while_cond)
        this.add(" do ")
        this.rnd(n.while_body)
        if (n.while_body.kind == ●block): this.add("\n" & this.nodeIndent(n)) else: this.add(" ")
        this.add("end")

proc ▸list(this : Rlua, n : Node) = 
        var parens = (n.list_values and (n.list_values[0].kind in {●member, ●func}))
        if parens: this.add("(")
        for i, item in n.list_values: 
            this.rnd(item)
            if (i < (n.list_values.len - 1)): 
                if (item.token.str notin @["ref", "const"]): 
                    this.add(",")
                this.add(" ")
        if parens: this.add(")")

proc ▸curly(this : Rlua, n : Node) = 
        (this.incurly += 1)
        this.add("{")
        var ml = false
        var line = n.token.line
        var idt : string
        for i, item in n.list_values: 
            if (item.token.line > line): 
                idt = this.nodeIndent(item)
                this.add("\n" & idt)
                ml = true
            this.rnd(item)
            if (i < (n.list_values.len - 1)): 
                this.add(", ")
            line = item.token.line
        if ml: this.add("\n" & idt)
        this.add("}")
        (this.incurly -= 1)

proc ▸squarely(this : Rlua, n : Node) = 
        this.add("array(")
        # @add "{"
        for i, item in n.list_values: 
            this.rnd(item)
            if (i < (n.list_values.len - 1)): 
                this.add(", ")
        # @add "}"
        this.add(")")

proc ▸range(this : Rlua, n : Node) = 
        this.rnd(n.range_start)
        if (n.token.str == "..."): 
            this.add("...")
        else: 
            this.tok(n)
        this.rnd(n.range_end)

proc ▸return(this : Rlua, n : Node) = 
        this.add("return")
        if n.return_value: 
            this.spc()
            this.rnd(n.return_value)

proc ▸discard(this : Rlua, n : Node) = 
        this.add("discard")
        if n.discard_value: 
            this.spc()
            this.rnd(n.discard_value)

proc ▸quote(this : Rlua, n : Node) = 
        this.add("quote do: ")
        this.rnd(n.quote_body)

proc ▸switch(this : Rlua, n : Node) = 
        var idt = ' '.repeat(n.token.col)
        this.add("if ")
        var cdt = ' '.repeat(n.switch_cases[0].token.col)
        for i, caseNode in n.switch_cases: 
            if (i > 0): 
                this.add("\n" & idt & "elseif ")
            for j, whenNode in caseNode.case_when: 
                if (j > 0): 
                    this.add(" or ")
                this.add("(")
                this.rnd(n.switch_value)
                this.add(" == ")
                this.rnd(whenNode)
                this.add(")")
            this.add(" then ")
            this.rnd(caseNode.case_then)
        if n.switch_default: 
            this.add("\n" & idt & "else ")
            this.rnd(n.switch_default)
        this.add("\n" & idt & "end")

proc ▸enum(this : Rlua, n : Node) = 
        this.add("type ")
        this.rnd(n.enum_name)
        this.add(" = enum")
        this.rnd(n.enum_body)

proc ▸class(this : Rlua, n : Node) = 
        this.add("local ")
        this.rnd(n.class_name)
        this.add(" = class(\"")
        this.rnd(n.class_name)
        this.add("\"")
        if n.class_parent: 
            this.add(", ")
            this.tok(n.class_parent)
        this.add(")")
        (this.incurly += 1)
        this.rnd(n.class_body)
        (this.incurly -= 1)

proc ▸struct(this : Rlua, n : Node) = 
        this.add("type ")
        this.rnd(n.class_name)
        this.add(" = object")
        if n.class_parent: 
            this.add(" of ")
            this.tok(n.class_parent)
        this.rnd(n.class_body)

proc ▸member(this : Rlua, n : Node) = 
        if (n.member_key.kind == ●string): 
            this.add("[")
            this.rnd(n.member_key)
            this.add("] = ")
            this.rnd(n.member_value)
        else: 
            this.rnd(n.member_key)
            if this.incurly: 
                this.add(" = ")
            else: 
                this.add(":")
            this.rnd(n.member_value)

proc ▸testCase(this : Rlua, n : Node) = 
        this.add("test.cmp(")
        this.rnd(n.test_value)
        this.add(", ")
        this.rnd(n.test_expected)
        this.add(")")

proc ▸testSuite(this : Rlua, n : Node) = 
        this.add("test(")
        this.add("\"")
        this.add(n.token.str[4..^1])
        this.add("\", function()")
        this.rnd(n.test_block)
        this.add("\n    end)")

proc rnd(this : Rlua, n : Node) = 
        if (n == nil): return
        case n.kind:
            of ●block: this.▸block(n)
            of ●semicolon: this.▸semicolon(n)
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
            of ●literal: this.▸literal(n)
            of ●color: this.▸color(n)
            of ●type, ●keyword: this.tok(n)
            else: 
                              echo(&"rlua? {n} {n.kind}")
                              this.tok(n)

proc renderLua*(code : string, autovar = true) : string = 
    var root = ast(code, "lua")
    if not root: return ""
    root = classifyLua(root)
    if autovar: root = variables(root, "lua")
    var r = Rlua(code: code)
    r.rnd(root)
    r.s

proc renderLuaFile*(file : string) : string = 
    profileScope(file)
    var fileOut = file.swapLastPathComponentAndExt("kua", "lua")
    var kuaCode = file.read()
    var luaCode = renderLua(kuaCode)
    if luaCode: 
        echo(luaCode)
        fileOut.write(luaCode)
        fileOut
    else: 
        ""