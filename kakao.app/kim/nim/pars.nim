# ████████    ███████   ████████    ███████
# ███   ███  ███   ███  ███   ███  ███     
# ████████   █████████  ███████    ███████ 
# ███        ███   ███  ███   ███       ███
# ███        ███   ███  ███   ███  ███████ 

import std/[strformat, strutils, terminal]
import kommon
import tknz

type
    NodeKind* = enum
    
        ●error,
        ●block,
        ●comment,
        ●literal,
        ●string,
        ●stripol,
        ●identifier,  
        ●preOp, 
        ●operation, 
        ●postOp,
        ●call,
        ●if, 
        ●condThen,
        ●for, 
        ●range, 
        ●while,
        ●switch,
        ●switchCase,
        ●var,        
        ●propertyAccess,        
        ●func,
        ●type,
        ●argType,
        ●argList,
        ●argDefault,
        ●signature,
        ●return, 
        ●break, 
        ●continue,          
        ●use, 
        ●import,
        ●class,
        ●enum,
        ●testSuite,
        ●testSection,
        ●testCase,
        ●eof
    
    # ███   ███   ███████   ███████    ████████
    # ████  ███  ███   ███  ███   ███  ███     
    # ███ █ ███  ███   ███  ███   ███  ███████ 
    # ███  ████  ███   ███  ███   ███  ███     
    # ███   ███   ███████   ███████    ████████

    Node* = ref object

        token* : Token
            
        case kind* : NodeKind:
        
            of ●block:
                
                expressions*    : seq[Node]
                
            of ●operation:
            
                operand_left*   : Node
                operand_right*  : Node
                
            of ●string:
            
                string_content*  : Node
                string_stripols* : seq[Node]
                
            of ●comment:
            
                comment_content* : Node
                
            of ●stripol:
            
                stripol_xprssns* : seq[Node]
                stripol_content* : Node

            of ●range:
            
                range_start*    : Node
                range_end*      : Node
                
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
                
            of ●argType:
            
                arg_name*       : Node    
                arg_type*       : Node
                arg_default*    : Node
                
            of ●argDefault:
            
                default*        : Node

            of ●argList:
            
                args*           : seq[Node]
                
            of ●signature:
            
                sig_args*       : seq[Node]  
                sig_type*       : Node
                
            of ●func:
            
                func_name*      : Node
                func_type*      : Node
                func_args*      : seq[Node]
                func_body*      : Node
                
            of ●use:
            
                use_module*     : Node
                use_kind*       : Node
                use_items*      : seq[Node]
                            
            of ●testCase:
                
                test_expression* : Node
                test_expected*   : Node
                
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
        text    : string # used in `$` for debugging. should be removed eventually 
        tokens* : seq[Token]
        pratts* : seq[Pratt]
        pos*    : int
    
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

    var s = &"▪▪▪ {p.current()} {p.pos}"
    s &= p.text
    for t in p.tokens:
        s &= &"\n{t}"
    s

proc `$`*(n: Node): string = 

    var s = &"{n.token.tok}"
    
    case n.kind:
        of ●block:
            s = "▪["
            for e in n.expressions:
                s &= &"{e}"
            s &= "]"
        of ●operation:
            s = &"({n.operand_left} {s} {n.operand_right})"
        of ●range:
            s = &"({n.range_start} {s} {n.range_end})"
        of ●string:
            # var i = ""
            # if n.string_stripols.len
            #     i &= &"{n.string_stripols}"
            let i = choose(n.string_stripols.len>0, &"{n.string_stripols}", "")
            s = &"◆string{i}"
        of ●preOp:
            s = &"({s} {n.operand})"
        of ●postOp:
            s = &"({n.operand} {s})"
        of ●return:
            let e = choose(n.return_value, &" {n.return_value}", "")
            s = &"({s}{e})"
        of ●call:
            s = &"({n.callee} ◆call {n.callargs})"
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
            let f = choose(n.func_name, &" {n.func_name}", "")
            let t = choose(n.func_type, &" {n.func_type}", "")
            let b = choose(n.func_body, &" {n.func_body}", "")
            s = &"({s}{f} {n.func_args}{t}{b})"
        of ●argType:
            let d = choose(n.arg_default, &" {n.arg_default}", "")
            let t = choose(n.arg_type, &" {s} {n.arg_type}", "")
            s = &"({n.arg_name}{t}{d})"
        of ●argDefault:
            s = &"(= {n.default})"
        of ●argList:
            s = &"({n.args})"
        of ●signature:
            s = &"({n.sig_args} {s} {n.sig_type})"
        of ●use:
            let k = choose(n.use_kind, &" {n.use_kind.token.str}", "")
            let i = choose(n.use_items.len>0, &" {n.use_items}", "")
            s = &"({s} {n.use_module}{k}{i})"
        of ●testCase:
            s = &"({n.test_expression} {s} {n.test_expected})"
        else:
            discard
    s

