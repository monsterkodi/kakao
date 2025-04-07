#[
    █████████  ████████    ███████   ███   ███   ███████
       ███     ███   ███  ███   ███  ████  ███  ███     
       ███     ███████    █████████  ███ █ ███  ███████ 
       ███     ███   ███  ███   ███  ███  ████       ███
       ███     ███   ███  ███   ███  ███   ███  ███████ 
]#

import std/[streams, paths, tables, pegs, sequtils, strutils, strformat]
import kommon

#  ███████  ███  ███   ███   ███████   ███      ████████   ███████   ███   ███   ███████   █████████  ████████
# ███       ███  ████  ███  ███        ███      ███       ███   ███  ███   ███  ███   ███     ███     ███     
# ███████   ███  ███ █ ███  ███  ████  ███      ███████   ███ ██ ██  ███   ███  ███   ███     ███     ███████ 
#      ███  ███  ███  ████  ███   ███  ███      ███       ███ ████   ███   ███  ███   ███     ███     ███     
# ███████   ███  ███   ███   ███████   ███████  ████████   █████ ██   ███████    ███████      ███     ████████

proc singleQuote*(line:string) : string =

    if line =~ peg"({(!\' .)*}{\'}{(!\' .)*}{\'}{(!\' .)*})+":
        apply(matches, proc(x: var string) = 
            if x == "'": x = "\"")
        return matches.join("")
    line

# █████████  ████████   ███  ████████   ███      ████████   ███████   ███████   ██     ██  ██     ██  ████████  ███   ███  █████████
#    ███     ███   ███  ███  ███   ███  ███      ███       ███       ███   ███  ███   ███  ███   ███  ███       ████  ███     ███   
#    ███     ███████    ███  ████████   ███      ███████   ███       ███   ███  █████████  █████████  ███████   ███ █ ███     ███   
#    ███     ███   ███  ███  ███        ███      ███       ███       ███   ███  ███ █ ███  ███ █ ███  ███       ███  ████     ███   
#    ███     ███   ███  ███  ███        ███████  ████████   ███████   ███████   ███   ███  ███   ███  ████████  ███   ███     ███   

proc tripleComment*(line:string, info:var TableRef[string,int]) : string =
    echo "info!!", info
    if line =~ peg"{(!\# .)*}{\#\#\#}{.*}":
        info["open"] = if info.hasKey("open") and info["open"]: 0 else: 1
        let punct = if info["open"]: "#[" else: "]#"
        apply(matches, proc(x: var string) = 
            if x == "###": x = punct)
        return matches.join("")
    line
    
# ███       ███████    ███████   █████████   ███████   ████████   ███████  ███   ███   ███████ 
# ███      ███   ███  ███           ███     ███   ███  ███       ███       ███   ███  ███   ███
# ███      ███   ███  ███  ████     ███     ███   ███  ███████   ███       █████████  ███   ███
# ███      ███   ███  ███   ███     ███     ███   ███  ███       ███       ███   ███  ███   ███
# ███████   ███████    ███████      ███      ███████   ████████   ███████  ███   ███   ███████ 

proc logToEcho*(line:string) : string =
    
    let pat = peg"""
        full <- ({pref l}{"log"}{r post})*
        pref <- (!(l "log" r) . )*
        post <- (!(l "log" r) . )*
        l    <- (^/\s/\;)
        r    <- ($/\s/\()
        """
    if line =~ pat:
        apply matches, proc(x: var string) = 
            if x == "log": x = "echo"
            
        let res = matches.join("")
        if res.len:
            return res
    line
    
# █████████  ████████   ███████  █████████   ███████  ███   ███  ███  █████████  ████████
#    ███     ███       ███          ███     ███       ███   ███  ███     ███     ███     
#    ███     ███████   ███████      ███     ███████   ███   ███  ███     ███     ███████ 
#    ███     ███            ███     ███          ███  ███   ███  ███     ███     ███     
#    ███     ████████  ███████      ███     ███████    ███████   ███     ███     ████████

proc testSuite*(line:string) : string =

    if line =~ peg"^{'▸'\s*}{.*}$":
        return &"suite \"{matches[1]}\":"
    if line =~ peg"^{\s+}{'▸'\s*}{.*}$":
        return &"{matches[0]}test \"{matches[2]}\":"
    line

