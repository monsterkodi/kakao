
import std/[strformat, strutils]
import kommon
import lexi

type
    NodeKind* = enum
    
        ●error,
        ●block,
        ●comment,
        ●literal,
        ●identifier,  
        ●preOp, 
        ●operation, 
        ●postOp,
        ●call,
        ●if, 
        ●condThen,
        ●for, 
        ●while,
        ●switch,
        ●switchCase,
        ●var,        
        ●propertyAccess,        
        ●func, 
        ●arg,
        ●return, 
        ●break, 
        ●continue,          
        ●use, 
        ●class,
        ●enum,
        ●eof
    
    # ███   ███   ███████   ███████    ████████
    # ████  ███  ███   ███  ███   ███  ███     
    # ███ █ ███  ███   ███  ███   ███  ███████ 
    # ███  ████  ███   ███  ███   ███  ███     
    # ███   ███   ███████   ███████    ████████

    Node* = ref object

        token : Token
            
        case kind*: NodeKind:
        
            of ●block:
                
                expressions*    : seq[Node]
        
            of ●operation:
            
                left*           : Node
                right*          : Node
                
            of ●postOp, ●preOp:
            
                operand*        : Node 
                
            of ●return:
            
                return_value*   : Node  

            of ●call:
            
                callee*         : Node
                call_args*      : seq[Node]

            of ●propertyAccess:
            
                owner*          : Node
                property*       : Node
                
            of ●if :
            
                cond_thens*     : seq[Node]
                `else`*         : Node
                
            of ●condThen:
            
                cond*           : Node
                then*           : Node
                
            of ●switch:
                
                switch_value*   : Node
                switch_cases*   : seq[Node]
                switch_default* : Node
                
            of ●switchCase:
            
                case_when*      : seq[Node]
                case_then*      : Node
                
            of ●while:
            
                while_cond*     : Node
                while_body*     : Node
                
            of ●for:
            
                for_value*      : Node
                for_range*      : Node
                for_body*       : Node
                
            of ●var:
            
                var_name*       : Node
                var_type*       : Node
                var_value*      : Node
                
            of ●func:
            
                func_name*      : Node
                func_type*      : Node
                func_args*      : Node
                func_body*      : Node
                
            else:
                discard
                
template choose*(cond, a, b: untyped): untyped =

    when typeof(cond) is bool:
        if cond :
            a 
        else :
            b
    elif typeof(cond) is ref:
        if cond != nil :
            a 
        else :
            b
    else:
        {.error: "Condition must be bool or ref type".}

# ████████    ███████   ████████    ███████  ████████  ████████ 
# ███   ███  ███   ███  ███   ███  ███       ███       ███   ███
# ████████   █████████  ███████    ███████   ███████   ███████  
# ███        ███   ███  ███   ███       ███  ███       ███   ███
# ███        ███   ███  ███   ███  ███████   ████████  ███   ███

type

    RHS = proc(p: var Parser): Node
    LHS = proc(p: var Parser, left: Node): Node
    
    Pratt = object
        rhs: RHS
        lhs: LHS
        precedence: int
         
    Parser* = object
    
        tokens* : seq[Token]
        pratts* : seq[Pratt]
        pos*    : int
    
    ParseError* = object
    
        msg*    : string
        line*   : int
        col*    : int


proc current*(p: Parser): Token =

    if p.pos < p.tokens.len:
        return  p.tokens[p.pos]
        
    Token(tok:◆eof)
    
proc tok*(p: Parser) : tok = p.current().tok

# ████████   ████████   ███  ███   ███  █████████  
# ███   ███  ███   ███  ███  ████  ███     ███     
# ████████   ███████    ███  ███ █ ███     ███     
# ███        ███   ███  ███  ███  ████     ███     
# ███        ███   ███  ███  ███   ███     ███     

proc `$`*(p: Parser): string = 

    let s = &"▪▪▪ {p.current()}"
    s

