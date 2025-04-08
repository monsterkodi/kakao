#[
    █████████  ████████    ███████   ███   ███   ███████
       ███     ███   ███  ███   ███  ████  ███  ███     
       ███     ███████    █████████  ███ █ ███  ███████ 
       ███     ███   ███  ███   ███  ███  ████       ███
       ███     ███   ███  ███   ███  ███   ███  ███████ 
]#

import std/[streams, paths, tables, pegs, sequtils, strutils, strformat, unittest]
import kommon

#  ███████  ███  ███   ███   ███████   ███      ████████         ███████   ███   ███   ███████   █████████  ████████
# ███       ███  ████  ███  ███        ███      ███             ███   ███  ███   ███  ███   ███     ███     ███     
# ███████   ███  ███ █ ███  ███  ████  ███      ███████         ███ ██ ██  ███   ███  ███   ███     ███     ███████ 
#      ███  ███  ███  ████  ███   ███  ███      ███             ███ ████   ███   ███  ███   ███     ███     ███     
# ███████   ███  ███   ███   ███████   ███████  ████████         █████ ██   ███████    ███████      ███     ████████

proc singleQuote*(line:string) : string =

    "\"" & line[1..^2] & "\""
    
# █████████  ████████   ███  ████████   ███      ████████         ███████   ███████   ██     ██  ██     ██  ████████  ███   ███  █████████
#    ███     ███   ███  ███  ███   ███  ███      ███             ███       ███   ███  ███   ███  ███   ███  ███       ████  ███     ███   
#    ███     ███████    ███  ████████   ███      ███████         ███       ███   ███  █████████  █████████  ███████   ███ █ ███     ███   
#    ███     ███   ███  ███  ███        ███      ███             ███       ███   ███  ███ █ ███  ███ █ ███  ███       ███  ████     ███   
#    ███     ███   ███  ███  ███        ███████  ████████         ███████   ███████   ███   ███  ███   ███  ████████  ███   ███     ███   

func get(info:var TableRef[string,int], key : string) : int =

    if info.hasKey(key): return info[key]
    0

proc tripleComment*(line:string, info:var TableRef[string,int]) : string =
    # echo "info", info
    if line =~ peg"{(!\# .)*}{\#\#\#}{.*}":
        info["tripleComment"] = if info.get("tripleComment"): 0 else: 1
        let punct = if info["tripleComment"]: "#[" else: "]#"
        apply(matches, proc(x: var string) = 
            if x == "###": x = punct)
        return matches.join("")
    line
    
# ███       ███████    ███████         █████████   ███████         ████████   ███████  ███   ███   ███████ 
# ███      ███   ███  ███                 ███     ███   ███        ███       ███       ███   ███  ███   ███
# ███      ███   ███  ███  ████           ███     ███   ███        ███████   ███       █████████  ███   ███
# ███      ███   ███  ███   ███           ███     ███   ███        ███       ███       ███   ███  ███   ███
# ███████   ███████    ███████            ███      ███████         ████████   ███████  ███   ███   ███████ 

proc logToEcho*(line:string) : string =

    line.replacef(peg"{\s*}{'log'}{'('/\s}", "$1echo$3")
    
# █████████  ████████   ███████  █████████         ███████  ███   ███  ███  █████████  ████████
#    ███     ███       ███          ███           ███       ███   ███  ███     ███     ███     
#    ███     ███████   ███████      ███           ███████   ███   ███  ███     ███     ███████ 
#    ███     ███            ███     ███                ███  ███   ███  ███     ███     ███     
#    ███     ████████  ███████      ███           ███████    ███████   ███     ███     ████████

proc testSuite*(line:string) : string =

    if line =~ peg"^{'▸'\s*}{.*}$":
        return &"suite \"{matches[1]}\":"
    if line =~ peg"^{\s+}{'▸'\s*}{.*}$":
        return &"{matches[0]}test \"{matches[2]}\":"
    line
    
#  ███████   ███████   ███       ███████   ███   ███  ███  ███████  ████████
# ███       ███   ███  ███      ███   ███  ████  ███  ███     ███   ███     
# ███       ███   ███  ███      ███   ███  ███ █ ███  ███    ███    ███████ 
# ███       ███   ███  ███      ███   ███  ███  ████  ███   ███     ███     
#  ███████   ███████   ███████   ███████   ███   ███  ███  ███████  ████████

proc colonize*(line:string) : string =

    if line =~ peg"\s*('if' / 'elif' / 'else' / 'while' / 'for')(\s+ / $)":
        if not (line =~ peg"(!([:] \s* $) .)+ [:] \s* $"):
            return line & ':'
    line

