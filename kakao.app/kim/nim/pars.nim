# ████████    ███████   ████████    ███████
# ███   ███  ███   ███  ███   ███  ███     
# ████████   █████████  ███████    ███████ 
# ███        ███   ███  ███   ███       ███
# ███        ███   ███  ███   ███  ███████ 
import tknz
export tknz
type NodeKind* = enum
    ●error
    ●block
    ●comment
    ●literal
    ●string
    ●stripol
    ●keyword
    ●preOp
    ●operation
    ●postOp
    ●call
    ●if
    ●condThen
    ●for
    ●list
    ●curly
    ●squarely
    ●range
    ●while
    ●switch
    ●switchCase
    ●arg
    ●var
    ●let
    ●propertyAccess
    ●arrayAccess
    ●arrayLike
    ●func
    ●type
    ●signature
    ●return
    ●discard
    ●break
    ●continue
    ●use
    ●import
    ●template
    ●converter
    ●macro
    ●quote
    ●proc
    ●typeDef
    ●enum
    ●class
    ●member
    ●testSuite
    ●testSection
    ●testCase
    ●eof
# ███   ███   ███████   ███████    ████████
# ████  ███  ███   ███  ███   ███  ███     
# ███ █ ███  ███   ███  ███   ███  ███████ 
# ███  ████  ███   ███  ███   ███  ███     
# ███   ███   ███████   ███████    ████████
type Node* = ref object
    token*: Token
    case kind*: NodeKind:
        of ●block: 
            expressions*: seq[Node]
        of ●operation: 
            operand_left*: Node
            operand_right*: Node
        of ●string: 
            string_prefix*: Node
            string_content*: Node
            string_stripols*: seq[Node]
        of ●comment: 
            comment_content*: Node
        of ●stripol: 
            stripol_xprssns*: seq[Node]
            stripol_content*: Node
        of ●range: 
            range_start*: Node
            range_end*: Node
        of ●postOp, ●preOp: 
            operand*: Node
        of ●return: 
            return_value*: Node
        of ●discard: 
            discard_value*: Node
        of ●call: 
            callee*: Node
            call_args*: seq[Node]
        of ●propertyAccess: 
            owner*: Node
            property*: Node
        of ●arrayAccess: 
            array_owner*: Node
            array_index*: Node
        of ●if: 
            # also handles when
            cond_thens*: seq[Node]
            else_branch*: Node
        of ●condThen: 
            condition*: Node
            then_branch*: Node
        of ●switch: 
            switch_value*: Node
            switch_cases*: seq[Node]
            switch_default*: Node
        of ●switchCase: 
            case_when*: seq[Node]
            case_then*: Node
        of ●while: 
            while_cond*: Node
            while_body*: Node
        of ●for: 
            for_value*: Node
            for_range*: Node
            for_body*: Node
        of ●list, ●curly, ●squarely: 
            list_values*: seq[Node]
        of ●arg: 
            arg_type*: Node
            arg_name*: Node
            arg_value*: Node
        of ●var: 
            var_name*: Node
            var_type*: Node
            var_value*: Node
        of ●let: 
            let_expr*: Node
        of ●signature: 
            sig_args*: Node
            sig_type*: Node
        of ●func: 
            func_signature*: Node
            func_mod*: Node
            func_body*: Node
        of ●use: 
            use_module*: Node
            use_kind*: Node
            use_items*: seq[Node]
        of ●class: 
            class_name*: Node
            class_body*: Node
        of ●member: 
            member_key*: Node
            member_value*: Node
        of ●enum: 
            enum_name*: Node
            enum_body*: Node
        of ●quote: 
            quote_body*: Node
        of ●testSuite, ●testSection: 
            test_block*: Node
        of ●testCase: 
            test_value*: Node
            test_expected*: Node
        else: discard
proc `$`*(this : Node) : string = 
        if (this == nil): 
            return "NIL"
        var s = $this.token.tok
        case this.kind:
            of ●string: 
                var ips = ""
                for i, s in this.string_stripols: 
                    if (i == 0): 
                        (ips &= "<")
                    (ips &= $s.stripol_xprssns)
                    if ((0 < i) and (i < (this.string_stripols.len - 1))): 
                        (ips &= " ")
                    if (i == (this.string_stripols.len - 1)): 
                        (ips &= ">")
                var p = choose(this.string_prefix, $this.string_prefix.token.str, "")
                s = &"◂{p}string{ips}"
            of ●block: 
                s = "▪["
                for e in this.expressions: 
                    if (e != nil): 
                        (s &= &"{e}")
                    else: 
                        (s &= "NIL")
                (s &= "]")
            of ●operation: 
                s = &"({this.operand_left} {s} {this.operand_right})"
            of ●range: 
                s = &"({this.range_start} {s} {this.range_end})"
            of ●preOp: 
                s = &"({s} {this.operand})"
            of ●postOp: 
                s = &"({this.operand} {s})"
            of ●return: 
                var e = choose(this.return_value, " " & $this.return_value, "")
                s = &"({s}{e})"
            of ●call: 
                s = &"({this.callee} ◂call {this.callargs})"
            of ●propertyAccess: 
                s = &"({this.owner} {s} {this.property})"
            of ●if: 
                var e = choose(this.else_branch, &" {this.else_branch}", "")
                s = &"({s} {this.cond_thens}{e})"
            of ●condThen: 
                s = &"({this.condition} {this.then_branch})"
            of ●switch: 
                var e = choose(this.switch_default, &" {this.switch_default}", "")
                s = &"({s} {this.switch_value} {this.switch_cases}{e})"
            of ●switchCase: 
                s = &"({this.case_when} {this.case_then})"
            of ●for: 
                var b = choose(this.for_body, &" {this.for_body}", "")
                s = &"({s} {this.for_value} in {this.for_range}{b})"
            of ●list: 
                s = &"{this.list_values}"
                s = "◂" & s[1..^1]
            of ●curly: 
                s = &"{this.list_values}"
                s = "{" & s[2..^2] & "}"
            of ●squarely: 
                s = &"{this.list_values}"
                s = "[" & s[1..^1] & "]]"
            of ●while: 
                var b = choose(this.while_body, &" {this.while_body}", "")
                s = &"({s} {this.while_cond}{b})"
            of ●func: 
                var sig = choose(this.func_signature, $this.func_signature, "")
                var mdf = choose(this.func_mod, &" {this.func_mod.token.str} ", "")
                var bdy = choose(this.func_body, &" {this.func_body}", "")
                s = &"({sig}{s}{mdf}{bdy})"
            of ●signature: 
                var a = if (this.sig_args and this.sig_args.list_values.len): $this.sig_args else: ""
                var t = choose(this.sig_type, &" ➜ {this.sig_type}", "")
                s = &"{a}{t}"
            of ●arrayAccess: 
                var i = choose(this.array_index, &"{this.array_index}", "")
                s = &"({this.array_owner}[{i}])"
            of ●arg: 
                var t = choose(this.arg_type, &"{s}{this.arg_type} ", "")
                var v = choose(this.arg_value, &" (= {this.arg_value})", "")
                s = &"({t}{this.arg_name}{v})"
            of ●var: 
                var t = choose(this.var_type, &" {s}{this.var_type}", "")
                var v = choose(this.var_value, &" (= {this.var_value})", "")
                s = &"({this.var_name}{t}{v})"
            of ●let: 
                s = &"({s} {this.let_expr})"
            of ●type: 
                s = &"type({this.token.str})"
            of ●use: 
                var k = choose(this.use_kind, &" {this.use_kind.token.str}", "")
                var i = choose((this.use_items.len > 0), &" {this.use_items}", "")
                s = &"({s} {this.use_module}{k}{i})"
            of ●enum: 
                var b = choose(this.enum_body, &" {this.enum_body}", "")
                s = &"({s} {this.enum_name}{b})"
            of ●class: 
                var b = choose(this.class_body, &" {this.class_body}", "")
                s = &"({s} {this.class_name}{b})"
            of ●member: 
                s = &"({this.member_key} {s} {this.member_value})"
            of ●quote: 
                s = &"({s} {this.quote_body})"
            of ●testSuite: 
                var b = choose(this.test_block, &" {this.test_block}", "")
                s = &"({s} suite{b})"
            of ●testSection: 
                var b = choose(this.test_block, &" {this.test_block}", "")
                s = &"({s} section{b})"
            of ●testCase: 
                s = &"({this.test_value} {s} {this.test_expected})"
            else: 
                discard
        s