proc `$`*(n: Node): string = 

    var s = &"{n.token.tok}"
    
    case n.kind:
        of ●block:
            for e in n.expressions:
                s &= &"\n {e}"
        of ●operation:
            s = &"({n.left} {s} {n.right})"
        of ●preOp:
            s = &"({s} {n.operand})"
        of ●postOp:
            s = &"({n.operand} {s})"
        of ●return:
            let e = choose(n.return_value, &" {n.return_value}", "")
            s = &"({s}{e})"
        of ●call:
            s = &"({n.callee} {s} {n.callargs})"
        of ●propertyAccess:
            s = &"({n.owner} {s} {n.property})"
        of ●if:
            let e = choose(n.else, &" {n.else}", "")
            s = &"({s} {n.cond_thens}{e})"
        of ●condThen:
            s = &"({n.cond} {n.then})"
        of ●switch:
            let e = choose(n.switch_default, &" {n.switch_default}", "")
            s = &"({s} {n.switch_value} {n.switch_cases}{e})"
        of ●switchCase:
            s = &"({n.case_when} {n.case_then})"
        of ●for :
            s = &"({s} {n.for_value} {n.for_range} {n.for_body})"
        of ●while:
            s = &"({s} {n.while_cond} {n.while_body})"
        of ●func:
            s = &"({s} {n.func_name} {n.func_type} {n.func_args}) {n.func_body})"
        else:
            discard
    s

proc formatValue*(result:var string, n:Node,   specifier: string) = result.add $n
proc formatValue*(result:var string, p:Parser, specifier: string) = result.add $p
proc error*(p: var Parser, msg: string) : Node =

    echo &"parse error: {msg}"
    nil
    
#  ███████   ███████   ███   ███   ███████  ███   ███  ██     ██  ████████
# ███       ███   ███  ████  ███  ███       ███   ███  ███   ███  ███     
# ███       ███   ███  ███ █ ███  ███████   ███   ███  █████████  ███████ 
# ███       ███   ███  ███  ████       ███  ███   ███  ███ █ ███  ███     
#  ███████   ███████   ███   ███  ███████    ███████   ███   ███  ████████

proc consume(p: var Parser): Token =

    let t = p.current()
    if p.pos < p.tokens.len:
        p.pos += 1
    t

proc swallow(p: var Parser) =

    discard p.consume()

proc swallow(p: var Parser, tok: tok) =

    if p.tok() == tok:
        p.swallow()
        
proc swallowError(p: var Parser, tok: tok, err: string) = 

    if p.tok() != tok:
        discard p.error(err)
        return  
    p.swallow()
    
proc peek*(p: Parser, ahead: int = 1): Token =

    p.tokens[p.pos + ahead]
    
proc getPrecedence(p: Parser, token: Token): int =

    if token.tok.ord < p.pratts.len:
        return  p.pratts[token.tok.ord].precedence
    0
    
proc rightHandSide(p: Parser, token: Token): RHS =

    if token.tok.ord < p.pratts.len:
        return  p.pratts[token.tok.ord].rhs

proc leftHandSide(p: Parser, token: Token): LHS =

    if token.tok.ord < p.pratts.len:
        return  p.pratts[token.tok.ord].lhs

# ████████  ███   ███  ████████   ████████   ████████   ███████   ███████  ███   ███████   ███   ███
# ███        ███ ███   ███   ███  ███   ███  ███       ███       ███       ███  ███   ███  ████  ███
# ███████     █████    ████████   ███████    ███████   ███████   ███████   ███  ███   ███  ███ █ ███
# ███        ███ ███   ███        ███   ███  ███            ███       ███  ███  ███   ███  ███  ████
# ████████  ███   ███  ███        ███   ███  ████████  ███████   ███████   ███   ███████   ███   ███

