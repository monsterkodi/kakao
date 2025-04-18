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

func get(info:var TableRef[string,int], key:string) : int =

    if info.hasKey(key):
        return info[key]
    0

proc tripleComment*(line:string, info:var TableRef[string,int]) : string =

    if line =~ peg"{(!\# .)*}{\#\#\#}{.*}":
        info["tripleComment"] = 
            if info.get("tripleComment") :
                0 
            else :
                1
        let punct = 
            if info["tripleComment"] :
                "#[" 
            else :
                "]#"
        apply(matches, proc(x: var string) = 
            if x == "###" :
                x = punct)
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
        return  &"suite \"{matches[1]}\":"
    if line =~ peg"^{\s+}{'▸'\s*}{.*}$":
        return  &"{matches[0]}test \"{matches[2]}\":"
    line
    
#  ███████   ███████   ███       ███████   ███   ███  ███  ███████  ████████
# ███       ███   ███  ███      ███   ███  ████  ███  ███     ███   ███     
# ███       ███   ███  ███      ███   ███  ███ █ ███  ███    ███    ███████ 
# ███       ███   ███  ███      ███   ███  ███  ████  ███   ███     ███     
#  ███████   ███████   ███████   ███████   ███   ███  ███  ███████  ████████

proc colonize*(seqs:var seq[string]) : seq[string] =

    if seqs[0] =~ peg"\s*('if' / 'elif' / 'else' / 'while' / 'for' / 'when' / 'case' / 'of')(\s+ / $)":
        var i = seqs.len-1
        if seqs[i][0] == "#"[0]:
             i -= 1
        if seqs[i][^1] != ":"[0]:
            seqs[i] = seqs[i] & ":"
    seqs

# ████████   ████████  █████████  ███   ███  ████████   ███   ███  ███  ███████  ████████
# ███   ███  ███          ███     ███   ███  ███   ███  ████  ███  ███     ███   ███     
# ███████    ███████      ███     ███   ███  ███████    ███ █ ███  ███    ███    ███████ 
# ███   ███  ███          ███     ███   ███  ███   ███  ███  ████  ███   ███     ███     
# ███   ███  ████████     ███      ███████   ███   ███  ███   ███  ███  ███████  ████████

proc returnize*(line:string) : string =

    line.replace(peg"'⮐'", "return")
        
#  ███████  █████████  ████████          ███████  ████████   ███████   ██     ██  ████████  ███   ███  █████████   ███████  
# ███          ███     ███   ███        ███       ███       ███        ███   ███  ███       ████  ███     ███     ███       
# ███████      ███     ███████          ███████   ███████   ███  ████  █████████  ███████   ███ █ ███     ███     ███████   
#      ███     ███     ███   ███             ███  ███       ███   ███  ███ █ ███  ███       ███  ████     ███          ███  
# ███████      ███     ███   ███        ███████   ████████   ███████   ███   ███  ████████  ███   ███     ███     ███████   

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

proc tripleString*(line:string, info:var TableRef[string,int]) : int = 

    let pat = peg"""^ (!'\"\"\"' .)* '\"\"\"' (!'\"\"\"' .)* $"""
    
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

proc isStr*(s:string) : bool =

    s.len > 0 and s[0] in "'\""
    
#  ███████  █████████   ███████   █████████  ████████  ██     ██  ████████  ███   ███  █████████   ███████
# ███          ███     ███   ███     ███     ███       ███   ███  ███       ████  ███     ███     ███     
# ███████      ███     █████████     ███     ███████   █████████  ███████   ███ █ ███     ███     ███████ 
#      ███     ███     ███   ███     ███     ███       ███ █ ███  ███       ███  ████     ███          ███
# ███████      ███     ███   ███     ███     ████████  ███   ███  ████████  ███   ███     ███     ███████ 

proc statements*(segments: seq[string]) : seq[seq[string]] = 

    var stmnts : seq[seq[string]] = @[]
    var stmnt  : seq[string]      = @[]
    
    for seg in segments:
        if seg.isStr:
            stmnt.add seg
        else:
            let splits = seg.split(";").toSeq()
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
    if tsi:
        return  line 
    
    let sgmnts = line.stringSegments()
    # echo "------- sgmnts ", sgmnts 
    let stmnts = statements(sgmnts)
    # echo "------- statements ", stmnts
    
    var cstmts:seq[string] = @[]
    for stmnt in stmnts:
        # echo "stmnt", stmnt
        var cgmnts:seq[string] = @[]
        for sgmnt in stmnt:
            cgmnts.add case sgmnt[0..<1]
                of "#"  :
                    sgmnt.tripleComment(info)
                of "\'" :
                    sgmnt.singleQuote()
                of "\""  :
                    sgmnt
                else    :
                    sgmnt
                        .logToEcho()
                        .testSuite()
                        .returnize()
                            
        cgmnts = cgmnts.colonize()
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

proc swapLastPathComponentAndExt(file: string, src: string, tgt: string): string =

    let (dir, _, _) = splitFile(file.Path)
    
    var dirParts = dir.string.split(DirSep)
    
    if dirParts[0] == "" and dirParts.len == 1:
        dirParts.delete 0..0
    
    for i in countdown(dirParts.high, 0):
        if dirParts[i] == src:
            dirParts[i] = tgt
            break
            
    # echo "dirParts ", dirParts 
    dirParts.add file.Path.changeFileExt("." & tgt).splitPath[1].string
    dirParts.join "/"

proc trans*(fileIn:string) : string =

    # echo "trans.fileIn: ", fileIn
    # var fileOut = Path(fileIn).changeFileExt(".nim").string
    var fileOut = fileIn.swapLastPathComponentAndExt("kim", "nim")
    # echo "trans.fileOut: ", fileOut
    var streamIn  = newFileStream(fileIn,  fmRead)  ; defer: streamIn.close
    var streamOut = newFileStream(fileOut, fmWrite) ; defer: streamOut.close
    if  streamIn  == nil :
        raise newException(IOError, "Could not open source file: " & fileIn)
    if  streamOut == nil :
        raise newException(IOError, "Could not open target file: " & fileOut)
    
    var line = ""
    var info = Table[string,int].new()
    while streamIn.readLine(line):
        line = pose(line, info)
        streamOut.writeLine(line)
    # echo "trans done:: ", fileOut
    fileOut

# ████████   ███  ███      ████████
# ███   ███  ███  ███      ███     
# ████████   ███  ███      ███████ 
# ███        ███  ███      ███     
# ███        ███  ███████  ████████

proc pile*(files:seq[string]) : seq[string] =

    # echo "trans.pile: ", files
    # echo "trans.pile: ", currentSourcePath()
    
    var transpiled:seq[string]
    for file in files:
        transpiled.add trans file
        
    # echo "pile done:: ", transpiled
    transpiled
            