# s = &"(¨s¨ ¨n.for_value¨ in ¨n.for_range¨¨b¨)"
# s = &"(⟨s⟩ ⟨n.for_value⟩ in ⟨n.for_range⟩⟨b⟩)"
# s = &"(⁅s⁆ ⁅n.for_value⁆ in ⁅n.for_range⁆⁅b⁆)"
# s = &"(❬s❭ ❬n.for_value❭ in ❬n.for_range❭❬b❭)"
# s = &"(❮s❯ ❮n.for_value❯ in ❮n.for_range❯❮b❯)"
# s = &"(❰s❱ ❰n.for_value❱ in ❰n.for_range❱❰b❱)"
# s = &"(⟪s⟫ ⟪n.for_value⟫ in ⟪n.for_range⟫⟪b⟫)"
# s = &"(«s» «n.for_value» in «n.for_range»«b»)"
# s = &"(‹s› ‹n.for_value› in ‹n.for_range›‹b›)"
# s = &"(⸨s⸩ ⸨n.for_value⸩ in ⸨n.for_range⸩⸨b⸩)"
# s = &"(s n.for_value in n.for_rangeb)"
# s = &"(┤s├ ┤n.for_value├ in ┤n.for_range├┤b├)"
proc nod*(kind : NodeKind, token : Token, args : varargs[Node]) : Node = 
    # log "#{kind} #{token}"
    var n = Node(kind: kind, token: token)
    case kind:
        of ●arg: 
            n.arg_type = args[0]
            n.arg_name = args[1]
            n.arg_value = args[2]
        of ●var: 
            n.var_name = args[0]
            n.var_type = args[1]
            n.var_value = args[2]
        of ●propertyAccess: 
            n.owner = args[0]
            n.property = args[1]
        of ●arrayAccess: 
            n.array_owner = args[0]
            n.array_index = args[1]
        of ●operation: 
            n.operand_left = args[0]
            n.operand_right = args[1]
        of ●postOp, ●preOp: 
            n.operand = args[0]
        of ●range: 
            n.range_start = args[0]
            n.range_end = args[1]
        of ●func: 
            n.func_signature = args[0]
            n.func_mod = args[1]
            n.func_body = args[2]
        of ●signature: 
            n.sig_args = args[0]
            n.sig_type = args[1]
        of ●let: 
            n.let_expr = args[0]
        of ●class: 
            n.class_name = args[0]
            n.class_body = args[1]
        of ●member: 
            n.member_key = args[0]
            n.member_value = args[1]
        of ●enum: 
            n.enum_name = args[0]
            n.enum_body = args[1]
        of ●quote: 
            n.quote_body = args[0]
        of ●comment: 
            n.comment_content = args[0]
        of ●for: 
            n.for_value = args[0]
            n.for_range = args[1]
            n.for_body = args[2]
        of ●while: 
            n.while_cond = args[0]
            n.while_body = args[1]
        of ●condThen: 
            n.condition = args[0]
            n.then_branch = args[1]
        of ●return: 
            n.return_value = args[0]
        of ●discard: 
            n.discard_value = args[0]
        of ●testCase: 
            n.test_value = args[0]
            n.test_expected = args[1]
        of ●testSection, ●testSuite: 
            n.test_block = args[0]
        else: discard
    n
proc nod*(kind : NodeKind, token : Token, args : seq[Node]) : Node = 
    var n = Node(kind: kind, token: token)
    case kind:
        of ●block: 
            n.expressions = args
        of ●list: 
            n.list_values = args
        of ●curly, ●squarely: 
            n.list_values = args
        else: discard
    n
# ████████    ███████   ████████    ███████  ████████  ████████ 
# ███   ███  ███   ███  ███   ███  ███       ███       ███   ███
# ████████   █████████  ███████    ███████   ███████   ███████  
# ███        ███   ███  ███   ███       ███  ███       ███   ███
# ███        ███   ███  ███   ███  ███████   ████████  ███   ███
{.experimental: "codeReordering".}
type RHS = proc(p: Parser): Node
type LHS = proc(p: Parser, left: Node): Node
type Pratt = object

    rhs: RHS
    lhs: LHS
    precedence: int
type Parser* = ref object
    tokens*: seq[Token]
    pratts*: seq[Pratt]
    blocks*: seq[Node]
    pos*: int
    explicit: int
    listless: int
    returning: bool
    typeless: bool
    failed: bool
    text: string # used in `$` for debugging. should be removed eventually 
    # ████████   ████████   ███  ███   ███  █████████  
    # ███   ███  ███   ███  ███  ████  ███     ███     
    # ████████   ███████    ███  ███ █ ███     ███     
    # ███        ███   ███  ███  ███  ████     ███     
    # ███        ███   ███  ███  ███   ███     ███     
proc current(this : Parser) : Token = 
        if (this.pos < this.tokens.len): 
            return this.tokens[this.pos]
        tkn(◂eof)
proc tok(this : Parser) : tok = this.current.tok
proc peek(this : Parser, ahead = 1) : Token = 
        if ((this.pos + ahead) < this.tokens.len): 
            this.tokens[(this.pos + ahead)]
        else: 
            tkn(◂eof)
proc `$`(this : Parser) : string = 
        var s = ""
        if (this.tok != ◂eof): 
            s = &"▪▪▪ {this.current} {this.pos}"
            var l = this.text.split("\n")[this.current.line]
            (s &= &"\n{this.current.line}: {l}")
        else: 
            s = this.text
        s
