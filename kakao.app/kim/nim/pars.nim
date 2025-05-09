# ████████    ███████   ████████    ███████
# ███   ███  ███   ███  ███   ███  ███     
# ████████   █████████  ███████    ███████ 
# ███        ███   ███  ███   ███       ███
# ███        ███   ███  ███   ███  ███████ 
import node
export node
{.experimental: "codeReordering".}
type RHS = proc(p: Parser): Node
type LHS = proc(p: Parser, left: Node): Node
var EOF = tkn(◂eof)
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
    inlinecall: int
    returning: bool
    typeless: bool
    failed: bool
    text: string # used in `$` for debugging. should be removed eventually 
    # ████████   ████████   ███  ███   ███  █████████  
    # ███   ███  ███   ███  ███  ████  ███     ███     
    # ████████   ███████    ███  ███ █ ███     ███     
    # ███        ███   ███  ███  ███  ████     ███     
    # ███        ███   ███  ███  ███   ███     ███     
    #  ███████   ███████   ███   ███   ███████  ███   ███  ██     ██  ████████
    # ███       ███   ███  ████  ███  ███       ███   ███  ███   ███  ███     
    # ███       ███   ███  ███ █ ███  ███████   ███   ███  █████████  ███████ 
    # ███       ███   ███  ███  ████       ███  ███   ███  ███ █ ███  ███     
    #  ███████   ███████   ███   ███  ███████    ███████   ███   ███  ████████
    # ███████    ███       ███████    ███████  ███   ███
    # ███   ███  ███      ███   ███  ███       ███  ███ 
    # ███████    ███      ███   ███  ███       ███████  
    # ███   ███  ███      ███   ███  ███       ███  ███ 
    # ███████    ███████   ███████    ███████  ███   ███
    #  ███████   ███████   ███      ███       ███████   ████████    ███████    ███████
    # ███       ███   ███  ███      ███      ███   ███  ███   ███  ███        ███     
    # ███       █████████  ███      ███      █████████  ███████    ███  ████  ███████ 
    # ███       ███   ███  ███      ███      ███   ███  ███   ███  ███   ███       ███
    #  ███████  ███   ███  ███████  ███████  ███   ███  ███   ███   ███████   ███████ 
    # █████████  ███   ███  ████████   ████████
    #    ███      ███ ███   ███   ███  ███     
    #    ███       █████    ████████   ███████ 
    #    ███        ███     ███        ███     
    #    ███        ███     ███        ████████
    # ███      ███   ███████  █████████
    # ███      ███  ███          ███   
    # ███      ███  ███████      ███   
    # ███      ███       ███     ███   
    # ███████  ███  ███████      ███   
    # █████████  ███   ███  ████████  ███   ███
    #    ███     ███   ███  ███       ████  ███
    #    ███     █████████  ███████   ███ █ ███
    #    ███     ███   ███  ███       ███  ████
    #    ███     ███   ███  ████████  ███   ███
    #  ███████   ███████   ███      ███    
    # ███       ███   ███  ███      ███    
    # ███       █████████  ███      ███    
    # ███       ███   ███  ███      ███    
    #  ███████  ███   ███  ███████  ███████
    # ███  ██     ██  ████████   ███      ███   ███████  ███  █████████
    # ███  ███   ███  ███   ███  ███      ███  ███       ███     ███   
    # ███  █████████  ████████   ███      ███  ███       ███     ███   
    # ███  ███ █ ███  ███        ███      ███  ███       ███     ███   
    # ███  ███   ███  ███        ███████  ███   ███████  ███     ███   
    # ███  ████████                             ███  ████████                               ███  ████████  
    # ███  ███                                  ███  ███                                    ███  ███       
    # ███  ██████                               ███  ██████                                 ███  ██████    
    # ███  ███                                  ███  ███                                    ███  ███       
    # ███  ███                                  ███  ███                                    ███  ███       
    # █████████   ███████   ███  ███         ███  ████████
    #    ███     ███   ███  ███  ███         ███  ███     
    #    ███     █████████  ███  ███         ███  ██████  
    #    ███     ███   ███  ███  ███         ███  ███     
    #    ███     ███   ███  ███  ███████     ███  ███     
    # ████████   ███████   ████████ 
    # ███       ███   ███  ███   ███
    # ██████    ███   ███  ███████  
    # ███       ███   ███  ███   ███
    # ███        ███████   ███   ███
    #  ███████  ███   ███  ███  █████████   ███████  ███   ███
    # ███       ███ █ ███  ███     ███     ███       ███   ███
    # ███████   █████████  ███     ███     ███       █████████
    #      ███  ███   ███  ███     ███     ███       ███   ███
    # ███████   ██     ██  ███     ███      ███████  ███   ███