proc formatValue*(result:var string, n:Node,   specifier: string) = result.add $n
proc formatValue*(result:var string, p:Parser, specifier: string) = result.add $p
proc error*(p: var Parser, msg: string) : Node =

    styledEcho fgRed, $p
    styledEcho fgYellow, &"parse error: {msg}"
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
    
proc peek(p: Parser, ahead=1): Token =

    if p.pos + ahead < p.tokens.len:
        p.tokens[p.pos + ahead]
    else:
        Token(tok:◆eof)
        
proc atEnd(p:Parser): bool = p.pos >= p.tokens.len
    
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
        
        if token.tok in {◆assign, ◆test}:
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

proc parseBlock*(p:var Parser, indent:int = 0): Node =

    var expressions = default seq[Node]
    var token: Token
    var block_indent = indent
    if p.tok() == ◆indent:
        token = p.consume() 
        block_indent = token.str.len
    
    var expr : Node = p.expression()
    while expr != nil:
        expressions.add expr
        if p.tok() == ◆indent:
            let ind = p.current() 
            if ind.str.len < block_indent:
                echo "pars.block outdent break"
                p.swallow()
                break
            elif ind.str.len > block_indent:
                # echo &"pars.block subblock {ind} {indent}"
                expr = p.parseBlock(ind.str.len)
                continue
            else:
                p.swallow() 
        expr = p.expression()
    Node(token:token, kind:●block, expressions:expressions)
    
proc parseList*(p:var Parser) : seq[Node] = 

    var list : seq[Node] = @[]
    let line = p.current().line
    var expr : Node = p.expression()
    while expr != nil:
        list.add expr
        expr = p.expression()
    list

proc parseModule*(p:var Parser) : Node = 

    let line = p.current().line
    
    var s = ""
    while p.current().line == line and p.current().str notin @["▪", "◆"]:
        s &= p.consume().str       
        if p.atEnd():
            break 
        
    Node(token:Token(str:s))
    
proc then(p: var Parser) : Node = 

    if p.tok() == ◆then:
        # echo "pars.then thenned"
        p.swallow ◆then
        
    if p.tok() == ◆indent:
        # echo "pars.then block"
        p.parseBlock()
    else:
        # if p.tok() != ◆eof
        #     echo &"pars.then expression {p.tok()}"
        p.expression()

proc parse*(p: var Parser): Node = 

    parseBlock(p)
    
# ███  ████████
# ███  ███     
# ███  ██████  
# ███  ███     
# ███  ███     

proc rIf(p: var Parser): Node =

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
        
# ████████   ███████   ████████ 
# ███       ███   ███  ███   ███
# ██████    ███   ███  ███████  
# ███       ███   ███  ███   ███
# ███        ███████   ███   ███

proc rFor(p: var Parser): Node = 

    let token = p.consume()
    let for_value = p.expression()
    p.swallowError(◆in, "Expected in after for value")
    let for_range = p.expression()
    let for_body  = p.then()

    Node(
        token:      token,
        kind:       ●for,
        for_value:  for_value,
        for_range:  for_range,
        for_body:   for_body
        )

#  ███████  ███   ███  ███  █████████   ███████  ███   ███
# ███       ███ █ ███  ███     ███     ███       ███   ███
# ███████   █████████  ███     ███     ███       █████████
#      ███  ███   ███  ███     ███     ███       ███   ███
# ███████   ██     ██  ███     ███      ███████  ███   ███