proc error(p : Parser, msg : string, token = tkn(◂eof)) : Node = 
    styledEcho(fgRed, styleDim, "△ ", resetStyle, fgYellow, msg)
    if (token.tok != ◂eof): 
        var line = p.text.split("\n")[token.line]
        styledEcho(fgWhite, styleDim, &"{token.line}", resetStyle, fgGreen, &"{line}")
    elif (p.tok != ◂eof): 
        var line = p.text.split("\n")[p.current.line]
        styledEcho(fgWhite, styleDim, &"{p.current.line}", resetStyle, fgGreen, &"{line}")
    p.failed = true
    nil
#  ███████   ███████   ███   ███   ███████  ███   ███  ██     ██  ████████
# ███       ███   ███  ████  ███  ███       ███   ███  ███   ███  ███     
# ███       ███   ███  ███ █ ███  ███████   ███   ███  █████████  ███████ 
# ███       ███   ███  ███  ████       ███  ███   ███  ███ █ ███  ███     
#  ███████   ███████   ███   ███  ███████    ███████   ███   ███  ████████
proc consume(p : Parser) : Token = 
    var t = p.current
    if (p.pos < p.tokens.len): 
        (p.pos += 1)
    t
proc swallow(p : Parser) = 
    discard p.consume()
proc swallow(p : Parser, tok : tok) = 
    if (p.tok == tok): 
        p.swallow()
proc swallowError(p : Parser, tok : tok, err : string) = 
    if (p.tok != tok): 
        discard p.error(&"Expected {tok} to swallow, but found {p.tok} instead")
        discard p.error(err)
        return
    p.swallow()
proc swallowSameIndent(p : Parser, indent : int) : bool = 
    if ((p.tok == ◂indent) and (p.current.str.len == indent)): 
        p.swallow()
        return true
    false
proc atIndent(p : Parser) : bool = 
    ((p.current.col == 0) or (p.peek(-1).tok == ◂indent))
proc atEnd(p : Parser) : bool = 
    (p.pos >= p.tokens.len)
proc isDedent(p : Parser, indent : int) : bool = 
    if (p.tok == ◂indent): 
        (p.current.str.len < indent)
    else: 
        (p.current.col < indent)
proc isNextLineIndented(p : Parser, token : Token) : bool = 
    var n = 0
    while (p.peek(n).tok != ◂indent): 
        (n += 1)
        if (p.peek(n).tok == ◂eof): 
            return false
    var idt = if (token.tok == ◂indent): token.str.len else: token.col
    return (p.peek(n).str.len > idt)
proc isTokAhead(p : Parser, tokAhead : tok) : bool = 
    var n = 0
    var c = p.current
    var line = c.line
    # log "isTokAhead #{tokAhead} #{line}"
    while (c.tok != ◂eof): 
        if (c.line > line): 
            return false
        if (c.tok == tokAhead): 
            return true
        (n += 1)
        c = p.peek(n)
    false
proc firstLineToken(p : Parser) : Token = 
    var line = p.current.line
    var tpos = p.tokens.len
    while (tpos > 0): 
        if (p.tokens[(tpos - 1)].line < line): 
            break
        (tpos -= 1)
    p.tokens[tpos]
proc lineIndent(p : Parser, line : int) : int = 
    var tpos = p.tokens.len
    while (tpos > 0): 
        if (p.tokens[(tpos - 1)].line < line): 
            break
        (tpos -= 1)
    if (p.tokens[tpos].tok == ◂indent): 
        p.tokens[tpos].str.len
    else: 
        p.tokens[tpos].col
proc isThenlessIf(p : Parser, token : Token) : bool = 
    if p.isNextLineIndented(token): 
        return false
    not p.isTokAhead(◂then)
proc getPrecedence(p : Parser, token : Token) : int = 
    if (token.tok.ord < p.pratts.len): 
        return p.pratts[token.tok.ord].precedence
    0
proc rightHandSide(p : Parser, token : Token) : RHS = 
    if (token.tok.ord < p.pratts.len): 
        return p.pratts[token.tok.ord].rhs
proc leftHandSide(p : Parser, token : Token) : LHS = 
    if (token.tok.ord < p.pratts.len): 
        return p.pratts[token.tok.ord].lhs
proc expression(p : Parser, precedenceRight = 0) : Node
proc expression(p : Parser, tokenRight : Token) : Node = 
    expression(p, p.getPrecedence(tokenRight))
proc value(p : Parser) : Node = 
    p.expression(-2)
# ███████    ███       ███████    ███████  ███   ███
# ███   ███  ███      ███   ███  ███       ███  ███ 
# ███████    ███      ███   ███  ███       ███████  
# ███   ███  ███      ███   ███  ███       ███  ███ 
# ███████    ███████   ███████    ███████  ███   ███
proc parseBlock(p : Parser, bn : Node = nil) : Node = 
    var token : Token
    var block_indent : int
    while (p.tok == ◂indent): 
        token = p.consume()
        block_indent = p.current.col
    var bn = bn
    if (bn == nil): 
        bn = nod(●block, token, @[])
    var expr = p.expression()
    while (expr != nil): 
        if ((expr.kind == ●func) and bn.expressions.len): 
            var prevExpr = bn.expressions[^1]
            if ((prevExpr.token.line == expr.token.line) and (prevExpr.token.tok == ◂assign)): 
                prevExpr = bn.expressions.pop()
                if (prevExpr.operand_right.kind == ●operation): 
                    var argtoken = prevExpr.operand_right.operand_left.token
                    argtoken.tok = ◂val_type
                    var argnode = nod(●arg, argtoken, nil, prevExpr.operand_right.operand_left, prevExpr.operand_right.operand_right)
                    expr.func_signature.sig_args.list_values.unshift(argnode)
                else: 
                    expr.func_signature.sig_args.list_values.unshift(prevExpr.operand_right)
                prevExpr.operand_right = expr
                expr = prevExpr
        bn.expressions.add(expr)
        if (p.tok == ◂indent): 
            var ind = p.current.str.len
            if (ind < block_indent): 
                break
            elif (ind > block_indent): 
                p.blocks.add(bn)
                expr = p.parseBlock()
                bn = p.blocks.pop()
                continue
            else: 
                p.swallow()
        if (p.atEnd() or (p.current.col < block_indent)): 
            break
        expr = p.expression()
    bn
proc expressionOrIndentedBlock(p : Parser, token : Token, col : int) : Node = 
    if (p.tok == ◂indent): 
        if (p.current.str.len > col): 
            return p.parseBlock()
    else: 
        return p.expression(token)
#  ███████   ███████   ███      ███       ███████   ████████    ███████    ███████
# ███       ███   ███  ███      ███      ███   ███  ███   ███  ███        ███     
# ███       █████████  ███      ███      █████████  ███████    ███  ████  ███████ 
# ███       ███   ███  ███      ███      ███   ███  ███   ███  ███   ███       ███
#  ███████  ███   ███  ███████  ███████  ███   ███  ███   ███   ███████   ███████ 
proc swallowIndent(p : Parser, col : int) : bool = 
    p.swallow(◂comma)
    if (p.tok == ◂indent): 
        if (p.current.str.len > col): 
            p.swallow()
        else: 
            return true
    false