proc stringSegments*(line:string) : seq[string] = 

    var segments:seq[string] = @[]
    
    let pat = peg"""
        input <- (stringLiteral / nonString)+
        nonString <- ((! """) . )+
        stringLiteral <- """ content """
        content <- (escaped / notEscaped)*
        escaped <- "\\" .
        notEscaped <- ((! """) .)
        """
    
    if line =~ pat
        echo &"matches {matches}"
        for match in matches
            segments.add(match)
    else
        segments.add(line)
    
    segments
        
# ████████    ███████    ███████  ████████
# ███   ███  ███   ███  ███       ███     
# ████████   ███   ███  ███████   ███████ 
# ███        ███   ███       ███  ███     
# ███         ███████   ███████   ████████

proc pose*(line:string, info:var TableRef[string,int]) : string =

    let segments = stringSegments(line)
    echo &"segments |{line}| {segments}"
    line
        .singleQuote()
        .logToEcho()
        .testSuite()
        .tripleComment(info)

proc pose*(line:string) : string =
    
    var info = Table[string,int].new()
    pose(line, info)

# █████████  ████████    ███████   ███   ███   ███████
#    ███     ███   ███  ███   ███  ████  ███  ███     
#    ███     ███████    █████████  ███ █ ███  ███████ 
#    ███     ███   ███  ███   ███  ███  ████       ███
#    ███     ███   ███  ███   ███  ███   ███  ███████ 

proc trans*(fileIn:string) : string =

    var fileOut = Path(fileIn).changeFileExt(".nim").string
    
    var streamIn  = newFileStream(fileIn,  fmRead)  ; defer: streamIn.close
    var streamOut = newFileStream(fileOut, fmWrite) ; defer: streamOut.close
    if  streamIn  == nil: raise newException(IOError, "Could not open source file: " & fileIn)
    if  streamOut == nil: raise newException(IOError, "Could not open target file: " & fileOut)
    
    var line = ""
    var info = Table[string,int].new()
    while streamIn.readLine(line):
        line = pose(line, info)
        streamOut.writeLine(line)
    
    fileOut

# ████████   ███  ███      ████████
# ███   ███  ███  ███      ███     
# ████████   ███  ███      ███████ 
# ███        ███  ███      ███     
# ███        ███  ███████  ████████

proc pile*(files:seq[string]) : seq[string] =

    var transpiled:seq[string]
    for file in files:
        transpiled.add trans file
    transpiled
            
import std/unittest

#  ███████  ███   ███  ███  █████████  ████████
# ███       ███   ███  ███     ███     ███     
# ███████   ███   ███  ███     ███     ███████ 
#      ███  ███   ███  ███     ███     ███     
# ███████    ███████   ███     ███     ████████

suite "trans":

    test "pose":
        
        check pose("log ''") == "echo \"\""
        check pose("log()") == "echo()"
        check pose("log 'hello'") == "echo \"hello\""
        check pose("log('hello')") == "echo(\"hello\")"
        check pose("log 'hello' ; log 'world'") == "echo \"hello\" ; echo \"world\""
        check pose("log 'a';log 'b'") == "echo \"a\";echo \"b\""
        check pose("▸ suite") == "suite \"suite\":"
        check pose("    ▸ test") == "    test \"test\":"
        check pose("### comment") == "#[ comment"
        
    test "peg":
        
        let l = "log hello"
        var m = default array[20, string]
        
        check l.match(peg"{log}", m) == true
        check m[0] == "log" 
        
        m = default typeof m

        check l.match(peg"{ 'log' }", m) == true
        check m[0] == "log" 
        
        m = default typeof m
        
        check l.match(peg"{ 'log' }\s{.*}", m) == true
        check m[0] == "log" 
        check m[1] == "hello" 
        
        m = default typeof m
        
        check "▸ test".match(peg"^{'▸'\s*}{.*}$", m) == true
        check m[0] == "▸ " 
        check m[1] == "test" 
        
    # test "Edge cases":
    #     expect OverflowError:
    #         discard add(high(int), 1)
    
