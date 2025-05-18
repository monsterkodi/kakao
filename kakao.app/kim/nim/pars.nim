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

type Parser = ref object of RootObj
    tokens: seq[Token]
    pratts: seq[Pratt]
    blocks: seq[Node]
    pos: int
    explicit: int
    listless: int
    inlinecall: int
    rangeless: bool
    returning: bool
    typeless: bool
    failed: bool
    lang: string
    text: string
# used in `$` for debugging. should be removed eventually 

proc current(this : Parser) : Token = 
        if (this.pos < this.tokens.len): 
            return this.tokens[this.pos]
        EOF

proc tok(this : Parser) : tok = this.current.tok

proc peek(this : Parser, ahead = 1) : Token = 
        if ((this.pos + ahead) < this.tokens.len): 
            this.tokens[(this.pos + ahead)]
        else: 
            EOF
# ████████   ████████   ███  ███   ███  █████████  
# ███   ███  ███   ███  ███  ████  ███     ███     
# ████████   ███████    ███  ███ █ ███     ███     
# ███        ███   ███  ███  ███  ████     ███     
# ███        ███   ███  ███  ███   ███     ███     

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
        if (token.tok != ◂eof): 
            styledEcho(styleDim, fgRed, "△ ", fgWhite, $(token.line + 1), ": ", resetStyle, fgYellow, msg)
            var line = this.text.split("\n")[token.line]
            styledEcho(fgRed, styleDim, "╰" & "─".repeat((token.col - 1)) & "╮")
            styledEcho(fgGreen, $line)
            echo("")
        elif (this.tok != ◂eof): 
            styledEcho(fgRed, styleDim, "△ ", resetStyle, fgYellow, msg)
            var line = this.text.split("\n")[this.current.line]
            styledEcho(fgWhite, styleDim, &"{this.current.line}", resetStyle, fgGreen, $line)
        else: 
            styledEcho(fgRed, styleDim, "△ ", resetStyle, fgYellow, msg)
        this.failed = true
        nil
#  ███████   ███████   ███   ███   ███████  ███   ███  ██     ██  ████████
# ███       ███   ███  ████  ███  ███       ███   ███  ███   ███  ███     
# ███       ███   ███  ███ █ ███  ███████   ███   ███  █████████  ███████ 
# ███       ███   ███  ███  ████       ███  ███   ███  ███ █ ███  ███     
#  ███████   ███████   ███   ███  ███████    ███████   ███   ███  ████████

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

proc swallowComment(this : Parser) = 
        if (this.tok == ◂comment_start): 
            this.swallow()
            this.swallow(◂comment)

proc swallowError(this : Parser, tok : tok, err : string, token : Token) = 
        if (this.tok != tok): 
            discard this.error(&"Expected {tok} but found {this.tok}", token)
            discard this.error(err, token)
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

proc isConnectedLeft(this : Parser, n = 0) : bool = 
        var lt = this.peek((n - 1))
        var ct = this.peek(n)
        ((((lt != EOF) and (ct != EOF)) and (lt.line == ct.line)) and ((lt.col + lt.str.len) == ct.col))

proc isConnectedRight(this : Parser, n = 0) : bool = 
        var ct = this.peek(n)
        var rt = this.peek((n + 1))
        ((((rt != EOF) and (ct != EOF)) and (rt.line == ct.line)) and ((ct.col + ct.str.len) == rt.col))