proc expression(p: var Parser, precedenceRight = 0): Node =

    let token = p.current()
    
    if token.tok == ◆eof:
        return  nil
    
    let rhs = p.rightHandSide(token)
    
    if rhs == nil:
    
        if token.tok == ◆else:
            return  nil
        return  p.error(&"expected expression but found: {token}")
        
    var left: Node = rhs(p)

    while true:
        
        let token = p.current()
        var precedence = p.getPrecedence(token)
        
        if token.tok == ◆assign:
            precedence += 1
        
        if precedenceRight >= precedence:
            break
    
        let lhs = p.leftHandSide(token)
        if lhs == nil:
            break
            
        left = lhs(p, left)
    
    left
    
proc expression(p: var Parser, tokenRight:Token ): Node =

    expression(p, p.getPrecedence(tokenRight))

# ███████    ███       ███████    ███████  ███   ███
# ███   ███  ███      ███   ███  ███       ███  ███ 
# ███████    ███      ███   ███  ███       ███████  
# ███   ███  ███      ███   ███  ███       ███  ███ 
# ███████    ███████   ███████    ███████  ███   ███

proc parseBlock*(p: var Parser): Node =

    var expressions = default seq[Node]
    var expr : Node = p.expression()
    while expr != nil:
        expressions.add expr
        expr = p.expression()
    
    Node(token:Token(tok:◆root), kind:●block, expressions:expressions)

proc parse*(p: var Parser): Node = 

    parseBlock(p)
    
# ███  ████████
# ███  ███     
# ███  ██████  
# ███  ███     
# ███  ███     

proc parseIf*(p: var Parser): Node =

    let token = p.consume() # if
    
    var condThens: seq[Node] = @[]
    
    p.swallow ◆indent # block indentation
    
    var cond = p.expression() # initial condition
            
    p.swallowError(◆then, "Expected 'then' after if condition") # initial then
    
    var then = p.expression()
    
    condThens.add(Node(kind:●condThen, cond:cond, then:then))
    
    while p.tok() in {◆elif, ◆indent}:
    
        p.swallow() # elif or indent
        
        if p.tok() == ◆then:
            break # then without condition -> else
        
        cond = p.expression()
        
        p.swallowError(◆then, "Expected 'then' after elif condition")
            
        then = p.expression()
        
        condThens.add(Node(kind:●condThen, cond:cond, then:then))
        
    var `else`: Node
    
    if p.tok() in {◆else, ◆then}:
        p.swallow() # else or then without condition
        `else` = p.expression()
    
    Node(
        token:      token,
        kind:       ●if,
        cond_thens: condThens,
        `else`:     `else`
        )

#  ███████  ███   ███  ███  █████████   ███████  ███   ███
# ███       ███ █ ███  ███     ███     ███       ███   ███
# ███████   █████████  ███     ███     ███       █████████
#      ███  ███   ███  ███     ███     ███       ███   ███
# ███████   ██     ██  ███     ███      ███████  ███   ███

proc parseSwitchCase(p: var Parser, caseStartIndent: int): Node =

    var case_when = default seq[Node]
    let case_token = p.current()

    while true:
        let current_tok = p.tok()
        let current_token = p.current()

        if current_tok == ◆then:
            p.swallow()
            break
        elif current_tok == ◆eof:
            return  p.error("Expected '➜', end of case matches, or 'else'/'➜' for default but found EOF")
        elif current_tok == ◆indent:
            if current_token.str.len < caseStartIndent:
                break
            elif current_token.str.len == caseStartIndent:
                p.swallow()
                continue
            else :
                break
        else:
            let expr = p.expression()
            if expr == nil :
                return  p.error("Failed to parse match expression")
            case_when.add(expr)

    var case_then_node: Node = nil

    if p.tok() == ◆indent and p.current().str.len > caseStartIndent:
        p.swallow()
        case_then_node = p.expression()
        if case_then_node == nil:
            return  p.error("Expected 'then' expression after indentation")
    else:
        let current_tok_after_when = p.tok()
        let current_token_after_when = p.current()

        if current_tok_after_when == ◆eof or current_tok_after_when in {◆else, ◆then} or (current_tok_after_when == ◆indent and current_token_after_when.str.len <= caseStartIndent) :

            if case_when.len == 0:
                return  p.error("Switch case must have at least one match expression")
            return  p.error("Expected 'then' expression after switch case matches")

        case_then_node = p.expression()
        if case_then_node == nil:
             return  p.error("Expected 'then' expression after switch case matches")

    if case_when.len == 0:
        return  p.error(&"Switch case must have at least one match expression")

    Node(
        token:      case_token,
        kind:       ●switchCase,
        case_when:  case_when,
        case_then:  case_then_node
        )

