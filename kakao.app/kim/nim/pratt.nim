
import std/[strformat, strutils, tables, macros]
import kommon
import pars
import lexi

type
    PrattParser = object
        tokens: seq[Token]
        pos:    int
    
    NudFunc = proc(p: var PrattParser): Node
    LedFunc = proc(p: var PrattParser, left: Node): Node
    
    TokenInfo = object
        nud: NudFunc
        led: LedFunc
        bp: int  # binding power

const
    BP_DOT     = 70
    BP_CALL    = 60
    BP_PREFIX  = 50
    BP_PRODUCT = 40
    BP_SUM     = 30
    BP_COMPARE = 20
    BP_ASSIGN  = 10
    BP_LOWEST  = 0
    
# precedence = o ->
#     
#     switch t
#     
#         "new"                                     ➜ -1
#         "last" "first"
#         "is" "equals" "noon"                      ➜  0
#         "copy" "clone" 
#         "not" "delete" "empty" "valid" "~"        ➜  1
#         "*" "/" "%"                               ➜  2
#         "+" "-"                                   ➜  3
#         "<<" ">>" ">>>"                           ➜  4
#         "<" "<=" ">" ">="                         ➜  5
#         "==" "!=" "eql"                           ➜  6
#         "&"                                       ➜  7
#         "^"                                       ➜  8
#         "|"                                       ➜  9
#         "and"                                     ➜ 10
#         "or"                                      ➜ 11
#         "?" "?:"                                  ➜ 12
#         "="                                       ➜ 13
#         "+=" "-=" "*=" "/=" "%=" "&=" "^=" "|="   ➜ 14
#         "<<=" ">>=" ">>>=" "&&=" "||=" "?="       ➜ 15
#                                                   ➜ Infinity

proc setupPrattParser(p: var PrattParser) =

    p.registerTokenInfo(tkInt,    TokenInfo(nud: nudLiteral, bp: BP_LOWEST))
    p.registerTokenInfo(tkMinus,  TokenInfo(nud: nudPrefix,  bp: BP_PREFIX))
    p.registerTokenInfo(tkNot,    TokenInfo(nud: nudPrefix,  bp: BP_PREFIX))
                                  
    p.registerTokenInfo(tkPlus,   TokenInfo(led: ledInfix,   bp: BP_SUM))
    p.registerTokenInfo(tkMinus,  TokenInfo(led: ledInfix,   bp: BP_SUM))
    p.registerTokenInfo(tkStar,   TokenInfo(led: ledInfix,   bp: BP_PRODUCT))
    p.registerTokenInfo(tkSlash,  TokenInfo(led: ledInfix,   bp: BP_PRODUCT))
    p.registerTokenInfo(tkEquals, TokenInfo(led: ledInfix,   bp: BP_COMPARE))
    p.registerTokenInfo(tkLParen, TokenInfo(led: ledCall,    bp: BP_CALL))
    p.registerTokenInfo(tkDot,    TokenInfo(led: ledDot,     bp: BP_DOT))
    
proc registerTokenInfo(p: var PrattParser, tokenKind: TokenKind, info: TokenInfo) =

    discard

proc parseExpression(p: var PrattParser, rbp: int = BP_LOWEST): Node =

    var left: Node
    let token = p.current()
    
    let nud = p.getNud(token.kind)
    if nud == nil:
        raiseParseError("Unexpected token: " & token.value)
    left = nud(p)

    while rbp < p.current().getBp():
        let token = p.current()
        let led = p.getLed(token.kind)
        if led == nil:
            break
        left = led(p, left)
    
    left

proc nudLiteral(p: var PrattParser): Node =

    let token = p.consume()
    Node(kind: nkIntLit, intVal: parseInt(token.value))

proc ledInfix(p: var PrattParser, left: Node): Node =

    let token = p.consume()
    let right = p.parseExpression(p.getBp(token.kind))
    Node(kind: nkInfix, left: left, op: token.value, right: right)

proc nudPrefix(p: var PrattParser): Node =

    let token = p.consume()
    let right = p.parseExpression(BP_PREFIX)
    Node(kind: nkPrefix, op: token.value, right: right)
    