proc isConnectedLeftAndRight(this : Parser, n = 0) : bool = 
        (this.isConnectedLeft(n) and this.isConnectedRight(n))

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
# ███████    ███       ███████    ███████  ███   ███
# ███   ███  ███      ███   ███  ███       ███  ███ 
# ███████    ███      ███   ███  ███       ███████  
# ███   ███  ███      ███   ███  ███       ███  ███ 
# ███████    ███████   ███████    ███████  ███   ███

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
#  ███████   ███████   ███      ███       ███████   ████████    ███████    ███████
# ███       ███   ███  ███      ███      ███   ███  ███   ███  ███        ███     
# ███       █████████  ███      ███      █████████  ███████    ███  ████  ███████ 
# ███       ███   ███  ███      ███      ███   ███  ███   ███  ███   ███       ███
#  ███████  ███   ███  ███████  ███████  ███   ███  ███   ███   ███████   ███████ 

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
            if (this.tok in {◂comment_start, ◂then, ◂test}): 
                break
            expr = this.expression()
        (this.listless -= 1)
        (this.explicit -= 1)
        list
# █████████  ███   ███  ████████   ████████
#    ███      ███ ███   ███   ███  ███     
#    ███       █████    ████████   ███████ 
#    ███        ███     ███        ███     
#    ███        ███     ███        ████████

proc parseType(this : Parser) : Node = 
        var token = this.consume()
        token.tok = ◂type
        if (token.str == "ref"): 
            (token.str &= " ")
            var t = this.consume()
            (token.str &= t.str)
        if (this.tok == ◂square_open): 
            var opened = 0
            while (this.tok != ◂eof): 
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
# ███      ███   ███████  █████████
# ███      ███  ███          ███   
# ███      ███  ███████      ███   
# ███      ███       ███     ███   
# ███████  ███  ███████      ███   

proc parseParenList(this : Parser) : seq[Node] = 
        var token = this.consume() # (
        var args : seq[Node]
        (this.explicit += 1)
        while ((this.tok != ◂paren_close) and (this.tok != ◂eof)): 
            var exp = this.expression()
            if exp: 
                args.add(exp)
            else: 
                break
            this.swallow(◂comma)
        this.swallowError(◂paren_close, "Missing closing )", token)
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
                var exp = this.expression()
                if exp: 
                    args.add(exp)
                else: 
                    break
            else: 
                break
        this.swallowError(close, &"Missing closing {close}", token)
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
# █████████  ███   ███  ████████  ███   ███
#    ███     ███   ███  ███       ████  ███
#    ███     █████████  ███████   ███ █ ███
#    ███     ███   ███  ███       ███  ████
#    ███     ███   ███  ████████  ███   ███

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
#  ███████   ███████   ███      ███    
# ███       ███   ███  ███      ███    
# ███       █████████  ███      ███    
# ███       ███   ███  ███      ███    
#  ███████  ███   ███  ███████  ███████

proc lCall(this : Parser, callee : Node) : Node = 
        if (callee.token.line != this.current.line): return
        if (callee.kind in {●string, ●operation, ●preOp, ●postOp}): return
        # ⮐  if callee.token.tok in {◂string ◂number ◂assign ◂colon ◂comma ◂paren_open ◂bracket_open}
        var token = this.consume() # (
        var args = this.parseCallArgs(callee.token.col)
        this.swallowError(◂paren_close, "Missing closing paren for call arguments", token)
        Node(token: token, kind: ●call, callee: callee, callargs: args)
# ███  ██     ██  ████████   ███      ███   ███████  ███  █████████
# ███  ███   ███  ███   ███  ███      ███  ███       ███     ███   
# ███  █████████  ████████   ███      ███  ███       ███     ███   
# ███  ███ █ ███  ███        ███      ███  ███       ███     ███   
# ███  ███   ███  ███        ███████  ███   ███████  ███     ███   

proc isImplicitCallPossible(this : Parser) : bool = 
        if this.explicit: return false
        var currt = this.peek(0)
        if (currt.tok in noCallToks): return false
        var prevt = this.peek(-1)
        if (currt.col <= (prevt.col + ksegWidth(prevt.str))): return false
        if (this.returning and this.isTokAhead(◂if)): return false
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
# ███  ████████                             ███  ████████                               ███  ████████  
# ███  ███                                  ███  ███                                    ███  ███       
# ███  ██████                               ███  ██████                                 ███  ██████    
# ███  ███                                  ███  ███                                    ███  ███       
# ███  ███                                  ███  ███                                    ███  ███       

