# █████████  ███   ███  ███   ███  ███████
#    ███     ███  ███   ████  ███     ███ 
#    ███     ███████    ███ █ ███    ███  
#    ███     ███  ███   ███  ████   ███   
#    ███     ███   ███  ███   ███  ███████

import std/[strformat, strutils, tables]
import kommon

type
    TokenKind* = enum

        ◆indent, ◆name, ◆number, ◆string, 

        ◆paren_open, ◆paren_close, 
        ◆bracket_open, ◆bracket_close, 
        ◆square_open, ◆square_close,

        ◆string_start, ◆string_end,
        ◆stripol_start,
        ◆stripol_end,

        ◆comment_start, ◆comment, ◆comment_end,

        ◆assign, ◆plus, ◆minus, ◆multiply, ◆divide,
        ◆plus_assign, ◆minus_assign, 
        ◆multiply_assign, ◆divide_assign,
        ◆equal, ◆not_equal, ◆greater, ◆less,
        ◆greater_equal, ◆less_equal, ◆then, ◆return,

        ◆comma, ◆semicolon, ◆dot, ◆doubledot, ◆tripledot,

        ◆if, ◆else, ◆for, ◆in, ◆true, ◆false, ◆null,

        ◆test, ◆val

    Token* = object
        tok*    : TokenKind
        str*    : string
        line*   : int
        col*    : int

proc charSetToSeq*(chars: set[char]): seq[string] =
    result = newSeq[string]()
    for c in chars:
        result.add($c)

let IdentStartChars = charSetToSeq(IdentStartChars)
let Whitespace = charSetToSeq(Whitespace)
let IdentChars = charSetToSeq(IdentChars)
let Digits = charSetToSeq(Digits)
let Digitc = @["x", "X", "b", "B", "o", "O", ".", "e", "E", "+", "-"]

proc tokenize*(text: string): seq[Token] =

    var line = 0
    var i    = 0
    var col  = 0
    var tokens: seq[Token]
    
    let input = kseg text
    
    proc addToken(tok: TokenKind, str: string) =
        tokens.add(Token(tok: tok, str: str, line: line, col: col - str.len))
    
    proc incToken(tok: TokenKind, str: string) =
        i += str.len
        col += str.len
        addToken(tok, str)
    
    while i < input.len:
    
        let c = input[i]
        
        if c == "\n":
            line += 1
            col = 0
            i += 1
            continue
        
        if c == " ":
            var spaceStr = ""
            while i < input.len and input[i] == " ":
                spaceStr.add " "
                i += 1
                col += 1
            
            # Only add indent if it's at start of line or after newline
            if tokens.len == 0 or tokens[^1].tok == ◆indent:
                addToken(◆indent, spaceStr)
            continue
                    
        if c in Digits:
            var numStr = c
            i += 1
            col += 1
            
            while i < input.len and (input[i] in Digits or input[i] in Digitc):
                numStr.add(input[i])
                i += 1
                col += 1
            
            addToken(◆number, numStr)
            continue
        
        if c in @["'", "\""]:
            let quote = c
            var strContent = ""
            incToken(◆string_start, quote)
            
            var isTriple = false
            if i + 1 < input.len and input[i] == quote and input[i+1] == quote:
                isTriple = true
                i += 2
                col += 2
            
            while i < input.len:
                if isTriple:
                    if i + 2 < input.len and input[i] == quote and input[i+1] == quote and input[i+2] == quote:
                        i += 3
                        col += 3
                        break
                elif input[i] == quote and (i == 0 or input[i-1] != "\\"):
                    i += 1
                    col += 1
                    break
                
                if not isTriple and quote == "\"" and i+1 < input.len and input[i] == "#" and input[i+1] == "{":
                    if strContent.len > 0:
                        addToken(◆string, strContent)
                        strContent = ""
                    incToken(◆stripol_start, "#{")
                    continue
                
                if input[i] == "}" and tokens.len > 0 and tokens[^1].tok == ◆stripol_start:
                    if strContent.len > 0:
                        addToken(◆string, strContent)
                        strContent = ""
                    incToken(◆stripol_end, "}")
                    continue
                
                strContent.add(input[i])
                i += 1
                col += 1
            
            if strContent.len > 0:
                addToken(◆string, strContent)
            
            if isTriple:
                incToken(◆string_end, quote & quote & quote)
            else:
                incToken(◆string_end, quote)
            continue
        
        if c == "#":
            var commentStr = ""
            incToken(◆comment_start, c)
            
            var isMulti = false
            if i + 1 < input.len and input[i] == "#" and input[i+1] == "#":
                isMulti = true
                incToken(◆comment_start, "###")
            
            while i < input.len:
                if input[i] == "\n":
                    if not isMulti:
                        break
                    line += 1
                    col = 0
                elif isMulti and i + 2 < input.len and input[i] == "#" and input[i+1] == "#" and input[i+2] == "#":
                    incToken(◆comment_end, "###")
                    break
                else:
                    commentStr.add(input[i])
                    i += 1
                    col += 1
            
            if commentStr.len > 0:
                addToken(◆comment, commentStr)
            continue
        
        if i + 1 < input.len:
            let twoChars = input[i] & input[i+1]
            case twoChars:
                of "==": 
                    incToken(◆equal, twoChars); continue
                of "!=": 
                    incToken(◆not_equal, twoChars); continue
                of ">=": 
                    incToken(◆greater_equal, twoChars); continue
                of "<=": 
                    incToken(◆less_equal, twoChars); continue
                of "+=": 
                    incToken(◆plus_assign, twoChars); continue
                of "-=": 
                    incToken(◆minus_assign, twoChars); continue
                of "*=": 
                    incToken(◆multiply_assign, twoChars); continue
                of "/=": 
                    incToken(◆divide_assign, twoChars); continue
                of "..": 
                    if i + 2 < input.len and input[i+2] == ".":
                        incToken(◆tripledot, "..."); continue
                    else:
                        incToken(◆doubledot, ".."); continue
                else: discard
        
        case c:
            of "(": 
                incToken(◆paren_open, c)
            of ")": 
                incToken(◆paren_close, c)
            of "{": 
                incToken(◆bracket_open, c)
            of "}": 
                incToken(◆bracket_close, c)
            of "[": 
                incToken(◆square_open, c)
            of "]": 
                incToken(◆square_close, c)
            of ",": 
                incToken(◆comma, c)
            of ";": 
                incToken(◆semicolon, c)
            of "=": 
                incToken(◆assign, c)
            of "+": 
                incToken(◆plus, c)
            of "-": 
                incToken(◆minus, c)
            of "*": 
                incToken(◆multiply, c)
            of "/": 
                incToken(◆divide, c)
            of ">": 
                incToken(◆greater, c)
            of "<": 
                incToken(◆less, c)
            of ".": 
                incToken(◆dot, c)
            of "➜": 
                incToken(◆then, c)
            of "⮐": 
                incToken(◆return, c)
            of "▸":
                var testStr = c
                i += 1
                col += 1
                while i < input.len and input[i] notin Whitespace:
                    testStr.add(input[i])
                    i += 1
                    col += 1
                addToken(◆test, testStr)

            of "▪": incToken(◆val, c)
            else:
                if c in IdentStartChars:
                    var ident = c
                    i += 1
                    col += 1
                    while i < input.len and input[i] in IdentChars:
                        ident.add(input[i])
                        i += 1
                        col += 1
                    
                    let keyword = parseEnum[TokenKind](ident.toLowerAscii, ◆name)
                    addToken(keyword, ident)
                    continue
                
                # Unknown character - skip
                i += 1
                col += 1
    
    result = tokens