proc current(this : Parser) : Token = 
        if (this.pos < this.tokens.len): 
            return this.tokens[this.pos]
        tkn(◂eof)
proc tok(this : Parser) : tok = this.current.tok
proc peek(this : Parser, ahead = 1) : Token = 
        if ((this.pos + ahead) < this.tokens.len): 
            this.tokens[(this.pos + ahead)]
        else: 
            EOF
proc `$`(this : Parser) : string = 
        var s = ""
        if (this.tok != ◂eof): 
            s = &"▪▪▪ {this.current} {this.pos}"
            var l = this.text.split("\n")[this.current.line]
            (s &= &"\n{this.current.line}: {l}")
        else: 
            s = this.text
        s
proc error(this : Parser, msg : string, token = EOF) : Node = 
        styledEcho(fgRed, styleDim, "△ ", resetStyle, fgYellow, msg)
        if (token.tok != ◂eof): 
            var line = this.text.split("\n")[token.line]
            styledEcho(fgWhite, styleDim, &"{token.line}", resetStyle, fgGreen, $line)
        elif (this.tok != ◂eof): 
            var line = this.text.split("\n")[this.current.line]
            styledEcho(fgWhite, styleDim, &"{this.current.line}", resetStyle, fgGreen, $line)
        this.failed = true
        nil
proc consume(this : Parser) : Token = 
        var t = this.current
        if (this.pos < this.tokens.len): 
            (this.pos += 1)
        t
proc swallow(this : Parser) = 
        discard this.consume()
proc swallow(this : Parser, tok : tok) = 
        if (this.tok == tok): 
            this.swallow()
proc swallowError(this : Parser, tok : tok, err : string) = 
        if (this.tok != tok): 
            discard this.error(&"Expected {tok} to swallow, but found {this.tok} instead")
            discard this.error(err)
            return
        this.swallow()
proc swallowSameIndent(this : Parser, indent : int) : bool = 
        if ((this.tok == ◂indent) and (this.current.str.len == indent)): 
            this.swallow()
            return true
        false
proc atIndent(this : Parser) : bool = 
        ((this.current.col == 0) or (this.peek(-1).tok == ◂indent))
proc atEnd(this : Parser) : bool = 
        (this.pos >= this.tokens.len)
proc isDedent(this : Parser, indent : int) : bool = 
        if (this.tok == ◂indent): 
            (this.current.str.len < indent)
        else: 
            (this.current.col < indent)
proc isNextLineIndented(this : Parser, token : Token) : bool = 
        var n = 0
        while (this.peek(n).tok != ◂indent): 
            (n += 1)
            if (this.peek(n).tok == ◂eof): 
                return false
        var idt = if (token.tok == ◂indent): token.str.len else: token.col
        return (this.peek(n).str.len > idt)
proc isTokAhead(this : Parser, tokAhead : tok) : bool = 
        var n = 0
        var c = this.current
        var line = c.line
        # log "isTokAhead #{tokAhead} #{line}"
        while (c.tok != ◂eof): 
            if (c.line > line): 
                return false
            if (c.tok == tokAhead): 
                return true
            (n += 1)
            c = this.peek(n)
        false
proc firstLineToken(this : Parser) : Token = 
        var line = this.current.line
        var tpos = this.tokens.len
        while (tpos > 0): 
            if (this.tokens[(tpos - 1)].line < line): 
                break
            (tpos -= 1)
        this.tokens[tpos]