proc inline(this : Parser) : Node = 
        (this.inlinecall += 1)
        var e = this.expression()
        (this.inlinecall -= 1)
        this.swallowComment()
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
                this.swallowComment()
                if (this.tok == ◂indent): 
                    continue
            this.swallow(◂elif)
            this.swallowComment()
            if (this.tok in {◂then, ◂else}): 
                break # then without condition -> else
            condition = this.inline()
            then_branch = this.thenBlock()
            condThens.add(nod(●condThen, condition.token, condition, then_branch))
        var else_branch : Node
        if not outdent: 
            this.swallow(◂indent)
            if (this.tok in {◂else, ◂then}): 
                this.swallow() # else or then without condition
                this.swallowComment()
                else_branch = this.thenBlock()
        Node(token: token, kind: ●if, cond_thens: condThens, else_branch: else_branch)
# █████████   ███████   ███  ███         ███  ████████
#    ███     ███   ███  ███  ███         ███  ███     
#    ███     █████████  ███  ███         ███  ██████  
#    ███     ███   ███  ███  ███         ███  ███     
#    ███     ███   ███  ███  ███████     ███  ███     

proc lTailIf(this : Parser, left : Node) : Node = 
        if this.returning: return
        if (left.token.line != this.current.line): return
        var token = this.consume()
        var condition = this.expression()
        var condThen = nod(●condThen, condition.token, condition, left)
        Node(token: token, kind: ●if, cond_thens: @[condThen])
# ████████   ███████   ████████ 
# ███       ███   ███  ███   ███
# ██████    ███   ███  ███████  
# ███       ███   ███  ███   ███
# ███        ███████   ███   ███

proc rFor(this : Parser) : Node = 
        var token = this.consume()
        var for_value = this.parseNamesUntil(◂in)
        this.swallowError(◂in, "Expected 'in' after for value", token)
        var for_range = this.expression()
        var for_body = this.thenBlock()
        nod(●for, token, for_value, for_range, for_body)

proc rWhile(this : Parser) : Node = 
        nod(●while, this.consume(), this.expression(), this.thenBlock())
#  ███████  ███   ███  ███  █████████   ███████  ███   ███
# ███       ███ █ ███  ███     ███     ███       ███   ███
# ███████   █████████  ███     ███     ███       █████████
#      ███  ███   ███  ███     ███     ███       ███   ███
# ███████   ██     ██  ███     ███      ███████  ███   ███

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
        this.swallowError(◂indent, "Expected indentation after switch statement", token)
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
        if ((this.peek(-1).col + this.peek(-1).str.len) < this.current.col): return
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

proc rLet(this : Parser) : Node = nod(●let, this.consume(), this.parseVar())

proc rReturnType(this : Parser) : Node = nod(●signature, this.consume(), nil, this.parseType())

proc rQuote(this : Parser) : Node = nod(●quote, this.consume(), this.thenBlock())

proc lSemiColon(this : Parser, left : Node) : Node = 
        if (this.peek(1).tok notin {◂indent, ◂eof}): 
            var token = this.consume()
            var right = this.expression(token)
            if (right.kind == ●semicolon): 
                right.expressions.unshift(left)
                return right
            return nod(●semicolon, token, @[left, right])
#  ███████  █████████  ████████   ███  ███   ███   ███████ 
# ███          ███     ███   ███  ███  ████  ███  ███      
# ███████      ███     ███████    ███  ███ █ ███  ███  ████
#      ███     ███     ███   ███  ███  ███  ████  ███   ███
# ███████      ███     ███   ███  ███  ███   ███   ███████ 

