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

        ◆paren_open="(", ◆paren_close=")", 
        ◆bracket_open="{", ◆bracket_close="}", 
        ◆square_open="[", ◆square_close="]",

        ◆string_start, ◆string_end,
        ◆stripol_start,
        ◆stripol_end,

        ◆comment_start, ◆comment, ◆comment_end,

        ◆assign="=", ◆plus="+", ◆minus="-", ◆multiply="*", ◆divide="/",
        ◆plus_assign="+=", ◆minus_assign="-=", 
        ◆multiply_assign="*=", ◆divide_assign="/=",
        ◆equal="==", ◆not_equal="!=", ◆greater=">", ◆less="<",
        ◆greater_equal=">=", ◆less_equal="<=", ◆then="➜", ◆return="⮐",

        ◆comma=",", ◆semicolon=";", ◆dot=".", ◆doubledot="..", ◆tripledot="...",

        ◆if="if", ◆else="else", ◆for="for", ◆in="in", ◆true="true", ◆false="false", ◆null="null",

        ◆test="▸", ◆val="▪"

    Token* = object
        str*    : string
        tok*    : TokenKind
        line*   : int
        col*    : int

proc charSetToSeq*(chars: set[char]): seq[string] =
    result = newSeq[string]()
    for c in chars:
        result.add($c)

proc tokenize*(text: string): seq[Token] =

    var i = 0
    var line = 0
    var col = 0
    var tokens: seq[Token]
    
    echo &"text: {text}"
    
    proc addToken(tok: TokenKind, str: string) =
        echo &"addToken {tok} {str}"
        tokens.add(Token(str: str, tok: tok, line: line, col: col - str.len))
    
    let input = kseg text
    
    echo &"input: {input}"
    
    while i < input.len:
        
        let c = input[i]
        
        echo &"i:{i} c:{c}"
        
        # Handle newlines
        if c == "\n":
            line += 1
            col = 0
            i += 1
            continue
        
        # Skip whitespace (unless it
        if c == " ":
            var spaces = 0
            while i < input.len and input[i] == " ":
                spaces += 1
                i += 1
                col += 1
            
            # Only add indent if it
            if tokens.len == 0 or (tokens.len > 0 and tokens[^1].tok == ◆indent):
                let idstr : string = " ".repeat(spaces)
                addToken(◆indent, idstr)
            continue
            
        let IdentStartChars = charSetToSeq IdentStartChars
        let Whitespace      = charSetToSeq Whitespace 
        let IdentChars      = charSetToSeq IdentChars
        let Digits          = charSetToSeq Digits 
        let Digitc          = @[
            "x", 
            "X", 
            "b", 
            "B", 
            "o", 
            "O", 
            ".", 
            "e", 
            "E", 
            "+", 
            "-"]
        
        if c in Digits:
            var numStr = $c
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
            i += 1
            col += 1
            addToken(◆string_start, $quote)
            
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
                    i += 2
                    col += 2
                    addToken(◆stripol_start, "#{")
                    continue
                
                if input[i] == "}" and tokens.len > 0 and tokens[^1].tok == ◆stripol_start:
                    if strContent.len > 0:
                        addToken(◆string, strContent)
                        strContent = ""
                    i += 1
                    col += 1
                    addToken(◆stripol_end, "}")
                    continue
                
                strContent.add(input[i])
                i += 1
                col += 1
            
            if strContent.len > 0:
                addToken(◆string, strContent)
            
            if isTriple:
                addToken(◆string_end, $quote & $quote & $quote)
            else:
                addToken(◆string_end, $quote)
                
            continue
        
        if c == "#":
            var commentStr = ""
            i += 1
            col += 1
            
            var isMulti = false
            if i + 1 < input.len and input[i] == "#" and input[i+1] == "#":
                isMulti = true
                i += 2
                col += 2
            
            addToken(◆comment_start, if isMulti: "###" else: "#")
            
            while i < input.len:
                if input[i] == "\n":
                    if not isMulti:
                        break
                    line += 1
                    col = 0
                elif isMulti and i + 2 < input.len and input[i] == "#" and input[i+1] == "#" and input[i+2] == "#":
                    i += 3
                    col += 3
                    addToken(◆comment_end, "###")
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
                    addToken(◆equal, twoChars); i += 2; col += 2; continue
                of "!=":
                    addToken(◆not_equal, twoChars); i += 2; col += 2; continue
                of ">=":
                    addToken(◆greater_equal, twoChars); i += 2; col += 2; continue
                of "<=":
                    addToken(◆less_equal, twoChars); i += 2; col += 2; continue
                of "+=":
                    addToken(◆plus_assign, twoChars); i += 2; col += 2; continue
                of "-=":
                    addToken(◆minus_assign, twoChars); i += 2; col += 2; continue
                of "*=":
                    addToken(◆multiply_assign, twoChars); i += 2; col += 2; continue
                of "/=":
                    addToken(◆divide_assign, twoChars); i += 2; col += 2; continue
                of "..":
                    if i + 2 < input.len and input[i+2] == ".":
                        addToken(◆tripledot, "..."); i += 3; col += 3; continue
                    else:
                        addToken(◆doubledot, ".."); i += 2; col += 2; continue
                else: 
                    discard
        
        case c:
            of "(":
                addToken(◆paren_open, $c)
            of ")":
                addToken(◆paren_close, $c)
            of "{":
                addToken(◆bracket_open, $c)
            of "}":
                addToken(◆bracket_close, $c)
            of "[":
                addToken(◆square_open, $c)
            of "]":
                addToken(◆square_close, $c)
            of ",":
                addToken(◆comma, $c)
            of ";":
                addToken(◆semicolon, $c)
            of "=":
                addToken(◆assign, $c)
            of "+":
                addToken(◆plus, $c)
            of "-":
                addToken(◆minus, $c)
            of "*":
                addToken(◆multiply, $c)
            of "/":
                addToken(◆divide, $c)
            of ">":
                addToken(◆greater, $c)
            of "<":
                addToken(◆less, $c)
            of ".":
                addToken(◆dot, $c)
            of "➜":
                addToken(◆then, $c)
            of "⮐":
                addToken(◆return, $c)
            of "▸":
                # Test token might include following text until whitespace
                var testStr = $c
                i += 1
                col += 1
                while i < input.len and input[i] notin Whitespace:
                    testStr.add(input[i])
                    i += 1
                    col += 1
                addToken(◆test, testStr)
                continue
            of "▪":
                addToken(◆val, $c)
            else:
                if c in IdentStartChars:
                    var ident = $c
                    i += 1
                    col += 1
                    while i < input.len and input[i] in IdentChars:
                        ident.add(input[i])
                        i += 1
                        col += 1
                    
                    let keyword = parseEnum[TokenKind](ident.toLowerAscii, ◆name)
                    addToken(keyword, ident)
                    continue
                
                # Unknown character - skip or handle error
                echo "Unknown character!"
                i += 1
                col += 1
    
    result = tokens

proc isNumber*(numStr: string, nextChar: string): bool =

    if numStr.len == 0:
        return false
    
    try:
        discard parseFloat(numStr)
        return true
    except ValueError:
        try:
            discard parseInt(numStr)
            return true
        except ValueError:
            return false