proc parseCallArgs(p : Parser, col : int) : seq[Node] = 
    (p.explicit += 1)
    (p.listless += 1)
    var list : seq[Node]
    var line = p.current.line
    var expr = p.expression()
    while (expr != nil): 
        list.add(expr)
        if p.swallowIndent(col): 
            break
        if (p.tok in {◂comment_start, ◂then}): 
            break
        expr = p.expression()
    (p.listless -= 1)
    (p.explicit -= 1)
    list
# █████████  ███   ███  ████████   ████████
#    ███      ███ ███   ███   ███  ███     
#    ███       █████    ████████   ███████ 
#    ███        ███     ███        ███     
#    ███        ███     ███        ████████
proc parseType(p : Parser) : Node = 
    var token = p.consume()
    token.tok = ◂type
    if (p.tok == ◂square_open): 
        var opened = 0
        while (p.tok notin {◂eof}): 
            var t = p.consume()
            (token.str &= t.str)
            if (t.tok == ◂square_open): 
                (opened += 1)
            elif (t.tok == ◂square_close): 
                (opened -= 1)
                if (opened == 0): 
                    break
    nod(●type, token)
proc parseVar(p : Parser) : Node = 
    var token = p.current()
    var var_name = p.value()
    var var_value : Node
    var var_type : Node
    if (p.tok == ◂assign): 
        p.swallow()
        var_value = p.thenBlock()
    elif (p.tok in {◂val_type, ◂var_type}): 
        token = p.consume()
        var_type = p.parseType()
        if (p.tok == ◂assign): 
            p.swallow()
            var_value = p.expression()
    nod(●var, token, var_name, var_type, var_value)
proc parseModule(p : Parser) : Node = 
    var line = p.current.line
    var s = ""
    while (p.current.str notin @["▪", "◆"]): 
        var e = (p.current.col + p.current.str.len)
        (s &= p.consume().str)
        if (p.atEnd() or (p.current.line != line)): 
            break
        if ((p.current.col > e) and (p.current.str notin @["▪", "◆"])): 
            (s &= " ")
    Node(token: Token(str: s))
# ███      ███   ███████  █████████
# ███      ███  ███          ███   
# ███      ███  ███████      ███   
# ███      ███       ███     ███   
# ███████  ███  ███████      ███   
proc parseParenList(p : Parser) : seq[Node] = 
    var token = p.consume() # (
    var args : seq[Node]
    (p.explicit += 1)
    while ((p.tok != ◂paren_close) and (p.tok != ◂eof)): 
        args.add(p.expression())
        p.swallow(◂comma)
    p.swallowError(◂paren_close, "Missing closing parenthesis")
    (p.explicit -= 1)
    if ((args.len == 1) and (args[0].kind == ●list)): 
        return args[0].list_values
    args
proc parseDelimitedList(p : Parser, open : tok, close : tok) : seq[Node] = 
    var token = p.consume()
    var args : seq[Node]
    (p.explicit += 1)
    while true: 
        discard p.swallowIndent(-1)
        if ((p.tok != close) and (p.tok != ◂eof)): 
            args.add(p.expression())
        else: 
            break
    p.swallowError(close, "Missing closing bracket")
    (p.explicit -= 1)
    if ((args.len == 1) and (args[0].kind == ●list)): 
        return args[0].list_values
    args
proc parseNames(p : Parser) : seq[Node] = 
    var list : seq[Node]
    var line = p.current.line
    (p.explicit += 1)
    var expr = p.rSymbol()
    while (expr != nil): 
        list.add(expr)
        if (p.current.line != line): 
            break
        p.swallow(◂comma)
        expr = p.rSymbol()
    (p.explicit -= 1)
    list
proc parseNamesUntil(p : Parser, stop : tok) : Node = 
    var token = p.current
    var list_values : seq[Node]
    (p.explicit += 1)
    while (p.tok != stop): 
        if (p.tok == ◂eof): 
            return p.error("Missing 'in' for 'for' loop (eof detected)!", token)
        if (p.current.line != token.line): 
            return p.error("Missing 'in' for 'for' loop (linebreak detected)!", token)
        list_values.add(p.rSymbol())
        p.swallow(◂comma)
    (p.explicit -= 1)
    if (list_values.len == 1): 
        list_values[0]
    else: 
        nod(●list, token, list_values)
# █████████  ███   ███  ████████  ███   ███
#    ███     ███   ███  ███       ████  ███
#    ███     █████████  ███████   ███ █ ███
#    ███     ███   ███  ███       ███  ████
#    ███     ███   ███  ████████  ███   ███
proc thenBlock(p : Parser) : Node = 
    if (p.tok == ◂then): 
        p.swallow(◂then)
    if (p.tok == ◂indent): 
        p.parseBlock()
    else: 
        p.expression()
proc thenIndented(p : Parser, token : Token) : Node = 
    if (p.tok == ◂then): 
        p.swallow(◂then)
    if (p.tok == ◂indent): 
        if p.isNextLineIndented(token): 
            return p.parseBlock()
        return nil
    else: 
        return p.expression()
#  ███████   ███████   ███      ███    
# ███       ███   ███  ███      ███    
# ███       █████████  ███      ███    
# ███       ███   ███  ███      ███    
#  ███████  ███   ███  ███████  ███████
proc lCall(p : Parser, callee : Node) : Node = 
    var token = p.consume() # (
    var args = p.parseCallArgs(callee.token.col)
    p.swallowError(◂paren_close, "Missing closing paren for call arguments")
    Node(token: token, kind: ●call, callee: callee, callargs: args)
# ███  ██     ██  ████████   ███      ███   ███████  ███  █████████
# ███  ███   ███  ███   ███  ███      ███  ███       ███     ███   
# ███  █████████  ████████   ███      ███  ███       ███     ███   
# ███  ███ █ ███  ███        ███      ███  ███       ███     ███   
# ███  ███   ███  ███        ███████  ███   ███████  ███     ███   
var optoks = {◂indent, ◂eof, ◂then, ◂else, ◂elif, ◂test, ◂val_type, ◂var_type, ◂colon, ◂plus, ◂minus, ◂divide, ◂multiply, ◂and, ◂or, ◂ampersand, ◂is, ◂in, ◂notin, ◂not, ◂equal, ◂not_equal, ◂greater_equal, ◂less_equal, ◂greater, ◂less, ◂match, ◂comment_start, ◂assign, ◂divide_assign, ◂multiply_assign, ◂plus_assign, ◂minus_assign, ◂ampersand_assign}
proc isImplicitCallPossible(p : Parser) : bool = 
    if p.explicit: return false
    var currt = p.peek(0)
    if (currt.tok in optoks): return false
    var prevt = p.peek(-1)
    if (currt.col <= (prevt.col + ksegWidth(prevt.str))): return false
    if p.isTokAhead(◂func): return false
    true