proc rString(this : Parser) : Node = 
        var token = this.consume() # string start
        if (this.tok == ◂string_end): 
            this.swallow()
            Node(token: token, kind: ●string, string_content: nod(●literal, tkn(◂string)))
        else: 
            var string_content : Node
            if (this.tok != ◂stripol_start): 
                string_content = nod(●literal, this.consume())
            else: 
                string_content = nod(●literal, tkn(◂string, "", this.current.line, this.current.col))
            var string_stripols : seq[Node]
            while (this.tok notin {◂string_end, ◂eof}): 
                this.swallowError(◂stripol_start, "Expected string interpolation start", token)
                var stripol = nod(●stripol, this.current)
                var stripol_xprssns : seq[Node]
                while (this.tok notin {◂stripol_end, ◂eof}): 
                    var xpr = this.expression()
                    stripol_xprssns.add(xpr)
                stripol.stripol_xprssns = stripol_xprssns
                this.swallowError(◂stripol_end, "Expected string interpolation end", token)
                if (this.tok notin {◂stripol_start, ◂string_end, ◂eof}): 
                    stripol.stripol_content = nod(●literal, this.consume())
                elif (this.tok == ◂stripol_start): 
                    stripol.stripol_content = nod(●literal, tkn(◂string, this.current.line, this.current.col))
                string_stripols.add(stripol)
            this.swallowError(◂string_end, "Expected closing string delimiter", token)
            Node(token: token, kind: ●string, string_content: string_content, string_stripols: string_stripols)

proc rUse(this : Parser) : Node = 
        var token = this.consume()
        (this.explicit += 1)
        var use_module = this.parseModule()
        if (not this.atEnd() and (this.current.line == token.line)): 
            var use_kind = this.rSymbol()
            var use_items = this.parseNames()
            (this.explicit -= 1)
            Node(token: token, kind: ●use, use_module: use_module, use_kind: use_kind, use_items: use_items)
        else: 
            (this.explicit -= 1)
            Node(token: token, kind: ●use, use_module: use_module)

proc rComment(this : Parser) : Node = 
        var n = nod(●comment, this.consume(), Node(token: this.consume()))
        this.swallow(◂comment_end)
        n

proc lReturnType(this : Parser, left : Node) : Node = 
        if (not this.isTokAhead(◂func) and not this.isTokAhead(◂method)): return
        if (left.kind in {●list, ●arg, ●operation}): 
            if (left.kind == ●operation): 
                if (left.token.tok == ◂assign): 
                    var sig = this.rReturnType()
                    var argtoken = tkn(◂val_type, "", left.token.line, left.token.col)
                    var argNode = nod(●arg, argtoken, nil, left.operand_left, left.operand_right)
                    sig.sig_args = nod(●list, left.token, @[argNode])
                    return sig
            elif (left.kind == ●list): 
                var sig = this.rReturnType()
                sig.sig_args = left
                return sig
            elif (left.kind == ●arg): 
                var sig = this.rReturnType()
                sig.sig_args = nod(●list, left.token, @[left])
                return sig

proc rArg(this : Parser) : Node = 
        var token = this.consume() # ◆ or ◇
        if this.typeless: 
            var nameToken = this.consume()
            nameToken.tok = ◂name
            nameToken.str = token.str & nameToken.str
            nameToken.col = token.col
            return nod(●literal, nameToken)
        var arg_type = this.parseType()
        var arg_name = this.value()
        var arg_value : Node
        if (this.tok == ◂assign): 
            var t = this.consume() # =
            arg_value = this.expression()
        nod(●arg, token, arg_type, arg_name, arg_value)

proc lVar(this : Parser, left : Node) : Node = 
        if (left.token.tok != ◂name): return
        var token = this.consume() # ◆ or ◇
        var var_type = this.parseType()
        var var_value : Node
        if (this.tok == ◂assign): 
            var t = this.consume() # =
            var_value = this.expression()
        nod(●var, token, left, var_type, var_value)