proc switchCase(p: var Parser, baseIndent: int): Node =

    var case_when: seq[Node]
    let token = p.current()
    
    while p.tok() notin {◆else, ◆then, ◆indent, ◆eof}:
        case_when.add p.expression()
    
    # if case_when.len == 0
    #     return  p.error("Switch case needs at least one pattern")
    
    p.swallow ◆then
    
    if p.tok() == ◆indent and p.current().str.len > baseIndent:
        p.swallow ◆indent
        
    let case_then = p.expression()
    
    if case_then == nil:
        return  p.error "Expected case body after matches"
    
    Node(
        token:      token,
        kind:       ●switchCase,
        case_when:  case_when,
        case_then:  case_then
        )

proc rSwitch*(p: var Parser): auto =

    let token = p.consume()
    let switch_value = p.expression()
    
    if switch_value == nil:
        return  p.error "Expected value after switch keyword"
    
    let baseIndent = p.current().str.len 
    
    p.swallowError(◆indent, "Expected indentation after switch statement")
    
    var switch_cases: seq[Node]
    
    while p.tok() notin {◆else, ◆then, ◆eof}:
        if p.tok() == ◆indent:
            if p.current().str.len < baseIndent:
                break
            p.swallow ◆indent
            continue
        let switch_case = p.switchCase(baseIndent)
        if switch_case == nil:
            return  p.error "failed to parse switch statement"
        else:
            switch_cases.add switch_case
    
    var switch_default: Node
    
    if p.tok() in {◆else, ◆then}:
        p.swallow()
        switch_default = 
            if p.tok() == ◆indent and p.current().str.len > baseIndent:
                p.swallow()
                p.expression()
            else:
                p.expression()
        
        if switch_default == nil:
            return  p.error "Expected default value"
    
    Node(
        token:          token,
        kind:           ●switch,
        switch_value:   switch_value,
        switch_cases:   switch_cases,
        switch_default: switch_default
        )
        
proc lCall(p: var Parser, callee: Node): Node =

    let token = p.consume() # (
    
    var args = default seq[Node]
    while p.tok() != ◆paren_close:
        args.add p.expression()
    p.swallowError(◆paren_close, "Missing closing paren for call arguments")    

    Node(token:token, kind:●call, callee:callee, callargs:args)
    
proc lPropertyAccess(p: var Parser, owner: Node): Node =

    let token = p.consume()
    let right = p.expression(token)
    Node(token:token, kind:●propertyAccess, owner:owner, property:right)

proc rLiteral(p: var Parser): Node =

    let token = p.consume()
    Node(token:token, kind: ●literal)

proc rImport(p: var Parser): Node =

    let token = p.consume()
    Node(token:token, kind: ●import)
    
proc rString(p: var Parser): Node =

    let token = p.consume() # string start

    let contentToken = p.consume()
    if contentToken.tok == ◆string_end:
        Node(token:token, kind:●string, string_content:Node(token:Token(str:"", tok:◆string), kind:●literal))
    else:
        let string_content = Node(token:contentToken, kind:●literal)
        var string_stripols : seq[Node] = @[]
        while p.tok() notin {◆string_end, ◆eof}:
        
            var stripol = Node(kind:●stripol)
            p.swallowError(◆stripol_start, "Expected string interpolation start")
            
            var stripol_xprssns : seq[Node] = @[]
            while p.tok() notin {◆stripol_end, ◆eof}:
                stripol_xprssns.add p.expression()
                
            stripol.stripol_xprssns = stripol_xprssns
            
            p.swallowError(◆stripol_end, "Expected string interpolation end")
            if p.tok() notin {◆string_end, ◆eof}:
                let content = p.consume()
                stripol.stripol_content = Node(token:content, kind:●literal)
            string_stripols.add stripol
            
        p.swallowError(◆string_end, "Expected closing string delimiter")
        
        Node(token:token, kind:●string, string_content:string_content, string_stripols:string_stripols)