proc rSymbol(p : Parser) : Node = 
    var token = p.consume()
    if (((token.str in @["peg", "re", "r"]) and (p.tok == ◂string_start)) and ((token.col + token.str.len) == p.current.col)): 
        var n = p.rString()
        n.string_prefix = nod(●literal, token)
        return n
    if p.isImplicitCallPossible(): 
        let args = p.parseCallArgs(token.col)
        return Node(token: token, kind: ●call, callee: nod(●literal, token), callargs: args)
    nod(●literal, token)
# ███  ████████                             ███  ████████                               ███  ████████  
# ███  ███                                  ███  ███                                    ███  ███       
# ███  ██████                               ███  ██████                                 ███  ██████    
# ███  ███                                  ███  ███                                    ███  ███       
# ███  ███                                  ███  ███                                    ███  ███       
proc rIf(p : Parser) : Node = 
    var token = p.consume() # if or when
    var condThens : seq[Node]
    var ifIndent = token.col
    var condIndt = ifIndent
    if (p.tok == ◂indent): 
        condIndt = p.current.str.len
        if (condIndt <= ifIndent): 
            return p.error("Expected indentation after 'if' without condition")
        p.swallow(◂indent) # block indentation
    var condition = p.expression() # initial condition
    var then_branch = p.thenBlock()
    condThens.add(nod(●condThen, condition.token, condition, then_branch))
    var outdent = false
    while (p.tok in {◂elif, ◂indent}): 
        if (p.tok == ◂indent): 
            if (p.current.str.len < ifIndent): 
                outdent = true
                break
            if (ifIndent < condIndt): 
                if (p.current.str.len < condIndt): 
                    break
            if ((p.peek(1).tok != ◂elif) and (p.current.str.len == ifIndent)): 
                break
            p.swallow(◂indent)
            if (p.tok == ◂comment_start): 
                p.swallow()
                p.swallow(◂comment)
            if (p.tok == ◂indent): 
                continue
        p.swallow(◂elif)
        if (p.tok in {◂then, ◂else}): 
            break # then without condition -> else
        condition = p.expression()
        p.swallow(◂comment)
        then_branch = p.thenBlock()
        condThens.add(nod(●condThen, condition.token, condition, then_branch))
    var else_branch : Node
    if not outdent: 
        p.swallow(◂indent)
        if (p.tok in {◂else, ◂then}): 
            p.swallow() # else or then without condition
            else_branch = p.thenBlock()
    Node(token: token, kind: ●if, cond_thens: condThens, else_branch: else_branch)
# █████████   ███████   ███  ███         ███  ████████
#    ███     ███   ███  ███  ███         ███  ███     
#    ███     █████████  ███  ███         ███  ██████  
#    ███     ███   ███  ███  ███         ███  ███     
#    ███     ███   ███  ███  ███████     ███  ███     
proc lTailIf(p : Parser, left : Node) : Node = 
    if p.returning: return
    if (left.token.line != p.current.line): return
    var token = p.consume()
    var condition = p.expression()
    var condThen = nod(●condThen, condition.token, condition, left)
    Node(token: token, kind: ●if, cond_thens: @[condThen])
# ████████   ███████   ████████ 
# ███       ███   ███  ███   ███
# ██████    ███   ███  ███████  
# ███       ███   ███  ███   ███
# ███        ███████   ███   ███
proc rFor(p : Parser) : Node = 
    var token = p.consume()
    var for_value = p.parseNamesUntil(◂in)
    p.swallowError(◂in, "Expected 'in' after for value")
    var for_range = p.expression()
    var for_body = p.thenBlock()
    nod(●for, token, for_value, for_range, for_body)
proc rWhile(p : Parser) : Node = 
    nod(●while, p.consume(), p.expression(), p.thenBlock())
#  ███████  ███   ███  ███  █████████   ███████  ███   ███
# ███       ███ █ ███  ███     ███     ███       ███   ███
# ███████   █████████  ███     ███     ███       █████████
#      ███  ███   ███  ███     ███     ███       ███   ███
# ███████   ██     ██  ███     ███      ███████  ███   ███
proc switchCase(p : Parser, baseIndent : int) : Node = 
    var case_when : seq[Node]
    var token = p.current
    var first = p.firstLineToken()
    while true: 
        if (p.tok == ◂indent): 
            if ((case_when.len == 0) and (p.peek(1).tok == ◂then)): 
                p.swallow()
                return # indent followed by a ➜ is else
            if not p.swallowSameIndent(baseIndent): 
                break
        if ((p.tok in {◂else, ◂eof}) or p.isDedent(baseIndent)): return
        if (p.tok == ◂then): break
        (p.explicit += 1)
        case_when.add(p.value())
        (p.explicit -= 1)
        p.swallow(◂comma)
    if p.isDedent(baseIndent): return
    var case_then = p.thenIndented(first)
    if (case_then == nil): 
        return p.error("Expected case body after match(es)", token)
    Node(token: token, kind: ●switchCase, case_when: case_when, case_then: case_then)
proc rSwitch(p : Parser) : Node = 
    var token = p.consume()
    var switch_value = p.expression()
    if (switch_value == nil): 
        return p.error("Expected value after switch keyword", token)
    var baseIndent = p.current.str.len
    p.swallowError(◂indent, "Expected indentation after switch statement")
    var switch_cases : seq[Node]
    while true: 
        var switch_case = p.switchCase(baseIndent)
        if switch_case: 
            switch_cases.add(switch_case)
        else: 
            break
    var switch_default : Node
    if (p.tok in {◂else, ◂then}): 
        p.swallow()
        switch_default = p.thenBlock()
        if (switch_default == nil): 
            return p.error("Expected default value", token)
    Node(token: token, kind: ●switch, switch_value: switch_value, switch_cases: switch_cases, switch_default: switch_default)
proc lArrayAccess(p : Parser, array_owner : Node) : Node = 
    var token = p.current()
    var array_indices = p.parseDelimitedList(◂square_open, ◂square_close)
    var array_index = 
        case array_indices.len:
            of 0: nil
            of 1: array_indices[0]
            else: nod(●list, token, array_indices)
    nod(●arrayAccess, token, array_owner, array_index)
proc lPropertyAccess(p : Parser, owner : Node) : Node = 
    var token = p.consume()
    var property = p.rLiteral()
    var n = nod(●propertyAccess, token, owner, property)
    if p.isImplicitCallPossible(): 
        return Node(token: token, kind: ●call, callee: n, callargs: p.parseCallArgs(token.col))
    n