proc lSymbolList(this : Parser, left : Node) : Node = 
        if this.listless: return
        case left.kind:
            of ●list: 
                var list_values = left.list_values
                # todo: check if all list items are symbols?
                list_values.add(this.rSymbol())
                return nod(●list, left.token, list_values)
            of ●literal: 
                if (left.token.tok != ◂name): 
                    return
                var list_values : seq[Node]
                list_values.add(left)
                list_values.add(this.rSymbol())
                return nod(●list, left.token, list_values)
            else: 
                discard

proc lArgList(this : Parser, left : Node) : Node = 
        case left.kind:
            of ●list: 
                var list_values = left.list_values
                list_values.add(this.rArg())
                return nod(●list, left.token, list_values)
            of ●arg: 
                var list_values : seq[Node]
                list_values.add(left)
                list_values.add(this.rArg())
                return nod(●list, left.token, list_values)
            of ●literal: 
                if (left.token.tok == ◂name): 
                    return this.lVar(left)
            else: 
                discard
# ████████  ███   ███  ███   ███   ███████
# ███       ███   ███  ████  ███  ███     
# ██████    ███   ███  ███ █ ███  ███     
# ███       ███   ███  ███  ████  ███     
# ███        ███████   ███   ███   ███████

proc lFunc(this : Parser, left : Node) : Node = 
        if (left.kind notin {●signature, ●list, ●arg, ●operation, ●range}): return
        var func_signature : Node
        if (left.kind == ●operation): 
            # log "lfunc op #{left}"
            if (left.token.tok != ◂assign): return
            if (left.operand_left.token.tok != ◂name): return
            if (left.operand_left.token.col == 0): 
                var left = left
                var argtoken = tkn(◂val_type, left.operand_right.token.line, left.operand_right.token.col)
                left.operand_right = this.lFunc(nod(●arg, argtoken, nil, left.operand_right, nil))
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
        elif (left.kind == ●range): 
            # log "left range #{left}"
            var sig_args = nod(●list, left.token, @[left])
            func_signature = nod(●signature, left.token, sig_args, nil)
        elif (left.kind == ●signature): 
            func_signature = left
        else: 
            echo(&"unhandled left {left.kind}")
        var firstToken = this.firstLineToken()
        var token = this.consume()
        var func_mod : Node
        if (this.tok == ◂mod): 
            func_mod = this.rLiteral()
        var func_body = this.thenIndented(firstToken)
        nod(●func, token, func_signature, func_mod, func_body)

proc rFunc(this : Parser) : Node = 
        var firstToken = this.firstLineToken()
        var token = this.consume()
        var func_mod : Node
        if (this.tok == ◂mod): 
            func_mod = this.rLiteral()
        var func_body = this.thenIndented(firstToken)
        nod(●func, token, nil, nil, func_body)

proc parseSignature(this : Parser) : Node = 
        var sig_args = nod(●list, this.current(), @[])
        var sig_type : Node
        var parens = false
        if (this.tok == ◂paren_open): 
            this.swallow()
            parens = true
        while true: 
            var token = this.current()
            var arg_type : Node = nil
            if (this.tok in {◂var_type, ◂val_type}): 
                this.swallow() # ◆ or ◇
                arg_type = this.parseType()
            if (this.tok != ◂name): 
                break
            var arg_name = this.value()
            var arg_value : Node
            if (this.tok == ◂assign): 
                this.swallow() # =
                (this.listless += 1)
                (this.explicit += 1)
                arg_value = this.expression()
                (this.explicit -= 1)
                (this.listless -= 1)
            this.swallow(◂comma)
            sig_args.list_values.add(nod(●arg, token, arg_type, arg_name, arg_value))
        if parens: 
            if (this.tok != ◂paren_close): return
            this.swallow()
        if (this.tok == ◂then): 
            this.swallow()
            sig_type = this.parseType()
        if (this.tok notin {◂func, ◂method}): 
            return
        nod(●signature, sig_args.token, sig_args, sig_type)