proc parseSwitch*(p: var Parser): Node =

    let token = p.consume() # "switch"
    let switch_value = p.expression() # the value being switched on
    if switch_value == nil :
        return  p.error("Expected value after switch keyword")

    var switch_cases = default seq[Node]
    var switch_default: Node = nil

    let initial_indent_token = p.current()
    let case_indent = initial_indent_token.str.len

    p.swallowError(◆indent, "Expected indentation after switch statement value")

    if p.tok() == ◆eof :
        return  p.error("Expected switch cases but found end of file instead")

    while true:
        let current_tok   = p.tok()
        let current_token = p.current()

        if current_tok in {◆else, ◆then, ◆eof}  :
            break

        if current_tok == ◆indent:
            if current_token.str.len < case_indent:
                break
            elif current_token.str.len == case_indent:
                let peek_token = p.peek()
                if peek_token.tok in {◆else, ◆then}:
                    break
                else:
                    p.swallow()
                    continue
            else :
                return  p.error(&"Unexpected indentation level for a new switch case")
        else:
            let case_node = p.parseSwitchCase(case_indent)
            if case_node == nil :
                return  nil
            switch_cases.add(case_node)

    if p.tok() == ◆indent and p.current().str.len == case_indent:
        p.swallow()

    if p.tok() in {◆else, ◆then} :
    
        p.swallow() # "else" or "➜"

        if p.tok() == ◆indent and p.current().str.len > case_indent:
             p.swallow()

        switch_default = p.expression()
        if switch_default == nil:
            return  p.error(&"Expected default expression after 'else' or '➜'")

    Node(
        token:          token, 
        kind:           ●switch,
        switch_value:   switch_value,
        switch_cases:   switch_cases,
        switch_default: switch_default
        )
     
# proc parseFor*(p: var Parser): Node =
# 
# proc parseFunction*(p: var Parser): Node =
# 
# proc parseVariable*(p: var Parser): Node =
    
proc parseArg(p: var Parser): Node =

    let token = p.consume()
    Node(token:token, kind:●arg)

proc parseArgs(p: var Parser): seq[Node] =

    var args = default seq[Node]
    while p.peek().tok != ◆paren_close:
        args.add p.parseArg()
    args    
    
proc parsePropertyAccess(p: var Parser, owner: Node): Node =

    let token = p.consume()
    let right = p.expression(token)
    Node(token:token, kind:●propertyAccess, owner:owner, property:right)

proc parseCall(p: var Parser, callee: Node): Node =
    
    let token = p.consume()
    let args  = p.parseArgs()
    Node(token:token, kind:●call, callee:callee, callargs:args)

proc parseLiteral(p: var Parser): Node =

    let token = p.consume()
    Node(token:token, kind: ●literal)

proc parseString(p: var Parser): Node =

    p.swallow() # string start
    let token = p.consume()
    p.swallowError(◆string_end, "Expected closing string delimiter")
    Node(token:token, kind: ●literal)

proc parsePostOp(p: var Parser, left: Node): Node =

    let token = p.consume()
    Node(token:token, kind: ●postOp, operand:left)