proc rLiteral(p : Parser) : Node = nod(●literal, p.consume())
proc rKeyword(p : Parser) : Node = nod(●keyword, p.consume())
proc rImport(p : Parser) : Node = nod(●import, p.consume())
proc rProc(p : Parser) : Node = nod(●proc, p.consume())
proc rTypeDef(p : Parser) : Node = nod(●typeDef, p.consume())
proc rMacro(p : Parser) : Node = nod(●macro, p.consume())
proc rTemplate(p : Parser) : Node = nod(●template, p.consume())
proc rConverter(p : Parser) : Node = nod(●converter, p.consume())
proc rLet(p : Parser) : Node = nod(●let, p.consume(), p.parseVar())
proc rReturnType(p : Parser) : Node = nod(●signature, p.consume(), nil, p.parseType())
proc rQuote(p : Parser) : Node = nod(●quote, p.consume(), p.thenBlock())
#  ███████  █████████  ████████   ███  ███   ███   ███████ 
# ███          ███     ███   ███  ███  ████  ███  ███      
# ███████      ███     ███████    ███  ███ █ ███  ███  ████
#      ███     ███     ███   ███  ███  ███  ████  ███   ███
# ███████      ███     ███   ███  ███  ███   ███   ███████ 
proc rString(p : Parser) : Node = 
    var token = p.consume() # string start
    if (p.tok == ◂string_end): 
        p.swallow()
        Node(token: token, kind: ●string, string_content: nod(●literal, tkn(◂string)))
    else: 
        var string_content : Node
        if (p.tok != ◂stripol_start): 
            string_content = nod(●literal, p.consume())
        else: 
            string_content = nod(●literal, tkn(◂string, "", p.current.line, p.current.col))
        var string_stripols : seq[Node]
        while (p.tok notin {◂string_end, ◂eof}): 
            p.swallowError(◂stripol_start, "Expected string interpolation start")
            var stripol = Node(token: p.current, kind: ●stripol)
            var stripol_xprssns : seq[Node]
            while (p.tok notin {◂stripol_end, ◂eof}): 
                var xpr = p.expression()
                stripol_xprssns.add(xpr)
            stripol.stripol_xprssns = stripol_xprssns
            p.swallowError(◂stripol_end, "Expected string interpolation end")
            if (p.tok notin {◂stripol_start, ◂string_end, ◂eof}): 
                stripol.stripol_content = nod(●literal, p.consume())
            elif (p.tok == ◂stripol_start): 
                stripol.stripol_content = nod(●literal, tkn(◂string, p.current.line, p.current.col))
            string_stripols.add(stripol)
        p.swallowError(◂string_end, "Expected closing string delimiter")
        Node(token: token, kind: ●string, string_content: string_content, string_stripols: string_stripols)
proc rUse(p : Parser) : Node = 
    var token = p.consume()
    (p.explicit += 1)
    var use_module = p.parseModule()
    if (not p.atEnd() and (p.current.line == token.line)): 
        var use_kind = p.rSymbol()
        var use_items = p.parseNames()
        (p.explicit -= 1)
        Node(token: token, kind: ●use, use_module: use_module, use_kind: use_kind, use_items: use_items)
    else: 
        (p.explicit -= 1)
        Node(token: token, kind: ●use, use_module: use_module)
proc rComment(p : Parser) : Node = 
    var n = nod(●comment, p.consume(), Node(token: p.consume()))
    p.swallow(◂comment_end)
    n
proc lReturnType(p : Parser, left : Node) : Node = 
    if not p.isTokAhead(◂func): return
    if (left.kind in {●list, ●arg, ●operation}): 
        if (left.kind == ●operation): 
            if (left.token.tok == ◂assign): 
                var sig = p.rReturnType()
                var argtoken = tkn(◂val_type, "", left.token.line, left.token.col)
                var argNode = nod(●arg, argtoken, nil, left.operand_left, left.operand_right)
                sig.sig_args = nod(●list, left.token, @[argNode])
                return sig
        elif (left.kind == ●list): 
            var sig = p.rReturnType()
            sig.sig_args = left
            return sig
        elif (left.kind == ●arg): 
            var sig = p.rReturnType()
            sig.sig_args = nod(●list, left.token, @[left])
            return sig
proc rArg(p : Parser) : Node = 
    var token = p.consume() # ◆ or ◇
    if p.typeless: 
        var nameToken = p.consume()
        nameToken.tok = ◂name
        nameToken.str = token.str & nameToken.str
        nameToken.col = token.col
        return nod(●literal, nameToken)
    var arg_type = p.parseType()
    var arg_name = p.value()
    var arg_value : Node
    if (p.tok == ◂assign): 
        var t = p.consume() # =
        arg_value = p.expression()
    nod(●arg, token, arg_type, arg_name, arg_value)
proc lVar(p : Parser, left : Node) : Node = 
    if (left.token.tok != ◂name): return
    var token = p.consume() # ◆ or ◇
    var var_type = p.parseType()
    var var_value : Node
    if (p.tok == ◂assign): 
        var t = p.consume() # =
        var_value = p.expression()
    nod(●var, token, left, var_type, var_value)
proc lSymbolList(p : Parser, left : Node) : Node = 
    if p.listless: return
    case left.kind:
        of ●list: 
            var list_values = left.list_values
            # todo: check if all list items are symbols?
            list_values.add(p.rSymbol())
            return nod(●list, left.token, list_values)
        of ●literal: 
            if (left.token.tok != ◂name): 
                return
            var list_values : seq[Node]
            list_values.add(left)
            list_values.add(p.rSymbol())
            return nod(●list, left.token, list_values)
        else: 
            discard
proc lArgList(p : Parser, left : Node) : Node = 
    case left.kind:
        of ●list: 
            var list_values = left.list_values
            list_values.add(p.rArg())
            return nod(●list, left.token, list_values)
        of ●arg: 
            var list_values : seq[Node]
            list_values.add(left)
            list_values.add(p.rArg())
            return nod(●list, left.token, list_values)
        of ●literal: 
            if (left.token.tok == ◂name): 
                return p.lVar(left)
        else: 
            discard
# ████████  ███   ███  ███   ███   ███████
# ███       ███   ███  ████  ███  ███     
# ██████    ███   ███  ███ █ ███  ███     
# ███       ███   ███  ███  ████  ███     
# ███        ███████   ███   ███   ███████
proc lFunc(p : Parser, left : Node) : Node = 
    if (left.kind notin {●signature, ●list, ●arg, ●operation}): return
    var func_signature : Node
    if (left.kind == ●operation): 
        # log "lfunc op #{left}"
        if (left.token.tok != ◂assign): return
        if (left.operand_left.token.tok != ◂name): return
        if (left.operand_left.token.col == 0): 
            var left = left
            var argtoken = tkn(◂val_type, left.operand_right.token.line, left.operand_right.token.col)
            left.operand_right = p.lFunc(nod(●arg, argtoken, nil, left.operand_right, nil))
            return left
        var vartoken = tkn(◂val_type, left.operand_left.token.line, left.operand_left.token.col)
        var varNode = nod(●arg, vartoken, nil, left.operand_left, left.operand_right)
        var sig_args = nod(●list, vartoken, @[varNode])
        func_signature = nod(●signature, left.token, sig_args, nil)
    elif (left.kind == ●list): 
        # log "lfunc list"
        var sig_args = left
        for i, a in sig_args.list_values: 
            if ((a.kind == ●operation) and (a.token.tok == ◂assign)): 
                var argtoken = tkn(◂val_type, a.operand_left.token.line, a.operand_left.token.col)
                sig_args.list_values[i] = nod(●arg, argtoken, nil, a.operand_left, a.operand_right)
            elif ((a.kind == ●literal) and (a.token.tok == ◂name)): 
                var argtoken = tkn(◂val_type, a.token.line, a.token.col)
                sig_args.list_values[i] = nod(●arg, argtoken, nil, a, nil)
        func_signature = nod(●signature, left.token, sig_args, nil)
    elif (left.kind == ●arg): 
        # log "lfunc arg"
        var sig_args = nod(●list, left.token, @[left])
        func_signature = nod(●signature, left.token, sig_args, nil)
    elif (left.kind == ●signature): 
        func_signature = left
    var firstToken = p.firstLineToken()
    var token = p.consume()
    var func_mod : Node
    if (p.tok == ◂mod): 
        func_mod = p.rLiteral()
    var func_body = p.thenIndented(firstToken)
    nod(●func, token, func_signature, func_mod, func_body)