proc funcOrExpression(this : Parser, token : Token) : Node = 
        var col = this.lineIndent(token.line)
        if (this.isTokAhead(◂func) or this.isTokAhead(◂method)): 
            var startPos = this.pos
            var func_signature : Node
            if (this.tok notin {◂func, ◂method}): 
                func_signature = this.parseSignature()
            if (this.tok in {◂func, ◂method}): 
                var ftoken = this.consume()
                var func_mod = if (this.tok == ◂mod): this.rLiteral() else: nil
                var func_body = this.expressionOrIndentedBlock(tkn(◂null), col)
                return nod(●func, ftoken, func_signature, func_mod, func_body)
            else: 
                this.pos = startPos
        this.expressionOrIndentedBlock(token, col)

proc rReturn(this : Parser) : Node = 
        var token = this.consume()
        if ((this.tok == ◂if) and this.isThenlessIf(token)): 
            nod(●return, token, nil)
        else: 
            this.returning = true
            var right : Node
            if ((this.tok != ◂indent) or this.isNextLineIndented(token)): 
                right = this.expression(token)
            this.returning = false
            nod(●return, token, right)

proc rDiscard(this : Parser) : Node = 
        var token = this.consume()
        if this.isDedent(token.col): 
            nod(●discard, token, nil)
        else: 
            nod(●discard, token, this.value())
#  ███████   ████████   ████████  ████████    ███████   █████████  ███   ███████   ███   ███
# ███   ███  ███   ███  ███       ███   ███  ███   ███     ███     ███  ███   ███  ████  ███
# ███   ███  ████████   ███████   ███████    █████████     ███     ███  ███   ███  ███ █ ███
# ███   ███  ███        ███       ███   ███  ███   ███     ███     ███  ███   ███  ███  ████
#  ███████   ███        ████████  ███   ███  ███   ███     ███     ███   ███████   ███   ███

proc lOperation(this : Parser, left : Node) : Node = 
        var token = this.consume()
        var right = this.expression(token)
        nod(●operation, token, left, right)

proc lNotIn(this : Parser, left : Node) : Node = 
        if (this.peek(1).tok == ◂in): 
            var token = this.consume()
            token.str = "notin"
            token.tok = ◂notin
            this.swallow()
            var right = this.expression(token)
            return nod(●operation, token, left, right)

proc lPostOp(this : Parser, left : Node) : Node = 
        nod(●postOp, this.consume(), left)

proc rPreOp(this : Parser) : Node = 
        var token = this.consume()
        var right = this.expression(token)
        nod(●preOp, token, right)

proc rDollar(this : Parser) : Node = 
        if (this.current.str.len > 1): 
            var token = this.consume()
            token.tok = ◂name
            return nod(●literal, token)
        if (this.peek(1).tok in {◂assign, ◂colon}): 
            var token = this.consume()
            token.tok = ◂name
            return nod(●literal, token)
        this.rPreOp()

proc lAssign(this : Parser, left : Node) : Node = 
        var token = this.consume()
        var right = this.funcOrExpression(token)
        nod(●operation, token, left, right)

proc lRange(this : Parser, left : Node) : Node = 
        if this.isTokAhead(◂func): return
        var token = this.consume()
        var right = this.expression(token)
        nod(●range, token, left, right)

proc rRange(this : Parser) : Node = 
        var token = this.consume()
        var right : Node
        if ((this.tok notin {◂paren_close}) and not this.isTokAhead(◂func)): 
            right = this.expression(token)
        nod(●range, token, nil, right)

proc rParenExpr(this : Parser) : Node = 
        nod(●list, this.current, this.parseParenList())

proc rCurly(this : Parser) : Node = 
        nod(●curly, this.current, this.parseDelimitedList(◂bracket_open, ◂bracket_close))