# ████████   ████████  █████████  ███   ███  ████████   ███   ███  ███  ███████  ████████
# ███   ███  ███          ███     ███   ███  ███   ███  ████  ███  ███     ███   ███     
# ███████    ███████      ███     ███   ███  ███████    ███ █ ███  ███    ███    ███████ 
# ███   ███  ███          ███     ███   ███  ███   ███  ███  ████  ███   ███     ███     
# ███   ███  ████████     ███      ███████   ███   ███  ███   ███  ███  ███████  ████████

proc returnize*(line:string) : string =

    line.replace(peg"'⮐'", "return")
        
#  ███████  █████████  ████████          ███████  ████████   ███████ 
# ███          ███     ███   ███        ███       ███       ███      
# ███████      ███     ███████          ███████   ███████   ███  ████
#      ███     ███     ███   ███             ███  ███       ███   ███
# ███████      ███     ███   ███        ███████   ████████   ███████ 

proc stringSegments*(line:string) : seq[string] = 

    var segments:seq[string] = @[]
    
    let pat = peg"""
        input   <- ({triple / string / nonstr})*
        string  <- '"' (esc / [^"])* '"' / "'" (esc / [^'])* "'"
        triple  <- '\"\"\"' (esc / (!'\"\"\"' .))*  '\"\"\"'
        nonstr  <- [^"']+
        esc     <- '\\' .
        """

    if line =~ pat:
        for match in matches:
            if match != "":
                segments.add(match)
    else:
        segments.add(line)
        
    segments
    
# █████████  ████████   ███  ████████   ███      ████████         ███████  █████████  ████████   ███  ███   ███   ███████ 
#    ███     ███   ███  ███  ███   ███  ███      ███             ███          ███     ███   ███  ███  ████  ███  ███      
#    ███     ███████    ███  ████████   ███      ███████         ███████      ███     ███████    ███  ███ █ ███  ███  ████
#    ███     ███   ███  ███  ███        ███      ███                  ███     ███     ███   ███  ███  ███  ████  ███   ███
#    ███     ███   ███  ███  ███        ███████  ████████        ███████      ███     ███   ███  ███  ███   ███   ███████ 

proc tripleString(line:string, info:var TableRef[string,int]) : int = 

    let pat = peg"""(!'\"\"\"' .)* '\"\"\"' (!'\"\"\"' .)*"""
    
    var tsi = info.get("tripleString")
    if line =~ pat:
        if tsi == 0:
            tsi = 1
        else:
            tsi = 3
    else:
        if tsi == 1:
            tsi = 2
        elif tsi == 3:
            tsi = 0
    info["tripleString"] = tsi
    tsi
    
# ███   ███████   ███████  █████████  ████████ 
# ███  ███       ███          ███     ███   ███
# ███  ███████   ███████      ███     ███████  
# ███       ███       ███     ███     ███   ███
# ███  ███████   ███████      ███     ███   ███

proc isStr(s:string) : bool =

    s.len > 0 and s[0] in "'\""
    
#  ███████  █████████   ███████   █████████  ████████  ██     ██  ████████  ███   ███  █████████   ███████
# ███          ███     ███   ███     ███     ███       ███   ███  ███       ████  ███     ███     ███     
# ███████      ███     █████████     ███     ███████   █████████  ███████   ███ █ ███     ███     ███████ 
#      ███     ███     ███   ███     ███     ███       ███ █ ███  ███       ███  ████     ███          ███
# ███████      ███     ███   ███     ███     ████████  ███   ███  ████████  ███   ███     ███     ███████ 

proc statements(segments: seq[string]) : seq[seq[string]] = 

    var stmnts : seq[seq[string]] = @[]
    var stmnt  : seq[string]      = @[]
    
    for seg in segments:
        if seg.isStr:
            stmnt.add seg
        else:
            let splits = seg.split(';').toSeq()
            if splits.len == 1:
                if splits[0].len:
                    stmnt.add(splits[0])
            else: 
                for split in splits:
                    if split.len:
                        stmnt.add(split)
                    stmnts.add(stmnt)
                    stmnt = @[]
    if stmnt.len:
        if stmnts.len: 
            stmnts[^1] = stmnts[^1].concat(stmnt) 
        else:
            stmnts.add(stmnt)
    stmnts
        
# ████████    ███████    ███████  ████████
# ███   ███  ███   ███  ███       ███     
# ████████   ███   ███  ███████   ███████ 
# ███        ███   ███       ███  ███     
# ███         ███████   ███████   ████████