proc lineIndent(this : Parser, line : int) : int = 
        var tpos = this.tokens.len
        while (tpos > 0): 
            if (this.tokens[(tpos - 1)].line < line): 
                break
            (tpos -= 1)
        if (this.tokens[tpos].tok == ◂indent): 
            this.tokens[tpos].str.len
        else: 
            this.tokens[tpos].col
proc isThenlessIf(this : Parser, token : Token) : bool = 
        if this.isNextLineIndented(token): 
            return false
        not this.isTokAhead(◂then)
proc getPrecedence(this : Parser, token : Token) : int = 
        if (token.tok.ord < this.pratts.len): 
            return this.pratts[token.tok.ord].precedence
        0
proc rightHandSide(this : Parser, token : Token) : RHS = 
        if (token.tok.ord < this.pratts.len): 
            return this.pratts[token.tok.ord].rhs
proc leftHandSide(this : Parser, token : Token) : LHS = 
        if (token.tok.ord < this.pratts.len): 
            return this.pratts[token.tok.ord].lhs
proc expression(this : Parser, precedenceRight = 0) : Node
proc expression(this : Parser, tokenRight : Token) : Node = 
        this.expression(this.getPrecedence(tokenRight))
proc value(this : Parser) : Node = 
        this.expression(-2)
proc parseBlock(this : Parser, bn : Node = nil) : Node = 
        var token : Token
        var block_indent : int
        while (this.tok == ◂indent): 
            token = this.consume()
            block_indent = this.current.col
        var bn = bn
        if (bn == nil): 
            bn = nod(●block, token, @[])
        var expr = this.expression()
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
            if (this.tok == ◂indent): 
                var ind = this.current.str.len
                if (ind < block_indent): 
                    break
                elif (ind > block_indent): 
                    this.blocks.add(bn)
                    expr = this.parseBlock()
                    bn = this.blocks.pop()
                    continue
                else: 
                    this.swallow()
            if (this.atEnd() or (this.current.col < block_indent)): 
                break
            expr = this.expression()
        bn
proc expressionOrIndentedBlock(this : Parser, token : Token, col : int) : Node = 
        if (this.tok == ◂indent): 
            if (this.current.str.len > col): 
                return this.parseBlock()
        else: 
            return this.expression(token)
proc swallowIndent(this : Parser, col : int) : bool = 
        this.swallow(◂comma)
        if (this.tok == ◂indent): 
            if (this.current.str.len > col): 
                this.swallow()
            else: 
                return true
        false
proc parseCallArgs(this : Parser, col : int) : seq[Node] = 
        (this.explicit += 1)
        (this.listless += 1)
        var list : seq[Node]
        var line = this.current.line
        var expr = this.expression()
        while (expr != nil): 
            list.add(expr)
            if (this.inlinecall and (this.tok == ◂indent)): 
                break
            if this.swallowIndent(col): 
                break
            # if @tok in {◂comment_start, ◂then, ◂paren_close}
            if (this.tok in {◂comment_start, ◂then}): 
                break
            expr = this.expression()
        (this.listless -= 1)
        (this.explicit -= 1)
        list
proc parseType(this : Parser) : Node = 
        var token = this.consume()
        token.tok = ◂type
        if (this.tok == ◂square_open): 
            var opened = 0
            while (this.tok notin {◂eof}): 
                var t = this.consume()
                (token.str &= t.str)
                if (t.tok == ◂square_open): 
                    (opened += 1)
                elif (t.tok == ◂square_close): 
                    (opened -= 1)
                    if (opened == 0): 
                        break
        nod(●type, token)
proc parseVar(this : Parser) : Node = 
        var token = this.current()
        var var_name = this.value()
        var var_value : Node
        var var_type : Node
        if (this.tok == ◂assign): 
            this.swallow()
            var_value = this.thenBlock()
        elif (this.tok in {◂val_type, ◂var_type}): 
            token = this.consume()
            var_type = this.parseType()
            if (this.tok == ◂assign): 
                this.swallow()
                var_value = this.expression()
        nod(●var, token, var_name, var_type, var_value)
