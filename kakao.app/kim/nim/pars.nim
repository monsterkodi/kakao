
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
                
template choose(cond, a, b: untyped): untyped =

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
        of ●call:
            s = &"({n.callee} {s} {n.callargs})"
        of ●propertyAccess:
            s = &"({n.owner} {s} {n.property})"
        of ●if:
            let e = choose(n.else, &" {n.else}", "")
            s = &"({s} {n.cond_thens}{e})"
        of ●condThen:
            s = &"({n.cond} {n.then})"
        of ●for :
            s = &"({s} {n.for_value} {n.for_range} {n.for_body})"
        of ●while:
            s = &"({s} {n.while_cond} {n.while_body})"
        of ●func:
            s = &"({s} {n.func_name} {n.func_type} {n.func_args}) {n.func_body})"
        else:
            discard
    s

proc formatValue*(result:var string, n:Node, specifier: string) = result.add $n

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

proc peek*(p: Parser, ahead: int = 1): Token =

    p.tokens[p.pos + ahead]

proc consume(p: var Parser): Token =

    let t = p.current()
    if p.pos < p.tokens.len:
        p.pos += 1
    t

proc swallow(p: var Parser) =

    discard p.consume()

proc error*(p: var Parser, msg: string) : Node =

    echo &"parse error: {msg}"
    nil

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
        let precedence = p.getPrecedence(token)
        
        if precedenceRight >= precedence:
            break
    
        let lhs = p.leftHandSide(token)
        if lhs == nil:
            break
            
        left = lhs(p, left)
    
    left
    
proc expression(p: var Parser, tokenRight:Token ): Node =

    expression(p, p.getPrecedence(tokenRight))

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
    
    if p.tok() == ◆indent:
        p.swallow() # block indentation
    
    var cond = p.expression() # initial condition
    
    if p.tok() != ◆then:
        return  p.error("Expected 'then' after if condition")
        
    discard p.consume() # initial then
    
    var then = p.expression()
    
    condThens.add(Node(kind:●condThen, cond:cond, then:then))
    
    while p.tok() == ◆elif or p.tok() == ◆indent:
    
        p.swallow() # elif or indent
        
        if p.tok() == ◆then:
            break # then without condition -> else
        
        cond = p.expression()
        
        if p.tok() != ◆then:
            return  p.error("Expected 'then' after elif condition")
            
        p.swallow() # then
        
        then = p.expression()
        
        condThens.add(Node(kind:●condThen, cond:cond, then:then))
        
    var `else`: Node
    if p.tok() == ◆else or p.tok() == ◆then:
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

proc parseSwitchCase(p: var Parser): Node =

    var whens: seq[Node] = @[]
    
    while true:
        whens.add(p.expression())
        if p.tok() in @[◆indent, ◆then]:
            p.swallow()
            break
    
    let then = p.expression()
    
    Node(
        kind: ●switchCase,
        case_when: whens,
        case_then: then
    )

proc parseSwitch*(p: var Parser): Node =

    let token = p.consume() # "switch"
    let value = p.expression()
    
    var cases: seq[Node] = @[]
    var default: Node
    
    if p.tok() == ◆indent:
        p.swallow()
    
    while p.tok() notin {◆else, ◆eof}:
    
        cases.add(p.parseSwitchCase())
        
        while p.tok() == ◆indent:
            p.swallow()
    
    if p.tok() == ◆else:
        
        p.swallow()
        default = p.expression()
        
    Node(
        token:          token,
        kind:           ●switch,
        switch_value:   value,
        switch_cases:   cases,
        switch_default: default
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

proc parsePostOp(p: var Parser, left: Node): Node =

    let token = p.consume()
    Node(token:token, kind: ●postOp, operand:left)

proc parsePreOp(p: var Parser): Node =

    let token = p.consume()
    let right = p.expression(token)
    Node(token:token, kind:●preOp, operand:right)

proc parseOperation(p: var Parser, left: Node): Node =

    let token = p.consume()
    let right = p.expression(token)
    Node(token:token, kind: ●operation, left: left, right: right)
        
proc register(p: var Parser, t:tok, pratt: Pratt) =

    if p.pratts.len <= t.ord:
        p.pratts.setLen(t.ord + 1)
    p.pratts[t.ord] = pratt

proc setup(p: var Parser) =

    p.register(◆number,     Pratt(                      rhs: parseLiteral,      precedence: 0))
    p.register(◆string,     Pratt(                      rhs: parseLiteral,      precedence: 0))
    p.register(◆true,       Pratt(                      rhs: parseLiteral,      precedence: 0))
    p.register(◆false,      Pratt(                      rhs: parseLiteral,      precedence: 0))
    p.register(◆null,       Pratt(                      rhs: parseLiteral,      precedence: 0))
    p.register(◆name,       Pratt(                      rhs: parseLiteral,      precedence: 0))
    
    p.register(◆return,     Pratt(                      rhs: parsePreOp,        precedence: 5))
                         
    p.register(◆assign,     Pratt(lhs: parseOperation,                          precedence: 10))
                                                                                
    p.register(◆if,         Pratt(rhs: parseIf,                                 precedence: 15))  
    p.register(◆switch,     Pratt(rhs: parseSwitch,                             precedence: 15))  
                                                                                
    p.register(◆equal,      Pratt(lhs: parseOperation,                          precedence: 20))
    p.register(◆plus,       Pratt(lhs: parseOperation,                          precedence: 30))
    p.register(◆multiply,   Pratt(lhs: parseOperation,                          precedence: 40))
    p.register(◆divide,     Pratt(lhs: parseOperation,                          precedence: 40))
                                                                                
    p.register(◆not,        Pratt(                      rhs: parsePreOp,        precedence: 50))
    p.register(◆minus,      Pratt(lhs: parseOperation,  rhs: parsePreOp,        precedence: 50))
                                                                                
    p.register(◆increment,  Pratt(lhs: parsePostOp,                             precedence: 60))
    p.register(◆decrement,  Pratt(lhs: parsePostOp,                             precedence: 60))
                                                                                
    p.register(◆paren_open, Pratt(lhs: parseCall,                               precedence: 70))
    p.register(◆dot,        Pratt(lhs: parsePropertyAccess,                     precedence: 100))
    
proc ast*(text:string) : Node =

    var p = Parser(tokens:lexi.tokenize(text), pos:0)
    p.setup()
    p.parse()
    