proc pose*(line:string, info:var TableRef[string,int]) : string =

    # echo "------- line ", line
    let tsi = line.tripleString(info)
    if tsi: return line 
    
    let sgmnts = line.stringSegments()
    # echo "------- sgmnts ", sgmnts 
    let stmnts = statements(sgmnts)
    # echo "------- statements ", stmnts
    
    var cstmts:seq[string] = @[]
    for stmnt in stmnts:
        # echo "stmnt", stmnt
        var cgmnts:seq[string] = @[]
        for sgmnt in stmnt:
            cgmnts.add case sgmnt[0]
                of '#':  sgmnt.tripleComment(info)
                of '\'': sgmnt.singleQuote()
                of '"':  sgmnt
                else:    sgmnt
                            .logToEcho()
                            .testSuite()
                            .colonize()
                            .returnize()
        # echo "cgmnts", cgmnts
        cstmts.add(cgmnts.join(""))
    cstmts.join(";")

proc pose*(line:string) : string =
    
    var info = Table[string,int].new()
    pose(line, info)

# █████████  ████████    ███████   ███   ███   ███████
#    ███     ███   ███  ███   ███  ████  ███  ███     
#    ███     ███████    █████████  ███ █ ███  ███████ 
#    ███     ███   ███  ███   ███  ███  ████       ███
#    ███     ███   ███  ███   ███  ███   ███  ███████ 

proc trans*(fileIn:string) : string =

    # echo "trans.trans ", fileIn
    
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

    # echo "trans.pile", files
    
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
        check pose("a=\"''\"") == "a=\"''\""
        check pose("proc logToEcho") == "proc logToEcho"
        check pose("let pat = peg\"\"\"") == "let pat = peg\"\"\""
        check pose("if true") == "if true:"
        check pose("if true:") == "if true:"
        check pose("elif true") == "elif true:"
        check pose("elif true:") == "elif true:"
        check pose("else") == "else:"
        check pose("else:") == "else:"
        check pose("while true") == "while true:"
        check pose("while true:") == "while true:"
        check pose("for i in [0..20]") == "for i in [0..20]:"
        check pose("⮐  42") == "return  42"
        
    test "stringSegments":
    
        check stringSegments("none") == @["none"]
        check stringSegments("n\"one\"") == @["n", "\"one\""]
        check stringSegments("n\"one\" and \"two\" and \"three\" end") == @[
            "n", "\"one\"", " and ", "\"two\"", " and ", "\"three\"", " end"]
        check stringSegments("escaped(\"\\\"\")") == @["escaped(", "\"\\\"\"", ")"]
        check stringSegments("\"'\"") == @["\"'\""]
        check stringSegments("'\"'") == @["'\"'"]
        check stringSegments("'\"'") == @["'\"'"]
        check stringSegments("""'"\\''""") == @["\'\"\\\\\'"]
        check stringSegments("hello \"\"\"'world'\"\"\" !") == @["hello ", "\"\"\"'world'\"\"\"", " !"]
        
    test "statements":
    
        check statements(@["let a=1; let b=2; let c=3"]) == @[@["let a=1"], @[" let b=2"], @[" let c=3"]]
        
    test "deepEqual":
    
        check deepEqual(statements(@["let a=1; let b=2; let c=3"]), @[@["let a=1"], @[" let b=2"], @[" let c=3"]])
        check deepEqual(@{"a":1, "b":2}, @{"a":1, "b":2})
        check deepEqual((a:1, b:2), (a:1, b:2))
        check deepEqual(("a", 2), ("a", 2))

        check statements(@["let a=1; let b=2; let c=3"]) == @[@["let a=1"], @[" let b=2"], @[" let c=3"]]
        check @{"a":1, "b":2} ==  @{"a":1, "b":2}
        check (a:1, b:2) == (a:1, b:2)
        check ("a", 2) == ("a", 2)
        
        check @{"b":(("c", (4,5)), ((d:"e"), (5,6,)))} == @{"b":(("c", (4,5)), ((d:"e"), (5,6,)))}
        check deepEqual(@{"b":(("c", (4,5)), ((d:"e"), (5,6,)))}, @{"b":(("c", (4,5)), ((d:"e"), (5,6,)))})
        
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

    test "string":
    
        var s = """
        a
        b
        """ 
        check s == "        a\n        b\n        "
        
        s = """"""""""""
        check s == "\"\"\"\"\"\""
        
        s = 
            "a"     & '\n' &
            "b"     & '\n' &
            "c" 
            
        check s == "a\nb\nc"

        s = 
            "a\n" &
            &"{1+1}\n" &
            "c"
            
        check s == "a\n2\nc"    
        
    # test "Edge cases":
    #     expect OverflowError:
    #         discard add(high(int), 1)
    