proc rFunc(p : Parser) : Node = 
    var firstToken = p.firstLineToken()
    var token = p.consume()
    var func_mod : Node
    if (p.tok == ◂mod): 
        func_mod = p.rLiteral()
    var func_body = p.thenIndented(firstToken)
    nod(●func, token, nil, nil, func_body)
proc parseSignature(p : Parser) : Node = 
    var sig_args = nod(●list, p.current(), @[])
    var sig_type : Node
    var parens = false
    if (p.tok == ◂paren_open): 
        p.swallow()
        parens = true
    while true: 
        var token = p.current()
        var arg_type : Node = nil
        if (p.tok in {◂var_type, ◂val_type}): 
            p.swallow() # ◆ or ◇
            arg_type = p.parseType()
        if (p.tok != ◂name): 
            break
        var arg_name = p.value()
        var arg_value : Node
        if (p.tok == ◂assign): 
            p.swallow() # =
            arg_value = p.value()
        p.swallow(◂comma)
        sig_args.list_values.add(nod(●arg, token, arg_type, arg_name, arg_value))
    if parens: 
        if (p.tok != ◂paren_close): return
        p.swallow()
    if (p.tok == ◂then): 
        p.swallow()
        sig_type = p.parseType()
    if (p.tok != ◂func): 
        return
    nod(●signature, sig_args.token, sig_args, sig_type)
proc funcOrExpression(p : Parser, token : Token) : Node = 
    var col = p.lineIndent(token.line)
    if p.isTokAhead(◂func): 
        var startPos = p.pos
        var func_signature : Node
        if (p.tok != ◂func): 
            func_signature = p.parseSignature()
        if (p.tok == ◂func): 
            var ftoken = p.consume()
            var func_mod = if (p.tok == ◂mod): p.rLiteral() else: nil
            var func_body = p.expressionOrIndentedBlock(tkn(◂null), col)
            return nod(●func, ftoken, func_signature, func_mod, func_body)
        else: 
            p.pos = startPos
    p.expressionOrIndentedBlock(token, col)
proc rReturn(p : Parser) : Node = 
    var token = p.consume()
    if ((p.tok == ◂if) and p.isThenlessIf(token)): 
        nod(●return, token, nil)
    else: 
        p.returning = true
        var right : Node
        if ((p.tok != ◂indent) or p.isNextLineIndented(token)): 
            right = p.expression(token)
        p.returning = false
        nod(●return, token, right)
proc rDiscard(p : Parser) : Node = 
    var token = p.consume()
    if p.isDedent(token.col): 
        nod(●discard, token, nil)
    else: 
        nod(●discard, token, p.value())
#  ███████   ████████   ████████  ████████    ███████   █████████  ███   ███████   ███   ███
# ███   ███  ███   ███  ███       ███   ███  ███   ███     ███     ███  ███   ███  ████  ███
# ███   ███  ████████   ███████   ███████    █████████     ███     ███  ███   ███  ███ █ ███
# ███   ███  ███        ███       ███   ███  ███   ███     ███     ███  ███   ███  ███  ████
#  ███████   ███        ████████  ███   ███  ███   ███     ███     ███   ███████   ███   ███
proc lOperation(p : Parser, left : Node) : Node = 
    var token = p.consume()
    var right = p.expression(token)
    nod(●operation, token, left, right)
proc lNotIn(p : Parser, left : Node) : Node = 
    if (p.peek(1).tok == ◂in): 
        var token = p.consume()
        token.str = "notin"
        token.tok = ◂notin
        p.swallow()
        var right = p.expression(token)
        return nod(●operation, token, left, right)
proc lPostOp(p : Parser, left : Node) : Node = 
    nod(●postOp, p.consume(), left)
proc rPreOp(p : Parser) : Node = 
    var token = p.consume()
    var right = p.expression(token)
    nod(●preOp, token, right)
proc lAssign(p : Parser, left : Node) : Node = 
    var token = p.consume()
    var right = p.funcOrExpression(token)
    nod(●operation, token, left, right)
proc lRange(p : Parser, left : Node) : Node = 
    var token = p.consume()
    var right = p.expression(token)
    nod(●range, token, left, right)
proc rParenExpr(p : Parser) : Node = 
    nod(●list, p.current, p.parseParenList())
proc rCurly(p : Parser) : Node = 
    nod(●curly, p.current, p.parseDelimitedList(◂bracket_open, ◂bracket_close))
proc rSquarely(p : Parser) : Node = 
    nod(●squarely, p.current, p.parseDelimitedList(◂square_open, ◂square_close))
proc rEnum(p : Parser) : Node = 
    var token = p.consume()
    var enum_name = p.value()
    var enum_body : Node
    if p.isNextLineIndented(token): 
        p.typeless = true
        enum_body = p.parseBlock()
        p.typeless = false
    nod(●enum, token, enum_name, enum_body)
proc rClass(p : Parser) : Node = 
    var token = p.consume()
    var class_name = p.value()
    var class_body = p.parseBlock()
    nod(●class, token, class_name, class_body)
proc lMember(p : Parser, left : Node) : Node = 
    var token = p.consume()
    var right = p.funcOrExpression(token)
    nod(●member, token, left, right)
proc lTestCase(p : Parser, left : Node) : Node = 
    var token = p.consume() # ▸
    p.swallow(◂indent) # todo: check if indent is larger than that of the test expression
    var right = p.expression()
    nod(●testCase, token, left, right)
proc rTestSuite(p : Parser) : Node = 
    var token = p.consume() # ▸
    var test_block = p.thenBlock()
    if (token.col == 0): 
        nod(●testSuite, token, test_block)
    else: 
        nod(●testSection, token, test_block)