proc rSquarely(this : Parser) : Node = 
        nod(●squarely, this.current, this.parseDelimitedList(◂square_open, ◂square_close))

proc rEnum(this : Parser) : Node = 
        var token = this.consume()
        var enum_name = this.value()
        var enum_body : Node
        if this.isNextLineIndented(token): 
            this.typeless = true
            enum_body = this.parseBlock()
            this.typeless = false
        nod(●enum, token, enum_name, enum_body)

proc rClass(this : Parser) : Node = 
        var token = this.consume()
        if (this.tok != ◂name): 
            return nod(●literal, token)
        (this.explicit += 1)
        var name = this.value()
        var parent : Node
        if (this.current.str == "extends"): 
            this.swallow()
            parent = this.value()
        (this.explicit -= 1)
        nod(●class, token, name, parent, this.parseBlock())

proc rStruct(this : Parser) : Node = 
        var token = this.consume()
        var name = this.value()
        var parent : Node
        if (this.current.str == "extends"): 
            this.swallow()
            parent = this.value()
        nod(●struct, token, name, parent, this.parseBlock())

proc lMember(this : Parser, left : Node) : Node = 
        var token = this.consume()
        token.col = left.token.col
        var right = this.funcOrExpression(token)
        nod(●member, token, left, right)

proc lTestCase(this : Parser, left : Node) : Node = 
        if this.listless: return
        var token = this.consume() # ▸
        this.swallow(◂indent) # todo: check if indent is larger than that of the test expression
        var right = this.expression()
        nod(●testCase, token, left, right)

proc rTestSuite(this : Parser) : Node = 
        var token = this.consume() # ▸
        var test_block = this.thenBlock()
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
        if this.failed: return nil
        var token = this.current
        if (token.tok in {◂eof, ◂stripol_end, ◂paren_close}): 
            return nil
        var rhs = this.rightHandSide(token)
        if (rhs == nil): 
            # ⮐  @error "Expected expression but found #{token.str} #{token}" token
            return this.error(&"Expected expression but found {token.str}", token)
        var node = this.rhs()
        if (precedenceRight < -1): 
            return node
        while not this.atEnd(): 
            token = this.current
            var precedence = this.getPrecedence(token)
            if (token.tok in {◂assign, ◂test, ◂semicolon}): 
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

proc pratt(this : Parser, t : tok, lhs : LHS, rhs : RHS, precedence : int) = 
        if (this.pratts.len <= t.ord): 
            this.pratts.setLen((t.ord + 1))
        this.pratts[t.ord] = Pratt(lhs: lhs, rhs: rhs, precedence: precedence)
#  ███████  ████████  █████████  ███   ███  ████████ 
# ███       ███          ███     ███   ███  ███   ███
# ███████   ███████      ███     ███   ███  ████████ 
#      ███  ███          ███     ███   ███  ███      
# ███████   ████████     ███      ███████   ███      