proc parseModule(this : Parser) : Node = 
        var line = this.current.line
        var s = ""
        while (this.current.str notin @["▪", "◆"]): 
            var e = (this.current.col + this.current.str.len)
            (s &= this.consume().str)
            if (this.atEnd() or (this.current.line != line)): 
                break
            if ((this.current.col > e) and (this.current.str notin @["▪", "◆"])): 
                (s &= " ")
        Node(token: Token(str: s))
proc parseParenList(this : Parser) : seq[Node] = 
        var token = this.consume() # (
        var args : seq[Node]
        (this.explicit += 1)
        while ((this.tok != ◂paren_close) and (this.tok != ◂eof)): 
            args.add(this.expression())
            this.swallow(◂comma)
        this.swallowError(◂paren_close, "Missing closing parenthesis")
        (this.explicit -= 1)
        if ((args.len == 1) and (args[0].kind == ●list)): 
            return args[0].list_values
        args
proc parseDelimitedList(this : Parser, open : tok, close : tok) : seq[Node] = 
        var token = this.consume()
        var args : seq[Node]
        (this.explicit += 1)
        while true: 
            discard this.swallowIndent(-1)
            if ((this.tok != close) and (this.tok != ◂eof)): 
                args.add(this.expression())
            else: 
                break
        this.swallowError(close, "Missing closing bracket")
        (this.explicit -= 1)
        if ((args.len == 1) and (args[0].kind == ●list)): 
            return args[0].list_values
        args
proc parseNames(this : Parser) : seq[Node] = 
        var list : seq[Node]
        var line = this.current.line
        (this.explicit += 1)
        var expr = this.rSymbol()
        while (expr != nil): 
            list.add(expr)
            if (this.current.line != line): 
                break
            this.swallow(◂comma)
            expr = this.rSymbol()
        (this.explicit -= 1)
        list
proc parseNamesUntil(this : Parser, stop : tok) : Node = 
        var token = this.current
        var list_values : seq[Node]
        (this.explicit += 1)
        while (this.tok != stop): 
            if (this.tok == ◂eof): 
                return this.error("Missing 'in' for 'for' loop (eof detected)!", token)
            if (this.current.line != token.line): 
                return this.error("Missing 'in' for 'for' loop (linebreak detected)!", token)
            list_values.add(this.rSymbol())
            this.swallow(◂comma)
        (this.explicit -= 1)
        if (list_values.len == 1): 
            list_values[0]
        else: 
            nod(●list, token, list_values)
proc thenBlock(this : Parser) : Node = 
        if (this.tok == ◂then): 
            this.swallow(◂then)
        if (this.tok == ◂indent): 
            this.parseBlock()
        else: 
            this.expression()
proc thenIndented(this : Parser, token : Token) : Node = 
        if (this.tok == ◂then): 
            this.swallow(◂then)
        if (this.tok == ◂indent): 
            if this.isNextLineIndented(token): 
                return this.parseBlock()
            return nil
        else: 
            return this.expression()
proc lCall(this : Parser, callee : Node) : Node = 
        var token = this.consume() # (
        var args = this.parseCallArgs(callee.token.col)
        this.swallowError(◂paren_close, "Missing closing paren for call arguments")
        Node(token: token, kind: ●call, callee: callee, callargs: args)
proc isImplicitCallPossible(this : Parser) : bool = 
        if this.explicit: return false
        var currt = this.peek(0)
        var optoks = {◂indent, ◂eof, ◂then, ◂else, ◂elif, ◂test, ◂val_type, ◂var_type, ◂colon, ◂plus, ◂minus, ◂divide, ◂multiply, ◂and, ◂or, ◂ampersand, ◂is, ◂in, ◂notin, ◂not, ◂equal, ◂not_equal, ◂greater_equal, ◂less_equal, ◂greater, ◂less, ◂match, ◂comment_start, ◂assign, ◂divide_assign, ◂multiply_assign, ◂plus_assign, ◂minus_assign, ◂ampersand_assign}
        if (currt.tok in optoks): return false
        var prevt = this.peek(-1)
        if (currt.col <= (prevt.col + ksegWidth(prevt.str))): return false
        if this.isTokAhead(◂func): return false
        true