# ████████  ███   ███  ████████   ████████   ████████   ███████   ███████  ███   ███████   ███   ███
# ███        ███ ███   ███   ███  ███   ███  ███       ███       ███       ███  ███   ███  ████  ███
# ███████     █████    ████████   ███████    ███████   ███████   ███████   ███  ███   ███  ███ █ ███
# ███        ███ ███   ███        ███   ███  ███            ███       ███  ███  ███   ███  ███  ████
# ████████  ███   ███  ███        ███   ███  ████████  ███████   ███████   ███   ███████   ███   ███
#[
   ◂R      ◂LR     ◂L      ◂R      ◂L      ◂LR     ◂R 
   │       │       │       │       │       │ 
   ◂R➜●    │       │       ◂R➜●    │       │ 
      │    │       │          │    │       │
      ╰───●◂L➜●───●◂L➜●       ╰───●◂L➜●───●◂L➜●
                      │                       │
                      ▾                       ▾
]#
proc expression(p : Parser, precedenceRight = 0) : Node = 
    var token = p.current
    if (token.tok in {◂eof, ◂stripol_end, ◂paren_close}): 
        return nil
    var rhs = p.rightHandSide(token)
    if (rhs == nil): 
        return p.error(&"Expected expression but found {token.str} {token}", token)
    var node = rhs(p)
    if (precedenceRight < -1): 
        return node
    while not p.atEnd(): 
        token = p.current
        var precedence = p.getPrecedence(token)
        if (token.tok in {◂assign, ◂test}): 
            (precedence += 1)
        var lhs = p.leftHandSide(token)
        if (precedenceRight >= precedence): 
            break
        if (lhs == nil): 
            break
        var lhn = p.lhs(node)
        if (lhn != nil): 
            node = lhn
        else: 
            break
        if ((p.tok == ◂indent) and (p.peek(1).tok in {◂dot})): 
             p.swallow()
             node = p.lPropertyAccess(node)
    node
# ████████   ████████    ███████   █████████  █████████
# ███   ███  ███   ███  ███   ███     ███        ███   
# ████████   ███████    █████████     ███        ███   
# ███        ███   ███  ███   ███     ███        ███   
# ███        ███   ███  ███   ███     ███        ███   
proc pratt(p : Parser, t : tok, lhs : LHS, rhs : RHS, precedence : int) = 
    if (p.pratts.len <= t.ord): 
        p.pratts.setLen((t.ord + 1))
    p.pratts[t.ord] = Pratt(lhs: lhs, rhs: rhs, precedence: precedence)
#  ███████  ████████  █████████  ███   ███  ████████ 
# ███       ███          ███     ███   ███  ███   ███
# ███████   ███████      ███     ███   ███  ████████ 
#      ███  ███          ███     ███   ███  ███      
# ███████   ████████     ███      ███████   ███      
proc setup(p : Parser) = 
    p.pratt(◂true, nil, rLiteral, 0)
    p.pratt(◂false, nil, rLiteral, 0)
    p.pratt(◂mod, nil, rLiteral, 0)
    p.pratt(◂null, nil, rLiteral, 0)
    p.pratt(◂number, nil, rLiteral, 0)
    p.pratt(◂string_start, nil, rString, 0)
    p.pratt(◂comment_start, nil, rComment, 0)
    p.pratt(◂name, lSymbolList, rSymbol, 13) # higher than assign
    p.pratt(◂import, nil, rImport, 0)
    p.pratt(◂macro, nil, rMacro, 0)
    p.pratt(◂template, nil, rTemplate, 0)
    p.pratt(◂converter, nil, rConverter, 0)
    p.pratt(◂proc, nil, rProc, 0)
    p.pratt(◂type, nil, rTypeDef, 0)
    p.pratt(◂use, nil, rUse, 0)
    p.pratt(◂let, nil, rLet, 0)
    p.pratt(◂var, nil, rLet, 0)
    p.pratt(◂return, nil, rReturn, 0)
    p.pratt(◂discard, nil, rDiscard, 0)
    p.pratt(◂quote, nil, rQuote, 0)
    p.pratt(◂test, lTestCase, rTestSuite, 0)
    p.pratt(◂class, nil, rClass, 0)
    p.pratt(◂enum, nil, rEnum, 0)
    p.pratt(◂colon, lMember, nil, 10)
    p.pratt(◂continue, nil, rKeyword, 0)
    p.pratt(◂break, nil, rKeyword, 0)
    p.pratt(◂assign, lAssign, nil, 10)
    p.pratt(◂plus_assign, lAssign, nil, 10)
    p.pratt(◂minus_assign, lAssign, nil, 10)
    p.pratt(◂divide_assign, lAssign, nil, 10)
    p.pratt(◂multiply_assign, lAssign, nil, 10)
    p.pratt(◂ampersand_assign, lAssign, nil, 10)
    p.pratt(◂if, lTailIf, rIf, 20)
    p.pratt(◂when, nil, rIf, 20)
    p.pratt(◂for, nil, rFor, 20)
    p.pratt(◂switch, nil, rSwitch, 20)
    p.pratt(◂while, nil, rWhile, 20)
    p.pratt(◂func, lFunc, rFunc, 20)
    p.pratt(◂or, lOperation, nil, 30)
    p.pratt(◂and, lOperation, nil, 31)
    p.pratt(◂is, lOperation, nil, 32)
    p.pratt(◂in, lOperation, nil, 33)
    p.pratt(◂notin, lOperation, nil, 34)
    p.pratt(◂equal, lOperation, nil, 40)
    p.pratt(◂not_equal, lOperation, nil, 40)
    p.pratt(◂greater_equal, lOperation, nil, 40)
    p.pratt(◂less_equal, lOperation, nil, 40)
    p.pratt(◂less, lOperation, nil, 40)
    p.pratt(◂greater, lOperation, nil, 40)
    p.pratt(◂match, lOperation, nil, 40)
    p.pratt(◂doubledot, lRange, nil, 40)
    p.pratt(◂tripledot, lRange, nil, 40)
    p.pratt(◂ampersand, lOperation, nil, 40)
    p.pratt(◂plus, lOperation, nil, 50)
    p.pratt(◂minus, lOperation, rPreOp, 50)
    p.pratt(◂multiply, lOperation, nil, 60)
    p.pratt(◂divide, lOperation, nil, 60)
    p.pratt(◂not, lNotIn, rPreOp, 70)
    p.pratt(◂increment, lPostOp, nil, 80)
    p.pratt(◂decrement, lPostOp, nil, 80)
    p.pratt(◂square_open, lArrayAccess, rSquarely, 90)
    p.pratt(◂paren_open, lCall, rParenExpr, 90)
    p.pratt(◂bracket_open, nil, rCurly, 90)
    p.pratt(◂then, lReturnType, rReturnType, 99)
    p.pratt(◂val_type, lArgList, rArg, 100)
    p.pratt(◂var_type, lArgList, rArg, 100)
    p.pratt(◂dot, lPropertyAccess, nil, 102)
#  ███████    ███████  █████████
# ███   ███  ███          ███   
# █████████  ███████      ███   
# ███   ███       ███     ███   
# ███   ███  ███████      ███   
proc ast*(text : string) : Node = 
    # profileStart 'tknz'
    var tokens = tokenize(text)
    # profileStop 'tknz'
    # log &"ast* {tokens}"
    # profileStart 'pars'
    var p = Parser(tokens: tokens, pos: 0, text: text)
    p.setup()
    var b = p.parseBlock()
    # profileStop 'pars'
    if p.failed: return nil
    b