proc setup(this : Parser) = 
        this.pratt(◂semicolon, lSemiColon, nil, 0)
        this.pratt(◂true, nil, rLiteral, 0)
        this.pratt(◂false, nil, rLiteral, 0)
        this.pratt(◂mod, nil, rLiteral, 0)
        this.pratt(◂null, nil, rLiteral, 0)
        this.pratt(◂number, nil, rLiteral, 0)
        this.pratt(◂string_start, nil, rString, 0)
        this.pratt(◂comment_start, nil, rComment, 0)
        this.pratt(◂verbatim, nil, rLiteral, 0)
        this.pratt(◂use, nil, rUse, 0)
        this.pratt(◂let, nil, rLet, 0)
        this.pratt(◂var, nil, rLet, 0)
        this.pratt(◂return, nil, rReturn, 0)
        this.pratt(◂discard, nil, rDiscard, 0)
        this.pratt(◂quote, nil, rQuote, 0)
        this.pratt(◂test, lTestCase, rTestSuite, 0)
        this.pratt(◂class, nil, rClass, 0)
        this.pratt(◂struct, nil, rStruct, 0)
        this.pratt(◂enum, nil, rEnum, 0)
        this.pratt(◂continue, nil, rKeyword, 0)
        this.pratt(◂break, nil, rKeyword, 0)
        this.pratt(◂colon, lMember, nil, 10)
        this.pratt(◂assign, lAssign, nil, 10)
        this.pratt(◂plus_assign, lAssign, nil, 10)
        this.pratt(◂minus_assign, lAssign, nil, 10)
        this.pratt(◂divide_assign, lAssign, nil, 10)
        this.pratt(◂multiply_assign, lAssign, nil, 10)
        this.pratt(◂ampersand_assign, lAssign, nil, 10)
        this.pratt(◂qmark_assign, lAssign, nil, 10)
        this.pratt(◂name, lSymbolList, rSymbol, 13) # higher than assign
        this.pratt(◂if, lTailIf, rIf, 20)
        this.pratt(◂when, nil, rIf, 20)
        this.pratt(◂for, nil, rFor, 20)
        this.pratt(◂switch, nil, rSwitch, 20)
        this.pratt(◂while, nil, rWhile, 20)
        this.pratt(◂func, lFunc, rFunc, 20)
        this.pratt(◂method, lFunc, rFunc, 20)
        this.pratt(◂or, lOperation, nil, 30)
        this.pratt(◂and, lOperation, nil, 31)
        this.pratt(◂is, lOperation, nil, 32)
        this.pratt(◂in, lOperation, nil, 33)
        this.pratt(◂notin, lOperation, nil, 34)
        this.pratt(◂equal, lOperation, nil, 40)
        this.pratt(◂not_equal, lOperation, nil, 40)
        this.pratt(◂greater_equal, lOperation, nil, 40)
        this.pratt(◂less_equal, lOperation, nil, 40)
        this.pratt(◂less, lOperation, nil, 40)
        this.pratt(◂greater, lOperation, nil, 40)
        this.pratt(◂match, lOperation, nil, 40)
        this.pratt(◂doubledot, lRange, nil, 40)
        this.pratt(◂tripledot, lRange, rRange, 40)
        this.pratt(◂dollar, nil, rDollar, 41)
        this.pratt(◂ampersand, lOperation, nil, 42)
        this.pratt(◂plus, lOperation, nil, 50)
        this.pratt(◂minus, lOperation, rPreOp, 50)
        this.pratt(◂multiply, lOperation, nil, 60)
        this.pratt(◂divide, lOperation, nil, 60)
        this.pratt(◂not, lNotIn, rPreOp, 70)
        this.pratt(◂increment, lPostOp, nil, 80)
        this.pratt(◂decrement, lPostOp, nil, 80)
        this.pratt(◂square_open, lArrayAccess, rSquarely, 90)
        this.pratt(◂paren_open, lCall, rParenExpr, 90)
        this.pratt(◂bracket_open, nil, rCurly, 90)
        this.pratt(◂then, lReturnType, rReturnType, 99)
        this.pratt(◂val_type, lArgList, rArg, 100)
        this.pratt(◂var_type, lArgList, rArg, 100)
        this.pratt(◂dot, lPropertyAccess, nil, 102)
#  ███████    ███████  █████████
# ███   ███  ███          ███   
# █████████  ███████      ███   
# ███   ███       ███     ███   
# ███   ███  ███████      ███   

proc ast*(text : string, lang : string) : Node = 
    # profileStart 'tknz'
    var tokens = tokenize(text, lang)
    # profileStop 'tknz'
    # log &"ast* {tokens}"
    # profileStart 'pars'
    var p = Parser(tokens: tokens, pos: 0, text: text, lang: lang)
    p.setup()
    var b = p.parseBlock()
    # profileStop 'pars'
    if p.failed: return nil
    b