proc rUse(p: var Parser): Node =

    let token = p.consume()
    let use_module = p.parseModule()
    if not p.atEnd():
        let use_kind = p.expression()
        let use_items  = p.parseList()
        Node(token:token, kind:●use, use_module:use_module, use_kind:use_kind, use_items:use_items) 
    else:
        Node(token:token, kind:●use, use_module:use_module) 
        
proc rComment(p: var Parser): Node = 

     let token = p.consume()
     let comment_content = Node(token:p.consume())
     
     Node(token:token, kind:●comment, comment_content:comment_content)

proc lPostOp(p: var Parser, left: Node): Node =

    let token = p.consume()
    Node(token:token, kind: ●postOp, operand:left)

proc rPreOp(p: var Parser): Node =

    let token = p.consume()
    let right = p.expression(token)
    Node(token:token, kind:●preOp, operand:right)

proc parseType(p: var Parser): Node =
    
    var token = p.consume()
    token.tok = ◆type
    
    if p.tok() == ◆square_open:
        while p.tok() notin {◆eof}:
            let t = p.consume()
            token.str &= t.str
            if t.tok == ◆square_close:
                break
    
    Node(token:token, kind:●type)
    
proc rReturnType(p: var Parser): Node =

    var token    = p.consume()
    let sig_type = p.parseType()
    
    Node(token:token, kind:●signature, sig_type:sig_type)
    
proc lSingleArg(p: var Parser, left: Node) : Node =

    var token : Token
    var arg_type : Node
    var arg_default : Node
    
    if p.tok() in {◆val, ◆var}:
        token    = p.consume()
        arg_type = p.parseType()
    
    if p.tok() == ◆assign:
        let t = p.consume() 
        arg_default = Node(
            token: t,
            kind: ●argDefault,
            default: p.expression()
            )
        
    Node(token:token, kind:●argType, arg_name:left, arg_type:arg_type, arg_default:arg_default)
    
proc lArgType(p: var Parser, left: Node) : Node =

    var n = p.lSingleArg(left)
    
    if p.peek().tok in {◆val, ◆var, ◆assign} :
        var argList : seq[Node] = @[n]
        while p.peek(1).tok in {◆val, ◆var, ◆assign}:
            argList.add p.lSingleArg(p.rLiteral())
            
        n = Node(token:n.token, kind:●argList, args:argList)

    if p.tok() == ◆then:
    
        var s = p.rReturnType()
        
        if n.kind == ●argList:
            s.sig_args = n.args
        else:
            s.sig_args = @[n]
        n = s
    n

proc lFunc(p: var Parser, left: Node): Node =

    let token = p.consume() # ->
    
    var funcName:  Node
    var func_type: Node
    var args: seq[Node] = @[]
    
    if left.kind == ●operation and left.token.tok == ◆assign:
        echo &"lFunc ASSIGN {left}"
        funcName = left.operand_left

    if left.kind == ●argType:
        args.add left
    if left.kind == ●argList:
        args = left.args
    if left.kind == ●signature:
        args = left.sig_args
        func_type = left.sig_type
    
    let body = p.then()
    
    Node(
        token: token,
        kind: ●func,
        func_name: funcName,
        func_args: args,
        func_type: func_type,
        func_body: body
        )

proc rFunc(p: var Parser): Node =
        
    let token = p.consume() # ->
    let body = p.then()
    Node(token:token, kind:●func, func_body: body)

proc rReturn(p: var Parser): Node =

    let token = p.consume()
    let right = p.expression(token)
    Node(token:token, kind:●return, return_value:right)

proc lOperation(p: var Parser, left: Node): Node =

    let token = p.consume()
    let right = p.expression(token)
    Node(token:token, kind: ●operation, operand_left: left, operand_right: right)

proc lAssign(p: var Parser, left: Node): Node =

    let token = p.consume()
    let right = p.expression(token)

    if left.kind == ●literal and right.kind == ●func:
        right.func_name = left
        right
    else:
        Node(token:token, kind: ●operation, operand_left: left, operand_right: right)

proc lRange(p: var Parser, left: Node): Node =

    let token = p.consume()
    let right = p.expression(token)
    Node(token:token, kind: ●range, range_start: left, range_end: right)
        