proc parsePreOp(p: var Parser): Node =

    let token = p.consume()
    let right = p.expression(token)
    Node(token:token, kind:●preOp, operand:right)

proc parseReturn(p: var Parser): Node =

    let token = p.consume()
    let right = p.expression(token)
    Node(token:token, kind:●return, return_value:right)

proc parseOperation(p: var Parser, left: Node): Node =

    let token = p.consume()
    let right = p.expression(token)
    Node(token:token, kind: ●operation, left: left, right: right)
        
proc parseParenExpr(p: var Parser): Node =

    discard p.consume() # "("
    let expr = p.expression()
    p.swallowError(◆paren_close, "Expected closing parenthesis")
    expr
        
#  ███████  ████████  █████████  ███   ███  ████████ 
# ███       ███          ███     ███   ███  ███   ███
# ███████   ███████      ███     ███   ███  ████████ 
#      ███  ███          ███     ███   ███  ███      
# ███████   ████████     ███      ███████   ███      

proc register(p: var Parser, t:tok, pratt: Pratt) =

    if p.pratts.len <= t.ord:
        p.pratts.setLen(t.ord + 1)
    p.pratts[t.ord] = pratt

proc setup(p: var Parser) =

    p.register(◆number,         Pratt(                      rhs: parseLiteral,      precedence: 0))
    p.register(◆string_start,   Pratt(                      rhs: parseString,       precedence: 0))
    p.register(◆true,           Pratt(                      rhs: parseLiteral,      precedence: 0))
    p.register(◆false,          Pratt(                      rhs: parseLiteral,      precedence: 0))
    p.register(◆null,           Pratt(                      rhs: parseLiteral,      precedence: 0))
    p.register(◆name,           Pratt(                      rhs: parseLiteral,      precedence: 0))
    
    p.register(◆return,         Pratt(                      rhs: parseReturn,       precedence: 5))
                                
    p.register(◆assign,         Pratt(lhs: parseOperation,                          precedence: 10))
                                                                                    
    p.register(◆if,             Pratt(rhs: parseIf,                                 precedence: 15))  
    p.register(◆switch,         Pratt(rhs: parseSwitch,                             precedence: 15))  
                                                                                    
    p.register(◆equal,          Pratt(lhs: parseOperation,                          precedence: 20))
    
    p.register(◆or,             Pratt(lhs: parseOperation,                          precedence: 22))
    p.register(◆and,            Pratt(lhs: parseOperation,                          precedence: 25))
    
    p.register(◆plus,           Pratt(lhs: parseOperation,                          precedence: 30))
    
    p.register(◆multiply,       Pratt(lhs: parseOperation,                          precedence: 40))
    p.register(◆divide,         Pratt(lhs: parseOperation,                          precedence: 40))
    
                                                                                    
    p.register(◆not,            Pratt(                      rhs: parsePreOp,        precedence: 50))
    p.register(◆minus,          Pratt(lhs: parseOperation,  rhs: parsePreOp,        precedence: 50))
                                                                                    
    p.register(◆increment,      Pratt(lhs: parsePostOp,                             precedence: 60))
    p.register(◆decrement,      Pratt(lhs: parsePostOp,                             precedence: 60))
                                                                                    
    p.register(◆paren_open,     Pratt(lhs: parseCall,                               precedence: 70))
    p.register(◆dot,            Pratt(lhs: parsePropertyAccess,                     precedence: 100))
                                
    p.register(◆paren_open,     Pratt(                      rhs: parseParenExpr,    precedence: 1000))
    
#  ███████    ███████  █████████
# ███   ███  ███          ███   
# █████████  ███████      ███   
# ███   ███       ███     ███   
# ███   ███  ███████      ███   

proc ast*(text:string) : Node =

    var p = Parser(tokens:lexi.tokenize(text), pos:0)
    p.setup()
    p.parse()
    