proc rSymbol(this : Parser) : Node = 
        var token = this.consume()
        if (((token.str in @["peg", "re", "r"]) and (this.tok == ◂string_start)) and ((token.col + token.str.len) == this.current.col)): 
            var n = this.rString()
            n.string_prefix = nod(●literal, token)
            return n
        if this.isImplicitCallPossible(): 
            let args = this.parseCallArgs(token.col)
            return Node(token: token, kind: ●call, callee: nod(●literal, token), callargs: args)
        nod(●literal, token)
proc inline(this : Parser) : Node = 
        (this.inlinecall += 1)
        var e = this.expression()
        (this.inlinecall -= 1)
        e
proc rIf(this : Parser) : Node = 
        var token = this.consume() # if or when
        var condThens : seq[Node]
        var ifIndent = token.col
        var condIndt = ifIndent
        if (this.tok == ◂indent): 
            condIndt = this.current.str.len
            if (condIndt <= ifIndent): 
                return this.error("Expected indentation after 'if' without condition")
            this.swallow(◂indent) # block indentation
        var condition = this.inline() # initial condition
        var then_branch = this.thenBlock()
        condThens.add(nod(●condThen, condition.token, condition, then_branch))
        var outdent = false
        while (this.tok in {◂elif, ◂indent}): 
            if (this.tok == ◂indent): 
                if (this.current.str.len < ifIndent): 
                    outdent = true
                    break
                if (ifIndent < condIndt): 
                    if (this.current.str.len < condIndt): 
                        break
                if ((this.peek(1).tok != ◂elif) and (this.current.str.len == ifIndent)): 
                    break
                this.swallow(◂indent)
                if (this.tok == ◂comment_start): 
                    this.swallow()
                    this.swallow(◂comment)
                if (this.tok == ◂indent): 
                    continue
            this.swallow(◂elif)
            if (this.tok in {◂then, ◂else}): 
                break # then without condition -> else
            condition = this.inline()
            this.swallow(◂comment)
            then_branch = this.thenBlock()
            condThens.add(nod(●condThen, condition.token, condition, then_branch))
        var else_branch : Node
        if not outdent: 
            this.swallow(◂indent)
            if (this.tok in {◂else, ◂then}): 
                this.swallow() # else or then without condition
                else_branch = this.thenBlock()
        Node(token: token, kind: ●if, cond_thens: condThens, else_branch: else_branch)
proc lTailIf(this : Parser, left : Node) : Node = 
        if this.returning: return
        if (left.token.line != this.current.line): return
        var token = this.consume()
        var condition = this.expression()
        var condThen = nod(●condThen, condition.token, condition, left)
        Node(token: token, kind: ●if, cond_thens: @[condThen])
proc rFor(this : Parser) : Node = 
        var token = this.consume()
        var for_value = this.parseNamesUntil(◂in)
        this.swallowError(◂in, "Expected 'in' after for value")
        var for_range = this.expression()
        var for_body = this.thenBlock()
        nod(●for, token, for_value, for_range, for_body)
proc rWhile(this : Parser) : Node = 
        nod(●while, this.consume(), this.expression(), this.thenBlock())
proc switchCase(this : Parser, baseIndent : int) : Node = 
        var case_when : seq[Node]
        var token = this.current
        var first = this.firstLineToken()
        while true: 
            if (this.tok == ◂indent): 
                if ((case_when.len == 0) and (this.peek(1).tok == ◂then)): 
                    this.swallow()
                    return # indent followed by a ➜ is else
                if not this.swallowSameIndent(baseIndent): 
                    break
            if ((this.tok in {◂else, ◂eof}) or this.isDedent(baseIndent)): return
            if (this.tok == ◂then): break
            (this.explicit += 1)
            case_when.add(this.value())
            (this.explicit -= 1)
            this.swallow(◂comma)
        if this.isDedent(baseIndent): return
        var case_then = this.thenIndented(first)
        if (case_then == nil): 
            return this.error("Expected case body after match(es)", token)
        Node(token: token, kind: ●switchCase, case_when: case_when, case_then: case_then)