proc rParenExpr(p: var Parser): Node =

    p.swallow() # "("
    let expr = p.expression()
    p.swallowError(◆paren_close, "Expected closing parenthesis")
    expr
    
proc lTestCase(p: var Parser, left: Node): Node =

    let token = p.consume() # ▸
    p.swallow(◆indent) # todo: check if indent is larger than that of the test expression
    let right = p.expression()
    Node(token:token, kind: ●testCase, test_expression:left, test_expected:right)

proc rTestSuite(p: var Parser): Node =

    let token = p.consume() # ▸
    let kind = choose(token.col == 0, ●testSuite, ●testSection)
    Node(token:token, kind:kind)
            
#  ███████  ████████  █████████  ███   ███  ████████ 
# ███       ███          ███     ███   ███  ███   ███
# ███████   ███████      ███     ███   ███  ████████ 
#      ███  ███          ███     ███   ███  ███      
# ███████   ████████     ███      ███████   ███      

proc pratt(p: var Parser, t:tok, lhs:LHS, rhs:RHS, precedence:int) = 

    if p.pratts.len <= t.ord:
        p.pratts.setLen(t.ord + 1)
    
    p.pratts[t.ord] = Pratt(lhs:lhs, rhs:rhs, precedence:precedence)

proc setup(p: var Parser) =

    p.pratt ◆comment_start,     nil,               rComment,        0
    p.pratt ◆import,            nil,               rImport,         0
    p.pratt ◆use,               nil,               rUse,            0
    p.pratt ◆test,              lTestCase,         rTestSuite,      0
    p.pratt ◆number,            nil,               rLiteral,        0
    p.pratt ◆string_start,      nil,               rString,         0
    p.pratt ◆true,              nil,               rLiteral,        0
    p.pratt ◆false,             nil,               rLiteral,        0
    p.pratt ◆null,              nil,               rLiteral,        0
    p.pratt ◆name,              nil,               rLiteral,        0
                                                                     
    p.pratt ◆return,            nil,               rReturn,         5
                                                                    
    p.pratt ◆assign,            lAssign,           nil,            10
    p.pratt ◆plus_assign,       lAssign,           nil,            10
    p.pratt ◆minus_assign,      lAssign,           nil,            10
    p.pratt ◆divide_assign,     lAssign,           nil,            10
    p.pratt ◆multiply_assign,   lAssign,           nil,            10

    p.pratt ◆func,              lFunc,             rFunc,          15
    p.pratt ◆if,                nil,               rIf,            15  
    p.pratt ◆for,               nil,               rFor,           15  
    p.pratt ◆switch,            nil,               rSwitch,        15  
                                
    p.pratt ◆equal,             lOperation,        nil,            20
    p.pratt ◆doubledot,         lRange,            nil,            20
                                                   
    p.pratt ◆or,                lOperation,        nil,            30
    p.pratt ◆and,               lOperation,        nil,            40
                                                   
    p.pratt ◆plus,              lOperation,        nil,            50
    p.pratt ◆minus,             lOperation,        rPreOp,         50
                                                   
    p.pratt ◆multiply,          lOperation,        nil,            60
    p.pratt ◆divide,            lOperation,        nil,            60
                                                                                                
    p.pratt ◆not,               nil,               rPreOp,         70
                                                                                                
    p.pratt ◆increment,         lPostOp,           nil,            80
    p.pratt ◆decrement,         lPostOp,           nil,            80
                                                                                        
    p.pratt ◆paren_open,        lCall,             rParenExpr,     90
    p.pratt ◆val,               lArgType,          nil,           100
    p.pratt ◆var,               lArgType,          nil,           100
    p.pratt ◆then,              nil,               rReturnType,   100
    p.pratt ◆dot,               lPropertyAccess,   nil,           100
    
#  ███████    ███████  █████████
# ███   ███  ███          ███   
# █████████  ███████      ███   
# ███   ███       ███     ███   
# ███   ███  ███████      ███   

proc ast*(text:string) : Node =

    let tokens = tokenize text
    # echo &"tokens {tokens}"
    var p = Parser(tokens:tokens, pos:0, text:text)
    p.setup()
    p.parse()
    