proc rSwitch(this : Parser) : Node = 
        var token = this.consume()
        var switch_value = this.expression()
        if (switch_value == nil): 
            return this.error("Expected value after switch keyword", token)
        var baseIndent = this.current.str.len
        this.swallowError(◂indent, "Expected indentation after switch statement")
        var switch_cases : seq[Node]
        while true: 
            var switch_case = this.switchCase(baseIndent)
            if switch_case: 
                switch_cases.add(switch_case)
            else: 
                break
        var switch_default : Node
        if (this.tok in {◂else, ◂then}): 
            this.swallow()
            switch_default = this.thenBlock()
            if (switch_default == nil): 
                return this.error("Expected default value", token)
        Node(token: token, kind: ●switch, switch_value: switch_value, switch_cases: switch_cases, switch_default: switch_default)
proc lArrayAccess(this : Parser, array_owner : Node) : Node = 
        var token = this.current()
        var array_indices = this.parseDelimitedList(◂square_open, ◂square_close)
        var array_index = 
            case array_indices.len:
                of 0: nil
                of 1: array_indices[0]
                else: nod(●list, token, array_indices)
        nod(●arrayAccess, token, array_owner, array_index)
proc lPropertyAccess(this : Parser, owner : Node) : Node = 
        var token = this.consume()
        var property = this.rLiteral()
        var n = nod(●propertyAccess, token, owner, property)
        if this.isImplicitCallPossible(): 
            return Node(token: token, kind: ●call, callee: n, callargs: this.parseCallArgs(token.col))
        n
proc rLiteral(this : Parser) : Node = nod(●literal, this.consume())
proc rKeyword(this : Parser) : Node = nod(●keyword, this.consume())
proc rImport(this : Parser) : Node = nod(●import, this.consume())
proc rProc(this : Parser) : Node = nod(●proc, this.consume())
proc rTypeDef(this : Parser) : Node = nod(●typeDef, this.consume())
proc rMacro(this : Parser) : Node = nod(●macro, this.consume())
proc rTemplate(this : Parser) : Node = nod(●template, this.consume())
proc rConverter(this : Parser) : Node = nod(●converter, this.consume())
proc rLet(this : Parser) : Node = nod(●let, this.consume(), this.parseVar())
proc rReturnType(this : Parser) : Node = nod(●signature, this.consume(), nil, this.parseType())
proc rQuote(this : Parser) : Node = nod(●quote, this.consume(), this.thenBlock())
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
            (p.listless += 1)
            (p.explicit += 1)
            arg_value = p.expression()
            (p.explicit -= 1)
            (p.listless -= 1)
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
proc rDollar(p : Parser) : Node = 
    if (p.current.str.len > 1): 
        var token = p.consume()
        token.tok = ◂name
        return nod(●literal, token)
    if (p.peek(1).tok in {◂assign, ◂colon}): 
        var token = p.consume()
        token.tok = ◂name
        return nod(●literal, token)
    p.rPreOp()
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
proc expression(this : Parser, precedenceRight = 0) : Node = 
    var token = this.current
    if (token.tok in {◂eof, ◂stripol_end, ◂paren_close}): 
        return nil
    var rhs = this.rightHandSide(token)
    if (rhs == nil): 
        return this.error(&"Expected expression but found {token.str} {token}", token)
    var node = this.rhs()
    if (precedenceRight < -1): 
        return node
    while not this.atEnd(): 
        token = this.current
        var precedence = this.getPrecedence(token)
        if (token.tok in {◂assign, ◂test}): 
            (precedence += 1)
        var lhs = this.leftHandSide(token)
        if (precedenceRight >= precedence): 
            break
        if (lhs == nil): 
            break
        var lhn = this.lhs(node)
        if (lhn != nil): 
            node = lhn
        else: 
            break
        if ((this.tok == ◂indent) and (this.peek(1).tok in {◂dot})): 
             this.swallow()
             node = this.lPropertyAccess(node)
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
    p.pratt(◂dollar, nil, rDollar, 41)
    p.pratt(◂ampersand, lOperation, nil, 42)
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